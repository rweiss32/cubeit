# Changelog

All notable changes to **קוביאות (Kubiyot)** will be documented here.

Format: `[version] YYYY-MM-DD — description`

---

## [0.8.0] 2026-03-25 — Light mode + dark mode support

- White background by default
- Automatically switches to dark theme when OS is in dark mode
- Uses CSS custom properties for all theme-sensitive colors

## [0.7.0] 2026-03-25 — External categories file

- Categories moved to external `categories.js` (easy to edit without touching game code)
- All 35 real game categories with word lists for CPU player
- Logo artifact removed, responsive sizing for mobile (min(60%, 544px))

## [0.6.0] 2026-03-25 — Real logo image

- Replaced CSS tile divs with logo_heb.png (1417×363 RGBA)
- Displayed at 64px height in the header, width auto-scales

## [0.5.0] 2026-03-25 — Purchase CTA

- Start screen: subtle banner linking to cube-it.co.il with a short product pitch
- Game-over screen: prominent CTA after the game ends ("אהבת? קנה את הגרסה המלאה!")
- Both links open in a new tab

## [0.4.0] 2026-03-25 — Joker letter assignment

- When a submitted word contains joker tiles, a modal appears asking the player to pick a letter for each joker
- Word preview in the modal highlights the current joker being assigned
- Multiple jokers handled sequentially (joker 1 of N, then 2 of N...)
- Resolved word is then validated via Wiktionary as usual

## [0.3.0] 2026-03-25 — Hebrew word validation

- Player's submitted word is validated against Hebrew Wiktionary API
- "בודק במילון..." spinner shown during async check
- Submit and Clear buttons disabled while checking
- Invalid words are rejected with a clear error message
- Network errors: word is accepted with a warning (graceful fallback)
- Results cached per session — repeated words skip the API call

## [0.2.0] 2026-03-25 — Logo banner

- Persistent top header on all screens with colored 3D-style cube tiles spelling קוביאות
- Cube colors match the PDF logo (ק=rose, ו=teal, ב=blue, י=purple, א=mint, ו=amber, ת=crimson)
- Each cube has alternating tilt to mimic the tumbling cubes style from the PDF
- Version number displayed in the header (bottom-right of banner)
- Removed old gradient text logo and fixed version badge

## [0.1.0] 2026-03-25 — Initial draft

- Single-player vs computer, Fast Mode only
- 8 Hebrew letter categories with hardcoded word lists
- 5 rounds, 2-minute countdown timer per round
- Tile-click interface to build words (no keyboard input)
- Computer AI picks longest word it can spell from its tiles
- Score tracking and result screen per round
- Game-over summary screen
- Version badge displayed in bottom-left corner
