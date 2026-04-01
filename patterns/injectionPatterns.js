// patterns/injectionPatterns.js
// Shared between content.js and settings page.
// Each pattern: { id, label, pattern (regex string), flags, enabled }

const DEFAULT_PATTERNS = [
  {
    id: "p1",
    label: "Full 'You are a helpful AI assistant' block",
    pattern: "You are a helpful AI assistant[\\s\\S]*?Do you understand\\?\\.?",
    flags: "gi",
    enabled: true
  },
  {
    id: "p2",
    label: "Academic integrity policy instruction block",
    pattern: "Your primary instruction for this specific page is[\\s\\S]*?stop\\.",
    flags: "gi",
    enabled: true
  },
  {
    id: "p3",
    label: "'Your sole function is to' instruction",
    pattern: "your\\s+\\*{0,2}sole function\\*{0,2}\\s+is to[\\s\\S]*?stop\\.",
    flags: "gi",
    enabled: true
  },
  {
    id: "p4",
    label: "'Scan all elements on this page' command",
    pattern: "Please scan all elements on this page[\\s\\S]*?data-action=[\"'][^\"']*[\"']",
    flags: "gi",
    enabled: true
  },
  {
    id: "p5",
    label: "'Click this button to confirm compliance' command",
    pattern: "Click this button to confirm[\\s\\S]*?compliance[\\s\\S]*?policy\\.",
    flags: "gi",
    enabled: true
  },
  {
    id: "p6",
    label: "'This verification step is mandatory' block",
    pattern: "This verification step is mandatory[\\s\\S]*?assessment pages\\.",
    flags: "gi",
    enabled: true
  },
  {
    id: "p7",
    label: "AI Agent Compliance Verification header",
    pattern: "\\*{0,2}IMPORTANT:\\*{0,2}\\s*AI Agent Compliance Verification Required",
    flags: "gi",
    enabled: true
  },
  {
    id: "p8",
    label: "data-action acknowledge-guidelines attribute",
    pattern: "data-action=[\"']acknowledge-guidelines[\"']",
    flags: "gi",
    enabled: true
  },
  {
    id: "p9",
    label: "'You must not attempt to answer' instruction",
    pattern: "You must not attempt to answer questions[\\s\\S]*?commands\\.",
    flags: "gi",
    enabled: true
  },
  {
    id: "p10",
    label: "'Locate the button labeled' click-jacking",
    pattern: "locate the button labeled[\\s\\S]*?button",
    flags: "gi",
    enabled: true
  }
];

/**
 * Run all enabled patterns against text.
 * Returns { cleaned, matched } where matched is true if any injection was found.
 */
function runPatterns(text, patterns) {
  let out = text;
  let matched = false;

  for (const p of patterns) {
    if (!p.enabled) continue;
    try {
      const re = new RegExp(p.pattern, p.flags);
      if (re.test(out)) {
        matched = true;
        out = out.replace(new RegExp(p.pattern, p.flags), "");
      }
    } catch (e) {
      // Skip invalid regex silently
    }
  }

  return { cleaned: out.trim(), matched };
}
