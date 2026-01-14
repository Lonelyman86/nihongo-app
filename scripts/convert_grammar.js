const fs = require('fs');
const path = require('path');

const DEST_FILE = path.join(__dirname, '../data/grammar.ts');

const n5Samples = [
    { grammar: '〜は〜です', meaning: 'X is Y', level: 'N5' },
    { grammar: '〜か', meaning: 'Question particle', level: 'N5' },
    { grammar: '〜の', meaning: 'Possessive particle', level: 'N5' },
    { grammar: '〜に / 〜へ', meaning: 'To (Destination)', level: 'N5' },
    { grammar: '〜で', meaning: 'At (Place of action); By means of', level: 'N5' },
    { grammar: '〜も', meaning: 'Also; Too', level: 'N5' },
    { grammar: '〜と', meaning: 'And; With', level: 'N5' },
    { grammar: '〜を', meaning: 'Object marker', level: 'N5' },
    { grammar: '〜も〜も', meaning: 'Both A and B', level: 'N5' },
    { grammar: '〜が', meaning: 'Subject marker; But', level: 'N5' },
    { grammar: '〜から', meaning: 'From; Because', level: 'N5' },
    { grammar: '〜まで', meaning: 'Until; As far as', level: 'N5' },
    { grammar: '〜ている', meaning: 'Currently doing (Progressive)', level: 'N5' },
    { grammar: '〜に行く', meaning: 'Go to do something', level: 'N5' },
    { grammar: '〜たい', meaning: 'Want to do', level: 'N5' },
    { grammar: '〜たくない', meaning: 'Do not want to do', level: 'N5' },
    { grammar: '〜な', meaning: 'Don\'t do (Imperative negative)', level: 'N5' },
    { grammar: '〜ね', meaning: 'Isn\'t it? (Agreement)', level: 'N5' },
    { grammar: '〜よ', meaning: 'You know (Emphasis)', level: 'N5' },
    { grammar: '〜ましょう', meaning: 'Let\'s do', level: 'N5' }
];

const n4Samples = [
    { grammar: '〜つもり', meaning: 'Plan to do', level: 'N4' },
    { grammar: '〜てみる', meaning: 'Try doing', level: 'N4' },
    { grammar: '〜なら', meaning: 'If/As for', level: 'N4' },
    { grammar: '〜てはいけない', meaning: 'Must not do', level: 'N4' },
    { grammar: '〜かもしれない', meaning: 'Might be', level: 'N4' },
    { grammar: '〜とおり', meaning: ' Just like; in the same way as', level: 'N4' },
    { grammar: '〜がる', meaning: 'Show signs of; appear to be', level: 'N4' },
    { grammar: '〜し〜し', meaning: 'and; and (listing reasons)', level: 'N4' },
    { grammar: '〜たり〜たり', meaning: 'do such things as A and B', level: 'N4' },
    { grammar: '〜まま', meaning: 'as it is; current state', level: 'N4' },
    { grammar: '〜ようだ', meaning: 'It seems that', level: 'N4' },
    { grammar: '〜らしい', meaning: 'It seems like; I heard', level: 'N4' }
];

const n3Samples = [
    { grammar: '〜に対して', meaning: 'Towards; against', level: 'N3' },
    { grammar: '〜によって', meaning: 'By; due to; depending on', level: 'N3' },
    { grammar: '〜ということだ', meaning: 'It implies that; I heard that', level: 'N3' },
    { grammar: '〜に限る', meaning: 'Nothing better than; best to', level: 'N3' },
    { grammar: '〜最中に', meaning: 'In the middle of', level: 'N3' },
    { grammar: '〜わりに（は）', meaning: 'Considering; For a...', level: 'N3' },
    { grammar: '〜くせに', meaning: 'Despite; even though (blame)', level: 'N3' },
    { grammar: '〜たびに', meaning: 'Whenever; every time', level: 'N3' },
    { grammar: '〜切る', meaning: 'To do completely', level: 'N3' },
    { grammar: '〜かけ', meaning: 'Halfway; in the middle of', level: 'N3' },
    { grammar: '〜ば〜ほど', meaning: 'The more... the more', level: 'N3' },
    { grammar: '〜ついでに', meaning: 'While doing X, I also did Y', level: 'N3' }
];

const n2Samples = [
    { grammar: '〜に際して', meaning: 'On the occasion of', level: 'N2' },
    { grammar: '〜ざるを得ない', meaning: 'Have no choice but to', level: 'N2' },
    { grammar: '〜かねる', meaning: 'Unable to; difficult to', level: 'N2' },
    { grammar: '〜つつある', meaning: 'In the process of doing', level: 'N2' },
    { grammar: '〜にわたって', meaning: 'Over a period of; throughout', level: 'N2' },
    { grammar: '〜をきっかけに', meaning: 'With... as a start/trigger', level: 'N2' },
    { grammar: '〜てしょうがない', meaning: 'Cannot help but; extremely', level: 'N2' },
    { grammar: '〜恐れがある', meaning: 'Risk of; fear of', level: 'N2' },
    { grammar: '〜のみならず', meaning: 'Not only... but also', level: 'N2' },
    { grammar: '〜ものなら', meaning: 'If one could', level: 'N2' },
    { grammar: '〜あげく', meaning: 'In the end; after all (bad result)', level: 'N2' },
    { grammar: '〜ばかりに', meaning: 'Simply because', level: 'N2' }
];

const n1Samples = [
    { grammar: '〜そばから', meaning: 'As soon as... (negative)', level: 'N1' },
    { grammar: '〜ごとき', meaning: 'Like; as if (derogatory/humble)', level: 'N1' },
    { grammar: '〜禁じ得ない', meaning: 'Cannot help (feeling)', level: 'N1' },
    { grammar: '〜余儀なくされる', meaning: 'Be forced to', level: 'N1' },
    { grammar: '〜んがため', meaning: 'In order to', level: 'N1' },
    { grammar: '〜といったらない', meaning: 'Inexpressibly; extremely', level: 'N1' },
    { grammar: '〜だに', meaning: 'Even just', level: 'N1' },
    { grammar: '〜たりとも', meaning: 'Even a (single unit)', level: 'N1' },
    { grammar: '〜極まる', meaning: 'Extremely', level: 'N1' },
    { grammar: '〜手前', meaning: 'Before; out of consideration for', level: 'N1' },
    { grammar: '〜まみれ', meaning: 'Covered in', level: 'N1' },
    { grammar: '〜ずくめ', meaning: 'Entirely; mostly', level: 'N1' }
];

// Helper to format
const format = (list, lvl) => list.map((i, idx) => ({
    id: `g-${lvl.toLowerCase()}-${idx}`,
    grammar: i.grammar,
    meaning: i.meaning,
    level: i.level || lvl,
}));

const allGrammar = [
    ...format(n5Samples, 'N5'),
    ...format(n4Samples, 'N4'),
    ...format(n3Samples, 'N3'),
    ...format(n2Samples, 'N2'),
    ...format(n1Samples, 'N1')
];

const fileContent = `export type GrammarItem = {
  id: string;
  grammar: string;
  meaning: string;
  level: string;
  structure?: string;
};

// Auto-generated Grammar Database (Manual Sample)
// Total items: ${allGrammar.length}
export const grammarDictionary: GrammarItem[] = ${JSON.stringify(allGrammar, null, 2)};
`;

fs.writeFileSync(DEST_FILE, fileContent);
console.log(`Grammar Dictionary generated involving ${allGrammar.length} entries.`);
