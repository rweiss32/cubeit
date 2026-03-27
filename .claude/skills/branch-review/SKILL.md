---
name: branch-review
description: Review the current branch against master — checks version bump, changelog, categories sync, and summarizes changes
allowed-tools: Read, Grep, Bash
---

# Branch Review

Review the current branch against master and produce a structured report.

## Current state
- Branch: !`git branch --show-current`
- Commits ahead of master: !`git log origin/master..HEAD --oneline`
- Changed files: !`git diff origin/master..HEAD --name-only`

## Checks to perform

Run each check and report ✅ / ❌ / ⚠️ clearly.

### 1. Version bump
- Read `const VERSION` from the local `index.html`
- Read `const VERSION` from `git show origin/master:index.html`
- ✅ if local version is higher than master
- ❌ if they are equal (forgot to bump)

### 2. Changelog updated
- Check if `CHANGELOG.md` changed between master and HEAD (`git diff origin/master HEAD -- CHANGELOG.md`)
- ✅ if it has a new entry
- ❌ if it was not updated

### 3. sw.js cache version in sync
- Confirm `cubeit-vX.Y.Z` in `sw.js` matches `VERSION` in `index.html`
- ✅ match / ❌ mismatch

### 4. categories.js in sync with categories.txt
- Check if `data/categories.txt` changed (`git diff origin/master HEAD -- data/categories.txt`)
- If yes: check if `data/categories.js` also changed
- ✅ both changed or neither changed
- ❌ txt changed but js was not regenerated

### 5. Summary of changes
- List the commits on this branch
- Briefly describe what was changed (files, features, fixes)
- Flag anything that looks risky or incomplete

## Output format

```
## Review: <branch> vs master

| Check | Status | Detail |
|-------|--------|--------|
| Version bump     | ✅/❌ | X.Y.Z → A.B.C |
| Changelog        | ✅/❌ | ... |
| sw.js in sync    | ✅/❌ | ... |
| categories in sync | ✅/❌ | ... |

### Changes summary
...

### Verdict
READY TO MERGE / NEEDS ATTENTION
```
