#!/usr/bin/env python3
"""Build the complete public listening catalog for the MI-MIDI demo."""

from __future__ import annotations

import argparse
import csv
import hashlib
import importlib.util
import json
import pickle
import shutil
import subprocess
import tempfile
import math
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
OUTPUT = HERE / "library/catalog"
SOUNDFONT = REPO / "experiments/sae/assets/soundfonts/MuseScore_General.sf3"
MAX_PREVIEW_SECONDS = 120.0
MAX_DRUM_NOTES_PER_PREVIEW = 64
EVAL_PROMPTS = (
    REPO / "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/inputs/eval_prompts_neutral.txt"
).read_text(encoding="utf-8").splitlines()

STEERING_METRICS = {
    "midi_llm": REPO / "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/steering_metrics_per_generation_v3.csv",
    "text2midi": REPO / "experiments/iclr2027/results/steering_metrics_text2midi_exact10_v3/steering_metrics_per_generation.csv",
}

# layer, smaller magnitude, larger magnitude, observed polarity, featured sample
STEERING_CONFIG = {
    ("midi_llm", "tempo"): (2, 0.25, 0.5, "semantic", 3),
    ("midi_llm", "register"): (15, 0.25, 0.5, "reversed", 4),
    ("midi_llm", "polyphony"): (12, 0.25, 0.75, "semantic", 9),
    ("text2midi", "tempo"): (2, 1.0, 2.0, "semantic", 9),
    ("text2midi", "register"): (2, 0.5, 1.0, "reversed", 3),
    ("text2midi", "polyphony"): (14, 0.5, 2.0, "reversed", 3),
}

