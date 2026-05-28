const concepts = [
  {
    id: "tempo",
    label: "Tempo",
    summary: "Steer the perceived speed of the generated fragment.",
    samples: [
      sample(-0.5, "showcase_samples/midi-llm/tempo/w dol/3/steered_one2all_dirL14_a0.5_s03.mp3"),
      sample(-0.25, "showcase_samples/midi-llm/tempo/w dol/3/steered_one2all_dirL14_a0.25_s03.mp3"),
      sample(0, "showcase_samples/midi-llm/tempo/w gore/3/steered_one2all_dirL14_a0.0_s03.mp3"),
      sample(0.25, "showcase_samples/midi-llm/tempo/w gore/3/steered_one2all_dirL14_a0.25_s03.mp3"),
      sample(0.5, "showcase_samples/midi-llm/tempo/w gore/3/steered_one2all_dirL14_a0.5_s03.mp3"),
    ],
  },
  {
    id: "register",
    label: "Register",
    summary: "Move the generated music toward a lower or higher pitch range.",
    samples: [
      sample(-2, "showcase_samples/midi-llm/register/w dol/steered_one2all_dirL14_a2.0_s00.mp3"),
      sample(-1, "showcase_samples/midi-llm/register/w dol/steered_one2all_dirL14_a1.0_s00.mp3"),
      sample(0, "showcase_samples/midi-llm/register/do góry/0/steered_one2all_dirL14_a0.0_s00.mp3"),
      sample(1, "showcase_samples/midi-llm/register/do góry/0/steered_one2all_dirL14_a1.0_s00.mp3"),
      sample(2, "showcase_samples/midi-llm/register/do góry/0/steered_one2all_dirL14_a2.0_s00.mp3"),
    ],
  },
  {
    id: "polyphony",
    label: "Polyphony",
    summary: "Control how dense and multi-voiced the generated texture becomes.",
    samples: [
      sample(-2, "showcase_samples/midi-llm/polyphony/w dol/4/steered_one2all_dirL14_a2.0_s04.mp3"),
      sample(-1, "showcase_samples/midi-llm/polyphony/w dol/4/steered_one2all_dirL14_a1.0_s04.mp3"),
      sample(0, "showcase_samples/midi-llm/polyphony/w gore/4/steered_one2all_dirL14_a0.0_s04.mp3"),
      sample(1, "showcase_samples/midi-llm/polyphony/w gore/4/steered_one2all_dirL14_a1.0_s04.mp3"),
      sample(2, "showcase_samples/midi-llm/polyphony/w gore/4/steered_one2all_dirL14_a2.0_s04.mp3"),
    ],
  },
];

const conceptGrid = document.querySelector("#conceptGrid");
const alphaSlider = document.querySelector("#alphaSlider");
const alphaValue = document.querySelector("#alphaValue");
const minAlpha = document.querySelector("#minAlpha");
const maxAlpha = document.querySelector("#maxAlpha");
const tickRow = document.querySelector("#tickRow");
const sampleTitle = document.querySelector("#sampleTitle");
const sampleDescription = document.querySelector("#sampleDescription");
const audioPlayer = document.querySelector("#audioPlayer");
const mp3Link = document.querySelector("#mp3Link");
const midiLink = document.querySelector("#midiLink");

let activeConcept = concepts[0];

function sample(alpha, mp3Path) {
  return {
    alpha,
    mp3Path,
    midiPath: mp3Path.replace(/\.mp3$/, ".mid"),
  };
}

function formatAlpha(value) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function renderConcepts() {
  conceptGrid.innerHTML = "";

  concepts.forEach((concept) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "concept-button";
    button.dataset.concept = concept.id;
    button.innerHTML = `
      <strong>${concept.label}</strong>
    `;

    button.addEventListener("click", () => {
      activeConcept = concept;
      syncConceptButtons();
      renderSlider();
      updateSample();
    });

    conceptGrid.append(button);
  });

  syncConceptButtons();
}

function syncConceptButtons() {
  conceptGrid.querySelectorAll(".concept-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.concept === activeConcept.id);
  });
}

function renderSlider() {
  alphaSlider.min = "0";
  alphaSlider.max = String(activeConcept.samples.length - 1);
  alphaSlider.step = "1";

  const zeroIndex = activeConcept.samples.findIndex((item) => item.alpha === 0);
  alphaSlider.value = String(Math.max(zeroIndex, 0));

  minAlpha.textContent = formatAlpha(activeConcept.samples[0].alpha);
  maxAlpha.textContent = formatAlpha(activeConcept.samples.at(-1).alpha);
  tickRow.innerHTML = activeConcept.samples
    .map((item) => `<span>${formatAlpha(item.alpha)}</span>`)
    .join("");
}

function updateSample(index = Number(alphaSlider.value)) {
  const selected = activeConcept.samples[index];
  const direction =
    selected.alpha < 0 ? "decrease" : selected.alpha > 0 ? "increase" : "neutral";

  alphaSlider.value = String(index);
  alphaValue.textContent = formatAlpha(selected.alpha);
  sampleTitle.textContent = `${activeConcept.label}: alpha ${formatAlpha(selected.alpha)}`;
  sampleDescription.textContent = `${activeConcept.summary} Direction: ${direction}.`;

  audioPlayer.src = encodeURI(selected.mp3Path);
  mp3Link.href = encodeURI(selected.mp3Path);
  midiLink.href = encodeURI(selected.midiPath);
}

alphaSlider.addEventListener("input", () => updateSample());

renderConcepts();
renderSlider();
updateSample();
