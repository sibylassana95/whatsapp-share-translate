// popup.js

const langSelect = document.getElementById("langSelect");
const previewContent = document.getElementById("previewContent");
const btnShare = document.getElementById("btnShare");
const btnText = document.getElementById("btnText");
const sourceUrl = document.getElementById("sourceUrl");
const statusEl = document.getElementById("status");
const langLabel = document.getElementById("langLabel");

let pageData = null;
let translatedText = "";

const LANG_LABELS = {
  fr: "FR", en: "EN", es: "ES", de: "DE",
  it: "IT", pt: "PT", ar: "AR", zh: "ZH", ja: "JA"
};

// ── Initialisation ──────────────────────────────────────────────────────────
async function init() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    sourceUrl.textContent = new URL(tab.url).hostname;

    // Récupérer les données de la page via content script
    const data = await chrome.tabs.sendMessage(tab.id, { action: "getPageData" });
    pageData = { ...data, url: tab.url };

    await translateAndPreview();
  } catch (e) {
    showError("Impossible de lire la page. Essayez de la recharger.");
  }
}

// ── Traduction & aperçu ────────────────────────────────────────────────────
async function translateAndPreview() {
  if (!pageData) return;

  const targetLang = langSelect.value;
  langLabel.textContent = LANG_LABELS[targetLang] || targetLang.toUpperCase();

  // Texte à traduire : sélection > tweet > titre + description
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

  // Affiche le spinner
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
    previewContent.textContent = raw; // fallback : texte original
    translatedText = raw;
    showStatus("⚠️ Traduction échouée, partage sans traduction", "error");
    btnShare.disabled = false;
    btnText.textContent = "Partager (sans traduction)";
    btnShare.querySelector("span").textContent = "📤";
  }
}

// ── Traduction via Google (gratuit, sans clé) ──────────────────────────────
async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.slice(0, 4000))}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0]
    .filter(item => item && item[0])
    .map(item => item[0])
    .join("");
}

// ── Partage WhatsApp ───────────────────────────────────────────────────────
btnShare.addEventListener("click", () => {
  if (!pageData) return;

  const message = translatedText
    ? `${translatedText}\n\n🔗 ${pageData.url}`
    : `🔗 ${pageData.url}`;

  const encoded = encodeURIComponent(message);
  chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${encoded}` });

  showStatus("✅ Ouverture de WhatsApp Web…", "success");
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
