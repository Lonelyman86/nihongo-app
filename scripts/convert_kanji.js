const fs = require('fs');
const path = require('path');

const SRC_FILE = path.join(__dirname, '../temp_kanji_repo/kanji.json');
const DEST_FILE = path.join(__dirname, '../data/kanji.ts');

if (!fs.existsSync(SRC_FILE)) {
  console.error(`File not found: ${SRC_FILE}`);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(SRC_FILE, 'utf8'));
const result = [];

// Iterate over keys (Kanji characters)
Object.keys(rawData).forEach(char => {
  const data = rawData[char];
  
  // Skip if no JLPT level is assigned or if it's not in 1-5 range
  // Note: jlpt_new is the current system.
  if (!data.jlpt_new) return;
  
  const level = `N${data.jlpt_new}`;
  
  // Valid levels are N1-N5
  if (!['N1', 'N2', 'N3', 'N4', 'N5'].includes(level)) return;

  result.push({
    kanji: char,
    onyomi: data.readings_on || [],
    kunyomi: data.readings_kun || [],
    meanings: data.meanings || [],
    jlpt: level,
    strokes: data.strokes || 0
  });
});

// Sort by Level (N5 -> N1) then strokes
result.sort((a, b) => {
  if (a.jlpt !== b.jlpt) {
    return b.jlpt.localeCompare(a.jlpt); // Reverse string sort: N5 > N1? No. 'N5' > 'N1'. We want N5 first? 
    // Actually typically learning order is N5 -> N1.
    // 'N5'.localeCompare('N1') is 1 (positive).
    // So b.localeCompare(a) would put N5 first.
  }
  return a.strokes - b.strokes;
});

const tsContent = `export type KanjiItem = {
  kanji: string;
  onyomi: string[];
  kunyomi: string[];
  meanings: string[];
  jlpt: string;
  strokes: number;
};

// Auto-generated Kanji Dictionary
// Total items: ${result.length}
export const kanjiDictionary: KanjiItem[] = ${JSON.stringify(result, null, 2)};
`;

fs.writeFileSync(DEST_FILE, tsContent);
console.log(`Kanji Dictionary generated with ${result.length} characters.`);
