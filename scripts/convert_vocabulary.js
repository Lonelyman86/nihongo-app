const fs = require('fs');
const path = require('path');

// Read the source file
// context: the file exports const WORDLIST = [...]
// We'll read it as text and extract the array part manually or eval it if clean.
// Since it has ES6 export, we can't require it directly in CommonJS without Babel or type="module".
// Simplest parsing: string manipulation.

const sourcePath = path.join(__dirname, '../data/n5_source.js');
const destPath = path.join(__dirname, '../data/dictionary.ts');

const content = fs.readFileSync(sourcePath, 'utf8');

// Loose extraction of the array content
// Look for '[' and the last ']'
const start = content.indexOf('[');
const end = content.lastIndexOf(']');
const arrayStr = content.slice(start, end + 1);

// We need to parse this string to JSON.
// But the keys in the file are not quoted (id: 1, hiragana: "...")
// So JSON.parse won't work directly.
// We can use `eval` if we wrap it.
let rawData;
try {
  rawData = eval(arrayStr);
} catch (e) {
  console.error("Eval failed", e);
  process.exit(1);
}

const cleaned = rawData
  .filter(item => item.id !== '-' && item.hiragana) // Filter metadata
  .map(item => {
    // Extract English meaning from examples (first line)
    // Example: "... station\nめぐろ駅から..." -> "Station"
    let english = item.examples ? item.examples.split('\n')[0] : '???';
    // Clean up "... " prefix if present (common in this dataset)
    english = english.replace(/^\.\.\.\s*/, '').replace(/\[.*\]/, '').trim();

    return {
      id: String(item.id),
      kanji: item.kanji || item.hiragana, // Fallback to kana if no kanji
      kana: item.hiragana,
      romaji: item.hiragana, // Generating true Romaji is hard without library, keep kana for now.
      english: english,
      type: 'word',
      jlpt: 'N5'
    };
  });

const tsContent = `export type DictionaryItem = {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  type: string;
  jlpt: string;
};

export const dictionary: DictionaryItem[] = ${JSON.stringify(cleaned, null, 2)};
`;

fs.writeFileSync(destPath, tsContent);
console.log(`Successfully converted ${cleaned.length} items to dictionary.ts`);