PATCHING_RESULTS = {
    "midi_llm": REPO / "experiments/midi_llm/results/iclr2027/e4_patching_v2/20260903_v3/results.csv",
    "text2midi": REPO / "experiments/text2midi/results/iclr2027/e4_patching_v2/20260901_v2/results.csv",
}
PATCHING_SELECTIONS = {
    "midi_llm": REPO / "experiments/midi_llm/results/iclr2027/e4_patching_v2/20260903_v3/behavior_seed_selection.json",
}
PATCHING_SITES = {
    "midi_llm": ["L00", "L12", "L15"],
    "text2midi": ["all_layers", "L17", "L08", "L00"],
}
PATCHING_FEATURED = {
    ("midi_llm", "a_to_b"): ("lyrical_piece", 843),
    ("midi_llm", "b_to_a"): ("classical_solo", 143),
    ("text2midi", "a_to_b"): ("unaccompanied", 943),
    ("text2midi", "b_to_a"): ("short_piece", 543),
}
DIRECTION_ROLES = {
    "a_to_b": ("A", "B"),
    "b_to_a": ("B", "A"),
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def web_path(path: Path) -> str:
    return path.relative_to(HERE).as_posix()


def media(path: Path) -> dict[str, str]:
    return {
        "audio": web_path(path.with_suffix(".mp3")),
        "midi": web_path(path.with_suffix(".mid")),
        "roll": web_path(path.with_name(path.stem + "_roll.webp")),
    }


def import_file(path: Path, name: str):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def token_hash(tokens: list[int]) -> str:
    value = ",".join(str(token) for token in tokens).encode("ascii")
    return hashlib.sha256(value).hexdigest()


def load_tokens(path: Path) -> list[int]:
    value = json.loads(path.read_text(encoding="utf-8"))
    tokens = [int(token) for token in value["tokens"]]
    if value.get("sha256") and value["sha256"] != token_hash(tokens):
        raise RuntimeError(f"token hash mismatch: {path}")
    return tokens


def copy_midi(source: Path, target: Path) -> None:
    if not source.is_file():
        raise FileNotFoundError(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def build_steering() -> dict:
    output: dict[str, dict] = {}
    for model, metrics_path in STEERING_METRICS.items():
        rows = read_csv(metrics_path)
        for concept in ("tempo", "register", "polyphony"):
            layer, small, large, polarity, featured = STEERING_CONFIG[(model, concept)]
            selected = [
                row for row in rows
                if row["concept"] == concept
                and row["injection_strategy"] == "one_to_all"
                and int(row["direction_layer"]) == layer
            ]
            high_direction = "a_minus_b" if polarity == "semantic" else "b_minus_a"
            low_direction = "b_minus_a" if polarity == "semantic" else "a_minus_b"
            levels = [
                ("far_down", low_direction, large, -large),
                ("down", low_direction, small, -small),
                ("baseline", high_direction, 0.0, 0.0),
                ("up", high_direction, small, small),
                ("far_up", high_direction, large, large),
            ]
            groups = []
            for sample_idx in range(10):
                items = []
                for level, direction, magnitude, signed_alpha in levels:
                    matches = [
                        row for row in selected
                        if row["diff_vector"] == direction
                        and int(row["sample_idx"]) == sample_idx
                        and abs(float(row["alpha"]) - magnitude) < 1e-9
                    ]
                    if len(matches) != 1:
                        raise RuntimeError(f"expected one steering row: {model}, {concept}, {sample_idx}, {direction}, {magnitude}")
                    row = matches[0]
                    source = REPO / row["midi_path"]
                    target = OUTPUT / "steering" / model / concept / f"sample_{sample_idx:02d}" / f"{level}.mid"
                    copy_midi(source, target)
                    items.append({"alpha": signed_alpha, **media(target)})
                groups.append({
                    "sample": sample_idx,
                    "prompt": EVAL_PROMPTS[sample_idx],
                    "featured": sample_idx == featured,
                    "items": items,
                })
            groups.sort(key=lambda group: (not group["featured"], group["sample"]))
            output.setdefault(model, {})[concept] = groups
    return output


def text2midi_tokenizer():
    legacy = import_file(
        REPO / "experiments/text2midi/scripts/run_cross_attention_patching.py",
        "demo_text2midi_patching",
    )
    with (REPO / "references/Text2midi/artifacts/vocab_remi.pkl").open("rb") as handle:
        tokenizer = pickle.load(handle)
    legacy._patch_tokenizer_config(tokenizer)
    return legacy, tokenizer


def behavior_references(model: str) -> dict[tuple[str, int, str], str]:
    if model not in PATCHING_SELECTIONS:
        return {}
    value = json.loads(PATCHING_SELECTIONS[model].read_text(encoding="utf-8"))
    output = {}
    for selection in value["selections"].values():
        for role, path in (selection.get("reference_token_paths") or {}).items():
            if path:
                output[(selection["template_id"], int(selection["nominal_seed"]), role)] = path.removeprefix("tokens/")
    return output


def decode_once(save, token_path: Path, target: Path) -> None:
    if target.is_file():
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    if not save(load_tokens(token_path), target):
        raise RuntimeError(f"could not decode {token_path}")


def build_patching(token_root: Path) -> dict:
    midi_legacy = import_file(
        REPO / "experiments/midi_llm/scripts/run_activation_patching.py",
        "demo_midillm_patching",
    )
    text_legacy, remi = text2midi_tokenizer()
    output: dict[str, dict] = {}

    for model, result_path in PATCHING_RESULTS.items():
        rows = read_csv(result_path)
        baselines = {
            (row["template_id"], int(row["seed"]), row["condition"]): row
            for row in rows if row["phase"] == "baseline"
        }
        behavior = {
            (row["template_id"], int(row["seed"]), row["direction"], row["site"]): row
            for row in rows if row["phase"] == "behavior" and row["condition"] == "semantic"
        }
        references = behavior_references(model)
        source_dir = token_root / model
        if model == "midi_llm":
            save = midi_legacy.save_midi
        else:
            save = lambda tokens, path: text_legacy.save_midi(tokens, path, remi)

        pairs = sorted({(template, seed) for template, seed, _direction, _site in behavior})
        for direction, (source_role, base_role) in DIRECTION_ROLES.items():
            groups = []
            for template, seed in pairs:
                source_row = baselines[(template, seed, source_role)]
                base_row = baselines[(template, seed, base_role)]
                reference_dir = OUTPUT / "patching" / model / "references" / f"{template}_{seed:04d}"
                items = []
                for kind, role, row in (("source", source_role, source_row), ("baseline", base_role, base_row)):
                    relative = references.get((template, seed, role), row["token_path"].removeprefix("tokens/"))
                    target = reference_dir / f"{role}.mid"
                    decode_once(save, source_dir / relative, target)
                    items.append({"kind": kind, **media(target)})
                for site in PATCHING_SITES[model]:
                    row = behavior[(template, seed, direction, site)]
                    token_path = source_dir / row["token_path"].removeprefix("tokens/")
                    target = OUTPUT / "patching" / model / direction / f"{template}_{seed:04d}" / f"{site.lower()}.mid"
                    decode_once(save, token_path, target)
                    items.append({"kind": "patched", "site": site, **media(target)})
                groups.append({
                    "template": template,
                    "seed": seed,
                    "source_prompt": source_row["prompt"],
                    "baseline_prompt": base_row["prompt"],
                    "featured": (template, seed) == PATCHING_FEATURED[(model, direction)],
                    "items": items,
                })
            groups.sort(key=lambda group: (not group["featured"], group["template"], group["seed"]))
            output.setdefault(model, {})[direction] = groups
    return output


def render_one(midi: Path) -> None:
    from PIL import Image
    import mido
    import pretty_midi
    import sys

    sys.path.insert(0, str(REPO / "experiments/sae/atlas"))
    from render import render_gm, render_piano_roll  # type: ignore

    audio = midi.with_suffix(".mp3")
    roll = midi.with_name(midi.stem + "_roll.webp")
    if audio.is_file() and roll.is_file():
        return
    with tempfile.TemporaryDirectory(prefix="mi-midi-demo-") as temp_name:
        temp = Path(temp_name)
        preview_score = pretty_midi.PrettyMIDI(str(midi))
        for instrument in preview_score.instruments:
            instrument.notes = [
                note for note in instrument.notes if note.start < MAX_PREVIEW_SECONDS
            ]
            for note in instrument.notes:
                note.end = min(note.end, MAX_PREVIEW_SECONDS)
            if instrument.is_drum and len(instrument.notes) > 200 and preview_score.get_end_time() < 5.0:
                stride = math.ceil(len(instrument.notes) / MAX_DRUM_NOTES_PER_PREVIEW)
                instrument.notes = instrument.notes[::stride]
        preview_midi = temp / "preview.mid"
        preview_score.write(str(preview_midi))
        sanitised = mido.MidiFile(str(preview_midi))
        final_tick = max(sum(message.time for message in track) for track in sanitised.tracks)
        stop_track = mido.MidiTrack()
        for channel in range(16):
            stop_track.append(mido.Message(
                "control_change", channel=channel, control=120, value=0,
                time=final_tick if channel == 0 else 0,
            ))
        stop_track.append(mido.MetaMessage("end_of_track", time=1))
        sanitised.tracks.append(stop_track)
        sanitised.save(str(preview_midi))
        if not audio.is_file():
            wav = temp / "audio.wav"
            render_gm(preview_midi, wav, 32000, SOUNDFONT, "fluidsynth")
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav), "-codec:a", "libmp3lame", "-qscale:a", "4", str(audio),
            ], check=True)
        if not roll.is_file():
            png = temp / "roll.png"
            render_piano_roll(preview_midi, png, "instrument", title="")
            with Image.open(png) as image:
                image.convert("RGB").save(roll, "WEBP", quality=82, method=6)


