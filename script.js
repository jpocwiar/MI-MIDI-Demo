const DATA = window.INTERVENTION_LIBRARY;

const I18N = {
  pl: {
    pageTitle: "MI-MIDI — sterowanie wektorami różnicowymi i podmiana aktywacji",
    metaDescription: "Próbki dźwiękowe dla sterowania wektorami różnicowymi i podmiany aktywacji w modelach text-to-MIDI.",
    heroEyebrow: "Mechanistyczna interpretowalność modeli text-to-MIDI",
    heroSection: "Sterowanie wektorami różnicowymi i podmiana aktywacji",
    heroLead: "Niniejsze demo udostępnia próbki dźwiękowe uzyskane w badaniach opisanych w rozdziałach „Podmiana aktywacji” i „Sterowanie wektorami różnicowymi” pracy magisterskiej. Materiał obejmuje modele text2midi i MIDI-LLM.",
    steeringTab: "Sterowanie wektorami", patchingTab: "Podmiana aktywacji",
    model: "Model", concept: "Koncept", direction: "Kierunek", prompt: "Opis wejściowy",
    concepts: { tempo: "Tempo", register: "Rejestr", polyphony: "Polifonia" },
    directions: { a_to_b: "Fortepian → skrzypce", b_to_a: "Skrzypce → fortepian" },
    axes: {
      tempo: ["wolniej", "szybciej"],
      register: ["niższy rejestr", "wyższy rejestr"],
      polyphony: ["mniejsza polifonia", "większa polifonia"],
    },
    steeringGuideTitle: "Interpretacja sterowania wektorami",
    steeringGuideText: "Dla wybranego modelu i konceptu zestawiono pięć generacji z tego samego opisu wejściowego. Wartość α = 0 oznacza generację bazową, natomiast wartości ujemne i dodatnie odpowiadają przeciwnym orientacjom kierunku sterującego.",
    patchingGuideTitle: "Interpretacja podmiany aktywacji",
    patchingGuideText: "Dla każdej pary opisów wejściowych przedstawiono przebieg bazowy, przebieg źródłowy oraz przebieg po podmianie aktywacji. Interwencja ma przenieść informację o instrumencie z opisu źródłowego do generacji warunkowanej opisem bazowym. Miejsce interwencji wybiera się z listy warstw; domyślnie wyświetlany jest najlepiej oceniony wariant dla danego modelu. Dla każdego kierunku pokazano pełny zbiór 30 obserwacji: dziesięć szablonów opisu i trzy ziarna losowe. Przykład o największym zaobserwowanym transferze instrumentu umieszczono jako pierwszy, bez przypisywania mu osobnej kategorii.",
    axisNegative: "ujemne α", axisBaseline: "α = 0", axisPositive: "dodatnie α",
    example: "Przykład",
    configurationTitle: "Konfiguracja prezentowanej serii",
    directionMethod: "Wyznaczenie kierunku",
    directionMethodValue: "różnica średnich z 25 par przeciwstawnych opisów",
    sourceLayer: "Warstwa źródłowa kierunku",
    interventionStrategy: "Strategia interwencji",
    interventionStrategyValue: "ten sam kierunek dodawany we wszystkich warstwach",
    alphaMode: "Sposób skalowania",
    alphaModeValue: "bezwzględny: h′ = h + αd",
    alphaValues: "Porównywane wartości α",
    promptRepresentation: "Reprezentacja opisu",
    promptRepresentations: {
      midi_llm: "aktywacja na ostatniej pozycji tekstowej",
      text2midi: "średnia aktywacja po pozycjach wspólnego wejścia dekodera",
    },
    configurationRationale: "Tempo, rejestr i polifonię wybrano jako uporządkowane własności, które można opisać słowami i mierzyć bezpośrednio w zapisie MIDI. Dla każdej pary model–koncept pokazano wariant o najsilniejszej odpowiedzi kierunkowej spośród stabilnych konfiguracji z interwencją we wszystkich warstwach.",
    sampleRationale: "Udostępniono pełny zbiór dziesięciu opisów wejściowych wykorzystanych w głównym eksperymencie, wspólny dla obu modeli i wszystkich trzech konceptów. Jako pierwszy umieszczono przykład, w którym zmiana jest najczytelniejsza w odsłuchu i na rolce pianolowej; pozostałych wyników nie odfiltrowano.",
    source: "Przebieg źródłowy", baseline: "Przebieg bazowy", patched: "Przebieg po podmianie aktywacji",
    sourcePrompt: "Źródłowy opis wejściowy", baselinePrompt: "Bazowy opis wejściowy",
    layer: "Warstwa", allLayers: "Wszystkie warstwy", download: "MIDI",
    pianoRoll: "Rolka pianolowa",
    saeLink: "MI-MIDI — interwencje w cechy rzadkich autoenkoderów →",
    licenseLink: "Licencja SoundFontu",
  },
  en: {
    pageTitle: "MI-MIDI — steering and activation patching",
    metaDescription: "Audio samples for activation steering and activation patching in text-to-MIDI models.",
    heroEyebrow: "Mechanistic interpretability of text-to-MIDI models",
    heroSection: "Activation steering and activation patching",
    heroLead: "This demo presents audio samples accompanying “MI-MIDI: Mechanistic Interpretability of Text-to-MIDI Generation Models via Probing, Lenses and Steering”. The material covers activation steering and activation patching in text2midi and MIDI-LLM.",
    steeringTab: "Activation steering", patchingTab: "Activation patching",
    model: "Model", concept: "Concept", direction: "Direction", prompt: "Prompt",
    concepts: { tempo: "Tempo", register: "Register", polyphony: "Polyphony" },
    directions: { a_to_b: "Piano → violin", b_to_a: "Violin → piano" },
    axes: {
      tempo: ["slower", "faster"],
      register: ["lower register", "higher register"],
      polyphony: ["lower polyphony", "higher polyphony"],
    },
    steeringGuideTitle: "Reading the steering comparison",
    steeringGuideText: "For each model and concept, five generations obtained from the same prompt are shown. α = 0 denotes the baseline generation; negative and positive values correspond to opposite orientations of the steering direction.",
    patchingGuideTitle: "Reading the activation-patching comparison",
    patchingGuideText: "Each prompt pair includes a baseline generation, a source generation, and the result after activation patching. The intervention transfers instrument information from the source prompt into the generation conditioned on the baseline prompt. The intervention site can be selected by layer; the best-performing site selected for the model is displayed by default. The complete set of 30 observations per direction is included: ten prompt templates and three random seeds. The pair with the largest observed instrument transfer is placed first without assigning it a separate category.",
    axisNegative: "negative α", axisBaseline: "α = 0", axisPositive: "positive α",
    example: "Example",
    configurationTitle: "Configuration shown",
    directionMethod: "Direction construction",
    directionMethodValue: "difference in means over 25 contrastive prompt pairs",
    sourceLayer: "Direction source layer",
    interventionStrategy: "Intervention strategy",
    interventionStrategyValue: "the same direction added at every layer",
    alphaMode: "Scaling mode",
    alphaModeValue: "absolute: h′ = h + αd",
    alphaValues: "Compared α values",
    promptRepresentation: "Prompt representation",
    promptRepresentations: {
      midi_llm: "activation at the final text position",
      text2midi: "mean activation over the shared decoder-input positions",
    },
    configurationRationale: "Tempo, register, and polyphony were selected as ordered attributes that can be stated in language and measured directly from symbolic MIDI. For each model–concept pair, the displayed series is the strongest directional response among stable all-layer configurations.",
    sampleRationale: "The complete ten-prompt evaluation set is included and is shared across both models and all three concepts. The example with the clearest change in listening and piano-roll inspection is placed first; no remaining result is filtered out.",
    source: "Source generation", baseline: "Baseline generation", patched: "After activation patching",
    sourcePrompt: "Source prompt", baselinePrompt: "Baseline prompt",
    layer: "Layer", allLayers: "All layers", download: "MIDI",
    pianoRoll: "Piano roll",
    saeLink: "MI-MIDI — SAE feature interventions →",
    licenseLink: "SoundFont license",
  },
};

