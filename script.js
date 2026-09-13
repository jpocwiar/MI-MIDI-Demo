const DATA = window.INTERVENTION_LIBRARY;

const I18N = {
  pl: {
    pageTitle: "MI-MIDI — atlas interwencji",
    heroEyebrow: "Mechanistyczna interpretowalność generacji MIDI",
    heroTitle: "Atlas interwencji MI-MIDI",
    heroLead: "Posłuchaj, jak bezpośrednia zmiana aktywacji wpływa na muzykę generowaną przez MIDI-LLM i text2midi. Atlas łączy steering kierunkami różnic średnich z przenoszeniem informacji przez activation patching.",
    saeLinkKicker: "Drugie demo", saeLink: "Otwórz atlas cech SAE",
    methodSummary: "Jak czytać te eksperymenty?",
    method: [
      ["Steering", "Do stanów modelu dodajemy kierunek wyznaczony z kontrastowych opisów, np. szybki–wolny. α określa siłę interwencji; generacja bazowa ma α=0."],
      ["Dwie orientacje", "Kierunek jest testowany w obie strony. Etykiety „w dół” i „w górę” opisują zamierzony biegun muzyczny, a nie znak wektora w kodzie."],
      ["Activation patching", "Model generuje z promptu B, ale wybrane aktywacje promptu zastępujemy aktywacjami z promptu A. Sprawdzamy, czy muzyka przesuwa się w stronę dawcy."],
      ["Dwa protokoły patchingu", "Odsłuch pochodzi z wcześniejszego pełnego przebiegu fortepian–skrzypce. Aktualny wynik zbiorczy E4 używa 10 szablonów, obu kierunków i dopasowanego placebo."],
      ["Próbki wyróżnione", "Pierwsze karty steeringu wybrano po obejrzeniu wyników i oznaczono jako ilustracyjne. Pozostałe karty pokazują cały dostępny w repozytorium materiał odsłuchowy."],
      ["Audio", "To statyczny atlas wcześniej wygenerowanych utworów, a nie model uruchamiany w przeglądarce. Pliki MIDI można pobrać przy każdej próbce."],
    ],
    steeringTab: "Steering", patchingTab: "Activation patching",
    steeringTitle: "Steering kierunkami różnic średnich",
    steeringIntro: "Wybierz model, koncept i próbkę. Gdy dostępne są obie orientacje, możesz porównać oba zamierzone bieguny z tą samą generacją bazową.",
    steeringEvidenceMidi: "MIDI-LLM: po korekcji BH i Holma efekt zachowują konfiguracje one-to-all dla tempa L2 i polifonii L12. Żadna konfiguracja single-layer nie przechodzi korekcji.",
    steeringEvidenceT2m: "text2midi: w rodzinie one-to-all cztery konfiguracje przechodzą BH, lecz tylko tempo L2 przechodzi także Holma. Żadna konfiguracja single-layer nie przechodzi korekcji.",
    steeringArchiveNotice: "Odsłuch jest kompletem mediów zgromadzonych wcześniej dla strony demonstracyjnej, nie pełną siatką exact10 używaną w aktualnej analizie. Dlatego karty są oznaczone jako materiał archiwalny i nie należy wybierać z nich konfiguracji na podstawie samego brzmienia.",
    patchingTitle: "Przenoszenie informacji o instrumencie",
    patchingIntro: "Porównaj dawcę A (fortepian), odbiorcę B (skrzypce) i generację B po podmianie aktywacji promptu. Selektor obejmuje wszystkie zapisane warstwy wcześniejszego przebiegu odsłuchowego.",
    completeArchive: "pełny dostępny atlas odsłuchowy", illustrative: "przykład ilustracyjny · wybór post hoc", archive: "materiał archiwalny",
    seed: "ziarno", magnitude: "Siła α", layer: "Miejsce interwencji", baseline: "Bez interwencji",
    lower: { tempo: "W stronę wolniej", register: "W stronę niżej", polyphony: "W stronę rzadziej", repetition: "W stronę mniej powtórzeń" },
    higher: { tempo: "W stronę szybciej", register: "W stronę wyżej", polyphony: "W stronę gęściej", repetition: "W stronę większej liczby powtórzeń" },
    noDirection: "Ta orientacja nie jest dostępna dla tej archiwalnej próbki.",
    donor: "Dawca A · fortepian", recipient: "Odbiorca B · skrzypce", patched: "B po patchingu z A",
    promptA: "A gentle solo piano piece, soft and melodic", promptB: "A gentle solo violin piece, soft and melodic",
    currentEvidence: "Aktualny wynik zbiorczy E4",
    legacyNotice: "Uwaga: poniższe audio pochodzi z wcześniejszego przebiegu z jedną parą promptów i nie zawiera dopasowanej kontroli placebo. Służy do ilustracji odsłuchowej, a nie jako samodzielny dowód statystyczny.",
    patchResultMidi: "MIDI-LLM: transfer pozostaje silny na L0 i L12, a na L15 spada do około 18% wartości odniesienia. Wszystkie trzy miejsca przechodzą korekcje BH i Holma.",
    patchResultT2m: "text2midi: pojedyncze warstwy nie dają potwierdzonego efektu free-running; patching wszystkich warstw osiąga transfer 0,527 [0,366; 0,689] i przechodzi korekcje BH i Holma.",
    aggregateNotAudio: "Liczby pochodzą z aktualnego, dopasowanego protokołu; odtwarzane próbki są oznaczonym materiałem wcześniejszym.",
    downloadMp3: "Pobierz MP3", downloadMidi: "Pobierz MIDI",
    featuredHeading: "Wyróżnione przykłady", featuredIntro: "Szybki punkt wejścia. Dobór jest ilustracyjny; niżej znajduje się cały dostępny zestaw.",
    atlasHeading: "Pełna biblioteka steeringu", atlasIntro: "Wszystkie seedy, modele, koncepty, kierunki i wartości α znajdujące się dotąd w repozytorium strony.",
    patchAtlasHeading: "Pełna biblioteka patchingu instrumentu", patchAtlasIntro: "Oba modele, wszystkie 10 seedów i wszystkie zapisane warstwy wcześniejszego przebiegu.",
    expand: "Rozwiń", collapse: "Zwiń", steeringGenerations: "próbek steeringu", patchingGenerations: "próbek patchingu", modelsCount: "modele", methodsCount: "metody interwencji",
    footerAudio: 'Audio zsyntetyzowano za pomocą FluidSynth. Nowe rendery patchingu używają MuseScore_General.sf3 0.2 na licencji MIT; szczegóły zawiera <a href="SOUNDFONT_LICENSE.md">nota licencyjna</a>. Pliki normalizowano niezależnie, dlatego głośność nie jest wynikiem porównawczym.',
    footerProvenance: "Każda karta podaje model, seed, kierunek i miejsce interwencji. Steering oraz odsłuch patchingu są archiwami wcześniej wygenerowanych próbek; aktualne wnioski statystyczne patchingu są prezentowane osobno.",
    saeFooter: "MI-MIDI V2: pełny atlas interwencji w cechy SAE →",
    concepts: { tempo: "Tempo", register: "Rejestr", polyphony: "Polifonia", repetition: "Powtórzenia" },
  },
  en: {
    pageTitle: "MI-MIDI — intervention atlas",
    heroEyebrow: "Mechanistic interpretability of MIDI generation", heroTitle: "MI-MIDI intervention atlas",
    heroLead: "Listen to how direct activation interventions change music generated by MIDI-LLM and text2midi. The atlas combines difference-in-means steering with information transfer through activation patching.",
    saeLinkKicker: "Companion demo", saeLink: "Open the SAE feature atlas",
    methodSummary: "How should these experiments be read?",
    method: [
      ["Steering", "We add a direction estimated from contrasting descriptions, such as fast–slow, to model states. α controls intervention strength; the baseline is α=0."],
      ["Two orientations", "Every direction is tested both ways. “Lower” and “higher” name the intended musical pole, not the vector sign used in code."],
      ["Activation patching", "The model generates from prompt B while selected prompt activations are replaced by activations from prompt A. We test whether the music moves toward the donor."],
      ["Two patching protocols", "The listening material comes from the earlier complete piano–violin run. Current aggregate E4 evidence uses 10 templates, both directions, and a matched placebo."],
      ["Highlighted samples", "The first steering cards were selected after inspecting the results and are marked as illustrative. The remaining cards contain all listening material currently available in the demo repository."],
      ["Audio", "This is a static atlas of previously generated pieces, not a model running in the browser. The original MIDI is downloadable for every clip."],
    ],
    steeringTab: "Steering", patchingTab: "Activation patching",
    steeringTitle: "Difference-in-means direction steering", steeringIntro: "Choose a model, concept, and sample. Where both orientations are available, compare both intended musical poles against the same baseline generation.",
    steeringEvidenceMidi: "MIDI-LLM: after both BH and Holm correction, one-to-all tempo L2 and polyphony L12 retain an effect. No single-layer configuration passes either correction.",
    steeringEvidenceT2m: "text2midi: four one-to-all configurations pass BH, but only tempo L2 also passes Holm. No single-layer configuration passes either correction.",
    steeringArchiveNotice: "The listening section is the complete set of media previously collected for the demo, not the full exact10 grid used by the current analysis. Cards are therefore marked as archival material and should not be used to select configurations by sound alone.",
    patchingTitle: "Transferring instrument information", patchingIntro: "Compare donor A (piano), recipient B (violin), and generation B after prompt-activation replacement. The selector covers every saved site in the earlier listening run.",
    completeArchive: "complete available listening atlas", illustrative: "illustrative example · post-hoc selection", archive: "archival material",
    seed: "seed", magnitude: "Strength α", layer: "Intervention site", baseline: "No intervention",
    lower: { tempo: "Toward slower", register: "Toward lower", polyphony: "Toward sparser", repetition: "Toward less repetition" },
    higher: { tempo: "Toward faster", register: "Toward higher", polyphony: "Toward denser", repetition: "Toward more repetition" },
    noDirection: "This orientation is unavailable for this archival sample.",
    donor: "Donor A · piano", recipient: "Recipient B · violin", patched: "B patched from A",
    promptA: "A gentle solo piano piece, soft and melodic", promptB: "A gentle solo violin piece, soft and melodic",
    currentEvidence: "Current aggregate E4 evidence",
    legacyNotice: "Note: the audio below comes from an earlier run with one prompt pair and no matched placebo. It is a listening illustration, not standalone statistical evidence.",
    patchResultMidi: "MIDI-LLM: transfer remains strong at L0 and L12, then falls to about 18% of the reference at L15. All three sites pass both BH and Holm corrections.",
    patchResultT2m: "text2midi: no single layer has a confirmed free-running effect; all-layer patching reaches 0.527 [0.366, 0.689] and passes both BH and Holm corrections.",
    aggregateNotAudio: "The numbers come from the current matched protocol; playable samples are explicitly marked earlier material.",
    downloadMp3: "Download MP3", downloadMidi: "Download MIDI",
    featuredHeading: "Highlighted examples", featuredIntro: "A quick entry point. Selection is illustrative; the complete available set follows below.",
    atlasHeading: "Complete steering library", atlasIntro: "Every seed, model, concept, direction, and α value currently included in the demo repository.",
    patchAtlasHeading: "Complete instrument-patching library", patchAtlasIntro: "Both models, all 10 seeds, and every saved layer from the earlier run.",
    expand: "Expand", collapse: "Collapse", steeringGenerations: "steering samples", patchingGenerations: "patching samples", modelsCount: "models", methodsCount: "intervention methods",
    footerAudio: 'Audio was synthesized with FluidSynth. New patching renders use MuseScore_General.sf3 0.2 under the MIT license; see the <a href="SOUNDFONT_LICENSE.md">full attribution</a>. Files were normalized independently, so loudness is not a comparative outcome.',
    footerProvenance: "Every card identifies the model, seed, direction, and intervention site. Steering and patching audio are archives of previously generated samples; current patching statistics are presented separately.",
    saeFooter: "MI-MIDI V2: complete SAE feature intervention atlas →",
    concepts: { tempo: "Tempo", register: "Register", polyphony: "Polyphony", repetition: "Repetition" },
  },
};

