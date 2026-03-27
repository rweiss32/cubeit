# Changelog

All notable changes to **קוביאות (Kubiyot)** will be documented here.

Format: `[version] YYYY-MM-DD — description`

---
## [0.23.4] 2026-03-28 — fix: joker modal closes immediately on multi-joker words

- Fixed bug where picking the first joker letter immediately cancelled the second joker modal
- Root cause: click event bubbled to a stale onOutside listener after the letter grid was rebuilt, with a detached target that tricked closest() into returning null

## [0.23.3] 2026-03-28 — fix: show assigned letters in multi-joker preview

- Fixed bug where already-assigned jokers always showed '?' in the preview when assigning multiple jokers
- Each resolved joker now correctly displays its chosen letter while the next joker is being assigned

## [0.23.2] 2026-03-28 — chore: add /web-code-review skill

- Added `/web-code-review` Claude Code skill for expert HTML/CSS/JS review
- Covers bugs, security, readability, accessibility, performance, and mobile

## [0.23.1] 2026-03-28 — fix: center word in Wikipedia panel

- Centered the word title in the Wikipedia bottom sheet header

## [0.23.0] 2026-03-27 — Bug fix: score updates after CPU reveal

- Fixed bug where the score was updated while the CPU was still "thinking"
- Score now stays at its pre-round value during the thinking animation
- Score updates only after the CPU word is fully revealed, together with the result banner

## [0.22.1] 2026-03-27 — words-editor improvements

- Header shows live total category and word counts
- Input box accepts comma-separated words (e.g. בית,כלב,ספר) — all added in one go
- Error message stays visible until user starts typing again
- File picker remembers last used folder within the session
- Drag & drop a .txt file onto the page to open it

## [0.22.0] 2026-03-27 — Expanded word lists

- Added many new words across categories in data/categories.txt

## [0.21.2] 2026-03-27 — words-editor tool improvements

- Renamed tool to cube-it-words-editor.html
- Words sorted alphabetically in the saved file (not just in display)
- Remove word: ✕ button on each word chip
- Edit word: click word label to edit inline (Enter saves, Escape cancels)
- Delete category: trash icon with confirmation dialog
- Edit category name: pencil icon to rename inline
- Drag & drop a .txt file onto the page to open it (no button needed)
- File picker remembers last used folder across opens in the same session
- Fixed input field showing "undefined" when selecting a category

## [0.21.1] 2026-03-27 — Prevent text selection on tiles

- Added user-select: none to tiles to prevent letters from being highlighted when dragging

## [0.21.0] 2026-03-27 — Drag tile to word-builder area

- Long-press a tile and drag it to the word-builder area to add it to the word
- Word area highlights with a dashed green border when hovered during drag
- Tile shifts in the tray reset when hovering over the word area
- Complements short-press — both gestures still work

## [0.20.0] 2026-03-27 — Drag to reorder tiles

- Long-press a tile (400ms) to drag it to a new position in the tray
- Tile is inserted at the drop position; tiles in between shift to fill the gap
- Short tap still selects the letter for the word as before
- Works on touch (mobile) and mouse (desktop)
- Haptic feedback on drag start

## [0.19.0] 2026-03-27 — Full PWA support (offline + install prompt)

- Added service worker (sw.js) with cache-first strategy for all static assets
- App works fully offline after first load (except Wiktionary/Wikipedia lookups)
- Browser will offer "Add to home screen" install prompt
- Cache versioned to match app version — auto-invalidates on deploy

## [0.18.1] 2026-03-27 — merge command for convert_lists_tool

- New `merge <file.txt>` command to merge a categories.txt-format file into data/categories.txt
- New categories are appended; existing categories get new words added, duplicates skipped
- `-v` flag prints per-category detail: added words, skipped duplicates, no-change categories
- Intra-file duplicates in the input are silently ignored

## [0.18.0] 2026-03-26 — Settings panel

