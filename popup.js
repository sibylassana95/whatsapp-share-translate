// popup.js

const langSelect    = document.getElementById("langSelect");
const previewContent= document.getElementById("previewContent");
const btnShare      = document.getElementById("btnShare");
const btnText       = document.getElementById("btnText");
const sourceUrl     = document.getElementById("sourceUrl");
const statusEl      = document.getElementById("status");
const langLabel     = document.getElementById("langLabel");
const modeApp       = document.getElementById("modeApp");
const modeWeb       = document.getElementById("modeWeb");

let pageData = null;
let translatedText = "";
let currentMode = "app"; // "app" | "web"

const LANG_LABELS = {
  fr: "FR", en: "EN", es: "ES", de: "DE",
  it: "IT", pt: "PT", ar: "AR", zh: "ZH", ja: "JA"
};

// ── Initialisation ──────────────────────────────────────────────────────────
async function init() {
  const { waMode } = await chrome.storage.local.get({ waMode: "app" });
  setMode(waMode, false);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    sourceUrl.textContent = new URL(tab.url).hostname;

    const data = await chrome.tabs.sendMessage(tab.id, { action: "getPageData" });
    pageData = { ...data, url: tab.url };

    await translateAndPreview();
  } catch (e) {
    showError("Impossible de lire la page. Essayez de la recharger.");
  }
}

// ── Mode App / Web ──────────────────────────────────────────────────────────
function setMode(mode, save = true) {
  currentMode = mode;
  if (mode === "app") {
    modeApp.classList.add("active");
    modeWeb.classList.remove("active");
  } else {
    modeWeb.classList.add("active");
    modeApp.classList.remove("active");
  }
  if (save) chrome.storage.local.set({ waMode: mode });
}

modeApp.addEventListener("click", () => setMode("app"));
modeWeb.addEventListener("click", () => setMode("web"));

// ── Traduction & aperçu ────────────────────────────────────────────────────
async function translateAndPreview() {
  if (!pageData) return;

  const targetLang = langSelect.value;
  langLabel.textContent = LANG_LABELS[targetLang] || targetLang.toUpperCase();

  const raw = pageData.selectedText
    || pageData.tweetText
    || `${pageData.title}. ${pageData.description}`.trim();

  if (!raw) {
    previewContent.className = "preview-content";
    previewContent.textContent = "(Aucun contenu détecté sur cette page)";
    btnShare.disabled = false;
    btnText.textContent = "Partager le lien";
    btnShare.querySelector("span").textContent = "📤";
    return;
  }

  previewContent.className = "preview-content loading";
  previewContent.innerHTML = `<div class="spinner"></div><span>Traduction en cours…</span>`;
  btnShare.disabled = true;
  btnText.textContent = "Traduction…";
  btnShare.querySelector("span").textContent = "⏳";

  try {
    translatedText = await translateText(raw, targetLang);
    previewContent.className = "preview-content";
    previewContent.textContent = translatedText;

    btnShare.disabled = false;
    btnText.textContent = "Partager sur WhatsApp";
    btnShare.querySelector("span").textContent = "📲";
  } catch (e) {
    previewContent.className = "preview-content";
    previewContent.textContent = raw;
    translatedText = raw;
    showStatus("⚠️ Traduction échouée, partage sans traduction", "error");
    btnShare.disabled = false;
    btnText.textContent = "Partager (sans traduction)";
    btnShare.querySelector("span").textContent = "📤";
  }
}

// ── Traduction via Google (gratuit, sans clé) ──────────────────────────────
async function translateText(text, targetLang) {
  // 1. Extraire les URLs et les remplacer par des marqueurs
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = [];
  const textWithPlaceholders = text.replace(urlRegex, (match) => {
    const index = urls.length;
    urls.push(match);
    return `__URL_${index}__`;
  });

  // 2. Traduire le texte sans les URLs
  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textWithPlaceholders.slice(0, 4000))}`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  let result = data[0]
    .filter(item => item && item[0])
    .map(item => item[0])
    .join("");

  // 3. Remettre les URLs originales a la place des marqueurs
  urls.forEach((originalUrl, index) => {
    result = result.replace(new RegExp(`__URL_${index}__`, "g"), originalUrl);
  });

  return result;
}

// ── Partage WhatsApp ───────────────────────────────────────────────────────
btnShare.addEventListener("click", () => {
  if (!pageData) return;

  // On partage uniquement le texte traduit, sans le lien
  const message = translatedText || pageData.url;

  const encoded = encodeURIComponent(message);

  if (currentMode === "app") {
    // whatsapp:// ouvre l'app desktop sur Windows et macOS
    chrome.tabs.create({ url: `whatsapp://send?text=${encoded}` });
    showStatus("✅ Ouverture de WhatsApp…", "success");
  } else {
    chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${encoded}` });
    showStatus("✅ Ouverture de WhatsApp Web…", "success");
  }

  setTimeout(() => window.close(), 1200);
});

// ── Re-traduire si la langue change ───────────────────────────────────────
langSelect.addEventListener("change", () => {
  translateAndPreview();
});

// ── Helpers ────────────────────────────────────────────────────────────────
function showStatus(msg, type = "") {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
}

function showError(msg) {
  previewContent.className = "preview-content";
  previewContent.textContent = msg;
  showStatus(msg, "error");
}

// Démarrage
init();
