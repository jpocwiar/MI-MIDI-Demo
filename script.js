const DATA = window.INTERVENTION_LIBRARY;

const I18N = {
  pl: {
    model: "Model", concept: "Koncept", direction: "Kierunek",
    concepts: { tempo: "Tempo", register: "Rejestr", polyphony: "Polifonia" },
    directions: { a_to_b: "Fortepian → skrzypce", b_to_a: "Skrzypce → fortepian" },
    example: "Przykład", more: "Więcej przykładów",
    source: "Źródłowy", baseline: "Bazowy", patched: "Zainterweniowany",
    sourcePrompt: "Prompt źródłowy", baselinePrompt: "Prompt bazowy",
    layer: "Warstwa", allLayers: "Wszystkie warstwy", download: "MIDI",
    saeLink: "MI-MIDI V2 — interwencje SAE →",
  },
  en: {
    model: "Model", concept: "Concept", direction: "Direction",
    concepts: { tempo: "Tempo", register: "Register", polyphony: "Polyphony" },
    directions: { a_to_b: "Piano → violin", b_to_a: "Violin → piano" },
    example: "Example", more: "More examples",
    source: "Source", baseline: "Baseline", patched: "Intervened",
    sourcePrompt: "Source prompt", baselinePrompt: "Baseline prompt",
    layer: "Layer", allLayers: "All layers", download: "MIDI",
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
  try { return localStorage.getItem("mi-midi-language") || (navigator.language.startsWith("pl") ? "pl" : "en"); }
  catch (_) { return navigator.language.startsWith("pl") ? "pl" : "en"; }
}
function modelLabel(model) { return model === "midi_llm" ? "MIDI-LLM" : "text2midi"; }
function alphaLabel(value) {
  const alpha = Number(value);
  if (alpha === 0) return "α = 0";
  return `α = ${alpha > 0 ? "+" : "−"}${Math.abs(alpha).toString()}`;
}
function layerLabel(site) {
  return site === "all_layers" ? t("allLayers") : `${t("layer")} ${Number(site.slice(1))}`;
}

function mediaCard(title, item, kind) {
  return `<article class="sample-card sample-${esc(kind)}">
    <h3>${esc(title)}</h3>
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

function steeringCards(group) {
  return `<div class="sample-grid steering-grid">${group.items.map((item) => mediaCard(alphaLabel(item.alpha), item, item.alpha < 0 ? "down" : item.alpha > 0 ? "up" : "baseline")).join("")}</div>`;
}

function steeringExample(group, ordinal, featured) {
  if (featured) {
    return `<section class="example featured-example">
      <div class="example-title"><span>${t("example")} ${ordinal}</span><p>${esc(group.prompt)}</p></div>
      ${steeringCards(group)}
    </section>`;
  }
  return `<details class="example">
    <summary><span>${t("example")} ${ordinal}</span><p>${esc(group.prompt)}</p></summary>
    <div class="example-body">${steeringCards(group)}</div>
  </details>`;
}

function renderSteering() {
  const modelSelect = document.querySelector("#steeringModel");
  const conceptSelect = document.querySelector("#steeringConcept");
  const model = DATA.steering[modelSelect.value] ? modelSelect.value : Object.keys(DATA.steering)[0];
  fillSelect(modelSelect, Object.keys(DATA.steering).map((value) => [value, modelLabel(value)]), model);
  const concepts = Object.keys(DATA.steering[model]);
  const concept = concepts.includes(conceptSelect.value) ? conceptSelect.value : concepts[0];
  fillSelect(conceptSelect, concepts.map((value) => [value, t("concepts")[value]]), concept);
  const groups = DATA.steering[model][concept];
  document.querySelector("#steeringSamples").innerHTML = [
    steeringExample(groups[0], 1, true),
    `<h2 class="more-title">${t("more")}</h2>`,
    ...groups.slice(1).map((group, index) => steeringExample(group, index + 2, false)),
  ].join("");
  attachDetails(document.querySelector("#steeringSamples"));
}

function promptPair(group) {
  return `<div class="prompt-pair">
    <div><b>${t("baselinePrompt")}</b><span>${esc(group.baseline_prompt)}</span></div>
    <div><b>${t("sourcePrompt")}</b><span>${esc(group.source_prompt)}</span></div>
  </div>`;
}

function patchingBody(group, id) {
  const patched = group.items.filter((item) => item.kind === "patched");
  return `${promptPair(group)}
    <label class="layer-control"><span>${t("layer")}</span><select data-patch-select="${esc(id)}">${patched.map((item) => `<option value="${esc(item.site)}">${esc(layerLabel(item.site))}</option>`).join("")}</select></label>
    <div class="sample-grid patching-grid" data-patch-grid="${esc(id)}"></div>`;
}

function patchingExample(group, ordinal, featured) {
  const id = `patch-${group.template}-${group.seed}`;
  const title = `${t("example")} ${ordinal}`;
  const prompts = `${group.source_prompt} → ${group.baseline_prompt}`;
  if (featured) {
    return `<section class="example featured-example patch-example" data-group-id="${esc(id)}">
      <div class="example-title"><span>${title}</span><p>${esc(prompts)}</p></div>
      ${patchingBody(group, id)}
    </section>`;
  }
  return `<details class="example patch-example" data-group-id="${esc(id)}">
    <summary><span>${title}</span><p>${esc(prompts)}</p></summary>
    <div class="example-body">${patchingBody(group, id)}</div>
  </details>`;
}

function updatePatchGroup(root, group) {
  const select = root.querySelector("[data-patch-select]");
  const source = group.items.find((item) => item.kind === "source");
  const baseline = group.items.find((item) => item.kind === "baseline");
  const patched = group.items.find((item) => item.kind === "patched" && item.site === select.value);
  root.querySelector("[data-patch-grid]").innerHTML = [
    mediaCard(t("baseline"), baseline, "baseline"),
    mediaCard(t("source"), source, "source"),
    mediaCard(t("patched"), patched, "patched"),
  ].join("");
}

function renderPatching() {
  const modelSelect = document.querySelector("#patchingModel");
  const directionSelect = document.querySelector("#patchingDirection");
  const model = DATA.patching[modelSelect.value] ? modelSelect.value : Object.keys(DATA.patching)[0];
  fillSelect(modelSelect, Object.keys(DATA.patching).map((value) => [value, modelLabel(value)]), model);
  const directions = Object.keys(DATA.patching[model]);
  const direction = directions.includes(directionSelect.value) ? directionSelect.value : directions[0];
  fillSelect(directionSelect, directions.map((value) => [value, t("directions")[value]]), direction);
  const groups = DATA.patching[model][direction];
  const container = document.querySelector("#patchingSamples");
  container.innerHTML = [
    patchingExample(groups[0], 1, true),
    `<h2 class="more-title">${t("more")}</h2>`,
    ...groups.slice(1).map((group, index) => patchingExample(group, index + 2, false)),
  ].join("");
  container.querySelectorAll(".patch-example").forEach((root, index) => {
    const group = groups[index];
    updatePatchGroup(root, group);
    root.querySelector("select").addEventListener("change", () => updatePatchGroup(root, group));
  });
  attachDetails(container);
}

function attachDetails(root) {
  root.querySelectorAll("details").forEach((details) => details.addEventListener("toggle", () => {
    if (!details.open) details.querySelectorAll("audio").forEach((audio) => audio.pause());
  }));
}
function pauseAudio() { document.querySelectorAll("audio").forEach((audio) => audio.pause()); }
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
  if (event.target.tagName === "AUDIO") document.querySelectorAll("audio").forEach((audio) => { if (audio !== event.target) audio.pause(); });
}, true);

applyLanguage();
