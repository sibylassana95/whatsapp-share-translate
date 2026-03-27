// background.js — Service Worker de l'extension

// Création du menu contextuel (clic droit)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "shareWhatsApp",
    title: "📱 Partager sur WhatsApp (traduit en français)",
    contexts: ["page", "selection", "link"]
  });
});

// Gestion du clic sur le menu contextuel
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "shareWhatsApp") {
    const pageUrl = info.linkUrl || tab.url;
    const selectedText = info.selectionText || "";

    if (selectedText) {
      // Texte sélectionné → traduire et partager
      const translated = await translateText(selectedText, "fr");
      openWhatsApp(translated);
    } else {
      // Pas de sélection → récupérer le titre de la page et le traduire
      chrome.scripting.executeScript(
        { target: { tabId: tab.id }, func: getPageMeta },
        async (results) => {
          const meta = results?.[0]?.result || { title: tab.title, description: "" };
          const textToTranslate = `${meta.title}. ${meta.description}`.trim();
          const translated = await translateText(textToTranslate, "fr");
          openWhatsApp(translated);
        }
      );
    }
  }
});

// Écoute des messages depuis le popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "sharePage") {
    handleShare(request).then(sendResponse);
    return true; // réponse asynchrone
  }
});

async function handleShare({ url, title, description, selectedText, targetLang }) {
  try {
    const textToTranslate = selectedText
      ? selectedText
      : `${title}. ${description}`.trim();

    const translated = await translateText(textToTranslate, targetLang || "fr");
    openWhatsApp(translated);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Traduction via l'API Google Translate (gratuite, sans clé)
async function translateText(text, targetLang) {
  if (!text || text.trim() === "") return text;

  // 1. Extraire les URLs et les remplacer par des marqueurs __URL_0__, __URL_1__...
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = [];
  const textWithPlaceholders = text.replace(urlRegex, (match) => {
    const index = urls.length;
    urls.push(match);
    return `__URL_${index}__`;
  });

  // 2. Traduire le texte sans les URLs
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

  // 3. Remettre les URLs originales a la place des marqueurs
  let result = translatedChunks.join(" ");
  urls.forEach((originalUrl, index) => {
    result = result.replace(new RegExp(`__URL_${index}__`, "g"), originalUrl);
  });

  return result;
}

// Découpe le texte en morceaux
function splitText(text, maxLength) {
  const chunks = [];
  let current = "";
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

// Ouvre WhatsApp — app desktop ou web selon le réglage sauvegardé
async function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const { waMode } = await chrome.storage.local.get({ waMode: "app" });

  if (waMode === "app") {
    // Tente d'ouvrir l'app WhatsApp Desktop via le protocole whatsapp://
    // Fonctionne sur Windows et Mac si WhatsApp Desktop est installé
    chrome.tabs.create({ url: `whatsapp://send?text=${encoded}` });
  } else {
    chrome.tabs.create({ url: `https://web.whatsapp.com/send?text=${encoded}` });
  }
}

// Fonction injectée dans la page pour récupérer le titre et la description
function getPageMeta() {
  const title = document.title || "";
  const descMeta = document.querySelector('meta[name="description"]') ||
                   document.querySelector('meta[property="og:description"]');
  const description = descMeta ? descMeta.getAttribute("content") : "";
  return { title, description };
}