let language = loadLanguage();
let activeView = "steering";
function t(key) { return I18N[language][key]; }
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]); }
function loadLanguage() { try { return localStorage.getItem("mi-midi-language") || (navigator.language.startsWith("pl") ? "pl" : "en"); } catch (_) { return navigator.language.startsWith("pl") ? "pl" : "en"; } }
function fmtAlpha(value) { return Number(value) === 0 ? "0" : Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, ""); }

function applyLanguage() {
  document.documentElement.lang = language; document.title = t("pageTitle");
  document.querySelectorAll("[data-text]").forEach((el) => { const value = t(el.dataset.text); if (el.dataset.text.startsWith("footer")) el.innerHTML = value; else el.textContent = value; });
  document.querySelector("#methodGrid").innerHTML = t("method").map(([title, body]) => `<div><b>${title}</b>${body}</div>`).join("");
  document.querySelectorAll(".language-button").forEach((button) => { const active = button.dataset.language === language; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); });
  renderStats(); renderViews();
}
function renderStats() {
  const stats = [[DATA.meta.steering_samples,t("steeringGenerations")],[DATA.meta.patching_samples,t("patchingGenerations")],[2,t("modelsCount")],[2,t("methodsCount")]];
  document.querySelector("#stats").innerHTML = stats.map(([n,label]) => `<div class="stat"><b>${n}</b><span>${label}</span></div>`).join("");
}
function mediaBox(kind, title, media) {
  if (!media) return `<div class="sample missing"><h3>${esc(title)}</h3><p>${t("noDirection")}</p></div>`;
  return `<div class="sample ${kind}"><h3>${esc(title)}</h3><audio controls preload="none" src="${esc(media.audio)}"></audio>${media.roll ? `<a class="roll-link" href="${esc(media.roll)}" target="_blank"><img class="roll" loading="lazy" src="${esc(media.roll)}" alt="Piano roll"></a>` : ""}<div class="downloads"><a href="${esc(media.audio)}" download>${t("downloadMp3")}</a><a href="${esc(media.midi)}" download>${t("downloadMidi")}</a></div></div>`;
}
function steeringCard(group) {
  const allAlpha = [...new Set([...group.lower,...group.higher].map((x) => x.alpha).filter((x) => x > 0))].sort((a,b) => a-b); const initial = allAlpha.at(-1) ?? 0;
  return `<details class="card steering-card ${group.featured ? "featured" : ""}" data-id="${esc(group.id)}" ${group.featured ? "open" : ""}><summary class="card-head"><span class="head-main"><span class="identity">${esc(group.model)} · ${t("seed")} ${group.seed}</span><span class="card-title">${esc(t("concepts")[group.concept])}</span><span class="badges">${group.featured ? `<span class="badge featured">${t("illustrative")}</span>` : ""}<span class="badge">${t("archive")}</span></span></span><span class="expand-label">${t("expand")}</span></summary><div class="card-body"><div class="listen-controls"><label>${t("magnitude")} <select class="alpha-select">${allAlpha.map((a) => `<option value="${a}" ${a === initial ? "selected" : ""}>${fmtAlpha(a)}</option>`).join("")}</select></label><span>${group.lower.length && group.higher.length ? "↙ · 0 · ↗" : "0 · ↗"}</span></div><div class="compare steering-compare"></div></div></details>`;
}
function nearest(items, alpha) { return items.find((x) => Number(x.alpha) === Number(alpha)) || null; }
function updateSteeringCard(card, group) { const alpha = Number(card.querySelector(".alpha-select").value); card.querySelector(".steering-compare").innerHTML = [mediaBox("lower",t("lower")[group.concept],nearest(group.lower,alpha)),mediaBox("baseline",t("baseline"),group.baseline),mediaBox("higher",t("higher")[group.concept],nearest(group.higher,alpha))].join(""); }
function renderSteering() {
  const featured = DATA.steering.filter((x) => x.featured), rest = DATA.steering.filter((x) => !x.featured), root = document.querySelector("#steeringView");
  root.innerHTML = `<div class="section-intro"><span class="section-kicker">${t("completeArchive")}</span><h2>${t("steeringTitle")}</h2><p>${t("steeringIntro")}</p></div><div class="evidence-grid"><article><span>MIDI-LLM</span><h3>${t("currentEvidence")}</h3><p>${t("steeringEvidenceMidi")}</p></article><article><span>text2midi</span><h3>${t("currentEvidence")}</h3><p>${t("steeringEvidenceT2m")}</p></article></div><p class="protocol-note">${t("steeringArchiveNotice")}</p><div class="subsection"><h3>${t("featuredHeading")}</h3><p>${t("featuredIntro")}</p></div>${featured.map(steeringCard).join("")}<div class="subsection divided"><h3>${t("atlasHeading")}</h3><p>${t("atlasIntro")}</p></div>${rest.map(steeringCard).join("")}`;
  root.querySelectorAll(".steering-card").forEach((card) => { const group = DATA.steering.find((x) => x.id === card.dataset.id); updateSteeringCard(card,group); card.querySelector(".alpha-select").addEventListener("change",() => updateSteeringCard(card,group)); attachCard(card); });
}
function patchingCard(group) { return `<details class="card patching-card" data-id="${esc(group.id)}"><summary class="card-head"><span class="head-main"><span class="identity">${esc(group.model)} · ${t("seed")} ${group.seed}</span><span class="card-title">Piano → violin</span><span class="badges"><span class="badge warning">${t("archive")}</span></span></span><span class="expand-label">${t("expand")}</span></summary><div class="card-body"><div class="prompt-pair"><span><b>A</b> ${esc(t("promptA"))}</span><span><b>B</b> ${esc(t("promptB"))}</span></div><div class="listen-controls"><label>${t("layer")} <select class="layer-select">${group.patched.map((x) => `<option value="${esc(x.layer)}">L${esc(x.layer)}</option>`).join("")}</select></label></div><div class="compare patch-compare"></div></div></details>`; }
function updatePatchingCard(card,group) { const layer = card.querySelector(".layer-select").value, patched = group.patched.find((x) => String(x.layer) === layer); card.querySelector(".patch-compare").innerHTML = [mediaBox("donor",t("donor"),group.baseline_a),mediaBox("recipient",t("recipient"),group.baseline_b),mediaBox("patched",t("patched"),patched)].join(""); }
function renderPatching() {
  const root = document.querySelector("#patchingView");
  root.innerHTML = `<div class="section-intro"><span class="section-kicker">${t("completeArchive")}</span><h2>${t("patchingTitle")}</h2><p>${t("patchingIntro")}</p></div><div class="evidence-grid"><article><span>MIDI-LLM</span><h3>${t("currentEvidence")}</h3><p>${t("patchResultMidi")}</p></article><article><span>text2midi</span><h3>${t("currentEvidence")}</h3><p>${t("patchResultT2m")}</p></article></div><p class="protocol-note"><strong>${t("legacyNotice")}</strong><br>${t("aggregateNotAudio")}</p><div class="subsection"><h3>${t("patchAtlasHeading")}</h3><p>${t("patchAtlasIntro")}</p></div>${DATA.patching.map(patchingCard).join("")}`;
  root.querySelectorAll(".patching-card").forEach((card) => { const group = DATA.patching.find((x) => x.id === card.dataset.id); updatePatchingCard(card,group); card.querySelector(".layer-select").addEventListener("change",() => updatePatchingCard(card,group)); attachCard(card); });
}
function attachCard(card) { const label = card.querySelector(".expand-label"), sync = () => { label.textContent = card.open ? t("collapse") : t("expand"); if (!card.open) card.querySelectorAll("audio").forEach((a) => a.pause()); }; card.addEventListener("toggle",sync); sync(); }
function renderViews() { renderSteering(); renderPatching(); showView(activeView); }
function showView(view) { activeView = view; document.querySelector("#steeringView").hidden = view !== "steering"; document.querySelector("#patchingView").hidden = view !== "patching"; document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("is-active",x.dataset.view === view)); document.querySelectorAll("audio").forEach((a) => a.pause()); }

document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click",() => { language = button.dataset.language; try { localStorage.setItem("mi-midi-language",language); } catch (_) {} applyLanguage(); }));
document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click",() => showView(button.dataset.view)));
document.addEventListener("play",(event) => { if (event.target.tagName === "AUDIO") document.querySelectorAll("audio").forEach((audio) => { if (audio !== event.target) audio.pause(); }); },true);
applyLanguage();
