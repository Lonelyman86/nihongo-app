import { dictionary, DictionaryItem } from './dictionary';
import { kanjiDictionary, KanjiItem } from './kanji';
import { grammarDictionary, GrammarItem } from './grammar';

export type Question = {
  id: string;
  type: 'multiple-choice' | 'input';
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export type ContentItem = {
  japanese: string;
  romaji: string;
  english: string;
  kind?: 'vocabulary' | 'kanji' | 'grammar';
  audio?: string;
};

export type Chapter = {
  id: string;
  title: string;
  description: string;
  content: ContentItem[];
  quiz: Question[];
};

export type Lesson = {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3';
  description: string;
  icon: string;
  color: string;
  chapters: Chapter[];
};

// --- Keyword Matchers for Thematic Grouping (Simple Heuristics) ---
const TOPICS = [
  {
    id: 'intro',
    title: 'Greetings & Introductions',
    keywords: ['hello', 'morning', 'greeting', 'name', ' i ', 'you', 'teacher', 'student', 'meet', 'nice', 'meet'],
  },
  {
    id: 'numbers_time',
    title: 'Numbers & Time',
    keywords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'time', 'hour', 'minute', 'o\'clock', 'day', 'month', 'year', 'week', 'today', 'yesterday', 'tomorrow', 'now'],
  },
  {
    id: 'people',
    title: 'People & Family',
    keywords: ['father', 'mother', 'sister', 'brother', 'family', 'person', 'man', 'woman', 'child', 'friend'],
  },
  {
    id: 'food',
    title: 'Food & Dining',
    keywords: ['eat', 'drink', 'food', 'water', 'tea', 'fish', 'meat', 'apple', 'restaurant', 'delicious', 'breakfast', 'lunch', 'dinner'],
  },
  {
    id: 'daily',
    title: 'Daily Life',
    keywords: ['go', 'come', 'return', 'sleep', 'wake', 'study', 'work', 'bath', 'shower', 'wash', 'home', 'house'],
  },
  {
    id: 'places',
    title: 'Places & Travel',
    keywords: ['station', 'train', 'bus', 'car', 'ticket', 'where', 'school', 'hospital', 'store', 'shop'],
  },
  {
    id: 'adjectives',
    title: 'Describing Things',
    keywords: ['big', 'small', 'red', 'blue', 'white', 'black', 'hot', 'cold', 'new', 'old', 'good', 'bad', 'interesting'],
  },
  {
    id: 'grammar_basics',
    title: 'Grammar Essentials',
    keywords: [], // Will be filled primarily by grammar type
  }
];

// Helper: Check if string matches any keyword
const matchesTopic = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(k => lowerText.includes(k));
};

// Helper: Random Quiz Generator (Updated for mixed content)
const generateQuizForChapter = (items: ContentItem[], chapterId: string): Question[] => {
  // Select up to 10 random items from the chapter content
  const candidates = items.filter(i => i.english && i.english.length > 1); // Ensure valid meaning
  const questionCount = Math.min(10, candidates.length);
  const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random()).slice(0, questionCount);

  return shuffledCandidates.map((item, idx) => {
    // Generate distractors from OTHER items in the same chapter (or fallback text)
    const distractors = candidates
      .filter(i => i.japanese !== item.japanese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(i => i.english);
    
    // Fill with generic distractors if needed
    while (distractors.length < 3) {
       distractors.push('Something else'); 
    }

    const options = [item.english, ...distractors].sort(() => 0.5 - Math.random());

    return {
      id: `${chapterId}-q-${idx}`,
      type: 'multiple-choice',
      question: `[${item.kind?.toUpperCase()}] What is the meaning of "${item.japanese}"?`,
      options: options,
      answer: item.english,
    };
  });
};

