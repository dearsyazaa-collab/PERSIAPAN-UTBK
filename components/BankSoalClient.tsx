"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, CheckCircle, XCircle, 
  Trophy, Home, BookOpen, 
  Type, Minus, Plus 
} from "lucide-react";
import clsx from "clsx";
import { submitQuizResult } from '@/app/actions/submit-quiz'; 
import { useRouter } from 'next/navigation';

// --- TIPE DATA ---
type Option = {
  code: string;
  text: string;
};

type Question = {
  id: string;
  content: string;
  options: Option[];
  correct_answer: string;
  explanation: string;
};

// PERBAIKAN: Menambahkan tryoutId ke interface
interface BankSoalClientProps {
  questions: Question[];
  title: string;
  categorySlug: string;
  tryoutId: string;
}

export default function BankSoalClient({
  questions,
  title,
  categorySlug,
  tryoutId, 
}: BankSoalClientProps) {
  
  // --- STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();
  
  // STATE: Ukuran Font (default: 'base')
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // --- DATA TURUNAN ---
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  // --- LOGIC ---
  const handleSelectOption = (code: string) => {
    if (isChecked) return;
    setSelectedOption(code);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
    setIsChecked(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correct_answer) correct++;
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  // PERBAIKAN: Fungsi Simpan ke Database
  const handleFinishAndSave = async () => {
    setIsSaving(true);

    try {
      // 1. Hitung ulang statistik
      const correctCount = questions.reduce((acc, q) => {
        return acc + (userAnswers[q.id] === q.correct_answer ? 1 : 0);
      }, 0);
      
      const wrongCount = totalQuestions - correctCount;
      const score = Math.round((correctCount / totalQuestions) * 100);

      // 2. Panggil Server Action
      const result = await submitQuizResult({
        tryout_id: tryoutId,
        score: score,
        total_correct: correctCount,
        total_wrong: wrongCount
      });

      if (result.error) {
        alert(result.error);
        setIsSaving(false);
      } else {
        alert('Nilai berhasil disimpan!');
        // Redirect ke halaman kategori setelah simpan
        router.push(`/bank-soal/${categorySlug}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan.');
      setIsSaving(false);
    }
  };

  // Helper untuk kelas Font Size dinamis
  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'sm': return "text-sm";
      case 'lg': return "text-lg";
      default: return "text-base";
    }
  };

  // --- TAMPILAN 1: HASIL SKOR ---
  if (showResult) {
    const score = calculateScore();
    const correctCount = questions.filter(q => userAnswers[q.id] === q.correct_answer).length;

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden text-center p-8 animate-in zoom-in-95 duration-300 max-w-2xl mx-auto mt-4">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-full mb-4 shadow-sm">
          <Trophy size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-1">Latihan Selesai!</h2>
        <p className="text-slate-500 mb-6 text-sm">Paket: <strong>{title}</strong></p>

        <div className="mb-8">
          <span className="text-6xl font-black text-indigo-600 tracking-tighter">{score}</span>
          <div className="text-xs font-bold text-slate-400 mt-1 uppercase">Skor Kamu</div>
        </div>

        <div className="flex justify-center gap-3 mb-8 text-sm">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 text-emerald-700">
            <CheckCircle size={16} /> <b>{correctCount}</b> Benar
          </div>
          <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100 text-rose-700">
            <XCircle size={16} /> <b>{totalQuestions - correctCount}</b> Salah
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* TOMBOL SIMPAN HASIL */}
          <button
            onClick={handleFinishAndSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan & Keluar'}
          </button>
          
          <Link 
            href={`/bank-soal/${categorySlug}`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm transition"
          >
             <Home size={16} /> Tanpa Simpan
          </Link>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: MODE PENGERJAAN ---
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[85vh] md:h-[600px] w-full max-w-5xl mx-auto relative">
      
      {/* HEADER: Judul & Kontrol Font */}
      <div className="flex-none p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex justify-between items-center z-10">
         <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{title}</h2>
            <span className="text-xs text-slate-500 font-medium">
              Soal {currentIndex + 1} / {totalQuestions}
            </span>
         </div>

         {/* KONTROL FONT */}
         <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
            <button 
              onClick={() => setFontSize('sm')}
              className={`p-1.5 rounded hover:bg-slate-100 transition ${fontSize === 'sm' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
              title="Kecil"
            >
              <Minus size={14} />
            </button>
            <div className="px-2 text-xs font-bold text-slate-500 flex items-center gap-1 border-l border-r border-slate-100 mx-1">
               <Type size={12} />
               {fontSize === 'sm' ? 'S' : fontSize === 'lg' ? 'L' : 'M'}
            </div>
            <button 
              onClick={() => setFontSize('lg')}
              className={`p-1.5 rounded hover:bg-slate-100 transition ${fontSize === 'lg' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
              title="Besar"
            >
              <Plus size={14} />
            </button>
         </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="flex-none w-full bg-slate-100 h-1">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* BODY: Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 scroll-smooth">
        {/* Teks Soal */}
        <div className={`prose prose-slate max-w-none mb-6 text-slate-800 leading-relaxed ${getTextSizeClass()}`}>
           <p className="whitespace-pre-line">{currentQuestion.content}</p>
        </div>

        {/* Pilihan Jawaban */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            let style = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer";
            let badgeStyle = "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600";
            
            if (selectedOption === opt.code) {
               style = "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";
               badgeStyle = "bg-indigo-600 text-white";
            }
            if (isChecked) {
               if (opt.code === currentQuestion.correct_answer) {
                  style = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500";
                  badgeStyle = "bg-emerald-500 text-white";
               } else if (selectedOption === opt.code && opt.code !== currentQuestion.correct_answer) {
                  style = "border-rose-500 bg-rose-50 ring-1 ring-rose-500";
                  badgeStyle = "bg-rose-500 text-white";
               } else {
                  style = "border-slate-100 opacity-50 cursor-not-allowed";
               }
            }

            return (
              <div
                key={opt.code}
                onClick={() => handleSelectOption(opt.code)}
                className={`group w-full text-left p-3 md:p-4 rounded-xl border-2 transition-all flex items-start gap-3 md:gap-4 relative ${style}`}
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors flex-shrink-0 mt-0.5 ${badgeStyle}`}>
                  {opt.code}
                </span>
                <span className={`font-medium text-slate-700 leading-snug ${getTextSizeClass()}`}>
                  {opt.text}
                </span>
                
                {isChecked && opt.code === currentQuestion.correct_answer && (
                  <CheckCircle className="absolute right-3 top-3 text-emerald-600" size={18} />
                )}
                {isChecked && selectedOption === opt.code && opt.code !== currentQuestion.correct_answer && (
                  <XCircle className="absolute right-3 top-3 text-rose-500" size={18} />
                )}
              </div>
            );
          })}
        </div>

        {/* PEMBAHASAN */}
        {isChecked && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm border-b border-blue-200 pb-2">
                  <BookOpen size={16} /> Pembahasan
                </div>
                <div className={`text-slate-700 leading-relaxed whitespace-pre-line ${getTextSizeClass()}`}>
                  {currentQuestion.explanation || "Pembahasan tidak tersedia."}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* FOOTER: Fixed at Bottom */}
      <div className="flex-none p-4 border-t border-slate-100 bg-white z-20 flex justify-between items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {!isChecked ? (
           <button
             onClick={handleCheckAnswer}
             disabled={!selectedOption} 
             className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-100 disabled:shadow-none text-sm"
           >
             Cek Jawaban
           </button>
        ) : (
           <div className="flex-1 md:flex-none hidden md:block text-slate-400 text-xs font-bold">
              Jawaban dikunci
           </div>
        )}

        <button
          onClick={handleNext}
          disabled={!isChecked} 
          className={clsx(
             "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm",
             isLastQuestion 
               ? "bg-slate-900 text-white hover:bg-black shadow-md" 
               : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100"
          )}
        >
          {isLastQuestion ? "Selesai" : "Lanjut"} 
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
}