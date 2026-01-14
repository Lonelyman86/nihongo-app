import { dictionary, DictionaryItem } from './dictionary';
import { kanjiDictionary, KanjiItem } from './kanji';
import { grammarDictionary, GrammarItem } from './grammar';

export type Question = {
  id: string;
  type: 'multiple-choice' | 'input' | 'reorder';
  question: string;
  options?: string[]; // For multiple choice
  correctOrder?: string[]; // For reorder: The correct sequence of chunks
  chunks?: string[]; // For reorder: The shuffled chunks to pick from
  answer: string;
  explanation?: string;
};

export type ContentItem = {
  japanese: string;
  romaji: string;
  english: string;
  kind?: 'vocabulary' | 'kanji' | 'grammar';
  audio?: string;
  mnemonic?: string;
  context?: {
    japanese: string;
    english: string;
  };
  grammarStructure?: string;
  grammarExplanation?: string;
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

// --- JLPT N5 Curriculum Topics (Textbook Style) ---
const TOPICS = [
  {
    id: 'ch1_greetings_intro',
    title: 'Chap 1: Greetings & Yourself',
    // Focus: X wa Y desu (I am...), Greetings, Country, Job
    keywords: ['hello', 'morning', 'greeting', 'nice', 'meet', ' i ', 'you', 'name', 'student', 'teacher', 'doctor', 'employee', 'japanese', 'person', 'yes', 'no', 'mr', 'ms'],
  },
  {
    id: 'ch2_demonstratives',
    title: 'Chap 2: Asking "What is that?"',
    // Focus: Kore/Sore/Are, Kono/Sono/Ano, Whose is this?
    keywords: ['this', 'that', 'what', 'who', 'whose', 'book', 'pen', 'umbrella', 'key', 'watch', 'camera', 'computer', 'car', 'bag'],
  },
  {
    id: 'ch3_places_direction',
    title: 'Chap 3: Places & Locations',
    // Focus: Koko/Soko/Asoko, Where is...?, Elevator, Toilet
    keywords: ['here', 'there', 'where', 'school', 'toilet', 'room', 'house', 'station', 'country', 'classroom', 'office', 'floor', 'stairs'],
  },
  {
    id: 'ch4_time_movement',
    title: 'Chap 4: Time & Movement',
    // Focus: Time, Hours, Days, Go/Come/Return (Iku/Kuru/Kaeru)
    keywords: ['time', 'go', 'come', 'return', 'school', 'supermarket', 'train', 'bus', 'airplane', 'taxi', 'bicycle', 'walk', 'friend', 'year', 'month', 'date', 'birthday', 'today', 'tomorrow'],
  },
  {
    id: 'ch5_verbs_daily',
    title: 'Chap 5: Daily Routines',
    // Focus: Masu form verbs, Transitive verbs (Taberu, Nomu, etc)
    keywords: ['eat', 'drink', 'smoke', 'read', 'write', 'listen', 'watch', 'buy', 'take', 'do', 'study', 'meet', 'breakfast', 'lunch', 'dinner', 'bread', 'water', 'tea', 'movie', 'letter', 'picture'],
  },
  {
    id: 'ch6_adjectives',
    title: 'Chap 6: Describing Things',
    // Focus: I-Adjectives & Na-Adjectives (Handsome, Kind, Hot, Cold)
    keywords: ['handsome', 'beautiful', 'quiet', 'lively', 'kind', 'healthy', 'famous', 'big', 'small', 'new', 'old', 'good', 'bad', 'hot', 'cold', 'difficult', 'easy', 'expensive', 'cheap', 'interesting', 'delicious', 'busy'],
  },
  {
    id: 'ch7_giving_receiving',
    title: 'Chap 7: Giving & Receiving',
    // Focus: Agemasu, Moraimasu, Kuremasu / Tools (de particle)
    keywords: ['give', 'receive', 'present', 'card', 'flower', 'chocolate', 'spoon', 'fork', 'chopsticks', 'hand', 'scissors', 'paper', 'send', 'cut'],
  },
  {
    id: 'ch8_existence',
    title: 'Chap 8: Existence & Position',
    // Focus: Arimasu/Imasu (There is...), Inside, Outside, Front, Back
    keywords: ['exist', 'there is', 'have', 'understand', 'like', 'dislike', 'cat', 'dog', 'tree', 'box', 'desk', 'chair', 'bed', 'top', 'bottom', 'inside', 'outside', 'front', 'back', 'right', 'left'],
  },
  {
    id: 'ch9_counters_quantities',
    title: 'Chap 9: Counters & Numbers',
    // Focus: Hitotsu/Futatsu, -mai, -dai, -nin, Period of time
    keywords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'how many', 'how much', 'apple', 'orange', 'sandwich', 'stamp', 'postcard', 'brother', 'sister'],
  },
  {
    id: 'ch10_desire_motion',
    title: 'Chap 10: Review & Travel',
    // Focus: Want, Motion purpose (mi ni ikimasu)
    keywords: ['want', 'painful', 'head', 'stomach', 'fever', 'sickness', 'medicine', 'trip', 'travel', 'sea', 'hotel', 'swimming', 'festival', 'play', 'sing', 'tired'],
  }
];