let language = loadLanguage();
let activeView = "steering";

const STEERING_CONFIGURATIONS = {
  midi_llm: {
    tempo: { sourceLayer: 2 },
    register: { sourceLayer: 15 },
    polyphony: { sourceLayer: 12 },
  },
  text2midi: {
    tempo: { sourceLayer: 2 },
    register: { sourceLayer: 2 },
    polyphony: { sourceLayer: 14 },
  },
};

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
  const magnitude = Math.abs(alpha).toString().replace(".", language === "pl" ? "," : ".");
  return `α = ${alpha > 0 ? "+" : "−"}${magnitude}`;
}
function layerLabel(site) {
  return site === "all_layers" ? t("allLayers") : `${t("layer")} ${Number(site.slice(1))}`;
}

function mediaCard(title, item, kind) {
  return `<article class="sample-card sample-${esc(kind)}">
    <h3>${esc(title)}</h3>
    <a class="roll-link" href="${esc(item.roll)}" target="_blank" rel="noreferrer">
      <img class="roll" src="${esc(item.roll)}" alt="${esc(`${t("pianoRoll")}: ${title}`)}" loading="lazy">
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

function steeringExample(group, ordinal, initiallyOpen) {
  const title = `${t("example")} ${ordinal}`;
  const prompt = `<p><b class="prompt-tag">${t("prompt")}</b>${esc(group.prompt)}</p>`;
  return `<details class="example"${initiallyOpen ? " open" : ""}>
    <summary><span>${title}</span>${prompt}</summary>
    <div class="example-body">${steeringCards(group)}</div>
  </details>`;
}

function renderSteeringConfiguration(model, concept, example) {
  const configuration = STEERING_CONFIGURATIONS[model][concept];
  document.querySelector("#steeringConfiguration").innerHTML = `
    <h2>${t("configurationTitle")}</h2>
    <div class="configuration-grid">
      <div><span>${t("directionMethod")}</span><b>${t("directionMethodValue")}</b></div>
      <div><span>${t("sourceLayer")}</span><b>ℓ* = ${configuration.sourceLayer} (${language === "pl" ? "numeracja od 0" : "zero-based"})</b></div>
      <div><span>${t("interventionStrategy")}</span><b>${t("interventionStrategyValue")}</b></div>
      <div><span>${t("alphaMode")}</span><b>${t("alphaModeValue")}</b></div>
      <div><span>${t("alphaValues")}</span><b>${example.items.map((item) => alphaLabel(item.alpha)).join(" · ")}</b></div>
      <div><span>${t("promptRepresentation")}</span><b>${t("promptRepresentations")[model]}</b></div>
    </div>
    <p>${t("configurationRationale")}</p>
    <p>${t("sampleRationale")}</p>`;
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
  renderSteeringConfiguration(model, concept, groups[0]);
  document.querySelector("#steeringSamples").innerHTML = groups
    .map((group, index) => steeringExample(group, index + 1, index === 0)).join("");
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

function patchingExample(group, ordinal, initiallyOpen) {
  const id = `patch-${group.template}-${group.seed}`;
  const title = `${t("example")} ${ordinal}`;
  const prompts = `${group.source_prompt} → ${group.baseline_prompt}`;
  return `<details class="example patch-example" data-group-id="${esc(id)}"${initiallyOpen ? " open" : ""}>
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
  container.innerHTML = groups
    .map((group, index) => patchingExample(group, index + 1, index === 0)).join("");
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
function renderGuide() {
  const title = document.querySelector("#guideTitle");
  const text = document.querySelector("#guideText");
  const key = document.querySelector("#guideKey");
  key.classList.toggle("is-patching", activeView === "patching");
  if (activeView === "steering") {
    const concept = document.querySelector("#steeringConcept").value || "tempo";
    const [low, high] = t("axes")[concept];
    title.textContent = t("steeringGuideTitle");
    text.textContent = t("steeringGuideText");
    key.innerHTML = `<div class="axis-key">
      <span class="axis-pole">${esc(low)}</span>
      <span class="axis-track"><b>${t("axisNegative")}</b><i>${t("axisBaseline")}</i><b>${t("axisPositive")}</b></span>
      <span class="axis-pole">${esc(high)}</span>
    </div>`;
    return;
  }
  title.textContent = t("patchingGuideTitle");
  text.textContent = t("patchingGuideText");
  key.innerHTML = [
    ["baseline", t("baseline")],
    ["source", t("source")],
    ["patched", t("patched")],
  ].map(([kind, label]) => `<span class="key-item key-${kind}">${esc(label)}</span>`).join("");
}
function showView(view) {
  activeView = view;
  document.querySelector("#steeringView").hidden = view !== "steering";
  document.querySelector("#patchingView").hidden = view !== "patching";
  document.querySelectorAll(".tab").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  renderGuide();
  pauseAudio();
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("pageTitle");
  document.querySelector('meta[name="description"]').content = t("metaDescription");
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
document.querySelector("#steeringConcept").addEventListener("change", () => { renderSteering(); renderGuide(); });
document.querySelector("#patchingModel").addEventListener("change", renderPatching);
document.querySelector("#patchingDirection").addEventListener("change", renderPatching);
document.addEventListener("play", (event) => {
  if (event.target.tagName === "AUDIO") document.querySelectorAll("audio").forEach((audio) => { if (audio !== event.target) audio.pause(); });
}, true);

applyLanguage();
