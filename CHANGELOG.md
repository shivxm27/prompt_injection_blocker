# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-01-01

### Added
- Initial release
- Content script that intercepts `copy` events on `coursera.org`
- 10 built-in regex patterns covering known Coursera prompt injection variants
- Silent clipboard cleaning — strips injection and writes clean text back automatically
- Amber alert pill shown when an injection is detected and removed
- Toolbar popup with on/off toggle and daily catch counter
- Settings page with full pattern management (add, edit, enable/disable, reset)
- Live preview panel in settings for testing patterns against real text
- Auto dark/light theme via `prefers-color-scheme`
- MIT license
