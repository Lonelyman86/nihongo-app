'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, Book, Type, List } from 'lucide-react';
import { searchDatabase, SearchResults } from './actions/search';
import { getCoursesList, CourseSummary } from './actions/courses';

// Use local types for state to avoid importing heavy dictionaries
type VocabItem = { kanji: string; kana: string; english: string; jlpt: string; type: string; id: string };
type KanjiItem = { kanji: string; onyomi: string[]; kunyomi: string[]; meanings: string[]; jlpt: string; strokes: number };
type GrammarItem = { grammar: string; meaning: string; level: string; id: string };

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({ vocab: [], kanji: [], grammar: [] });
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch courses on mount
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
    <main className="min-h-screen p-8 pb-24 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10" />

      <header className="flex justify-between items-center mb-16 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-gradient-primary">DokuGaku</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 tracking-wider">
            BETA
          </span>
        </h1>
        <nav>
          {/* Simple Nav */}
        </nav>
      </header>

      <div className="max-w-5xl mx-auto">
        <section className="mb-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              Master Japanese <br />
              <span className="text-gradient-primary">The Simple Way</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              No complex databases. No clutter. Just pure learning focused on
              what matters. Start your journey from Zero to N1 today.
            </p>
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto relative z-20">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {isSearching ? (
                     <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                     <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  )}
                </div>
                <input 
                  type="text" 
                  value={query}
                  onChange={handleSearch}
                  placeholder="Search grammar, kotoba, kanji..." 
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-white placeholder-gray-500 backdrop-blur-md shadow-lg"
                />
              </div>

               {/* Search Results Dropdown */}
               <AnimatePresence>
                {query.length > 0 && (results.vocab.length > 0 || results.kanji.length > 0 || results.grammar.length > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-[60vh] overflow-y-auto"
                  >
                    {/* Grammar Section (New) */}
                    {results.grammar.length > 0 && (
                      <div className="border-b border-white/10">
                        <div className="px-4 py-2 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                           <List className="w-3 h-3" /> Grammar Results
                        </div>
                        <div className="divide-y divide-white/5">
                          {results.grammar.map((item) => (
                             <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between text-left group cursor-pointer">
                                <div>
                                  <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-xl font-bold text-green-400">{item.grammar}</span>
                                  </div>
                                  <p className="text-sm text-gray-300">{item.meaning}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/20 text-green-300 border border-green-500/20">{item.level}</span>
                                </div>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Kanji Section */}
                    {results.kanji.length > 0 && (
                      <div className="border-b border-white/10">
                        <div className="px-4 py-2 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                           <Type className="w-3 h-3" /> Kanji Results
                        </div>
                        <div className="divide-y divide-white/5">
                          {results.kanji.map((item, idx) => (
                             <div key={`k-${idx}`} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between text-left group cursor-pointer">
                                <div>
                                  <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-2xl font-black text-pink-400">{item.kanji}</span>
                                    <span className="text-sm text-gray-400 font-mono ml-2">
                                      {[...item.onyomi, ...item.kunyomi].slice(0, 3).join(', ')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">{item.meanings.slice(0, 2).join(', ')}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-pink-500/20 text-pink-300 border border-pink-500/20">{item.jlpt}</span>
                                    <p className="text-xs text-gray-600 mt-1">{item.strokes} strokes</p>
                                </div>
                             </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vocabulary Section */}
                    {results.vocab.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                           <Book className="w-3 h-3" /> Vocabulary Results
                        </div>
                        <div className="divide-y divide-white/5">
                          {results.vocab.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between text-left group cursor-pointer">
                              <div>
                                <div className="flex items-baseline gap-3 mb-1">
                                  <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{item.kanji}</span>
                                  <span className="text-sm text-gray-400 font-mono ml-2">{item.kana}</span>
                                </div>
                                <p className="text-sm text-gray-500">{item.english}</p>
                              </div>
                              <div className="text-right">
                                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/20">{item.jlpt}</span>
                                  <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{item.type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                {/* No results state */}
                {query.length > 0 && !isSearching && results.vocab.length === 0 && results.kanji.length === 0 && results.grammar.length === 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center text-gray-500 shadow-2xl z-50">
                       <p>No results found for "{query}"</p>
                     </div>
                )}
              </AnimatePresence>
              
              {query.length === 0 && (
                <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] w-full md:w-auto">
                  Start Learning Now
                </button>
              )}
            </div>
          </motion.div>
        </section>

        <section className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-semibold">Available Integrated Courses</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
               // Loading Skeletons
               [1,2,3].map(i => (
                 <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
               ))
            ) : (
               courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/lesson/${course.id}`}
                  className="block group h-full"
                >
                  <div className="glass-panel h-full p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                        {course.level}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                    </div>
                    
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {course.description}
                    </p>
                    
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4 text-xs text-gray-500">
                      <span>{course.unitCount} Units</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>~15 Mins</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )))}
          </div>
        </section>
      </div>
    </main>
  );
}
