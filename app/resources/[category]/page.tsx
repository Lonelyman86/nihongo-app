'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { courses } from '@/data/content';

import { useParams } from 'next/navigation';

export default function ResourcePage() {
  const params = useParams();
  const category = params.category as string;

  // Timer State
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // 2 hours in seconds
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(2 * 60 * 60);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };



  // Determine Category Filter
  const categoryMap: Record<string, string> = {
      'bunpou': 'grammar',
      'kanji': 'kanji',
      'vocab': 'vocabulary',
      'goi': 'vocabulary',
      'choukai': 'listening',
      'dokkai': 'reading',
      'practice': 'all'
  };

  const categoryTitles: Record<string, string> = {
      'bunpou': 'Bunpou (Grammar)',
      'kanji': 'Kanji',
      'vocab': 'Goi (Vocabulary)',
      'goi': 'Goi (Vocabulary)',
      'choukai': 'Choukai (Listening)',
      'dokkai': 'Dokkai (Reading)',
      'practice': 'JLPT Practice'
  };

  const currentKind = categoryMap[category] || 'unknown';
  const displayTitle = categoryTitles[category] || 'Basic Japan';
  const n5Course = courses.find(c => c.level === 'N5');

  // Transform Data
  const scheduleData = n5Course?.chapters.flatMap(chapter => {
      // Filter content for this chapter
      const relevantContent = chapter.content.filter(item => {
          if (currentKind === 'all') return true;
          return item.kind === currentKind;
      });

      if (relevantContent.length === 0) return [];

      // Group/Format for Display
      const materiList = relevantContent.map(item => {
          if (item.kind === 'grammar') return `${item.japanese} (${item.english})`;
          if (item.kind === 'kanji') return `${item.japanese} : ${item.english.split('|')[0]}`;
          return `${item.japanese} (${item.romaji}) - ${item.english}`;
      }).slice(0, 10); // Limit to 10 items per day to keep table clean

      if (relevantContent.length > 10) materiList.push(`... ${relevantContent.length - 10} more items`);

      return [{
          id: chapter.id,
          courseId: n5Course.id,
          name: chapter.title, // e.g., "Hari 1: Perkenalan"
          materi: materiList,
          link: `Start Lesson`,
          youtube: [] as string[], // Explicitly type as string array
          latihan: "Practice Quiz"
      }];
  }) || [];

  return (
    <div className="min-h-screen bg-[#191919] text-[#d4d4d4] font-sans selection:bg-[#2383e2] selection:text-white pb-20">

      {/* Navbar Placeholder / Back Button */}
      <Link href="/" className="p-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer w-fit">
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
      </Link>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-8">

        {/* BANNER / ICON */}
        <div className="mb-8">
            <div className="text-6xl mb-4">
                <img src="/nav_kanji.png" className="w-24 h-24 object-cover rounded-md" alt="icon" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 capitalize">
                {displayTitle}
            </h1>

            {/* CALLOUT */}
            <div className="bg-[#252525] border-l-4 border-red-500 p-4 rounded-r-md flex items-start gap-4">
                <span className="text-red-500 font-bold text-xl">!!</span>
                <p className="text-gray-300 italic font-serif text-lg">
                    七転び八起き (nana korobi ya oki) – Jatuh tujuh kali, bangun delapan kali.
                </p>
            </div>
        </div>

        {/* PLAYLIST SECTION */}
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">playlist</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#202020] p-6 rounded-lg">
                {/* Youtube Embed */}
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/jfKfPfyJRdk"
                        title="Lofi Girl"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Study Timer */}
                <div className="bg-[#4ade80] rounded-lg p-8 flex flex-col items-center justify-center text-[#1a2e1a] shadow-lg relative overflow-hidden group">
                     {/* Decorative Blob */}
                     <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-all"></div>

                     <div className="text-center z-10">
                        <div className="text-6xl font-mono font-bold mb-2 tracking-widest">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="font-bold opacity-70 uppercase tracking-widest mb-8">Study Time</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={toggleTimer}
                                className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all active:scale-95"
                            >
                                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all active:scale-95"
                            >
                                <RotateCcw size={32} />
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        {/* SCHEDULE SECTION */}
        <div>
            <div className="flex items-center gap-3 mb-6">
                 <h2 className="text-3xl font-bold">Schedule</h2>
            </div>

            <div className="border border-gray-800 rounded-md overflow-hidden bg-[#191919]">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-[#252525] text-gray-400 text-sm font-medium py-3 px-4 border-b border-gray-800 gap-4">
                    <div className="col-span-2">Aa Name</div>
                    <div className="col-span-4">= Materi</div>
                    <div className="col-span-2">📎 Link Materi</div>
                    <div className="col-span-2">🎥 Youtube</div>
                    <div className="col-span-2">📎 Latihan</div>
                </div>

                {/* Table Rows */}
                {scheduleData.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-sm py-4 px-4 border-b border-gray-800 hover:bg-[#202020] transition-colors gap-4 items-start">
                        {/* Name */}
                        <div className="col-span-2 font-bold text-gray-200 flex items-center gap-2">
                            <span className="text-gray-500">📄</span> {row.name}
                        </div>

                        {/* Materi */}
                        <div className="col-span-4 text-gray-300 space-y-1">
                            {Array.isArray(row.materi) ? row.materi.map((m, i) => (
                                <div key={i}>{m}</div>
                            )) : row.materi}
                        </div>

                        {/* Link Materi */}
                        <div className="col-span-2">
                             <Link
                                href={`/resources/preview/${row.id}`}
                                className="bg-[#2d2d2d] px-2 py-1 rounded text-xs text-blue-400 underline cursor-pointer hover:text-blue-300"
                             >
                                {row.link}
                             </Link>
                        </div>

                        {/* Youtube */}
                        <div className="col-span-2">
                             {Array.isArray(row.youtube) ? (
                                 <div className="flex flex-wrap gap-1">
                                      {row.youtube.map((y, i) => (
                                          <a href="#" key={i} className="bg-[#2d2d2d] px-2 py-1 rounded text-xs text-red-400 cursor-pointer hover:text-red-300">
                                              ▶ {y}
                                          </a>
                                      ))}
                                 </div>
                             ) : (
                                <a href="#" className="bg-[#2d2d2d] px-2 py-1 rounded text-xs text-red-400 cursor-pointer text-ellipsis overflow-hidden block hover:text-red-300">
                                   ▶ {row.youtube}
                                </a>
                             )}
                        </div>

                        {/* Latihan */}
                        <div className="col-span-2">
                            {row.latihan && (
                                <Link
                                    href={`/lesson/${row.courseId}?chapterId=${row.id}&mode=quiz`}
                                    className="bg-[#2d2d2d] px-2 py-1 rounded text-xs text-green-400 cursor-pointer hover:text-green-300"
                                >
                                    {row.latihan}
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