- Gear icon in header opens a settings bottom sheet
- Toggle to enable/disable sounds
- Toggle to enable/disable Wikipedia popup
- Settings persisted in localStorage

## [0.17.6] 2026-03-26 — Rename words.txt to categories.txt

- Renamed data/words.txt → data/categories.txt for consistency with categories.js
- Added auto-generated header to categories.js

## [0.17.5] 2026-03-26 — Joker modal cancel (X button + click outside)

- Added ✕ button to close joker modal without picking a letter
- Clicking outside the joker box also cancels it
- Cancelling silently aborts the word submission

## [0.17.4] 2026-03-26 — Wikipedia bottom sheet after successful word

- Show Hebrew Wikipedia summary as a slide-up bottom sheet on the result screen
- Dismisses on any tap; auto-closes when advancing to next round
- No-op when Wikipedia has no entry for the word

## [0.17.3] 2026-03-26 — Wikipedia popup after successful word

- After each round, if the player submitted a word, fetch its Hebrew Wikipedia summary
- Display it in a dismissible popup after the CPU reveal animation
- If no Wikipedia entry exists, nothing is shown

## [0.17.2] 2026-03-26 — Reorganize project files

- Moved logo files to assets/
- Moved words.txt and categories.js to data/
- Updated all references in index.html and tools/convert_lists_tool.js

## [0.17.1] 2026-03-26 — Use official cube-it.co.il icon

- Replaced generated icons with the official icon from cube-it.co.il

## [0.17.0] 2026-03-26 — PWA manifest + home screen icon

- manifest.json with app name, RTL/Hebrew locale, theme color (#2a2a50)
- icons/icon-192.png and icons/icon-512.png (white logo on indigo background)
- apple-touch-icon for iOS support
- theme-color meta tag colors the browser chrome on Android

## [0.16.0] 2026-03-26 — words.txt + convert_lists_tool

- words.txt: plain-text source of truth for all category word lists (comma-separated, no spaces, correct final Hebrew letters)
- tools/convert_lists_tool.js: bidirectional converter (js2txt / txt2js) with validation
- .githooks/pre-push: auto-validates and rebuilds categories.js before every push
- Fixed 73 pre-existing data issues (duplicates, non-Hebrew chars, wrong final letter forms)

## [0.15.0] 2026-03-26 — Fixed 5 sec timout

## [0.15.0] 2026-03-26 — Word suggestions when player misses a round

- If player submits no word, result screen shows 1 short + 1 longer word they could have played from their tiles
- Only words from the active category are suggested

## [0.14.1] 2026-03-26 - Expand word lists
- Added more words to the category lists

## [0.14.0] 2026-03-26 — Human-like CPU opponent

- CPU gets a random Hebrew name (דני, מיכל, שירה, ...) — same name for all 5 rounds, changes per game
- Female names (מיכל, רונית, שירה, נועה, תמר) use correct gendered forms: "חושבת", "ניצחה"
- Animated thinking dots (3 bouncing dots) shown while CPU decides its word
- CPU "thinks" before revealing its word — delay scales with word length (1.5–4s)
- CPU word is revealed letter by letter (typewriter effect)
- CPU occasionally picks a suboptimal word (25% chance) — not always the longest
- Flavor reaction shown after each round ("כל הכבוד! 👏", "קל מדי 😏", etc.)
- CPU label changed to "המילה של X" format
- CPU name replaces "מחשב" everywhere: score bar, banners, game-over screen

## [0.13.0] 2026-03-26 — Fix warning message shown on result screen

- Category/Wiktionary warnings now displayed on the result screen (not the game screen where they were immediately hidden)
- Warning shown in amber below the score bar

## [0.12.1] 2026-03-26 — Fix header overlapping content + category validation

- Body padding-top now measured dynamically from actual header height (fixes overlap on all screen sizes)
- Submitted word checked against category word list first (no API call needed)
- If not in list, falls back to Wiktionary; if valid Hebrew but not in list, shows warning to user

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
