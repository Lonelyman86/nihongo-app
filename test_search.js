// Mock dictionary with the item we found
const mockDictionary = [
  {
    "id": "w509",
    "kanji": "猫",
    "kana": "ねこ",
    "romaji": "neko",
    "english": "cat",
    "type": "word",
    "jlpt": "N5"
  }
];

const query = "neko";
const lowerValue = query.toLowerCase();

console.log(`Searching for "${query}"...`);

const result = mockDictionary.filter((item) =>
    item.english.toLowerCase().includes(lowerValue) ||
    item.romaji.toLowerCase().includes(lowerValue) ||
    item.kana.includes(query) ||
    item.kanji.includes(query)
);

console.log('Result:', result);

if (result.length > 0) {
    console.log("SUCCESS: Logic works.");
} else {
    console.log("FAILURE: Logic did not find the item.");
}
