#!/usr/bin/env python3
"""
Render all .mid files under showcase_samples/ to .mp3 (same relative paths).

Uses FluidSynth + TimGM6mb.sf2 (from pretty_midi), then ffmpeg (imageio-ffmpeg) for MP3.

Usage (from repo root):
    .venv/bin/python showcase_samples/render_to_mp3.py
    .venv/bin/python showcase_samples/render_to_mp3.py --overwrite
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from midi2audio import FluidSynth

try:
    import imageio_ffmpeg
except ImportError:
    imageio_ffmpeg = None  # type: ignore


def _default_soundfont() -> Path:
    """Prefer FluidR3_GM (full GM, much better than tiny TimGM6mb)."""
    candidates = [
        Path("/usr/share/sounds/sf2/FluidR3_GM.sf2"),
        Path("/usr/share/soundfonts/FluidR3_GM.sf2"),
    ]
    for sf2 in candidates:
        if sf2.is_file():
            return sf2
    import pretty_midi

    fallback = Path(pretty_midi.__file__).resolve().parent / "TimGM6mb.sf2"
    if fallback.is_file():
        return fallback
    raise FileNotFoundError(
        "No soundfont found. Install fluid-soundfont-gm or pass --soundfont PATH.sf2"
    )


def _ffmpeg_exe() -> str:
    if imageio_ffmpeg is None:
        raise RuntimeError(
            "imageio-ffmpeg is required for MP3 export. "
            "Install: pip install imageio-ffmpeg"
        )
    return imageio_ffmpeg.get_ffmpeg_exe()


def midi_to_mp3(
    midi_path: Path,
    mp3_path: Path,
    *,
    soundfont: Path,
    sample_rate: int = 44100,
) -> None:
    wav_path = mp3_path.with_suffix(".wav")
    mp3_path.parent.mkdir(parents=True, exist_ok=True)

    synth = FluidSynth(str(soundfont))
    synth.midi_to_audio(str(midi_path), str(wav_path))

    ffmpeg = _ffmpeg_exe()
    cmd = [
        ffmpeg,
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(wav_path),
        "-ar",
        str(sample_rate),
        "-codec:a",
        "libmp3lame",
        "-qscale:a",
        "2",
        str(mp3_path),
    ]
    subprocess.run(cmd, check=True)
    wav_path.unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent,
        help="Root folder to scan (default: showcase_samples/)",
    )
    parser.add_argument(
        "--soundfont",
        type=Path,
        default=None,
        help="Path to .sf2 (default: /usr/share/sounds/sf2/FluidR3_GM.sf2)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Re-render even if .mp3 already exists",
    )
    args = parser.parse_args()

    root: Path = args.root.resolve()
    soundfont = args.soundfont or _default_soundfont()
    midis = sorted(root.rglob("*.mid"))
    if not midis:
        print(f"No .mid files under {root}", file=sys.stderr)
        return 1

    print(f"SoundFont: {soundfont}")
    print(f"FFmpeg:    {_ffmpeg_exe()}")
    print(f"MIDI files: {len(midis)} under {root}\n")

    ok, skip, fail = 0, 0, 0
    for i, mid in enumerate(midis, 1):
        mp3 = mid.with_suffix(".mp3")
        rel = mid.relative_to(root)
        if mp3.exists() and not args.overwrite:
            print(f"[{i}/{len(midis)}] skip (exists) {rel}")
            skip += 1
            continue
        try:
            print(f"[{i}/{len(midis)}] render {rel} -> {mp3.name}", flush=True)
            midi_to_mp3(mid, mp3, soundfont=soundfont)
            ok += 1
        except Exception as exc:
            print(f"[{i}/{len(midis)}] FAIL {rel}: {exc}", file=sys.stderr)
            fail += 1

    print(f"\nDone: {ok} rendered, {skip} skipped, {fail} failed")
    return 1 if fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
