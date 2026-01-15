'use client';

import { useParams, useRouter } from 'next/navigation';
import { courses, Chapter } from '@/data/content';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@/lib/useProgress';
import confetti from 'canvas-confetti';

export default function DarkQuizPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  // Find Chapter
  // We assume N5 for the roadmap context
  const n5Course = courses.find(c => c.level === 'N5');
  const chapter = n5Course?.chapters.find(ch => ch.id === chapterId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { completeUnit } = useProgress();

  if (!chapter) {
      return (
        <div className="min-h-screen bg-[#191919] text-[#d4d4d4] flex items-center justify-center">
            <h1>Chapter not found</h1>
        </div>
      );
  }

  const question = chapter.quiz[currentQuestionIndex];

  const handleOptionClick = (option: string) => {
    if (selectedOption) return;
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
      completeUnit(chapter.id);
      confetti({
          colors: ['#4ade80', '#ffffff'],
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
      });
    }
  };

  if (completed) {
      return (
        <div className="min-h-screen bg-[#191919] text-[#d4d4d4] flex items-center justify-center font-sans">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8 bg-[#202020] rounded-2xl border border-gray-800 max-w-md w-full"
            >
                <div className="text-6xl mb-6">💮</div>
                <h2 className="text-3xl font-bold mb-2 text-white">Lesson Complete!</h2>
                <p className="text-gray-400 mb-8">
                    You scored <span className="text-green-400 font-bold text-xl">{score}</span> / {chapter.quiz.length}
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/resources/preview/' + chapter.id)}
                        className="w-full py-3 bg-[#2d2d2d] hover:bg-[#333] text-white rounded-lg font-bold transition-colors"
                    >
                        Review Material
                    </button>
                    <Link
                        href="/" // In future, maybe point to Resource List?
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-[#1a2e1a] rounded-lg font-bold transition-colors"
                    >
                        Back to Roadmap
                    </Link>
                </div>
            </motion.div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#191919] text-[#d4d4d4] font-sans">
        {/* Header */}
        <div className="p-6 flex items-center justify-between max-w-2xl mx-auto">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-white transition-colors">
                <ArrowLeft />
            </button>
            <div className="text-sm font-bold text-gray-500 tracking-widest uppercase">
                Question {currentQuestionIndex + 1} / {chapter.quiz.length}
            </div>
            <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Question Area */}
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-24">
             <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    {/* Question Card */}
                    <div className="bg-[#202020] p-8 rounded-2xl border border-gray-800 mb-8 shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-10 -mt-10"></div>
                         <h2 className="text-2xl md:text-3xl font-bold text-white relative z-10 leading-relaxed">
                            {question.type === 'reorder' ?
                                question.question.replace('Translate: ', '').replace(/"/g, '')
                                : question.question
                            }
                         </h2>
                         {question.type === 'reorder' && (
                             <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-bold">Translate this sentence</p>
                         )}
                    </div>

                    {/* Options / Interaction */}
                    {question.type === 'reorder' ? (
                        <ReorderQuestionDark
                            question={question}
                            onResult={(correct) => {
                                setIsCorrect(correct);
                                if (correct) setScore(s => s + 1);
                            }}
                            onNext={nextQuestion}
                            isLast={currentQuestionIndex === chapter.quiz.length - 1}
                        />
                    ) : (
                        <div className="grid gap-4">
                            {question.options?.map((option) => {
                                const isSelected = selectedOption === option;
                                const isAnswer = option === question.answer;

                                let style = "bg-[#252525] border-gray-800 hover:bg-[#2a2a2a] text-gray-300"; // Default
                                if (selectedOption) {
                                    if (isSelected && isCorrect) style = "bg-green-500/20 border-green-500 text-green-400 font-bold";
                                    else if (isSelected && !isCorrect) style = "bg-red-500/20 border-red-500 text-red-400 font-bold";
                                    else if (isAnswer && !isSelected) style = "bg-green-500/10 border-green-500/50 text-green-400 opacity-70";
                                    else style = "opacity-30 bg-[#202020] border-transparent";
                                }

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={!!selectedOption}
                                        className={`p-6 rounded-xl border-2 text-left transition-all ${style} text-lg font-medium`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                </motion.div>
             </AnimatePresence>

             {/* Next Button (For Multiple Choice) */}
             {selectedOption && question.type === 'multiple-choice' && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-0 left-0 right-0 p-6 bg-[#191919] border-t border-gray-800"
                >
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                         <div className={`text-lg font-bold flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? <><Check /> Correct!</> : <><X /> Answer: {question.answer}</>}
                         </div>
                         <button
                            onClick={nextQuestion}
                            className={`px-8 py-3 rounded-full font-bold text-[#1a2e1a] flex items-center gap-2 ${isCorrect ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                        >
                            {currentQuestionIndex === chapter.quiz.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
                        </button>
                    </div>
                 </motion.div>
             )}
        </div>
    </div>
  );
}


// --- Reorder Component (Dark Mode) ---
function ReorderQuestionDark({ question, onResult, onNext, isLast }: {
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
      const clean = (str: string) => str.replace(/[\s\u3000\u3001\u3002\.\!\?]/g, '');
      const correct = clean(userAnswer) === clean(question.answer);
      setStatus(correct ? 'correct' : 'wrong');
      onResult(correct);
   };

   return (
      <div>
         {/* Answer Area */}
         <div className="min-h-[100px] border-b-2 border-dashed border-gray-800 mb-8 flex flex-wrap gap-2 p-4 bg-[#202020] rounded-lg items-center">
            {selectedChunks.length === 0 && (
                <div className="w-full text-center text-gray-600 italic">Tap words below...</div>
            )}
            {selectedChunks.map((chunk, idx) => (
               <button
                  key={`${chunk}-${idx}`}
                  onClick={() => handleDeselect(chunk, idx)}
                  className="px-4 py-2 bg-[#2d2d2d] text-green-400 border border-green-500/30 rounded-lg font-bold hover:bg-red-500/20 hover:text-red-400 transition-colors"
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
                  className="px-4 py-3 bg-[#252525] text-gray-300 border border-gray-700 rounded-lg font-bold hover:bg-[#303030] hover:-translate-y-1 transition-all shadow-sm"
               >
                  {chunk}
               </button>
            ))}
         </div>

         {/* Fixed Footer for Reorder */}
         <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#191919] border-t border-gray-800">
             <div className="max-w-2xl mx-auto flex justify-end w-full">
                {status === 'idle' ? (
                    <button
                       onClick={checkAnswer}
                       disabled={selectedChunks.length === 0}
                       className="px-8 py-3 bg-green-600 text-[#1a2e1a] font-bold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-500 transition-colors w-full md:w-auto"
                    >
                       Check Answer
                    </button>
                ) : (
                    <div className="flex items-center justify-between w-full">
                         <div className={`font-bold text-lg flex items-center gap-2 ${status === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                           {status === 'correct' ? <><Check /> Correct!</> : <><X /> Solution: {question.answer}</>}
                        </div>
                        <button
                           onClick={onNext}
                           className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 ${status === 'correct' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                        >
                           {isLast ? 'Finish' : 'Next'} <ArrowRight size={20}/>
                        </button>
                    </div>
                )}
             </div>
         </div>
      </div>
   );
}
