// content.js — Share & Translate v3.0

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageData") {
    const selectedText = window.getSelection().toString().trim();
    const title = document.title || "";

    const descMeta =
      document.querySelector('meta[property="og:description"]') ||
      document.querySelector('meta[name="description"]') ||
      document.querySelector('meta[name="twitter:description"]');
    const description = descMeta ? descMeta.getAttribute("content") : "";

    // X.com / Twitter : extraire le texte du tweet affiché
    let tweetText = "";
    const host = window.location.hostname;
    if (host.includes("x.com") || host.includes("twitter.com")) {
      const el =
        document.querySelector('[data-testid="tweetText"]') ||
        document.querySelector('article [lang]');
      if (el) tweetText = el.innerText.trim();
    }

    // LinkedIn : extraire le texte d'un post si ouvert
    let linkedinPostText = "";
    if (host.includes("linkedin.com")) {
      const el =
        document.querySelector('.feed-shared-update-v2__description') ||
        document.querySelector('.attributed-text-segment-list__content');
      if (el) linkedinPostText = el.innerText.trim();
    }

    sendResponse({
      selectedText,
      title,
      description,
      tweetText,
      linkedinPostText,
      url: window.location.href
    });
  }
});
