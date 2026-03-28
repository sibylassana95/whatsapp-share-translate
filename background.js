// background.js — Share & Translate v3.0
// Supporte WhatsApp, LinkedIn, X (Twitter)

// ── Menu contextuel (clic droit) ────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  // Menu parent
  chrome.contextMenus.create({
    id: "shareTranslate",
    title: "Share & Translate",
    contexts: ["page", "selection", "link"]
  });
  // Sous-menus par plateforme
  chrome.contextMenus.create({
    id: "shareWhatsApp",
    parentId: "shareTranslate",
    title: "Partager sur WhatsApp",
    contexts: ["page", "selection", "link"]
  });
  chrome.contextMenus.create({
    id: "shareLinkedIn",
    parentId: "shareTranslate",
    title: "Partager sur LinkedIn",
    contexts: ["page", "selection", "link"]
  });
  chrome.contextMenus.create({
    id: "shareX",
    parentId: "shareTranslate",
    title: "Partager sur X",
    contexts: ["page", "selection", "link"]
  });
});

// ── Clic sur menu contextuel ─────────────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const platformMap = {
    shareWhatsApp: "whatsapp",
    shareLinkedIn: "linkedin",
    shareX: "x"
  };
  const platform = platformMap[info.menuItemId];
  if (!platform) return;

  const pageUrl = info.linkUrl || tab.url;
  const selectedText = info.selectionText || "";

  const { defaultLang } = await chrome.storage.local.get({ defaultLang: "fr" });

  if (selectedText) {
    const translated = await translateText(selectedText, defaultLang);
    openPlatform(platform, translated, pageUrl);
  } else {
    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, func: getPageMeta },
      async (results) => {
        const meta = results?.[0]?.result || { title: tab.title, description: "" };
        const raw = `${meta.title}. ${meta.description}`.trim();
        const translated = await translateText(raw, defaultLang);
        openPlatform(platform, translated, pageUrl);
      }
    );
  }
});

// ── Messages depuis le popup ──────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sharePage") {
    handleShare(request).then(sendResponse);
    return true;
  }
});

async function handleShare({ platform, text, url, targetLang }) {
  try {
    const translated = await translateText(text, targetLang || "fr");
    openPlatform(platform, translated, url);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ── Ouvre la bonne plateforme ─────────────────────────────────────────────────
async function openPlatform(platform, text, pageUrl) {
  const encoded = encodeURIComponent(text);
  const urlEncoded = encodeURIComponent(pageUrl || "");

  if (platform === "whatsapp") {
    const { waMode } = await chrome.storage.local.get({ waMode: "app" });
    if (waMode === "app") {
      chrome.tabs.create({ url: `whatsapp://send?text=${encoded}` });
    } else {
      chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${encoded}` });
    }
  } else if (platform === "linkedin") {
    // LinkedIn Share URL — pré-remplit le champ texte + URL de la page
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}&summary=${encoded}`;
    chrome.tabs.create({ url: linkedinUrl });
  } else if (platform === "x") {
    // X (Twitter) — pré-remplit le tweet avec le texte traduit
    const xUrl = `https://x.com/intent/tweet?text=${encoded}`;
    chrome.tabs.create({ url: xUrl });
  }
}

// ── Traduction Google Translate (sans clé API) ────────────────────────────────
async function translateText(text, targetLang) {
  if (!text || text.trim() === "") return text;

  // Extraire les URLs pour ne pas les traduire
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = [];
  const textWithPlaceholders = text.replace(urlRegex, (match) => {
    const i = urls.length;
    urls.push(match);
    return `__URL_${i}__`;
  });

  const chunks = splitText(textWithPlaceholders, 4000);
  const translatedChunks = [];

  for (const chunk of chunks) {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const translated = data[0]
      .filter(item => item && item[0])
      .map(item => item[0])
      .join("");
    translatedChunks.push(translated);
  }

  let result = translatedChunks.join(" ");
  urls.forEach((url, i) => {
    result = result.replace(new RegExp(`__URL_${i}__`, "g"), url);
  });

  return result;
}

// ── Découpe le texte en morceaux ───────────────────────────────────────────────
function splitText(text, maxLength) {
  if (text.length <= maxLength) return [text];
  const chunks = [];
  let current = "";
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const s of sentences) {
    if ((current + s).length > maxLength) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += (current ? " " : "") + s;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

// ── Récupère meta de la page (injecté dans le tab) ────────────────────────────
function getPageMeta() {
  const title = document.title || "";
  const descMeta =
    document.querySelector('meta[name="description"]') ||
    document.querySelector('meta[property="og:description"]') ||
    document.querySelector('meta[name="twitter:description"]');
  const description = descMeta ? descMeta.getAttribute("content") : "";
  return { title, description };
}
