document.addEventListener("DOMContentLoaded", () => {
  const tog       = document.getElementById("tog");
  const chip      = document.getElementById("chip");
  const chipLabel = document.getElementById("chip-label");
  const sToday    = document.getElementById("s-today");
  const sPatterns = document.getElementById("s-patterns");

  chrome.storage.sync.get(["enabled", "patterns", "catchCount"], (res) => {
    const enabled  = res.enabled !== false;
    const patterns = res.patterns || DEFAULT_PATTERNS;
    const today    = new Date().toDateString();
    const caught   = res.catchCount?.[today] || 0;

    tog.checked            = enabled;
    sToday.textContent     = caught;
    sPatterns.textContent  = patterns.filter(p => p.enabled).length;
    setChip(enabled);
  });

  tog.addEventListener("change", () => {
    chrome.storage.sync.set({ enabled: tog.checked });
    setChip(tog.checked);
  });

  document.getElementById("open-settings").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  function setChip(on) {
    chip.className        = on ? "chip" : "chip off";
    chipLabel.textContent = on ? "Active" : "Paused";
  }
});