def all_items(data: dict) -> list[dict]:
    items = []
    for concepts in data["steering"].values():
        for groups in concepts.values():
            for group in groups:
                items.extend(group["items"])
    for directions in data["patching"].values():
        for groups in directions.values():
            for group in groups:
                items.extend(group["items"])
    return items


def validate(data: dict) -> None:
    missing = [
        item[key]
        for item in all_items(data)
        for key in ("audio", "midi", "roll")
        if not (HERE / item[key]).is_file() or (HERE / item[key]).stat().st_size == 0
    ]
    if missing:
        raise RuntimeError(f"missing media: {missing[:5]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--patch-token-root", type=Path, default=Path("/private/tmp/mi-midi-e4-tokens"))
    parser.add_argument("--jobs", type=int, default=4)
    args = parser.parse_args()
    data = {
        "schema_version": 3,
        "steering": build_steering(),
        "patching": build_patching(args.patch_token_root),
    }
    if not SOUNDFONT.is_file():
        raise FileNotFoundError(SOUNDFONT)
    with ThreadPoolExecutor(max_workers=args.jobs) as pool:
        list(pool.map(render_one, sorted(OUTPUT.rglob("*.mid"))))
    validate(data)
    (HERE / "library.js").write_text(
        "window.INTERVENTION_LIBRARY="
        + json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"steering groups=60, patching groups=120, media items={len(all_items(data))}")


if __name__ == "__main__":
    main()