// --- Main Generator Function ---
const createIntegratedCourse = (level: string, color: string): Lesson => {
  // 1. Gather all raw items
  const rawVocab = dictionary.filter(d => d.jlpt === level);
  const rawKanji = kanjiDictionary.filter(k => k.jlpt === level);
  const rawGrammar = grammarDictionary.filter(g => g.level === level);

  // 2. Map Keyed Buckets
  const chapterBuckets: Record<string, ContentItem[]> = {};
  
  // Initialize buckets
  TOPICS.forEach(t => chapterBuckets[t.id] = []);
  chapterBuckets['general'] = []; // Fallback bucket

  // 3. Distribute Vocabulary
  rawVocab.forEach(d => {
    const item: ContentItem = {
      japanese: d.kanji !== d.kana ? `${d.kanji} (${d.kana})` : d.kana,
      romaji: d.romaji,
      english: d.english,
      kind: 'vocabulary'
    };
    
    // Try to match topic
    const foundTopic = TOPICS.find(t => matchesTopic(d.english, t.keywords));
    if (foundTopic) {
      chapterBuckets[foundTopic.id].push(item);
    } else {
      chapterBuckets['general'].push(item);
    }
  });

  // 4. Distribute Kanji
  rawKanji.forEach(k => {
    const meaningStr = k.meanings.join(', ');
    const item: ContentItem = {
      japanese: k.kanji,
      romaji: `On: ${k.onyomi.join(' ')}`,
      english: `Kun: ${k.kunyomi.join(' ')} | ${meaningStr}`,
      kind: 'kanji'
    };

    const foundTopic = TOPICS.find(t => matchesTopic(meaningStr, t.keywords));
    if (foundTopic) {
      chapterBuckets[foundTopic.id].push(item);
    } else {
      chapterBuckets['general'].push(item);
    }
  });

  // 5. Distribute Grammar (Harder to match by keyword, distribute mostly to General or specific Grammar bucket if we made one)
  // Or, let's just put them in 'general' chunks for now as "Grammar checkpoints"
  rawGrammar.forEach(g => {
    const item: ContentItem = {
      japanese: g.grammar,
      romaji: 'Grammar',
      english: g.meaning,
      kind: 'grammar'
    };
    chapterBuckets['general'].push(item);
  });

  // 6. Build Final Chapters List
  const chapters: Chapter[] = [];

  // A. Thematic Chapters
  TOPICS.forEach((topic, idx) => {
    const items = chapterBuckets[topic.id];
    if (items.length > 5) { // Only create chapter if it has decent content
       chapters.push({
         id: `${level}-unit-${idx + 1}`,
         title: `Unit ${chapters.length + 1}: ${topic.title}`,
         description: `Focus on ${topic.title} related Vocabulary & Kanji.`,
         content: items,
         quiz: generateQuizForChapter(items, `${level}-unit-${idx + 1}`)
       });
    } else {
      // If too few, dump back to general
      chapterBuckets['general'].push(...items);
    }
  });

  // B. General Chapters (Chunking the rest)
  // We want mixed content in general chapters too, ideally.
  // The general bucket currently looks like [vocab..., kanji..., grammar...]
  // We should shuffle it? Or just chunk it.
  const generalItems = chapterBuckets['general'];
  const chunkSize = 25;
  
  for (let i = 0; i < generalItems.length; i += chunkSize) {
    const chunk = generalItems.slice(i, i + chunkSize);
    // Try to ensure chunk has at least some grammar if available
    // (This primitive logic relies on the array being mixed, currently it's concatenated types. Let's shuffle the general bucket first)
  }

  // Shuffle general items to mix Types
  const shuffledGeneral = [...generalItems].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < shuffledGeneral.length; i += chunkSize) {
    const chunk = shuffledGeneral.slice(i, i + chunkSize);
    const unitNum = chapters.length + 1;
    chapters.push({
      id: `${level}-unit-${unitNum}`,
      title: `Unit ${unitNum}: General Practice`,
      description: `Mixed practice of Vocabulary, Kanji, and Grammar.`,
      content: chunk,
      quiz: generateQuizForChapter(chunk, `${level}-unit-${unitNum}`)
    });
  }

  return {
    id: level.toLowerCase(),
    title: `${level} Integrated Course`,
    level: level as any,
    description: `Complete Master Course. ${chapters.length} Units covering Vocabulary, Kanji, and Grammar.`,
    icon: level === 'N5' ? '🌱' : (level === 'N4' ? '🌿' : '🌳'),
    color: color,
    chapters: chapters
  };
};

export const courses: Lesson[] = [
  createIntegratedCourse('N5', 'from-emerald-400 to-green-600'),
  createIntegratedCourse('N4', 'from-blue-400 to-indigo-600'),
  createIntegratedCourse('N3', 'from-orange-400 to-red-600'),
];
