'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, Book, Type, List, Flame, Zap, Trophy, User } from 'lucide-react';
import { searchDatabase, SearchResults } from './actions/search';
import { getCoursesList, CourseSummary } from './actions/courses';
import { useProgress } from '@/lib/useProgress';
import { cn } from '@/lib/utils';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ vocab: [], kanji: [], grammar: [] });
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { progress } = useProgress();

  useEffect(() => {
    getCoursesList().then(setCourses);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      setIsSearching(true);
      try {
        const res = await searchDatabase(value);
        setResults(res);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults({ vocab: [], kanji: [], grammar: [] });
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 relative overflow-hidden">
      {/* Zen Background: No blobs, just paper texture defined in globals */}

      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {/* Main Brand with Matcha Gradient */}
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-lime-600">
            DokuGaku
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 tracking-wider">
            BETA
          </span>
        </h1>
        <div className="flex items-center gap-6">
             {/* Stats */}
             <div className="hidden md:flex items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-2 text-[var(--accent)]">
                    <Flame className="w-4 h-4 fill-[var(--accent)]/20" /> {progress.streak} Day Streak
                </div>
                <div className="flex items-center gap-2 text-[var(--secondary)]">
                    <Zap className="w-4 h-4 fill-[var(--secondary)]/20" /> {progress.xp} XP
                </div>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center border border-gray-200 shadow-sm text-gray-600">
                <User className="w-5 h-5" />
             </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <section className="mb-12 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-gray-800">
              Okaeri, <span className="text-[var(--primary)]">Sensei!</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">Siap melanjutkan petualangan hari ini?</p>
        </section>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 mb-12 auto-rows-[minmax(180px,auto)]">

            {/* 1. SEARCH WIDGET (Span 2 col) */}
            <div className="col-span-1 md:col-span-2 row-span-1 relative z-30">
                 <div className="paper-card h-full rounded-2xl p-8 relative bg-white">
                    {/* Background Decoration (Clipped) */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-bl-full -mr-8 -mt-8 opacity-50" />
                    </div>

                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Search className="w-3 h-3" /> Cari Kotoba (Kamus)
                    </label>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Cari huruf, kanji, atau arti..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 shadow-inner"
                        />
                         {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                            </div>
                         )}
                    </div>

                     {/* DROPDOWN RESULTS (Light Mode) */}
                     <AnimatePresence>
                        {query.length > 0 && (results.vocab.length > 0 || results.kanji.length > 0 || results.grammar.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xl z-50 max-h-[400px] overflow-y-auto ring-1 ring-black/5"
                        >
                             {/* Grammar */}
                            {results.grammar.length > 0 && (
                                <div className="p-2">
                                    <div className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded inline-block mb-2 mt-1 mx-1">Grammar</div>
                                    {results.grammar.map(item => (
                                        <div key={item.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-[var(--primary)] text-lg">{item.grammar}</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{item.level}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">{item.meaning}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                             {/* Kanji */}
                             {results.kanji.length > 0 && (
                                <div className="p-2 border-t border-gray-100">
                                    <div className="text-xs font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded inline-block mb-2 mt-2 mx-1">Kanji</div>
                                    {results.kanji.map((item, idx) => (
                                        <div key={`k-${idx}`} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors flex items-center gap-4">
                                            <span className="text-3xl font-black text-gray-800 bg-gray-100 w-12 h-12 flex items-center justify-center rounded-lg">{item.kanji}</span>
                                            <div className="overflow-hidden">
                                                <div className="text-sm font-bold text-gray-800 truncate">{item.meanings.join(', ')}</div>
                                                <div className="text-xs text-gray-500 truncate font-mono mt-1">{[...item.onyomi, ...item.kunyomi].join(' ')}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                             {/* Vocab */}
                             {results.vocab.length > 0 && (
                                <div className="p-2 border-t border-gray-100">
                                    <div className="text-xs font-bold text-lime-700 bg-lime-50 px-3 py-1 rounded inline-block mb-2 mt-2 mx-1">Vocabulary</div>
                                    {results.vocab.map(item => (
                                        <div key={item.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-bold text-gray-900 text-lg">{item.kanji}</span>
                                                <span className="text-xs text-gray-400 font-mono">{item.kana}</span>
                                            </div>
                                            <div className="text-sm text-lime-700 font-medium truncate">{item.english}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                        )}
                     </AnimatePresence>
                 </div>
            </div>

            {/* 2. STREAK CARD (Vermilion Accent) */}
            <div className="col-span-1 row-span-1 paper-card rounded-2xl p-6 relative overflow-hidden group bg-white border-l-4 border-l-[var(--accent)]">
                <div className="absolute top-2 right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Flame className="w-16 h-16 text-[var(--accent)]" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-4xl font-black text-[var(--accent)]">{progress.streak}</div>
                        <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">Day Streak</div>
                    </div>
                    <div className="flex gap-1.5 mt-4">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-2 flex-1 rounded-sm ${i <= (progress.streak % 5 || 1) ? 'bg-[var(--accent)]' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. XP CARD (Matcha/Green) */}
            <div className="col-span-1 row-span-1 paper-card rounded-2xl p-6 relative overflow-hidden group bg-white border-l-4 border-l-[var(--secondary)]">
                <div className="absolute top-2 right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-16 h-16 text-[var(--secondary)]" />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="text-4xl font-black text-[var(--secondary)]">{progress.xp}</div>
                        <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">Total XP</div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2 font-medium">Top 5% Scholar</p>
                </div>
            </div>

             {/* 4. TIMELINE (ROADMAP) */}
             <div className="col-span-1 md:col-span-4 row-span-1 mt-4">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                   <div className="p-2 bg-[var(--primary)]/10 rounded-lg text-[var(--primary)]">
                     <List className="w-5 h-5" />
                   </div>
                   Roadmap Belajar (N5)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {courses.find(c => c.level === 'N5')?.chapters?.map((chapter, idx) => {
                      // Check progress
                      const isDone = false; // TODO: Hook up to real progress
                      const isLocked = idx > 0 && !isDone; // Simple lock mechanism

                      return (

                         <Link key={chapter.id} href={`/lesson/n5?chapterId=${chapter.id}`}
                               className={`group relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all ${isLocked ? 'opacity-70 grayscale' : 'hover:-translate-y-1 hover:border-[var(--primary)]'}`}
                         >
                            <div className="flex justify-between items-start mb-4">
                               <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${idx === 0 ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-500'}`}>
                                  Hari {idx + 1}
                               </span>
                               {isLocked ? <div className="text-gray-300">🔒</div> : <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--primary)]" />}
                            </div>

                            <h4 className="text-lg font-bold text-gray-800 mb-2">{chapter.title.split(':')[1] || chapter.title}</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                               {chapter.description}
                            </p>

                            <div className="flex gap-2">
                               {chapter.content.some(c => c.kind === 'vocabulary') && (
                                  <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 font-medium">Kotoba</span>
                               )}
                               {chapter.content.some(c => c.kind === 'kanji') && (
                                  <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 font-medium">Kanji</span>
                               )}
                               {chapter.content.some(c => c.kind === 'grammar') && (
                                  <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100 font-medium">Bunpou</span>
                               )}
                            </div>
                         </Link>
                      );
                   })}

                   {/* Coming Soon Card */}
                   <div className="p-6 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm font-medium min-h-[160px]">
                      <span>Hari berikutnya...</span>
                      <span className="text-xs mt-1 opacity-70">Coming Soon</span>
                   </div>
                </div>
             </div>


             {/* 5. STATS SUMMARY (Span 2) */}
            <div className="col-span-1 md:col-span-2 row-span-1 paper-card rounded-2xl p-6 flex flex-col justify-center items-center text-center bg-gray-900 text-white relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-20" />
                 <div className="relative z-10">
                    <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-1">Current Goal</h3>
                    <p className="text-sm text-gray-400 mb-0">Complete 3 Units to reach Level 2</p>
                 </div>
            </div>

        </div>
      </div>
    </main>
  );
}
