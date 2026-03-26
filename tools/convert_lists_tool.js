#!/usr/bin/env node
/**
 * convert_lists_tool.js — convert between words.txt and categories.js
 *
 * Usage:
 *   node tools/convert_lists_tool.js txt2js   — words.txt  → categories.js
 *   node tools/convert_lists_tool.js js2txt   — categories.js → words.txt
 *
 * words.txt format:
 *   # Category name | hint text (hint is optional)
 *   word1, word2, word3, word4, word5, word6, word7, word8
 *   word9, word10, ...
 *   (blank line separates categories — multiple words per line, comma-separated)
 *
 * Validation (applied in txt2js):
 *   - Only Hebrew letters (א-ת, including final forms)
 *   - Max 8 letters per word
 *   - No duplicates within a category
 *   - No spaces, punctuation or foreign characters
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const WORDS_TXT    = path.join(ROOT, 'words.txt');
const CATEGORIES_JS = path.join(ROOT, 'categories.js');

const HEBREW_RE  = /^[\u05D0-\u05EA]+$/;  // alef–tav only (includes final forms)
const FINAL_MAP  = { '\u05DD':'\u05DE','\u05DF':'\u05E0','\u05E3':'\u05E4','\u05DA':'\u05DB','\u05E5':'\u05E6' };
const SUFFIX_MAP = { '\u05DE':'\u05DD','\u05E0':'\u05DF','\u05E4':'\u05E3','\u05DB':'\u05DA','\u05E6':'\u05E5' };

function norm(w)      { return [...(w||'')].map(c => FINAL_MAP[c] ?? c).join(''); }
function finalForm(w) { if (!w) return w; const l = w[w.length-1]; return SUFFIX_MAP[l] ? w.slice(0,-1)+SUFFIX_MAP[l] : w; }

// ─── helpers ───────────────────────────────────────────────────────────────

function validateWord(word, category, lineNum) {
  const errors = [];
  // validate against the normalised form (no final letters) so ארץ and ארצ both pass
  if (!HEBREW_RE.test(norm(word)))
    errors.push(`line ${lineNum}: "${word}" in [${category}] — non-Hebrew characters`);
  if ([...norm(word)].length > 8)
    errors.push(`line ${lineNum}: "${word}" in [${category}] — ${[...norm(word)].length} letters (max 8)`);
  return errors;
}

// ─── js2txt ────────────────────────────────────────────────────────────────

function js2txt() {
  const raw = fs.readFileSync(CATEGORIES_JS, 'utf8');

  // Evaluate the file to get window.CATEGORIES_DATA
  const sandbox = { window: {} };
  const code = raw.replace(/^window\./, 'sandbox.window.');
  try {
    new Function('sandbox', code)(sandbox); // eslint-disable-line no-new-func
  } catch (e) {
    console.error('Failed to parse categories.js:', e.message);
    process.exit(1);
  }

  const data = sandbox.window.CATEGORIES_DATA;
  if (!Array.isArray(data)) {
    console.error('categories.js does not export CATEGORIES_DATA array');
    process.exit(1);
  }

  const lines = [
    '## קוביאות — רשימת מילים לפי קטגוריות',
    '## פורמט: שורת כותרת מתחילה ב-#  ואחריה שם קטגוריה | רמז (רמז הוא אופציונלי)',
    '## מילים מופרדות בפסיקים, מספר מילים בכל שורה. שורה ריקה מפרידה בין קטגוריות.',
    '',
  ];

  for (const cat of data) {
    const header = cat.description
      ? `# ${cat.category} | ${cat.description}`
      : `# ${cat.category}`;
    lines.push(header);
    const words = (cat.words || []).map(finalForm);
    for (let i = 0; i < words.length; i += 8) {
      lines.push(words.slice(i, i + 8).join(','));
    }
    lines.push('');
  }

  fs.writeFileSync(WORDS_TXT, lines.join('\n'), 'utf8');
  console.log(`✓ Wrote ${data.length} categories to words.txt`);
}

// ─── txt2js ────────────────────────────────────────────────────────────────

function txt2js() {
  const raw = fs.readFileSync(WORDS_TXT, 'utf8');
  const lines = raw.split(/\r?\n/);

  const categories = [];
  let current = null;
  const allErrors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    if (!line || line.startsWith('##')) continue;

    if (line.startsWith('#')) {
      // Header line — start new category
      const body = line.slice(1).trim();
      const [categoryRaw, ...hintParts] = body.split('|');
      const category = categoryRaw.trim();
      const description = hintParts.join('|').trim();
      if (!category) {
        allErrors.push(`line ${lineNum}: empty category name`);
        continue;
      }
      current = { category, description, words: [], seen: new Set() };
      categories.push(current);
      continue;
    }

    if (!current) {
      allErrors.push(`line ${lineNum}: word "${line}" appears before any category header`);
      continue;
    }

    // Word line — comma-separated (spaces around commas are ignored)
    const words = line.split(',').map(w => w.trim()).filter(Boolean);
    for (const raw of words) {
      const word = finalForm(raw);  // normalise to correct final form
      const errors = validateWord(word, current.category, lineNum);
      allErrors.push(...errors);
      if (errors.length > 0) continue;

      const key = norm(word);  // deduplicate ignoring final-letter variants
      if (current.seen.has(key)) {
        allErrors.push(`line ${lineNum}: duplicate word "${word}" in [${current.category}]`);
        continue;
      }
      current.seen.add(key);
      current.words.push(word);
    }
  }

  if (allErrors.length > 0) {
    console.error(`\n✗ Validation failed (${allErrors.length} error${allErrors.length > 1 ? 's' : ''}):\n`);
    allErrors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  // Serialize
  const entries = categories.map(cat => {
    // 8 words per line for readability
    const wordLines = [];
    for (let i = 0; i < cat.words.length; i += 8) {
      wordLines.push(cat.words.slice(i, i + 8).map(w => JSON.stringify(w)).join(','));
    }
    const wordsStr = wordLines.map((l, idx) =>
      (idx === 0 ? '[' : '      ') + l + (idx === wordLines.length - 1 ? ']' : ',')
    ).join('\n');

    return `  {\n    "category": ${JSON.stringify(cat.category)},\n    "description": ${JSON.stringify(cat.description)},\n    "words": ${wordsStr}\n  }`;
  });

  const output = `window.CATEGORIES_DATA =\n[\n${entries.join(',\n')}\n]\n`;
  fs.writeFileSync(CATEGORIES_JS, output, 'utf8');

  const total = categories.reduce((s, c) => s + c.words.length, 0);
  console.log(`✓ Wrote ${categories.length} categories, ${total} words to categories.js`);
}

// ─── main ──────────────────────────────────────────────────────────────────

const cmd = process.argv[2];
if (cmd === 'js2txt') {
  js2txt();
} else if (cmd === 'txt2js') {
  txt2js();
} else {
  console.error('Usage: node tools/convert_lists_tool.js <js2txt|txt2js>');
  process.exit(1);
}
