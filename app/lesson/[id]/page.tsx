'use client';

import { useParams, useRouter } from 'next/navigation';
import { courses, Chapter } from '@/data/content';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, BookOpen, Brain, List, Volume2, Lightbulb, Speech } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const course = courses.find((c) => c.id === lessonId);

  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'quiz'>('learn');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link href="/" className="text-cyan-400 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  // --- Chapter Selection View ---
  if (!activeChapter) {
    return (
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-gray-400 text-sm">{course.description}</p>
            </div>
          </header>

          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <List className="w-5 h-5 text-cyan-400" />
            Select a Unit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setActiveChapter(chapter);
                  setActiveTab('learn');
                }}
                className="bg-white/5 border border-white/10 p-6 rounded-xl cursor-pointer hover:bg-white/10 hover:border-cyan-500/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-cyan-300 transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 font-mono">
                      {chapter.content.length} Items
                    </p>
                    <p className="text-sm text-gray-400 leading-snug">
                       {chapter.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setActiveChapter(null)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
             <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-gray-400">{course.title} /</h1>
                <h2 className="text-xl font-bold text-white">{activeChapter.title}</h2>
             </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-1 mb-8 w-fit mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('learn')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-md transition-all",
              activeTab === 'learn' ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"
            )}
          >
            <BookOpen className="w-4 h-4" />
            Learn
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-md transition-all",
              activeTab === 'quiz' ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-400 hover:text-white"
            )}
          >
            <Brain className="w-4 h-4" />
            Quiz
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'learn' ? (
            <motion.div
              key="learn"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {['vocabulary', 'kanji', 'grammar'].map((type) => {
                const items = activeChapter.content.filter((i) => (i.kind || 'vocabulary') === type);
                if (items.length === 0) return null;

                return (
                  <div key={type}>
                     <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        {type === 'vocabulary' && <BookOpen className="w-4 h-4" />}
                        {type === 'kanji' && <Brain className="w-4 h-4" />}
                        {type === 'grammar' && <List className="w-4 h-4" />}
                        {type}
                     </h3>
                     <div className="grid gap-4">
                        {items.map((item, idx) => (
                          <div key={`${type}-${idx}`} className="bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:bg-white/10 group relative">
                            <div className="flex items-start justify-between">
                                <div>
                                  {type === 'kanji' ? (
                                     <div className="flex items-end gap-3 mb-2">
                                       <span className="text-5xl font-black text-white group-hover:text-pink-400 transition-colors">{item.japanese}</span>
                                       <div className="flex flex-col text-xs text-gray-400 font-mono mb-1">
                                          {item.romaji.split('\n').map((line, i) => <span key={i}>{line}</span>)}
                                       </div>
                                     </div>
                                  ) : (
                                     <div className="mb-2">
                                      <div className="flex items-center gap-3">
                                        <div className={`font-bold text-white group-hover:text-cyan-400 transition-colors ${type === 'grammar' ? 'text-2xl' : 'text-3xl'}`}>
                                          {item.japanese}
                                        </div>
                                        <button 
                                          onClick={() => {
                                            const u = new SpeechSynthesisUtterance(item.japanese);
                                            u.lang = 'ja-JP';
                                            window.speechSynthesis.speak(u);
                                          }}
                                          className="p-2 rounded-full bg-white/5 hover:bg-white/20 transition-colors text-cyan-400 opacity-0 group-hover:opacity-100"
                                          title="Shadowing (Play Audio)"
                                        >
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <div className="text-sm text-gray-500 font-mono">{item.romaji}</div>
                                     </div>
                                  )}
                                </div>
                                
                                <div className="text-base font-medium text-cyan-100/90 text-right max-w-[50%] pl-4 border-l border-white/10 ml-4">
                                  {item.english.split('|').map((part, i) => (
                                    <p key={i} className={i === 0 ? "" : "text-gray-400 text-xs mt-1"}>{part.trim()}</p>
                                  ))}
                                </div>
                            </div>

                            {/* Sensei's Notes Section */}
                            {(item.mnemonic || item.context || item.kind === 'grammar') && (
                              <div className="mt-4 pt-4 border-t border-white/5">
                                {item.context && (
                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                    <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1">
                                      <Speech className="w-3 h-3" /> CONTEXT
                                    </p>
                                    <p className="text-base text-white font-medium">{item.context.japanese}</p>
                                    <p className="text-sm text-gray-400">{item.context.english}</p>
                                  </div>
                                )}
                                
                                {item.mnemonic && item.kind !== 'grammar' && (
                                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs font-bold text-yellow-400 mb-1 flex items-center gap-1">
                                      <Lightbulb className="w-3 h-3" /> MEMORY HINT
                                    </p>
                                    <p className="text-sm text-gray-300 italic">"{item.mnemonic}"</p>
                                  </div>
                                )}

                                {item.kind === 'grammar' && (
                                  <div className="space-y-2">
                                     {item.grammarStructure && (
                                       <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                          <p className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1">
                                            <List className="w-3 h-3" /> STRUCTURE
                                          </p>
                                          <p className="text-base text-white font-mono">{item.grammarStructure}</p>
                                       </div>
                                     )}
                                     {item.grammarExplanation && (
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                                          <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                                            <Brain className="w-3 h-3" /> EXPLANATION
                                          </p>
                                          <p className="text-sm text-gray-300">{item.grammarExplanation}</p>
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
    }
  };

  if (completed) {
    return (
      <motion.div
        key="completed"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold mb-4 text-white">Unit Completed!</h2>
        <p className="text-xl text-gray-300 mb-8">
          You scored <span className="text-green-400 font-bold">{score}</span> / {chapter.quiz.length}
        </p>
        <button 
          onClick={onComplete}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
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
      <div className="mb-8 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <div className="flex justify-between text-xs font-mono text-gray-500 mb-2">
          <span>QUESTION {currentQuestionIndex + 1} OF {chapter.quiz.length}</span>
          <span>SCORE: {score}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{question.question}</h3>
      </div>

      <div className="grid gap-3">
        {question.options?.map((option) => {
          const isSelected = selectedOption === option;
          const isAnswer = option === question.answer;
          
          let style = "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300";
          if (selectedOption) {
             if (isSelected && isCorrect) style = "bg-green-500/20 border-green-500 text-green-400";
             else if (isSelected && !isCorrect) style = "bg-red-500/20 border-red-500 text-red-400";
             else if (isAnswer && !isSelected) style = "bg-green-500/10 border-green-500/50 text-green-400/70"; 
             else style = "opacity-40";
          }

          return (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={!!selectedOption}
              className={`p-4 rounded-xl border text-left transition-all ${style} font-medium`}
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
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            {currentQuestionIndex === chapter.quiz.length - 1 ? 'Finish' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
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
      // Move from available to selected
      const newAvailable = [...availableChunks];
      newAvailable.splice(index, 1);
      setAvailableChunks(newAvailable);
      setSelectedChunks([...selectedChunks, chunk]);
   };

   const handleDeselect = (chunk: string, index: number) => {
      if (status !== 'idle') return;
      // Move from selected to available
      const newSelected = [...selectedChunks];
      newSelected.splice(index, 1);
      setSelectedChunks(newSelected);
      setAvailableChunks([...availableChunks, chunk]);
   };

   const checkAnswer = () => {
      const userAnswer = selectedChunks.join('');
      // Compare joined string with question.answer (whitespace insensitive)
      // Or compare against correctOrder joined if whitespace matters less
      const correct = userAnswer.replace(/\s+/g, '') === question.answer.replace(/\s+/g, '');
      setStatus(correct ? 'correct' : 'wrong');
      onResult(correct);
   };

   return (
      <div className="max-w-xl mx-auto">
         <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Translate this sentence</h3>
            <p className="text-2xl font-bold text-white">{question.question.replace('Translate: ', '').replace(/"/g, '')}</p>
         </div>

         {/* Answer Area */}
         <div className="min-h-[80px] border-b-2 border-white/20 mb-8 flex flex-wrap gap-2 p-2">
            {selectedChunks.map((chunk, idx) => (
               <button 
                  key={`${chunk}-${idx}`}
                  onClick={() => handleDeselect(chunk, idx)}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 rounded-lg font-bold hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-colors"
               >
                  {chunk}
               </button>
            ))}
         </div>

         {/* Word Bank */}
         <div className="flex flex-wrap gap-3 justify-center mb-8">
            {availableChunks.map((chunk, idx) => (
               <button 
                  key={`${chunk}-${idx}`}
                  onClick={() => handleSelect(chunk, idx)}
                  className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg font-bold hover:bg-white/20 hover:scale-105 transition-all shadow-sm"
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
                   className="px-8 py-3 bg-white text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                   Check
                </button>
            ) : (
                <div className="flex items-center gap-4 w-full justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                   <div className={`font-bold text-lg flex items-center gap-2 ${status === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                      {status === 'correct' ? <><Check className="w-6 h-6"/> Correct!</> : <><X className="w-6 h-6"/> Solution: {question.answer}</>}
                   </div>
                   <button 
                      onClick={onNext}
                      className={`px-6 py-2 rounded-lg font-bold text-black flex items-center gap-2 ${status === 'correct' ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'}`}
                   >
                      {isLast ? 'Finish' : 'Next'} <ArrowRight className="w-4 h-4"/>
                   </button>
                </div>
            )}
         </div>
      </div>
   );
}
