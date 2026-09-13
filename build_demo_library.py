#!/usr/bin/env python3
"""Build the compact media set used by the MI-MIDI demo."""

from __future__ import annotations

import argparse
import importlib.util
import json
import pickle
import shutil
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
OUTPUT = HERE / "library/selected"
SOUNDFONT = REPO / "experiments/sae/assets/soundfonts/MuseScore_General.sf3"

# Ordered: far down, slightly down, baseline, slightly up, far up.
STEERING_SELECTIONS = {
    ("midi_llm", "tempo"): [
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/tempo/b_minus_a/one_to_all/L02/a0p5_s03.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/tempo/b_minus_a/one_to_all/L02/a0p25_s03.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/tempo/a_minus_b/one_to_all/L02/a0_s03.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/tempo/a_minus_b/one_to_all/L02/a0p25_s03.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/tempo/a_minus_b/one_to_all/L02/a0p5_s03.mid",
    ],
    ("midi_llm", "register"): [
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/register/a_minus_b/one_to_all/L15/a0p5_s04.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/register/a_minus_b/one_to_all/L15/a0p25_s04.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/register/b_minus_a/one_to_all/L15/a0_s04.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/register/b_minus_a/one_to_all/L15/a0p25_s04.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/register/b_minus_a/one_to_all/L15/a0p5_s04.mid",
    ],
    ("midi_llm", "polyphony"): [
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/polyphony/b_minus_a/one_to_all/L12/a0p75_s09.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/polyphony/b_minus_a/one_to_all/L12/a0p25_s09.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/polyphony/a_minus_b/one_to_all/L12/a0_s09.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/polyphony/a_minus_b/one_to_all/L12/a0p25_s09.mid",
        "experiments/midi_llm/results/iclr2027/steering_exact10_l4_archive/20260907_exact10_l4_v1/midi/polyphony/a_minus_b/one_to_all/L12/a0p75_s09.mid",
    ],
    ("text2midi", "tempo"): [
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/tempo/b_minus_a/layer_2/002_steering_tempo_mean_all_one_to_all_dirL2/midi/tempo/steered_one2all_dirL02_a2.0_s01.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/tempo/b_minus_a/layer_2/002_steering_tempo_mean_all_one_to_all_dirL2/midi/tempo/steered_one2all_dirL02_a0.25_s01.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/tempo/a_minus_b/layer_2/002_steering_tempo_mean_all_one_to_all_dirL2/midi/tempo/steered_one2all_dirL02_a0.0_s01.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/tempo/a_minus_b/layer_2/002_steering_tempo_mean_all_one_to_all_dirL2/midi/tempo/steered_one2all_dirL02_a0.25_s01.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/tempo/a_minus_b/layer_2/002_steering_tempo_mean_all_one_to_all_dirL2/midi/tempo/steered_one2all_dirL02_a2.0_s01.mid",
    ],
    ("text2midi", "register"): [
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/register/a_minus_b/layer_2/002_steering_register_mean_all_one_to_all_dirL2/midi/register/steered_one2all_dirL02_a1.0_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/register/a_minus_b/layer_2/002_steering_register_mean_all_one_to_all_dirL2/midi/register/steered_one2all_dirL02_a0.5_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/register/b_minus_a/layer_2/002_steering_register_mean_all_one_to_all_dirL2/midi/register/steered_one2all_dirL02_a0.0_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/register/b_minus_a/layer_2/002_steering_register_mean_all_one_to_all_dirL2/midi/register/steered_one2all_dirL02_a0.5_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/register/b_minus_a/layer_2/002_steering_register_mean_all_one_to_all_dirL2/midi/register/steered_one2all_dirL02_a1.0_s03.mid",
    ],
    ("text2midi", "polyphony"): [
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/polyphony/a_minus_b/layer_14/002_steering_polyphony_mean_all_one_to_all_dirL14/midi/polyphony/steered_one2all_dirL14_a2.0_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/polyphony/a_minus_b/layer_14/002_steering_polyphony_mean_all_one_to_all_dirL14/midi/polyphony/steered_one2all_dirL14_a0.5_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/polyphony/b_minus_a/layer_14/002_steering_polyphony_mean_all_one_to_all_dirL14/midi/polyphony/steered_one2all_dirL14_a0.0_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/polyphony/b_minus_a/layer_14/002_steering_polyphony_mean_all_one_to_all_dirL14/midi/polyphony/steered_one2all_dirL14_a0.5_s03.mid",
        "experiments/text2midi/results/iclr2027/steering_exact10_l4/20260903_exact10_l4_v1/polyphony/b_minus_a/layer_14/002_steering_polyphony_mean_all_one_to_all_dirL14/midi/polyphony/steered_one2all_dirL14_a2.0_s03.mid",
    ],
}

