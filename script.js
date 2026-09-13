const DATA = window.INTERVENTION_LIBRARY;

const I18N = {
  pl: {
    model: "Model",
    concept: "Koncept",
    direction: "Kierunek",
    concepts: { tempo: "Tempo", register: "Rejestr", polyphony: "Polifonia" },
    directions: { piano_to_violin: "Fortepian → skrzypce", violin_to_piano: "Skrzypce → fortepian" },
    levels: { far_down: "Bardzo w dół", down: "Trochę w dół", baseline: "Bez", up: "W górę", far_up: "Bardzo w górę" },
    source: "Źródło",
    baseline: "Bez patchingu",
    layer: "Warstwa",
    allLayers: "Wszystkie warstwy",
    download: "MIDI",
    saeLink: "MI-MIDI V2 — interwencje SAE →",
  },
  en: {
    model: "Model",
    concept: "Concept",
    direction: "Direction",
    concepts: { tempo: "Tempo", register: "Register", polyphony: "Polyphony" },
    directions: { piano_to_violin: "Piano → violin", violin_to_piano: "Violin → piano" },
    levels: { far_down: "Far down", down: "Slightly down", baseline: "None", up: "Up", far_up: "Far up" },
    source: "Source",
    baseline: "No patching",
    layer: "Layer",
    allLayers: "All layers",
    download: "MIDI",
    saeLink: "MI-MIDI V2 — SAE interventions →",
  },
};

let language = loadLanguage();
let activeView = "steering";

function t(key) { return I18N[language][key]; }
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}
function loadLanguage() {
  try {
    return localStorage.getItem("mi-midi-language") || (navigator.language.startsWith("pl") ? "pl" : "en");
  } catch (_) {
    return navigator.language.startsWith("pl") ? "pl" : "en";
  }
}
function modelLabel(model) { return model === "midi_llm" ? "MIDI-LLM" : "text2midi"; }

function card(title, item, position) {
  return `<article class="sample-card sample-${esc(position)}">
    <h2>${esc(title)}</h2>
    <a class="roll-link" href="${esc(item.roll)}" target="_blank" rel="noreferrer">
      <img class="roll" src="${esc(item.roll)}" alt="" loading="lazy">
    </a>
    <audio controls preload="none" src="${esc(item.audio)}"></audio>
    <a class="download" href="${esc(item.midi)}" download>${t("download")} ↓</a>
  </article>`;
}

function fillSelect(select, entries, selected) {
  select.innerHTML = entries.map(([value, label]) => `<option value="${esc(value)}"${value === selected ? " selected" : ""}>${esc(label)}</option>`).join("");
}

function renderSteering() {
  const modelSelect = document.querySelector("#steeringModel");
  const conceptSelect = document.querySelector("#steeringConcept");
  const model = DATA.steering[modelSelect.value] ? modelSelect.value : Object.keys(DATA.steering)[0];
  fillSelect(modelSelect, Object.keys(DATA.steering).map((value) => [value, modelLabel(value)]), model);
  const concepts = Object.keys(DATA.steering[model]);
  const concept = concepts.includes(conceptSelect.value) ? conceptSelect.value : concepts[0];
  fillSelect(conceptSelect, concepts.map((value) => [value, t("concepts")[value]]), concept);
  document.querySelector("#steeringSamples").innerHTML = DATA.steering[model][concept]
    .map((item) => card(t("levels")[item.level], item, item.level))
    .join("");
}

function patchingTitle(item) {
  if (item.kind === "source") return t("source");
  if (item.kind === "baseline") return t("baseline");
  if (item.site === "all_layers") return t("allLayers");
  return `${t("layer")} ${Number(item.site.slice(1))}`;
}

function renderPatching() {
  const modelSelect = document.querySelector("#patchingModel");
  const directionSelect = document.querySelector("#patchingDirection");
  const model = DATA.patching[modelSelect.value] ? modelSelect.value : Object.keys(DATA.patching)[0];
  fillSelect(modelSelect, Object.keys(DATA.patching).map((value) => [value, modelLabel(value)]), model);
  const directions = Object.keys(DATA.patching[model]);
  const direction = directions.includes(directionSelect.value) ? directionSelect.value : directions[0];
  fillSelect(directionSelect, directions.map((value) => [value, t("directions")[value]]), direction);
  document.querySelector("#patchingSamples").innerHTML = DATA.patching[model][direction]
    .map((item) => card(patchingTitle(item), item, item.kind === "patched" ? "patched" : item.kind))
    .join("");
}

function pauseAudio() {
  document.querySelectorAll("audio").forEach((audio) => audio.pause());
}

function showView(view) {
  activeView = view;
  document.querySelector("#steeringView").hidden = view !== "steering";
  document.querySelector("#patchingView").hidden = view !== "patching";
  document.querySelectorAll(".tab").forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
  pauseAudio();
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-text]").forEach((element) => { element.textContent = t(element.dataset.text); });
  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderSteering();
  renderPatching();
  showView(activeView);
}

document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.language;
  try { localStorage.setItem("mi-midi-language", language); } catch (_) {}
  applyLanguage();
}));
document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
document.querySelector("#steeringModel").addEventListener("change", renderSteering);
document.querySelector("#steeringConcept").addEventListener("change", renderSteering);
document.querySelector("#patchingModel").addEventListener("change", renderPatching);
document.querySelector("#patchingDirection").addEventListener("change", renderPatching);
document.addEventListener("play", (event) => {
  if (event.target.tagName === "AUDIO") {
    document.querySelectorAll("audio").forEach((audio) => { if (audio !== event.target) audio.pause(); });
  }
}, true);

applyLanguage();
