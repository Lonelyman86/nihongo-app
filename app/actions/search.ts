'use server';

import { dictionary, DictionaryItem } from '@/data/dictionary';
import { kanjiDictionary, KanjiItem } from '@/data/kanji';
import { grammarDictionary, GrammarItem } from '@/data/grammar';

export type SearchResults = {
  vocab: DictionaryItem[];
  kanji: KanjiItem[];
  grammar: GrammarItem[];
};

export async function searchDatabase(query: string): Promise<SearchResults> {
  if (!query || query.length === 0) {
    return { vocab: [], kanji: [], grammar: [] };
  }

  const lowerValue = query.toLowerCase();

  // Filter Vocabulary (Top 30)
  const filteredVocab = dictionary.filter((item) =>
    item.english.toLowerCase().includes(lowerValue) ||
    item.romaji.toLowerCase().includes(lowerValue) ||
    item.kana.includes(query) ||
    item.kanji.includes(query)
  ).slice(0, 30);

  // Filter Kanji (Top 10)
  const filteredKanji = kanjiDictionary.filter((item) =>
    item.kanji === query ||
    item.meanings.some(m => m.toLowerCase().includes(lowerValue)) ||
    item.onyomi.some(r => r.includes(query)) ||
    item.kunyomi.some(r => r.includes(query))
  ).slice(0, 10);

  // Filter Grammar (Top 10)
  const filteredGrammar = grammarDictionary.filter((item) =>
    item.grammar.includes(query) ||
    item.meaning.toLowerCase().includes(lowerValue)
  ).slice(0, 10);

  return {
    vocab: filteredVocab,
    kanji: filteredKanji,
    grammar: filteredGrammar,
  };
}
