# MI-MIDI Demo

A bilingual static listening atlas for activation interventions in symbolic
text-to-MIDI models. It contains:

- every steering clip currently included in the demo repository;
- the complete saved piano-to-violin activation-patching listening run for
  MIDI-LLM and text2midi (all ten seeds and all saved intervention sites);
- current aggregate E4 conclusions, explicitly separated from the earlier
  listening protocol;
- original MIDI downloads and instrument-aware piano rolls;
- a link to the companion [MI-MIDI V2 SAE atlas](https://jpocwiar.github.io/MI-MIDIv2-Demo/).

## Run locally

From this directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Rebuild the library

From the parent research repository:

```bash
.venv/bin/python demo/MI-MIDI-Demo/build_demo_library.py --render --jobs 4
```

The builder inventories the steering showcase, copies the two instrument
patching MIDI archives, renders patching audio and piano rolls with FluidSynth
and MuseScore General 0.2, validates all referenced media, and regenerates
`library.js`.

The public site is hosted at <https://jpocwiar.github.io/MI-MIDI-Demo/>.
