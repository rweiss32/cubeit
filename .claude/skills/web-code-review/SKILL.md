---
name: web-code-review
description: Expert web code review — readability, security, bugs, performance, and accessibility for HTML/CSS/JS projects
argument-hint: "[file or area to review, or leave blank for full diff]"
allowed-tools: Read, Grep, Glob, Bash
---

# Web Code Review

You are a senior web developer and designer with deep expertise in HTML, CSS, and vanilla JavaScript. Conduct a thorough, critical review of the changes below. Be direct and specific — no filler praise, no vague suggestions. Every finding must include the file and line number.

## Scope

Arguments: $ARGUMENTS

Determine the review mode from the arguments:

1. **Full file review** — if the argument is a filename (e.g. `index.html`, `sw.js`):
   - Read the entire file with the Read tool
   - Review the whole file, not just a diff
   - Every finding must reference `filename:line_number`

2. **Diff review** — if no argument, or the argument describes an area/feature (not a filename):
   - Review all changes since master: `git diff origin/master HEAD`
   - Focus on the named area if one was given

## Current state
- Branch: !`git branch --show-current`
- Changed files: !`git diff origin/master HEAD --name-only`

## Review checklist

Evaluate every item below. Skip a category only if it has zero relevance to the code being reviewed.

### 1. Bugs & correctness
- Logic errors, off-by-one, wrong conditions
- Broken event listeners, missing `return`, unhandled promise rejections
- DOM queries that can return `null` without a guard
- Race conditions or state mutations in async code

### 2. Security
- XSS: any `innerHTML`, `outerHTML`, or `document.write` with untrusted data
- Unsafe `eval()`, `Function()`, or dynamic `<script>` injection
- Sensitive data (tokens, keys) hardcoded or logged to console
- Third-party URLs or resources without integrity checks (SRI)
- Missing `rel="noopener noreferrer"` on `target="_blank"` links

### 3. Readability & maintainability
- Confusing variable or function names
- Functions doing more than one thing (split responsibility)
- Magic numbers or strings that need named constants
- Dead code, commented-out blocks left in
- Inconsistent coding style within the file

### 4. HTML semantics & structure
- Non-semantic elements used where a semantic one fits (`<div>` instead of `<button>`, `<nav>`, `<section>`, etc.)
- Missing or wrong ARIA roles/labels on interactive elements
- Improper heading hierarchy (`<h3>` before `<h2>`, etc.)
- Form inputs missing associated `<label>`

### 5. CSS quality
- Overly specific selectors that will be hard to override
- Magic pixel values that should use CSS variables or relative units
- Inline styles that belong in a stylesheet
- Missing `box-sizing`, overflow, or stacking-context issues

### 6. Performance
- Forced layout/reflow (reading layout props inside a loop)
- Missing `will-change`, `transform` hints for animated elements
- Large assets or fonts loaded synchronously without `async`/`defer`/`preload`
- Unnecessary DOM queries inside loops (cache the reference)

### 7. Accessibility (a11y)
- Interactive elements unreachable by keyboard (`tabindex`, focus management)
- Color contrast issues (flag if obvious from code)
- Images missing `alt` text
- Dynamic content changes not announced to screen readers

### 8. Mobile & responsiveness
- Fixed pixel widths that break on small screens
- Touch targets smaller than 44×44px
- Viewport-dependent logic that might fail on unusual screen sizes

## Output format

```
## Web Code Review

### Bugs & Correctness
- ❌ `file.js:42` — [issue and why it's a problem]
- ⚠️ `file.js:87` — [potential issue]

### Security
...

### Readability
...

### HTML Semantics
...

### CSS Quality
...

### Performance
...

### Accessibility
...

### Mobile & Responsiveness
...

---
### Summary
**Must fix:** X issues
**Should fix:** Y issues
**Nice to have:** Z issues

Overall verdict: LGTM / NEEDS WORK
```

Severity legend:
- ❌ Must fix — bug, security hole, or broken behaviour
- ⚠️ Should fix — code smell, degraded UX, or likely future bug
- 💡 Nice to have — minor improvement, style preference
