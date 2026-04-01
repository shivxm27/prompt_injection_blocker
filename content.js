// content.js — injected on coursera.org only
let isEnabled   = true;
let activePatterns = DEFAULT_PATTERNS;
let pillEl      = null;

// ── Load settings ─────────────────────────────────────────
function loadSettings() {
  chrome.storage.sync.get(["enabled", "patterns"], (res) => {
    isEnabled      = res.enabled !== false;
    activePatterns = res.patterns || DEFAULT_PATTERNS;
  });
}
loadSettings();

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled)  isEnabled      = changes.enabled.newValue;
  if (changes.patterns) activePatterns = changes.patterns.newValue;
});

// ── Copy listener ─────────────────────────────────────────
document.addEventListener("copy", async () => {
  if (!isEnabled) return;

  // Small delay to let the browser write to clipboard first
  await new Promise(r => setTimeout(r, 80));

  let text = "";
  try {
    text = await navigator.clipboard.readText();
  } catch {
    return; // Clipboard read not permitted — bail silently
  }

  if (!text.trim()) return;

  const { cleaned, matched } = runPatterns(text, activePatterns);

  if (!matched) return;

  // Write clean text back
  try {
    await navigator.clipboard.writeText(cleaned);
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    Object.assign(ta.style, { position: "fixed", opacity: "0" });
    ta.value = cleaned;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  // Increment today's catch count
  chrome.storage.sync.get(["catchCount"], (res) => {
    const today  = new Date().toDateString();
    const counts = res.catchCount || {};
    counts[today] = (counts[today] || 0) + 1;
    chrome.storage.sync.set({ catchCount: counts });
  });

  showPill();
});

// ── Alert pill ────────────────────────────────────────────
function showPill() {
  removePill();
  injectStyles();

  pillEl = document.createElement("div");
  pillEl.id = "pib-pill";
  pillEl.innerHTML = `
    <div class="pib-inner">
      <span class="pib-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </span>
      <div class="pib-text">
        <span class="pib-title">Injection stripped</span>
        <span class="pib-sub">Prompt injection detected and removed from clipboard</span>
      </div>
      <button class="pib-close" id="pib-x" aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`;

  // Position: fixed bottom-right
  pillEl.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647;
    pointer-events: none;
  `;

  document.body.appendChild(pillEl);
  document.getElementById("pib-x").addEventListener("click", removePill);

  // Auto-dismiss after 4s
  setTimeout(removePill, 4000);
}

function removePill() {
  pillEl?.remove();
  pillEl = null;
}

// ── Styles ────────────────────────────────────────────────
function injectStyles() {
  if (document.getElementById("pib-styles")) return;
  const s = document.createElement("style");
  s.id = "pib-styles";
  s.textContent = `
    #pib-pill { pointer-events: none; font-family: system-ui, -apple-system, sans-serif; }

    .pib-inner {
      pointer-events: all;
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 14px 14px 16px;
      border-radius: 14px;
      max-width: 320px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1);
      animation: pib-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;

      /* Light mode */
      background: #ffffff;
      border: 1px solid rgba(245,158,11,0.3);
    }

    @media (prefers-color-scheme: dark) {
      .pib-inner {
        background: #1c1c28;
        border: 1px solid rgba(245,158,11,0.35);
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      }
    }

    @keyframes pib-in {
      from { opacity: 0; transform: translateY(12px) scale(0.94); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    .pib-icon {
      flex-shrink: 0;
      width: 36px; height: 36px;
      background: rgba(245,158,11,0.12);
      border-radius: 8px;
      display: grid; place-items: center;
    }
    .pib-icon svg { width: 18px; height: 18px; color: #f59e0b; }

    .pib-text { flex: 1; display: flex; flex-direction: column; gap: 2px; padding-top: 1px; }
    .pib-title {
      font-size: 13px; font-weight: 700; letter-spacing: -0.01em;
      color: #111827;
    }
    @media (prefers-color-scheme: dark) {
      .pib-title { color: #f1f5f9; }
    }

    .pib-sub {
      font-size: 11.5px; color: #6b7280; line-height: 1.4;
    }
    @media (prefers-color-scheme: dark) {
      .pib-sub { color: #94a3b8; }
    }

    .pib-close {
      flex-shrink: 0; background: none; border: none; cursor: pointer;
      padding: 2px; border-radius: 6px; color: #9ca3af;
      display: grid; place-items: center; transition: all 0.15s;
      margin-top: -2px;
    }
    .pib-close svg { width: 14px; height: 14px; }
    .pib-close:hover { background: rgba(0,0,0,0.06); color: #374151; }
    @media (prefers-color-scheme: dark) {
      .pib-close:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
    }
  `;
  document.head.appendChild(s);
}