// Helper: Check if string matches any keyword
const matchesTopic = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(k => lowerText.includes(k));
};

// Helper: Auto-generate context using templates
const getTemplateContext = (item: ContentItem): { japanese: string, english: string } | undefined => {
  // Simple heuristic based on meaning or type
  // Note: effectively we need 'part of speech' data for perfect sentences, but we'll try best-effort here.

  const lowerEng = item.english.toLowerCase();

  // Nouns (Greetings/Intro/objects)
  if (['hello', 'good morning', 'goodbye'].some(k => lowerEng.includes(k))) return undefined; // Already handled or unique

  // Basic Noun Template: "This is a [X]"
  // We can't easily detect nouns vs verbs without data, but let's assume if it doesn't look like a verb (to X)...
  if (!lowerEng.startsWith('to ')) {
     return {
       japanese: `これは${item.japanese}です。`,
       english: `This is (a/an) ${item.english}.`
     };
  }

  // Basic Verb Template: "I [X]"
  // Very rough approximation for N5 verbs
  if (lowerEng.startsWith('to ')) {
     // Remove 'to '
     const action = item.english.replace('to ', '');
     return {
       // japanese: `毎日${item.japanese}ます。`, // Dictionary form + masu is wrong, but we lack conjugation engine here.
       // Ideally we need the polite form in our dictionary. Assuming dictionary items might be in dict form.
       // Let's stick to "Dictionary form" usage or basic distinct patterns if possible.
       // For N5, maybe just "Basic Sentence":
       japanese: `よく${item.japanese}。`, // "I often [verb]" (using dict form is casual/ok for simple examples)
       english: `I often ${action}.`
     };
  }

  return undefined;
};

