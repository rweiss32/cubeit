#!/usr/bin/env node
/**
 * convert_lists_tool.js — convert between categories.txt and categories.js
 *
 * Usage:
 *   node tools/convert_lists_tool.js txt2js              — data/categories.txt → data/categories.js
 *   node tools/convert_lists_tool.js js2txt              — data/categories.js  → data/categories.txt
 *   node tools/convert_lists_tool.js merge <file.txt>    — merge file.txt into data/categories.txt
 *   node tools/convert_lists_tool.js merge <file.txt> -v — same, with verbose output
 *
 * merge behaviour:
 *   - New category (name not in categories.txt)  → appended at the end
 *   - Existing category (same name)              → words added, duplicates silently skipped
 *   - Category in categories.txt but not in file → untouched
 *   - Validation runs before any file is written; aborts on error
 *   - The input file is never modified
 *   -v prints per-category detail: added words, skipped duplicates, no-change categories
 *
 * categories.txt format:
 *   # Category name | hint text (hint is optional)
 *   word1, word2, word3, word4, word5, word6, word7, word8
 *   word9, word10, ...
 *   (blank line separates categories — multiple words per line, comma-separated)
 *
 * Validation (applied in txt2js and merge):
 *   - Only Hebrew letters (א-ת, including final forms)
 *   - Max 8 letters per word
 *   - No duplicates within a category
 *   - No spaces, punctuation or foreign characters
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT         = path.join(__dirname, '..');
const WORDS_TXT    = path.join(ROOT, 'data', 'categories.txt');
const CATEGORIES_JS = path.join(ROOT, 'data', 'categories.js');

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
  const code = raw.replace(/\bwindow\./g, 'sandbox.window.');
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

  const cats = data.map(c => ({
    category: c.category, description: c.description || '',
    words: (c.words || []), seen: new Set((c.words || []).map(norm)),
  }));
  fs.writeFileSync(WORDS_TXT, serializeTxt(cats), 'utf8');
  console.log(`✓ Wrote ${data.length} categories to categories.txt`);
}

// ─── parseTxt ──────────────────────────────────────────────────────────────
// Parse a categories.txt file. Returns { categories, errors }.
// categories: [{ category, description, words, seen }]

function parseTxt(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  const categories = [];
  let current = null;
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    if (!line || line.startsWith('##')) continue;

    if (line.startsWith('#')) {
      const body = line.slice(1).trim();
      const [categoryRaw, ...hintParts] = body.split('|');
      const category = categoryRaw.trim();
      const description = hintParts.join('|').trim();
      if (!category) {
        errors.push(`line ${lineNum}: empty category name`);
        continue;
      }
      current = { category, description, words: [], seen: new Set() };
      categories.push(current);
      continue;
    }

    if (!current) {
      errors.push(`line ${lineNum}: word "${line}" appears before any category header`);
      continue;
    }

    const words = line.split(',').map(w => w.trim()).filter(Boolean);
    for (const raw of words) {
      const word = finalForm(raw);
      const wordErrors = validateWord(word, current.category, lineNum);
      errors.push(...wordErrors);
      if (wordErrors.length > 0) continue;

      const key = norm(word);
      if (current.seen.has(key)) {
        errors.push(`line ${lineNum}: duplicate word "${word}" in [${current.category}]`);
        continue;
      }
      current.seen.add(key);
      current.words.push(word);
    }
  }

  return { categories, errors };
}

// ─── serializeTxt ──────────────────────────────────────────────────────────
// Serialize categories array back to categories.txt format.

function serializeTxt(categories) {
  const lines = [
    '## קוביאות — רשימת מילים לפי קטגוריות',
    '## פורמט: שורת כותרת מתחילה ב-#  ואחריה שם קטגוריה | רמז (רמז הוא אופציונלי)',
    '## מילים מופרדות בפסיקים, מספר מילים בכל שורה. שורה ריקה מפרידה בין קטגוריות.',
    '',
  ];
  for (const cat of categories) {
    lines.push(cat.description ? `# ${cat.category} | ${cat.description}` : `# ${cat.category}`);
    const words = cat.words.map(finalForm);
    for (let i = 0; i < words.length; i += 8) lines.push(words.slice(i, i + 8).join(','));
    lines.push('');
  }
  return lines.join('\n');
}

// ─── txt2js ────────────────────────────────────────────────────────────────

function txt2js() {
  const { categories, errors } = parseTxt(WORDS_TXT);

  if (errors.length > 0) {
    console.error(`\n✗ Validation failed (${errors.length} error${errors.length > 1 ? 's' : ''}):\n`);
    errors.forEach(e => console.error('  ' + e));
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

  const output = `// AUTO-GENERATED — do not edit manually.\n// Edit data/categories.txt and run: node tools/convert_lists_tool.js txt2js\n\nwindow.CATEGORIES_DATA =\n[\n${entries.join(',\n')}\n]\n`;
  fs.writeFileSync(CATEGORIES_JS, output, 'utf8');

  const total = categories.reduce((s, c) => s + c.words.length, 0);
  console.log(`✓ Wrote ${categories.length} categories, ${total} words to categories.js`);
}

// ─── merge ─────────────────────────────────────────────────────────────────

function merge(inputPath, verbose) {
  if (!fs.existsSync(inputPath)) {
    console.error(`✗ File not found: ${inputPath}`);
    process.exit(1);
  }

  // Parse both files
  const base  = parseTxt(WORDS_TXT);
  const input = parseTxt(inputPath);

  if (base.errors.length > 0) {
    console.error(`✗ Validation errors in categories.txt:`);
    base.errors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }
  if (input.errors.length > 0) {
    console.error(`✗ Validation errors in ${inputPath}:`);
    input.errors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }
  if (input.categories.length === 0) {
    console.warn('⚠️  No categories found in input file — nothing to merge.');
    process.exit(0);
  }

  // Build lookup map of existing categories by name
  const baseMap = new Map(base.categories.map(c => [c.category, c]));

  let newCats = 0, mergedCats = 0, addedWords = 0, skippedWords = 0;

  for (const incoming of input.categories) {
    const existing = baseMap.get(incoming.category);

    if (!existing) {
      // New category — append
      base.categories.push(incoming);
      baseMap.set(incoming.category, incoming);
      newCats++;
      if (verbose) {
        console.log(`+ [${incoming.category}] — new category (${incoming.words.length} words)`);
      }
    } else {
      // Existing category — merge words
      const added = [], skipped = [];
      for (const word of incoming.words) {
        const key = norm(word);
        if (existing.seen.has(key)) {
          skipped.push(finalForm(word));
        } else {
          existing.seen.add(key);
          existing.words.push(word);
          added.push(finalForm(word));
        }
      }
      addedWords   += added.length;
      skippedWords += skipped.length;
      if (added.length > 0 || skipped.length > 0) mergedCats++;
      if (verbose) {
        if (added.length === 0 && skipped.length === 0) {
          console.log(`= [${incoming.category}] — no changes`);
        } else {
          console.log(`~ [${incoming.category}] — merged`);
          if (added.length)   console.log(`    added:   ${added.join(', ')}`);
          if (skipped.length) console.log(`    skipped: ${skipped.join(', ')} (duplicates)`);
        }
      }
    }
  }

  fs.writeFileSync(WORDS_TXT, serializeTxt(base.categories), 'utf8');

  const parts = [];
  if (newCats)      parts.push(`${newCats} new categor${newCats === 1 ? 'y' : 'ies'}`);
  if (mergedCats)   parts.push(`${mergedCats} merged (+${addedWords} words)`);
  if (skippedWords) parts.push(`${skippedWords} duplicate${skippedWords === 1 ? '' : 's'} skipped`);
  if (parts.length === 0) {
    console.log('✓ Nothing to merge — categories.txt is unchanged.');
  } else {
    console.log(`✓ ${parts.join(', ')}`);
    console.log(`✓ Wrote updated categories.txt`);
  }
}

// ─── main ──────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const cmd     = args[0];
const verbose = args.includes('-v');

if (cmd === 'js2txt') {
  js2txt();
} else if (cmd === 'txt2js') {
  txt2js();
} else if (cmd === 'merge') {
  const inputFile = args.find(a => a !== 'merge' && a !== '-v');
  if (!inputFile) {
    console.error('Usage: node tools/convert_lists_tool.js merge <file.txt> [-v]');
    process.exit(1);
  }
  merge(path.resolve(inputFile), verbose);
} else {
  console.error('Usage: node tools/convert_lists_tool.js <txt2js|js2txt|merge <file.txt> [-v]>');
  process.exit(1);
}
