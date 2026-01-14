const fs = require('fs');
const path = require('path');

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const SRC_DIR = path.join(__dirname, '../temp_elzup_repo/src');
const DEST_FILE = path.join(__dirname, '../data/dictionary.ts');

// --- Helper: Simple Kana to Romaji Converter ---
// This is a basic implementation to support search.
const KANA_MAP = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',
  か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',
  た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',
  は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',
  や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',
  わ:'wa',を:'wo',ん:'n',
  が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',
  ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',
  ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',
  ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  きゃ:'kya',きュ:'kyu',きょ:'kyo',
  しゃ:'sha',しゅ:'shu',しょ:'sho',
  ちゃ:'cha',ちゅ:'chu',ちょ:'cho',
  にゃ:'nya',にゅ:'nyu',にょ:'nyo',
  ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',
  みゃ:'mya',みゅ:'myu',みょ:'myo',
  りゃ:'rya',りゅ:'ryu',りょ:'ryo',
  ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
  じゃ:'ja',じゅ:'ju',じょ:'jo',
  びゃ:'bya',びゅ:'byu',びょ:'byo',
  ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',
  // Small tsu and vowels are handled by logic
};

function toRomaji(text) {
  if (!text) return '';
  let res = '';
  // Simple pass: map multi-char sequences first?
  // For simplicity, we just iterate.
  // Real Hepburn rules are complex (long vowels with macron or ii/uu).
  // We'll stick to a simple 1-to-1 or 2-to-1 map.
  
  // Normalize simple katakana to hiragana range for mapping if needed? 
  // The dataset seems to have hiragana in 'reading' column usually.
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i+1];
    
    // Small tsu (っ) -> double consonant
    if (char === 'っ') {
      if (next && KANA_MAP[next]) {
        const nextRomaji = KANA_MAP[next];
        res += nextRomaji[0]; // double the first letter
        continue;
      }
    }
    
    // Check for compound (kya, etc.)
    if (next && (next === 'ゃ' || next === 'ゅ' || next === 'ょ')) {
       const key = char + next;
       if (KANA_MAP[key]) {
         res += KANA_MAP[key];
         i++; // skip next
         continue;
       }
    }
    
    // Long vowels (ー) -> ignore or duplicate previous vowel?
    // Usually 'ー' in katakana words extends the sound.
    if (char === 'ー') {
        const lastChar = res[res.length - 1];
        if (lastChar) res += lastChar;
        continue;
    }

    if (KANA_MAP[char]) {
      res += KANA_MAP[char];
    } else {
      res += char; // Keep as is (kanji or unknown)
    }
  }
  return res;
}

// --- CSV Parser ---
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuote = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// --- Main ---

let allWords = [];
let idCounter = 1;

LEVELS.forEach(level => {
  const file = path.join(SRC_DIR, `${level}.csv`);
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}`);
    return;
  }
  
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  // Skip header "expression,reading,meaning,tags"
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Hand-rolled CSV parse because of quotes
    const cols = parseCSVLine(line);
    
    if (cols.length < 3) continue;
    
    const expression = cols[0].replace(/^"|"$/g, ''); // Kanji/Word
    const reading = cols[1].replace(/^"|"$/g, ''); // Kana
    const meaning = cols[2].replace(/^"|"$/g, ''); // English
    
    // If expression is the same as reading, it's kana-only word.
    // If expression contains kanji, it will be different.
    
    allWords.push({
      id: `w${idCounter++}`,
      kanji: expression,
      kana: reading || expression,
      romaji: toRomaji(reading || expression),
      english: meaning,
      type: 'word', // dataset doesn't distinguish noun/verb well, default to word
      jlpt: level.toUpperCase()
    });
  }
});

// Write Output
const tsContent = `export type DictionaryItem = {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  type: string;
  jlpt: string;
};

// Auto-generated dictionary from elzup/jlpt-word-list
// Total items: ${allWords.length}
export const dictionary: DictionaryItem[] = ${JSON.stringify(allWords, null, 2)};
`;

fs.writeFileSync(DEST_FILE, tsContent);
console.log(`Dictionary generated with ${allWords.length} words.`);