// Updated Quiz Generator
const generateQuizForChapter = (items: ContentItem[], chapterId: string): Question[] => {
  // Select up to 10 random items
  const candidates = items.filter(i => i.english && i.english.length > 1);
  const questionCount = Math.min(10, candidates.length);
  const shuffledCandidates = [...candidates].sort(() => 0.5 - Math.random()).slice(0, questionCount);

  return shuffledCandidates.map((item, idx) => {
    // 80% chance to generate a "Reorder" (Duolingo Style) question
    // If context is missing, we create a simple one on the fly to FORCE the feature to show.
    const hasContext = item.context || { japanese: `これは${item.japanese}です`, english: `This is ${item.english}` };

    if (Math.random() > 0.2) {
       let targetJapanese = item.context ? item.context.japanese : `これは${item.japanese}です`;
       let targetEnglish = item.context ? item.context.english : `This is ${item.english}`;

       // Create chunks
       let chunks: string[] = [];

       if (targetJapanese.includes('これは')) {
          chunks = ['これは', item.japanese, 'です'];
       } else if (targetJapanese.includes('先生、')) {
          chunks = ['先生、', 'こんにちは'];
       } else if (targetJapanese.includes('ます')) {
           // Simple verb split: "MainPart" + "masu"
           chunks = [targetJapanese.replace('ます', ''), 'ます'];
       } else {
          // Robust Fallback: Split by common particles if present
          const parts = targetJapanese.split(/(は|を|が|で|に|へ)/).filter(p => p);
          if (parts.length > 1) chunks = parts;
          else chunks = [targetJapanese];
       }

       // If chunks are too simple (1 chunk), split chars for challenge? No, too hard.
       // Add some distractors?
       if (chunks.length < 3) {
          chunks.push('よ'); // Random particle distractor
          chunks.push('ね');
       }

       // Real shuffle
       const shuffledChunks = [...chunks].sort(() => 0.5 - Math.random());

       return {
         id: `${chapterId}-q-${idx}`,
         type: 'reorder',
         question: `Translate: "${targetEnglish}"`,
         correctOrder: chunks, // Actually we verify by string comparison, so this is metadata
         chunks: shuffledChunks,
         answer: targetJapanese
       };
    }

    // Default Multiple Choice
    const distractors = candidates
      .filter(i => i.japanese !== item.japanese)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(i => i.english);

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



// ... (Question, Chapter, Lesson, TOPICS... these are fine, keep them implied or use startLine below appropriately)
// Assuming we are replacing from AFTER `TOPICS` constant roughly, or just updating createIntegratedCourse and ContentItem.
// Since ContentItem is at top (line 16) and createIntegratedCourse is at bottom (line 231), I should do two replaces for safety or one big one if I encompass efficiently.
// Let's do huge chunk replacement to ensure consistency.

// ... (TOPICS and helpers remain in the middle, I will just replace ContentItem at the top first)

// --- Grammar Enricher Helper ---
const enrichGrammar = (item: ContentItem): ContentItem => {
   // Simple rules to add Structure/Explanation based on meaning
   // This is a "Sensei" simulation for missing data
   if (item.japanese.includes('ます')) {
     item.grammarStructure = "Verb (masu-stem) + ます";
     item.grammarExplanation = "Polite form helper verb. Used for general statements and future tense.";
   } else if (item.japanese.includes('て')) {
     item.grammarStructure = "Verb (te-form)";
     item.grammarExplanation = "Connective form. Used to link sentences or ask requests.";
   } else if (item.japanese.includes('ない')) {
     item.grammarStructure = "Verb (nai-form)";
     item.grammarExplanation = "Negative form. Used to say something does NOT happen.";
   } else if (item.japanese.includes('は')) {
     item.grammarStructure = "Noun + は";
     item.grammarExplanation = "Topic marker. Indicates what we are talking about.";
   } else if (item.japanese.includes('を')) {
     item.grammarStructure = "Noun + を + Verb";
     item.grammarExplanation = "Object marker. Indicates the target of an action.";
   } else {
     item.grammarStructure = "Standard Phrase";
     item.grammarExplanation = item.english;
   }
   return item;
};

// --- Main Generator Function ---
const createIntegratedCourse = (level: string, color: string): Lesson => {
  // 1. Gather all raw items
  const rawVocab = dictionary.filter(d => d.jlpt === level);
  const rawKanji = kanjiDictionary.filter(k => k.jlpt === level);
  const rawGrammar = grammarDictionary.filter(g => g.level === level);

  // 1b. Build "Allowed Kanji" Set for this level
  // N5 allows N5 kanji. N4 allows N5 + N4.
  const allowedLevels = level === 'N5' ? ['N5'] : (level === 'N4' ? ['N5', 'N4'] : ['N5', 'N4', 'N3']);
  const validKanjiList = kanjiDictionary.filter(k => allowedLevels.includes(k.jlpt)).map(k => k.kanji);
  const validKanjiSet = new Set(validKanjiList);

  const isKanjiAllowed = (word: string): boolean => {
     // Check every character. If it's a Kanji (approx range) and NOT in valid set, return false.
     for (const char of word) {
        // Simple Kanji range check (CJK Unified Ideographs)
        if (char >= '\u4e00' && char <= '\u9faf') {
           if (!validKanjiSet.has(char)) return false;
        }
     }
     return true;
  };

  // 2. Map Keyed Buckets
  const chapterBuckets: Record<string, ContentItem[]> = {};

  // Initialize buckets
  TOPICS.forEach(t => chapterBuckets[t.id] = []);
  chapterBuckets['general'] = []; // Fallback bucket

  // --- Helper to inject Sensei Content ---
  const enrichItem = (item: ContentItem, level: string, topicId: string): ContentItem => {
    // A. Add Context Sentences for Vocabulary
    if (item.kind === 'vocabulary') {
      let context = undefined;

      if (item.japanese.includes('こんにちは')) {
         context = { japanese: '先生、こんにちは！', english: 'Hello, teacher!' };
      } else if (item.japanese.includes('ありがとう')) {
         context = { japanese: 'プレゼントをありがとう。', english: 'Thank you for the present.' };
      } else if (item.japanese.includes('私')) {
         context = { japanese: '私は学生です。', english: 'I am a student.' };
      } else if (item.japanese.includes('先生')) {
         context = { japanese: '田中先生は優しいです。', english: 'Ms. Tanaka is kind.' };
      }

      if (!context) {
         context = getTemplateContext(item);
      }

      if (context) item.context = context;
    }

    // B. Add Mnemonics for Kanji (Visual Imagination)
    if (item.kind === 'kanji') {
       if (item.japanese === '一') item.mnemonic = 'Imagine ONE finger holding up the sky.';
       if (item.japanese === '二') item.mnemonic = 'TWO lines, the earth and the sky.';
       if (item.japanese === '三') item.mnemonic = 'THREE layers of clouds.';
       if (item.japanese === '人') item.mnemonic = 'A PERSON walking with legs wide apart.';
       if (item.japanese === '木') item.mnemonic = 'A TREE with a trunk and spreading branches.';
       if (item.japanese === '休') item.mnemonic = 'A PERSON (人) leaning against a TREE (木) to REST.';
       if (item.japanese === '日') item.mnemonic = 'The SUN is a box of light.';
       if (item.japanese === '口') item.mnemonic = 'An open MOUTH.';
       if (item.japanese === '山') item.mnemonic = 'Three peaks of a MOUNTAIN.';
       if (item.japanese === '川') item.mnemonic = 'Water flowing in a RIVER.';
    }

    return item;
  };

  // 3. Distribute Vocabulary
  rawVocab.forEach(d => {
    // Determine display: strict level compliance
    const displayJapanese = isKanjiAllowed(d.kanji) ? (d.kanji !== d.kana ? `${d.kanji} (${d.kana})` : d.kana) : d.kana;

    let item: ContentItem = {
      japanese: displayJapanese, // Use Kana if kanji is too hard
      romaji: d.romaji,
      english: d.english,
      kind: 'vocabulary'
    };

    const foundTopic = TOPICS.find(t => matchesTopic(d.english, t.keywords));
    const topicId = foundTopic ? foundTopic.id : 'general';
    item = enrichItem(item, level, topicId);
    chapterBuckets[topicId].push(item);
  });

  // 4. Distribute Kanji
  rawKanji.forEach(k => {
    const meaningStr = k.meanings.join(', ');
    let item: ContentItem = {
      japanese: k.kanji,
      romaji: `On: ${k.onyomi.join(' ')}`,
      english: `Kun: ${k.kunyomi.join(' ')} | ${meaningStr}`,
      kind: 'kanji'
    };

    const foundTopic = TOPICS.find(t => matchesTopic(meaningStr, t.keywords));
    const topicId = foundTopic ? foundTopic.id : 'general';
    item = enrichItem(item, level, topicId);
    chapterBuckets[topicId].push(item);
  });

  // 5. Distribute Grammar
  rawGrammar.forEach(g => {
    let item: ContentItem = {
      japanese: g.grammar,
      romaji: 'Grammar',
      english: g.meaning,
      kind: 'grammar'
    };

    // Enrich with Sensei Data
    item = enrichGrammar(item);

    // Try to find a home for it
    const foundTopic = TOPICS.find(t => matchesTopic(g.meaning, t.keywords));

    if (foundTopic) {
       chapterBuckets[foundTopic.id].push(item);
    } else {
       chapterBuckets['general'].push(item);
    }
  });

  // 6. Build Final Chapters List
  const chapters: Chapter[] = [];

  // A. Thematic Chapters
  TOPICS.forEach((topic, idx) => {
    const items = chapterBuckets[topic.id];
    // Relaxed constraint: Create chapter if > 2 item (to ensure grammar/vocab are modally present even if small)
    if (items.length > 2) {
       chapters.push({
         id: `${level}-unit-${idx + 1}`,
         title: `Unit ${chapters.length + 1}: ${topic.title}`,
         description: `Topics: ${topic.keywords.slice(0, 3).join(', ')}...`,
         content: items,
         quiz: generateQuizForChapter(items, `${level}-unit-${idx + 1}`)
       });
    } else {
      chapterBuckets['general'].push(...items);
    }
  });

  // B. General Chapters
  const generalItems = chapterBuckets['general'];
  const shuffledGeneral = [...generalItems].sort(() => 0.5 - Math.random());
  const chunkSize = 25;

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
