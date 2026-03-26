# Changelog

All notable changes to **קוביאות (Kubiyot)** will be documented here.

Format: `[version] YYYY-MM-DD — description`

---

## [0.12.0] 2026-03-26 — Expanded word lists

- ~50-89 words per category (filtered to max 8 letters, no phrases)
- Compact format: 8 words per line in categories.js

## [0.11.0] 2026-03-26 — Max 2 of any letter in player's hand

- When dealing 8 tiles, player cannot receive more than 2 of the same letter
- Jokers (★) also capped at 2 per hand
- CPU draw is unchanged

## [0.10.1] 2026-03-25 — Fix Wiktionary lookup for words with final letters

- norm() was stripping final forms before API call (מתן looked up as מתנ)
- Wiktionary now receives the correctly spelled word with final letter forms

## [0.10.0] 2026-03-25 — Correct final Hebrew letter forms

- Submitted word automatically gets final letter form (מ→ם, נ→ן, פ→ף, כ→ך, צ→ץ)
- Wiktionary lookup now uses the correctly spelled word
- Final forms shown in result screen and error messages

## [0.9.0] 2026-03-25 — Sound effects

- Click sound on tile selection and next-round button
- Confirmation sound on word submission
- Happy jingle on game start
- Fanfare on win, descending tone on lose
- All synthesized via Web Audio API (no external files)

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