PATCHING_SELECTIONS = {
    ("midi_llm", "piano_to_violin"): {
        "sites": ["L00", "L12", "L15"],
        "token_pattern": "behavior_candidates/patched_lyrical_piece_nominal_s00843_retry00_actual_s00843_a_to_b_{site}_semantic.json",
        "baseline_pattern": "baseline_candidates/lyrical_piece_nominal_s00843_attempt00_actual_s00843_{role}.json",
        "source_role": "A", "base_role": "B",
    },
    ("midi_llm", "violin_to_piano"): {
        "sites": ["L00", "L12", "L15"],
        "token_pattern": "behavior_classical_solo_s0143_b_to_a_{site}_semantic.json",
        "baseline_pattern": "baseline_candidates/classical_solo_nominal_s00143_attempt00_actual_s00143_{role}.json",
        "source_role": "B", "base_role": "A",
    },
    ("text2midi", "piano_to_violin"): {
        "sites": ["all_layers", "L17", "L08", "L00"],
        "token_pattern": "behavior_unaccompanied_s0943_a_to_b_{site}_semantic.json",
        "baseline_pattern": "baseline_unaccompanied_s0943_{role}.json",
        "source_role": "A", "base_role": "B",
    },
    ("text2midi", "violin_to_piano"): {
        "sites": ["all_layers", "L17", "L08", "L00"],
        "token_pattern": "behavior_short_piece_s0543_b_to_a_{site}_semantic.json",
        "baseline_pattern": "baseline_short_piece_s0543_{role}.json",
        "source_role": "B", "base_role": "A",
    },
}


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


def load_tokens(path: Path) -> list[int]:
    return [int(token) for token in json.loads(path.read_text(encoding="utf-8"))["tokens"]]


def build_steering() -> dict:
    output: dict[str, dict] = {}
    names = ["far_down", "down", "baseline", "up", "far_up"]
    for (model, concept), sources in STEERING_SELECTIONS.items():
        items = []
        for name, source_name in zip(names, sources):
            source = REPO / source_name
            if not source.is_file():
                raise FileNotFoundError(source)
            target = OUTPUT / "steering" / model / concept / f"{name}.mid"
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
            items.append({"level": name, **media(target)})
        output.setdefault(model, {})[concept] = items
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


def build_patching(token_root: Path) -> dict:
    midi_legacy = import_file(
        REPO / "experiments/midi_llm/scripts/run_activation_patching.py",
        "demo_midillm_patching",
    )
    text_legacy, remi = text2midi_tokenizer()
    output: dict[str, dict] = {}
    for (model, direction), selection in PATCHING_SELECTIONS.items():
        source_dir = token_root / model
        target_dir = OUTPUT / "patching" / model / direction
        target_dir.mkdir(parents=True, exist_ok=True)
        if model == "midi_llm":
            save = midi_legacy.save_midi
        else:
            save = lambda tokens, path: text_legacy.save_midi(tokens, path, remi)

        items = []
        for kind, role in (("source", selection["source_role"]), ("baseline", selection["base_role"])):
            token_path = source_dir / selection["baseline_pattern"].format(role=role)
            target = target_dir / f"{kind}.mid"
            if not save(load_tokens(token_path), target):
                raise RuntimeError(f"could not decode {token_path}")
            items.append({"kind": kind, **media(target)})
        for site in selection["sites"]:
            token_path = source_dir / selection["token_pattern"].format(site=site)
            target = target_dir / f"{site.lower()}.mid"
            if not save(load_tokens(token_path), target):
                raise RuntimeError(f"could not decode {token_path}")
            items.append({"kind": "patched", "site": site, **media(target)})
        output.setdefault(model, {})[direction] = items
    return output


def render_one(midi: Path) -> None:
    from PIL import Image
    import sys

    sys.path.insert(0, str(REPO / "experiments/sae/atlas"))
    from render import render_gm, render_piano_roll  # type: ignore

    audio = midi.with_suffix(".mp3")
    roll = midi.with_name(midi.stem + "_roll.webp")
    with tempfile.TemporaryDirectory(prefix="mi-midi-demo-") as temp_name:
        temp = Path(temp_name)
        if not audio.is_file():
            wav = temp / "audio.wav"
            render_gm(midi, wav, 32000, SOUNDFONT, "fluidsynth")
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav), "-codec:a", "libmp3lame", "-qscale:a", "4", str(audio),
            ], check=True)
        if not roll.is_file():
            png = temp / "roll.png"
            render_piano_roll(midi, png, "instrument", title="")
            with Image.open(png) as image:
                image.convert("RGB").save(roll, "WEBP", quality=82, method=6)


def validate(data: dict) -> None:
    items = []
    for concepts in data["steering"].values():
        for values in concepts.values():
            items.extend(values)
    for directions in data["patching"].values():
        for values in directions.values():
            items.extend(values)
    missing = [
        item[key]
        for item in items
        for key in ("audio", "midi", "roll")
        if not (HERE / item[key]).is_file()
    ]
    if missing:
        raise RuntimeError(f"missing media: {missing[:5]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--patch-token-root", type=Path, default=Path("/private/tmp/mi-midi-e4-tokens"))
    parser.add_argument("--jobs", type=int, default=4)
    args = parser.parse_args()
    data = {
        "schema_version": 2,
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
    steering_count = sum(len(x) for concepts in data["steering"].values() for x in concepts.values())
    patching_count = sum(len(x) for directions in data["patching"].values() for x in directions.values())
    print(f"steering={steering_count}, patching={patching_count}")


if __name__ == "__main__":
    main()
