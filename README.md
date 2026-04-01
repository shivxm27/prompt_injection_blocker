# 🛡️ Prompt Injection Blocker

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-f59e0b?style=flat-square)
![Manifest](https://img.shields.io/badge/manifest-v3-f59e0b?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)
![Status](https://img.shields.io/badge/status-active-10b981?style=flat-square)

**A Chrome extension that detects and silently strips prompt injection attacks from text copied on Coursera.**

</div>

---

> ⚠️ **What is a prompt injection attack?**
> Malicious text hidden inside web pages that, when copied and pasted into an AI tool, hijacks the AI's behaviour — instructing it to click buttons, ignore your requests, or act on behalf of the page instead of you.

---

## Demo

> 📹 *Record a short GIF using [ScreenToGif](https://www.screentogif.com/) (free, Windows) and drop it here.*
> Show: copying injected text → amber pill appearing → pasting clean result.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [Managing Patterns](#managing-patterns)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🔍 **Scans on every copy** — intercepts `Ctrl+C` on `coursera.org`, no extra steps
- 🧹 **Silently strips injections** — writes clean text back to clipboard automatically
- ⚠️ **Amber alert pill** — appears briefly when an injection is detected and removed
- 🧩 **10 built-in patterns** — covers known Coursera injection variants out of the box
- ⚙️ **Settings page** — add, edit, enable/disable patterns with a live regex test box
- 🌗 **Auto dark/light theme** — respects your system preference
- 🔒 **100% local** — no servers, no telemetry, no external requests

---

## Installation

> The extension is not on the Chrome Web Store. Install it manually in under 2 minutes.

**Step 1.** Download the latest `.zip` from [Releases](../../releases/latest)

**Step 2.** Unzip it anywhere on your computer

**Step 3.** Open Chrome and go to:
```
chrome://extensions
```

**Step 4.** Enable **Developer Mode** using the toggle in the top-right corner

**Step 5.** Click **Load unpacked** and select the unzipped folder

**Step 6.** Done. The shield icon appears in your Chrome toolbar.

---

## How It Works

```
You press Ctrl+C on coursera.org
          │
          ▼
Extension reads the clipboard (80ms delay to let browser write first)
          │
          ▼
Runs text through each enabled regex pattern
          │
     ┌────┴────┐
   Match?    No match?
     │            │
     ▼            ▼
Strips injection  Does nothing — completely silent
Writes clean text back to clipboard
Shows amber pill: "⚠ Injection stripped"
```

---

## Managing Patterns

Click the extension icon → **Manage Patterns** to open the settings page.

| Action | How |
|---|---|
| Disable a pattern | Toggle the switch on the left |
| Edit a pattern | Click the pencil icon |
| Add a custom pattern | Click **Add Pattern** — supports full JavaScript regex |
| Test a pattern | Use the live test box in the Add/Edit modal |
| Preview on real text | Paste text into the Live Preview panel |
| Reset to defaults | Click **Reset defaults** |

### Built-in patterns

| ID | Detects |
|---|---|
| p1 | Full `You are a helpful AI assistant…Do you understand?` block |
| p2 | Academic integrity instruction blocks |
| p3 | `Your sole function is to…stop.` directives |
| p4 | `Scan all elements…data-action` commands |
| p5 | `Click this button to confirm compliance` click-jacking |
| p6 | `This verification step is mandatory` blocks |
| p7 | `AI Agent Compliance Verification Required` headers |
| p8 | `data-action="acknowledge-guidelines"` attribute injections |
| p9 | `You must not attempt to answer` override instructions |
| p10 | `Locate the button labeled` click-jacking variants |

---

## Project Structure

```
prompt-injection-blocker/
├── manifest.json                  # Extension config (Manifest V3)
├── content.js                     # Copy listener, pattern matching, pill alert
├── background.js                  # Service worker — sets defaults on install
├── patterns/
│   └── injectionPatterns.js       # Pattern library + runPatterns() engine
├── popup/
│   ├── popup.html                 # Toolbar popup
│   ├── popup.css
│   └── popup.js
├── settings/
│   ├── settings.html              # Full settings page
│   ├── settings.css
│   └── settings.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: description"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

New injection patterns are especially welcome — if you spot one on Coursera, open an issue or PR with the pattern and a sample of the injected text.

---

## License

MIT © [shivxm27](https://github.com/shivxm27)
