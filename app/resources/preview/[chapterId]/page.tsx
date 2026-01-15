'use client';

import { useParams, useRouter } from 'next/navigation';
import { courses } from '@/data/content';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Brain, List, Play, Volume2 } from 'lucide-react';

export default function ChapterPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  // Find the chapter across all courses (assuming unique IDs for now or just searching N5)
  // Since we know we are in N5 context mostly, but better to search safely.
  const n5Course = courses.find(c => c.level === 'N5');
  const chapter = n5Course?.chapters.find(ch => ch.id === chapterId);

  if (!chapter || !n5Course) {
    return (
        <div className="min-h-screen bg-[#191919] text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Chapter Not Found</h1>
                <Link href="/" className="text-blue-400 hover:underline">Return Home</Link>
            </div>
        </div>
    );
  }

  // Group Content
  const vocab = chapter.content.filter(i => i.kind === 'vocabulary');
  const kanji = chapter.content.filter(i => i.kind === 'kanji');
  const grammar = chapter.content.filter(i => i.kind === 'grammar');

  return (
    <div className="min-h-screen bg-[#191919] text-[#d4d4d4] font-sans pb-24">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-50 bg-[#191919]/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>
                <div className="font-bold text-white hidden md:block">
                    {chapter.title}
                </div>
                <Link
                    href={`/lesson/${n5Course.id}?chapterId=${chapter.id}`}
                    className="bg-[var(--primary)] text-[#1a2e1a] px-4 py-2 rounded-full font-bold text-sm hover:bg-lime-500 transition-colors flex items-center gap-2"
                >
                    <Play size={16} fill="currentColor" />
                    Start Practice
                </Link>
            </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 pt-12">
            {/* Header */}
            <div className="mb-12 text-center">
                <span className="inline-block px-3 py-1 bg-[#252525] rounded-full text-xs font-mono text-gray-400 mb-4 border border-gray-800">
                    UNIT PREVIEW
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {chapter.title}
                </h1>
                <p className="text-xl text-gray-500 font-serif italic">
                    {chapter.description}
                </p>
            </div>

            {/* Content Blocks */}
            <div className="space-y-16">

                {/* Vocabulary Section */}
                {vocab.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <BookOpen className="text-blue-400" />
                            <h2 className="text-2xl font-bold text-white">Vocabulary</h2>
                            <span className="text-sm text-gray-600 ml-auto bg-[#252525] px-2 py-1 rounded">{vocab.length} words</span>
                        </div>
                        <div className="grid gap-3">
                            {vocab.map((item, idx) => (
                                <div key={idx} className="bg-[#202020] p-4 rounded-lg border border-gray-800 flex items-center justify-between group hover:border-gray-700 transition-colors">
                                    <div>
                                        <div className="text-lg font-bold text-white mb-1">{item.japanese}</div>
                                        <div className="text-sm text-gray-500 font-mono">{item.romaji}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-300 font-medium">{item.english}</div>
                                        {item.context && (
                                            <div className="text-xs text-gray-600 mt-1 max-w-[200px] truncate">
                                                Ex: {item.context.japanese}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Kanji Section */}
                {kanji.length > 0 && (
                    <section>
                         <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <Brain className="text-red-400" />
                            <h2 className="text-2xl font-bold text-white">Kanji</h2>
                            <span className="text-sm text-gray-600 ml-auto bg-[#252525] px-2 py-1 rounded">{kanji.length} characters</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             {kanji.map((item, idx) => (
                                <div key={idx} className="bg-[#202020] p-6 rounded-lg border border-gray-800 flex flex-col items-center text-center hover:bg-[#252525] transition-colors">
                                    <div className="text-5xl font-black text-white mb-4">{item.japanese}</div>
                                    <div className="space-y-1 w-full">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Meaning</p>
                                        <p className="text-sm text-gray-300 font-medium border-b border-gray-700 pb-2 mb-2">{item.english.split('|')[1]?.trim() || item.english}</p>

                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-2">Readings</p>
                                        <p className="text-xs text-gray-400 font-mono">{item.romaji.replace('On: ', '')}</p>
                                        <p className="text-xs text-gray-400 font-mono">{item.english.split('|')[0]}</p>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </section>
                )}

                {/* Grammar Section */}
                {grammar.length > 0 && (
                     <section>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <List className="text-green-400" />
                            <h2 className="text-2xl font-bold text-white">Grammar</h2>
                             <span className="text-sm text-gray-600 ml-auto bg-[#252525] px-2 py-1 rounded">{grammar.length} points</span>
                        </div>
                        <div className="space-y-6">
                            {grammar.map((item, idx) => (
                                <div key={idx} className="bg-[#202020] rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="bg-[#252525] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white">{item.japanese}</h3>
                                        {item.grammarStructure && (
                                            <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-green-400 border border-green-900/50">
                                                {item.grammarStructure}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-300 leading-relaxed mb-4">
                                            {item.grammarExplanation || item.english}
                                        </p>
                                        {/* Example if any */}
                                        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2 text-[10px]">Usage Example</p>
                                            <p className="text-white text-lg mb-1">{item.context?.japanese || "例文がありません (No example)"}</p>
                                            <p className="text-gray-500 text-sm">{item.context?.english || ""}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </section>
                )}

            </div>

             {/* Footer Action */}
            <div className="mt-24 text-center">
                 <p className="text-gray-500 mb-6">Ready to test your knowledge?</p>
                 <Link
                    href={`/lesson/${n5Course.id}?chapterId=${chapter.id}`}
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10"
                >
                    <Play className="fill-black" />
                    Start Interactive Lesson
                </Link>
            </div>


        </div>
    </div>
  );
}
