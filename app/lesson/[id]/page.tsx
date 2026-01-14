'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { courses, Chapter } from '@/data/content';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, BookOpen, Brain, List, Volume2, Lightbulb, Speech } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/lib/useProgress';
import confetti from 'canvas-confetti';

export default function LessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const course = courses.find((c) => c.id === lessonId);

  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');

  // Deep Link Handling
  useEffect(() => {
    const chapterId = searchParams.get('chapterId');
    if (chapterId && course) {
       const found = course.chapters.find(c => c.id === chapterId);
       if (found) setActiveChapter(found);
    }
  }, [searchParams, course]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link href="/" className="text-[var(--primary)] hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  // --- Chapter Selection View ---
  if (!activeChapter) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-12">
            <Link href="/" className="p-3 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-500 text-sm mt-1">{course.description}</p>
            </div>
          </header>

          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 border-b border-gray-200 pb-2">
            <List className="w-5 h-5 text-[var(--primary)]" />
            Pilih Materi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setActiveChapter(chapter);
                  setActiveTab('learn');
                }}
                className="bg-white border border-gray-100 p-6 rounded-xl cursor-pointer hover:border-[var(--primary)]/30 hover:shadow-md transition-all group paper-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors text-gray-800">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2 font-mono uppercase tracking-wide">
                      {chapter.content.length} Item
                    </p>
                    <p className="text-sm text-gray-500 leading-snug">
                       {chapter.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[var(--primary)] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Active Chapter View (Learn / Quiz) ---
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
               setActiveChapter(null);
               router.push(`/lesson/${lessonId}`); // Clear URL param
            }}
            className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 hover:shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
             <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-gray-400">{course.title} /</h1>
                <h2 className="text-xl font-bold text-gray-900">{activeChapter.title}</h2>
             </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1.5 mb-8 w-fit mx-auto md:mx-0 shadow-inner">
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-md transition-all font-medium text-sm",
              activeTab === 'learn' ? "bg-white text-[var(--primary)] shadow-sm font-bold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Belajar
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-md transition-all font-medium text-sm",
              activeTab === 'quiz' ? "bg-white text-[var(--accent)] shadow-sm font-bold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            )}
          >
            <Brain className="w-4 h-4" />
            Latihan
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'learn' ? (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              {['vocabulary', 'kanji', 'grammar'].map((type) => {
                const items = activeChapter.content.filter((i) => (i.kind || 'vocabulary') === type);
                if (items.length === 0) return null;

                return (
                  <div key={type}>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                        {type === 'vocabulary' && <><BookOpen className="w-4 h-4" /> KOTOBA (Kosakata)</>}
                        {type === 'kanji' && <><Brain className="w-4 h-4" /> KANJI</>}
                        {type === 'grammar' && <><List className="w-4 h-4" /> BUNPOU (Tata Bahasa)</>}
                     </h3>
                     <div className="grid gap-4">
                        {items.map((item, idx) => (
                          <div key={`${type}-${idx}`} className="paper-card bg-white p-6 rounded-xl transition-all group relative border border-gray-100">
                            <div className="flex items-start justify-between">
                                <div>
                                  {type === 'kanji' ? (
                                     <div className="flex items-end gap-3 mb-2">
                                       <span className="text-5xl font-black text-gray-800">{item.japanese}</span>
                                       <div className="flex flex-col text-xs text-gray-500 font-mono mb-1">
                                          {item.romaji.split('\n').map((line, i) => <span key={i}>{line}</span>)}
                                       </div>
                                     </div>
                                  ) : (
                                     <div className="mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className={`font-bold text-gray-900 ${type === 'grammar' ? 'text-2xl' : 'text-3xl'}`}>
                                          {item.japanese}
                                        </div>
                                        <button
                                          onClick={() => {
                                            const u = new SpeechSynthesisUtterance(item.japanese);
                                            u.lang = 'ja-JP';
                                            window.speechSynthesis.speak(u);
                                          }}
                                          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-[var(--primary)] opacity-0 group-hover:opacity-100"
                                          title="Shadowing (Play Audio)"
                                        >
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <div className="text-sm text-gray-500 font-mono">{item.romaji}</div>
                                     </div>
                                  )}
                                </div>

                                <div className="text-base font-medium text-gray-700 text-right max-w-[50%] pl-4 border-l border-gray-100 ml-4">
                                  {item.english.split('|').map((part, i) => (
                                    <p key={i} className={i === 0 ? "" : "text-gray-400 text-xs mt-1"}>{part.trim()}</p>
                                  ))}
                                </div>
                            </div>

                            {/* Sensei's Notes Section (Washi Tape style) */}
                            {(item.mnemonic || item.context || item.kind === 'grammar') && (
                              <div className="mt-6 pt-4 border-t border-dashed border-gray-200">
                                {item.context && (
                                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-2">
                                    <p className="text-[10px] font-bold text-blue-500 mb-1 flex items-center gap-1 uppercase tracking-wider">
                                      <Speech className="w-3 h-3" /> Context
                                    </p>
                                    <p className="text-base text-gray-800 font-medium">{item.context.japanese}</p>
                                    <p className="text-xs text-gray-500">{item.context.english}</p>
                                  </div>
                                )}

                                {item.mnemonic && item.kind !== 'grammar' && (
                                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                                    <p className="text-[10px] font-bold text-amber-600 mb-1 flex items-center gap-1 uppercase tracking-wider">
                                      <Lightbulb className="w-3 h-3" /> Memory Hint
                                    </p>
                                    <p className="text-sm text-gray-700 italic">"{item.mnemonic}"</p>
                                  </div>
                                )}

                                {item.kind === 'grammar' && (
                                  <div className="space-y-2">
                                     {item.grammarStructure && (
                                       <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                                          <p className="text-[10px] font-bold text-purple-600 mb-1 flex items-center gap-1 uppercase tracking-wider">
                                            <List className="w-3 h-3" /> Structure
                                          </p>
                                          <p className="text-base text-gray-800 font-mono bg-white/50 px-2 py-1 rounded inline-block">{item.grammarStructure}</p>
                                       </div>
                                     )}
                                     {item.grammarExplanation && (
                                        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                          <p className="text-[10px] font-bold text-gray-400 mb-1 flex items-center gap-1 uppercase tracking-wider">
                                            <Brain className="w-3 h-3" /> Explanation
                                          </p>
                                          <p className="text-sm text-gray-600 leading-relaxed">{item.grammarExplanation}</p>
                                       </div>
                                     )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                     </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <QuizSection chapter={activeChapter} onComplete={() => setActiveChapter(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuizSection({ chapter, onComplete }: { chapter: Chapter, onComplete: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { completeUnit } = useProgress();

  const question = chapter.quiz[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption) return; // Prevent changing answer
    setSelectedOption(option);
    const correct = option === question.answer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < chapter.quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setCompleted(true);
      // Save Progress
      completeUnit(chapter.id);
      // Trigger Confetti
      confetti({
          colors: ['#ef4444', '#1e3a8a', '#ffffff'], // Japanese flag + Indigo colors
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
      });
    }
  };

  if (completed) {
    return (
      <motion.div
        key="completed"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xl paper-card"
      >
        <div className="text-6xl mb-6">💮</div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Unit Completed</h2>
        <p className="text-xl text-gray-500 mb-8">
          You scored <span className="text-[var(--accent)] font-bold">{score}</span> / {chapter.quiz.length}
        </p>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:bg-lime-700 transition-colors shadow-lg shadow-lime-200"
        >
          Return to Units
        </button>
      </motion.div>
    );
  }

  // --- REORDER (DUOLINGO STYLE) ---
  if (question.type === 'reorder') {
     return (
        <ReorderQuestion
           key={question.id}
           question={question}
           onResult={(correct) => {
              setIsCorrect(correct);
              if (correct) setScore(s => s + 1);
           }}
           onNext={nextQuestion}
           isLast={currentQuestionIndex === chapter.quiz.length - 1}
        />
     );
  }

  // --- MULTIPLE CHOICE ---
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="mb-8 p-6 rounded-xl bg-white border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/10 rounded-bl-full -mr-8 -mt-8 opacity-50" />
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-4 tracking-widest uppercase">
          <span>Question {currentQuestionIndex + 1} / {chapter.quiz.length}</span>
          <span>Score: {score}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2 relative z-10">{question.question}</h3>
      </div>

      <div className="grid gap-3">
        {question.options?.map((option: string) => {
          const isSelected = selectedOption === option;
          const isAnswer = option === question.answer;

          let style = "bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm";
          if (selectedOption) {
             if (isSelected && isCorrect) style = "bg-white border-[var(--primary)] text-[var(--primary)] font-bold shadow-lime-100 ring-2 ring-[var(--primary)]/20";
             else if (isSelected && !isCorrect) style = "bg-white border-[var(--accent)] text-[var(--accent)] font-bold shadow-rose-100 ring-2 ring-[var(--accent)]/20";
             else if (isAnswer && !isSelected) style = "bg-lime-50 border-[var(--primary)] text-[var(--primary)] opacity-70";
             else style = "opacity-40 bg-gray-50 border-transparent";
          }

          return (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption}
              className={`p-5 rounded-xl border-2 text-left transition-all ${style} font-medium text-lg`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-end"
        >
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
          >
            {currentQuestionIndex === chapter.quiz.length - 1 ? 'Finish' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function ReorderQuestion({ question, onResult, onNext, isLast }: {
    question: any,
    onResult: (correct: boolean) => void,
    onNext: () => void,
    isLast: boolean
}) {
   const [selectedChunks, setSelectedChunks] = useState<string[]>([]);
   const [availableChunks, setAvailableChunks] = useState<string[]>(question.chunks || []);
   const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

   const handleSelect = (chunk: string, index: number) => {
      if (status !== 'idle') return;
      const newAvailable = [...availableChunks];
      newAvailable.splice(index, 1);
      setAvailableChunks(newAvailable);
      setSelectedChunks([...selectedChunks, chunk]);
   };

   const handleDeselect = (chunk: string, index: number) => {
      if (status !== 'idle') return;
      const newSelected = [...selectedChunks];
      newSelected.splice(index, 1);
      setSelectedChunks(newSelected);
      setAvailableChunks([...availableChunks, chunk]);
   };

   const checkAnswer = () => {
      const userAnswer = selectedChunks.join('');
      // Clean punctuation
      const clean = (str: string) => str.replace(/[\s\u3000\u3001\u3002\.\!\?]/g, '');
      const correct = clean(userAnswer) === clean(question.answer);
      setStatus(correct ? 'correct' : 'wrong');
      onResult(correct);
   };

   return (
      <div className="max-w-xl mx-auto">
         <div className="mb-8 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Translate this sentence</h3>
            <p className="text-xl font-bold text-gray-800 font-serif leading-relaxed">{question.question.replace('Translate: ', '').replace(/"/g, '')}</p>
         </div>

         {/* Answer Area */}
         <div className="min-h-[80px] border-b-2 border-dashed border-gray-200 mb-8 flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-t-xl">
            {selectedChunks.length === 0 && (
                <div className="w-full text-center text-gray-300 italic py-2">Tap words below...</div>
            )}
            {selectedChunks.map((chunk, idx) => (
               <button
                  key={`${chunk}-${idx}`}
                  onClick={() => handleDeselect(chunk, idx)}
                  className="px-4 py-2 bg-white text-[var(--primary)] border-2 border-[var(--primary)] rounded-lg font-bold shadow-sm hover:bg-rose-50 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
               >
                  {chunk}
               </button>
            ))}
         </div>

         {/* Word Bank */}
         <div className="flex flex-wrap gap-3 justify-center mb-10">
            {availableChunks.map((chunk, idx) => (
               <button
                  key={`${chunk}-${idx}`}
                  onClick={() => handleSelect(chunk, idx)}
                  className="px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-1 transition-all shadow-sm"
               >
                  {chunk}
               </button>
            ))}
         </div>

         {/* Controls */}
         <div className="flex justify-end">
            {status === 'idle' ? (
                <button
                   onClick={checkAnswer}
                   disabled={selectedChunks.length === 0}
                   className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-700 transition-transform shadow-lg shadow-lime-100"
                >
                   Check Answer
                </button>
            ) : (
                <div className={`flex items-center gap-4 w-full justify-between p-4 rounded-xl border ${status === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                   <div className={`font-bold text-lg flex items-center gap-2 ${status === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                      {status === 'correct' ? <><Check className="w-6 h-6"/> Correct!</> : <><X className="w-6 h-6"/> Solution: {question.answer}</>}
                   </div>
                   <button
                      onClick={onNext}
                      className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 shadow-sm ${status === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                   >
                      {isLast ? 'Finish' : 'Next'} <ArrowRight className="w-4 h-4"/>
                   </button>
                </div>
            )}
         </div>
      </div>
   );
}
