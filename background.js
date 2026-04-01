// background.js
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install") {
    chrome.storage.sync.set({
      enabled: true,
      patterns: null,      // null = use DEFAULT_PATTERNS from injectionPatterns.js
      catchCount: {}       // { "Mon Jan 01 2025": 3, ... }
    });
    console.log("[PIB] Prompt Injection Blocker installed.");
  }
});
