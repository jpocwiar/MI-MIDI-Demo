# MI-MIDI Demo

A compact bilingual listening demo for steering and activation patching in
MIDI-LLM and text2midi.

## Run locally

```bash
python3 -m http.server 8000 --directory demo/MI-MIDI-Demo
```

Then visit <http://localhost:8000>.

## Rebuild the media library

The patching token JSON files must first be copied from the experiment output
to `/private/tmp/mi-midi-e4-tokens/{midi_llm,text2midi}`. Then run:

```bash
.venv/bin/python demo/MI-MIDI-Demo/build_demo_library.py --jobs 4
```

The builder copies the selected steering MIDI files, decodes the selected
patching sequences, renders MP3 and piano-roll previews, validates every
referenced file, and regenerates `library.js`.

The public site is hosted at <https://jpocwiar.github.io/MI-MIDI-Demo/>.
