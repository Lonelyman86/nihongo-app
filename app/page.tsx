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
              Welcome back, <span className="text-[var(--primary)]">Scholar</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">Ready to continue your mastery?</p>
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
                        <Search className="w-3 h-3" /> Dictionary Search
                    </label>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Find grammar, kanji, or words..."
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

             {/* 4. COURSES (Loop) */}
             {courses.length === 0 ? (
                // Skeleton Loading
                [1,2,3].map(i => <div key={i} className="col-span-1 md:col-span-2 row-span-1 bg-gray-100 rounded-2xl animate-pulse h-[200px]" />)
             ) : (
                courses.map((course) => {
                    const isCompleted = progress.completedUnits.some(uId => uId.startsWith(course.level));
                    const unitsDone = progress.completedUnits.filter(u => u.startsWith(course.level)).length;
                    const progressPercent = Math.min(100, Math.round((unitsDone / Math.max(course.unitCount, 1)) * 100));

                    // Course Colors based on levels
                    // N5: Matcha (Lime/Green)
                    // N4: Sky (Blue) - Kept distinction but fixed contrast
                    // N3: Azuki (Rose/Red)
                    let levelColor = 'text-gray-900';
                    let levelBg = 'bg-gray-100';
                    let barColor = 'bg-gray-800';

                    if (course.level === 'N5') {
                        levelColor = 'text-lime-800';
                        levelBg = 'bg-lime-100';
                        barColor = 'bg-lime-600';
                    } else if (course.level === 'N4') {
                        levelColor = 'text-sky-800';
                        levelBg = 'bg-sky-100';
                        barColor = 'bg-sky-600';
                    } else if (course.level === 'N3') {
                        levelColor = 'text-rose-800';
                        levelBg = 'bg-rose-100';
                        barColor = 'bg-rose-600';
                    }

                    return (
                        <Link key={course.id} href={`/lesson/${course.id}`} className="col-span-1 md:col-span-2 row-span-1">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="h-full paper-card rounded-2xl p-8 relative overflow-hidden group bg-white"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -mr-16 -mt-16 opacity-50 transition-all group-hover:scale-110" />

                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider mb-4 inline-block shadow-sm ${levelBg} ${levelColor} border-black/5`}>
                                                {course.level} Course
                                            </span>
                                            <h3 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                                            <p className="text-gray-600 text-sm max-w-sm leading-relaxed">{course.description}</p>
                                        </div>
                                        <div className="p-3 rounded-full bg-white border border-gray-100 shadow-sm group-hover:translate-x-1 transition-transform">
                                            <ArrowRight className="w-5 h-5 text-gray-500" />
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                            <span>Progress</span>
                                            <span>{progressPercent}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercent}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${barColor}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })
             )}


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
