#!/usr/bin/env python3
"""Build the static MI-MIDI steering and patching listening library.

The steering section inventories every MP3/MIDI pair already stored in
``showcase_samples``.  The patching section copies every instrument-patching
MIDI from the two legacy listening runs and can render matching MP3 and WebP
assets with the same SoundFont used by MI-MIDI V2.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
SOUNDFONT = REPO / "experiments/sae/assets/soundfonts/MuseScore_General.sf3"
PATCH_SOURCES = {
    "midi-llm": REPO / "experiments/midi_llm/results/activation_patching/midi/instrument",
    "text2midi": REPO / "experiments/text2midi/results/xattn_patching/midi/instrument",
}
FEATURED = {("midi-llm", "tempo", 3), ("midi-llm", "register", 0), ("midi-llm", "polyphony", 4)}


def web_path(path: Path) -> str:
    return path.relative_to(HERE).as_posix()


def media(path: Path, *, roll: Path | None = None) -> dict:
    return {
        "audio": web_path(path.with_suffix(".mp3")),
        "midi": web_path(path.with_suffix(".mid")),
        "roll": web_path(roll) if roll else None,
    }


def build_steering() -> tuple[list[dict], int]:
    groups: dict[tuple[str, str, int], dict] = {}
    mp3s = sorted((HERE / "showcase_samples").rglob("*.mp3"))
    for audio in mp3s:
        relative = audio.relative_to(HERE / "showcase_samples")
        model = relative.parts[0]
        raw_concept = relative.parts[1]
        concept = "tempo" if raw_concept == "tempo gora" else raw_concept
        name = audio.stem
        alpha_match = re.search(r"_a([0-9.]+)_s", name)
        seed_match = re.search(r"_s(\d+)$", name)
        if not alpha_match or not seed_match:
            raise ValueError(f"cannot parse steering sample: {relative}")
        alpha = float(alpha_match.group(1))
        seed = int(seed_match.group(1))
        lowered = "/".join(relative.parts).lower()
        if "w dol" in lowered:
            direction = "lower"
        elif any(marker in lowered for marker in ("w gore", "do góry", "tempo gora")):
            direction = "higher"
        else:
            direction = "higher"
        roll = audio.with_name(audio.stem + "_roll.webp")
        item = {"alpha": alpha, **media(audio, roll=roll)}
        key = (model, concept, seed)
        group = groups.setdefault(key, {
            "id": f"steering:{model}:{concept}:s{seed:02d}",
            "model": model, "concept": concept, "seed": seed,
            "featured": key in FEATURED, "baseline": None,
            "lower": [], "higher": [],
        })
        if alpha == 0:
            group["baseline"] = item
        else:
            group[direction].append(item)
    for group in groups.values():
        if group["baseline"] is None:
            raise ValueError(f"steering group lacks baseline: {group['id']}")
        group["lower"].sort(key=lambda row: row["alpha"])
        group["higher"].sort(key=lambda row: row["alpha"])
    ordered = sorted(groups.values(), key=lambda row: (
        not row["featured"], row["model"], row["concept"], row["seed"]
    ))
    return ordered, len(mp3s)


def copy_patching_midis() -> list[Path]:
    copied: list[Path] = []
    for model, source in PATCH_SOURCES.items():
        if not source.is_dir():
            raise FileNotFoundError(source)
        destination = HERE / "library/media/patching" / model / "instrument"
        destination.mkdir(parents=True, exist_ok=True)
        for midi in sorted(source.glob("*.mid")):
            target = destination / midi.name
            if not target.exists() or target.stat().st_size != midi.stat().st_size:
                shutil.copy2(midi, target)
            copied.append(target)
    return copied


def render_one(midi: Path) -> None:
    from PIL import Image
    import sys

    sys.path.insert(0, str(REPO / "experiments/sae/atlas"))
    from render import render_gm, render_piano_roll  # type: ignore

    audio = midi.with_suffix(".mp3")
    roll = midi.with_name(midi.stem + "_roll.webp")
    if audio.exists() and roll.exists():
        return
    with tempfile.TemporaryDirectory(prefix="mi-midi-render-") as temp_name:
        temp = Path(temp_name)
        if not audio.exists():
            wav = temp / "audio.wav"
            render_gm(midi, wav, 32000, SOUNDFONT, "fluidsynth")
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav), "-codec:a", "libmp3lame", "-qscale:a", "4",
                str(audio),
            ], check=True)
        if not roll.exists():
            png = temp / "roll.png"
            render_piano_roll(midi, png, "instrument", title="")
            with Image.open(png) as image:
                image.convert("RGB").save(roll, "WEBP", quality=82, method=6)


def build_patching(midis: list[Path]) -> list[dict]:
    groups: list[dict] = []
    for model in PATCH_SOURCES:
        folder = HERE / "library/media/patching" / model / "instrument"
        for seed in range(10):
            baseline_a = folder / f"baseline_A_s{seed:02d}.mid"
            baseline_b = folder / f"baseline_B_s{seed:02d}.mid"
            patched = []
            for midi in sorted(folder.glob(f"patched_L*_s{seed:02d}.mid")):
                layer_match = re.search(r"patched_L(\d+)_", midi.name)
                if not layer_match:
                    raise ValueError(midi)
                patched.append({
                    "layer": int(layer_match.group(1)),
                    **media(midi, roll=midi.with_name(midi.stem + "_roll.webp")),
                })
            if not baseline_a.exists() or not baseline_b.exists() or not patched:
                raise ValueError(f"incomplete patching group: {model}, seed {seed}")
            groups.append({
                "id": f"patching:{model}:instrument:s{seed:02d}",
                "model": model, "seed": seed,
                "baseline_a": media(baseline_a, roll=baseline_a.with_name(baseline_a.stem + "_roll.webp")),
                "baseline_b": media(baseline_b, roll=baseline_b.with_name(baseline_b.stem + "_roll.webp")),
                "patched": sorted(patched, key=lambda row: row["layer"]),
            })
    return groups


def validate_media(data: dict, require_renders: bool) -> None:
    missing: list[str] = []
    for group in data["steering"]:
        for item in [group["baseline"], *group["lower"], *group["higher"]]:
            for key in ("audio", "midi"):
                if not (HERE / item[key]).is_file():
                    missing.append(item[key])
    for group in data["patching"]:
        for item in [group["baseline_a"], group["baseline_b"], *group["patched"]]:
            keys = ("audio", "midi", "roll") if require_renders else ("midi",)
            for key in keys:
                if not (HERE / item[key]).is_file():
                    missing.append(item[key])
    if missing:
        raise ValueError(f"missing {len(missing)} media files; first: {missing[:5]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--render", action="store_true", help="render patching MP3 and WebP media")
    parser.add_argument("--jobs", type=int, default=4)
    args = parser.parse_args()
    midis = copy_patching_midis()
    if args.render:
        if not SOUNDFONT.is_file():
            raise FileNotFoundError(SOUNDFONT)
        with ThreadPoolExecutor(max_workers=args.jobs) as pool:
            steering_midis = sorted((HERE / "showcase_samples").rglob("*.mid"))
            list(pool.map(render_one, [*midis, *steering_midis]))
    steering, steering_count = build_steering()
    patching = build_patching(midis)
    data = {
        "schema_version": 1,
        "meta": {
            "steering_samples": steering_count,
            "patching_samples": len(midis),
            "steering_scope": "all media previously included in MI-MIDI-Demo",
            "patching_audio_protocol": "legacy single-pair listening run",
            "patching_statistical_protocol": "E4 matched bidirectional v2/v4",
        },
        "steering": steering,
        "patching": patching,
    }
    validate_media(data, require_renders=args.render)
    payload = "window.INTERVENTION_LIBRARY=" + json.dumps(
        data, ensure_ascii=False, separators=(",", ":")
    ) + ";\n"
    (HERE / "library.js").write_text(payload, encoding="utf-8")
    print(f"steering={steering_count}, patching={len(midis)}, cards={len(steering) + len(patching)}")


if __name__ == "__main__":
    main()
