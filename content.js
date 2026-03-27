// content.js — Script injecté dans chaque page

// Écoute les messages depuis le popup ou le background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageData") {
    const selectedText = window.getSelection().toString().trim();
    const title = document.title || "";

    const descMeta =
      document.querySelector('meta[name="description"]') ||
      document.querySelector('meta[property="og:description"]') ||
      document.querySelector('meta[name="twitter:description"]');
    const description = descMeta ? descMeta.getAttribute("content") : "";

    // Pour X.com : essayer de récupérer le texte du tweet
    let tweetText = "";
    if (window.location.hostname.includes("x.com") || window.location.hostname.includes("twitter.com")) {
      const tweetEl =
        document.querySelector('[data-testid="tweetText"]') ||
        document.querySelector('article [lang]');
      if (tweetEl) tweetText = tweetEl.innerText.trim();
    }

    sendResponse({
      selectedText,
      title,
      description,
      tweetText,
      url: window.location.href
    });
  }
});
