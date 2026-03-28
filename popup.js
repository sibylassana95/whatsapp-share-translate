// popup.js — Share & Translate v3.0

// ── Éléments DOM ─────────────────────────────────────────────────────────────
const sourceUrl   = document.getElementById("sourceUrl");
const previewBody = document.getElementById("previewBody");
const langLabel   = document.getElementById("langLabel");
const langSelect  = document.getElementById("langSelect");
const modeApp     = document.getElementById("modeApp");
const modeWeb     = document.getElementById("modeWeb");
const btnWa       = document.getElementById("btnWa");
const btnLi       = document.getElementById("btnLi");
const btnX        = document.getElementById("btnX");
const statusEl    = document.getElementById("status");

// ── State ─────────────────────────────────────────────────────────────────────
let pageData      = null;
let translatedText = "";
let currentMode   = "app"; // "app" | "web"

const LANG_LABELS = {
  fr:"FR", en:"EN", es:"ES", de:"DE",
  it:"IT", pt:"PT", ar:"AR", zh:"ZH", ja:"JA"
};

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  // Restaurer préférences
  const { waMode, defaultLang } = await chrome.storage.local.get({
    waMode: "app",
    defaultLang: "fr"
  });
  setMode(waMode, false);
  langSelect.value = defaultLang;
  langLabel.textContent = LANG_LABELS[defaultLang] || "FR";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    try {
      sourceUrl.textContent = new URL(tab.url).hostname;
    } catch { sourceUrl.textContent = tab.url; }

    const data = await chrome.tabs.sendMessage(tab.id, { action: "getPageData" });
    pageData = { ...data, url: tab.url };
    await translateAndPreview();
  } catch (e) {
    showError("Impossible de lire cette page. Rechargez-la et réessayez.");
  }
}

// ── Mode App / Web WhatsApp ───────────────────────────────────────────────────
function setMode(mode, save = true) {
  currentMode = mode;
  modeApp.classList.toggle("active", mode === "app");
  modeWeb.classList.toggle("active", mode === "web");
  if (save) chrome.storage.local.set({ waMode: mode });
}
modeApp.addEventListener("click", () => setMode("app"));
modeWeb.addEventListener("click", () => setMode("web"));

// ── Traduction & aperçu ───────────────────────────────────────────────────────
async function translateAndPreview() {
  if (!pageData) return;

  const targetLang = langSelect.value;
  langLabel.textContent = LANG_LABELS[targetLang] || targetLang.toUpperCase();
  chrome.storage.local.set({ defaultLang: targetLang });

  // Priorité : sélection > tweet > post LinkedIn > titre+description
  const raw =
    pageData.selectedText ||
    pageData.tweetText ||
    pageData.linkedinPostText ||
    `${pageData.title}. ${pageData.description}`.trim();

  setButtonsLoading(true);

  if (!raw) {
    previewBody.className = "preview-body";
    previewBody.textContent = "(Aucun contenu détecté sur cette page)";
    setButtonsLoading(false);
    return;
  }

  previewBody.className = "preview-body loading";
  previewBody.innerHTML = `<div class="spinner"></div><span>Traduction en cours…</span>`;

  try {
    translatedText = await translateText(raw, targetLang);
    previewBody.className = "preview-body";
    previewBody.textContent = translatedText;
    setButtonsLoading(false);
  } catch (e) {
    previewBody.className = "preview-body";
    previewBody.textContent = raw;
    translatedText = raw;
    showStatus("Traduction échouée — partage sans traduction", "err");
    setButtonsLoading(false);
  }
}

// ── Boutons plateforme ────────────────────────────────────────────────────────
function setButtonsLoading(loading) {
  [btnWa, btnLi, btnX].forEach(btn => {
    btn.disabled = loading;
    btn.classList.toggle("loading", loading);
  });
}

function doShare(platform) {
  if (!pageData) return;

  const text    = translatedText || pageData.title || "";
  const pageUrl = pageData.url || "";
  const encoded = encodeURIComponent(text);
  const urlEncoded = encodeURIComponent(pageUrl);

  if (platform === "whatsapp") {
    if (currentMode === "app") {
      chrome.tabs.create({ url: `whatsapp://send?text=${encoded}` });
    } else {
      chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${encoded}` });
    }
    showStatus("Ouverture de WhatsApp…", "ok");

  } else if (platform === "linkedin") {
    chrome.tabs.create({
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}&summary=${encoded}`
    });
    showStatus("Ouverture de LinkedIn…", "ok");

  } else if (platform === "x") {
    chrome.tabs.create({
      url: `https://x.com/intent/tweet?text=${encoded}`
    });
    showStatus("Ouverture de X…", "ok");
  }

  setTimeout(() => window.close(), 1100);
}

btnWa.addEventListener("click", () => doShare("whatsapp"));
btnLi.addEventListener("click", () => doShare("linkedin"));
btnX.addEventListener("click",  () => doShare("x"));

// ── Traduction Google (sans clé) ──────────────────────────────────────────────
async function translateText(text, targetLang) {
  // Extraire les URLs pour ne pas les traduire
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = [];
  const withPlaceholders = text.replace(urlRegex, (match) => {
    const i = urls.length;
    urls.push(match);
    return `__URL_${i}__`;
  });

  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(withPlaceholders.slice(0, 4000))}`;
  const res  = await fetch(apiUrl);
  const data = await res.json();

  let result = data[0]
    .filter(item => item && item[0])
    .map(item => item[0])
    .join("");

  urls.forEach((url, i) => {
    result = result.replace(new RegExp(`__URL_${i}__`, "g"), url);
  });

  return result;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function showStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
}
function showError(msg) {
  previewBody.className = "preview-body";
  previewBody.textContent = msg;
  showStatus(msg, "err");
}

langSelect.addEventListener("change", translateAndPreview);

// Démarrage
init();
