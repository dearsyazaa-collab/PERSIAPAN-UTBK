"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle, Home, RotateCcw, Trophy, ArrowRight } from "lucide-react";
import clsx from "clsx";

type Question = {
  id: string;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  discussion?: string;
};

export default function BankSoalClient({
  questions,
  title,
  categorySlug,
}: {
  questions: Question[];
  title: string;
  categorySlug: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false); // State untuk layar hasil

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Hitung Nilai
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) correct++;
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleAnswer = (key: string) => {
    if (showResult) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }));
  };

  // --- TAMPILAN 1: HASIL AKHIR (RESULT SCREEN) ---
  if (showResult) {
    const score = calculateScore();
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Trophy size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Latihan Selesai!</h2>
          <p className="text-slate-500 mb-8">Berikut adalah hasil pencapaianmu.</p>
          
          <div className="relative inline-block mb-2">
            <span className="text-7xl font-black text-indigo-600 tracking-tighter">{score}</span>
            <span className="absolute -top-2 -right-6 text-2xl text-slate-400 font-bold">%</span>
          </div>
          
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10 border-t border-slate-100 pt-4 mt-4">
             Skor Akhir
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => {
                setShowResult(false);
                setCurrentIndex(0);
                setUserAnswers({});
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
            >
              <RotateCcw size={20} /> Ulangi
            </button>
            
            <Link 
              href={`/bank-soal/${categorySlug}`}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              <Home size={20} /> Menu Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: MODE PENGERJAAN (QUIZ MODE) ---
  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link href={`/bank-soal/${categorySlug}`} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 text-sm font-bold transition-colors">
          <ChevronLeft size={20} /> Keluar
        </Link>
        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-600">
          {currentIndex + 1} <span className="text-slate-400 mx-1">/</span> {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 min-h-[450px] flex flex-col relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>

        {/* Question Text */}
        <div className="flex-1 relative z-10">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed mb-10">
            {currentQuestion.question_text}
          </h1>

          {/* Options */}
          <div className="space-y-3">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = userAnswers[currentQuestion.id] === key;
              return (
                <div
                  key={key}
                  onClick={() => handleAnswer(key)}
                  className={clsx(
                    "cursor-pointer group p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-200 relative overflow-hidden",
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={clsx(
                      "w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-xl font-bold text-sm transition-all shadow-sm",
                      isSelected
                        ? "bg-indigo-600 text-white scale-110"
                        : "bg-white text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                    )}
                  >
                    {key}
                  </div>
                  <div className={clsx("text-base font-medium z-10", isSelected ? "text-indigo-900" : "text-slate-600")}>
                    {value}
                  </div>
                  
                  {isSelected && <CheckCircle className="ml-auto text-indigo-600 animate-in zoom-in spin-in-90 duration-300" size={24} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 relative z-10">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="text-slate-400 hover:text-slate-800 disabled:opacity-0 font-bold flex items-center gap-2 px-4 py-2 transition-all"
          >
            <ChevronLeft size={20} /> Sebelumnya
          </button>

          {/* LOGIC TOMBOL SELESAI DISINI */}
          {isLastQuestion ? (
             <button
             onClick={() => setShowResult(true)}
             className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
           >
             Selesai <CheckCircle size={18}/>
           </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
            >
              Lanjut <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}