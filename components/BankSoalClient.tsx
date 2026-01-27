'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import QuestionCard from "./QuestionCard"
import { ChevronLeft, ChevronRight, Type } from "lucide-react"

// Definisi tipe data soal
type Question = {
  id: string
  question_text: string
  options: any
  correct_answer: string
  discussion?: string
  difficulty?: string
}

type Props = {
  questions: Question[]
  title: string
  categorySlug: string
}

export default function BankSoalClient({ questions, title, categorySlug }: Props) {
  // 1. State untuk navigasi soal
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 2. State untuk interaksi jawaban
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  
  // 3. State untuk ukuran font
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  const currentQuestion = questions[currentIndex]

  // Reset jawaban & status setiap kali pindah soal
  useEffect(() => {
    setSelectedOption(null)
    setStatus('idle')
  }, [currentIndex])

  // Fungsi: Cek Jawaban
  const handleCheckAnswer = () => {
    if (!selectedOption || !currentQuestion) return

    // Bandingkan jawaban user dengan kunci (case insensitive)
    const isCorrect = selectedOption.toLowerCase() === currentQuestion.correct_answer.toLowerCase()
    setStatus(isCorrect ? 'correct' : 'wrong')
  }

  // Fungsi: Navigasi
  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  // Jika tidak ada soal
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed">
        <h3 className="text-lg font-medium text-slate-900">Belum ada soal</h3>
        <p className="text-slate-500">Soal untuk kategori ini sedang disiapkan.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Soal {currentIndex + 1} dari {questions.length}
          </p>
        </div>

        {/* Kontrol Ukuran Font */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border shadow-sm">
          <Type size={16} className="text-slate-400 ml-2 mr-1" />
          {/* Tombol Small */}
          <button 
            onClick={() => setFontSize('small')}
            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all ${fontSize === 'small' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            A
          </button>
          {/* Tombol Medium */}
          <button 
            onClick={() => setFontSize('medium')}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-all ${fontSize === 'medium' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            A
          </button>
          {/* Tombol Large */}
          <button 
            onClick={() => setFontSize('large')}
            className={`w-8 h-8 flex items-center justify-center rounded text-lg font-bold transition-all ${fontSize === 'large' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            A
          </button>
        </div>
      </div>

      {/* --- QUESTION CARD --- */}
      <div className="mb-8">
        <QuestionCard 
          key={currentQuestion.id} // Penting agar komponen re-render saat ganti soal
          data={currentQuestion}
          number={currentIndex + 1}
          selected={selectedOption}     // Kirim jawaban yang dipilih
          onSelect={setSelectedOption}  // Kirim fungsi pemilih
          status={status}               // Kirim status benar/salah
          fontSize={fontSize}           // Kirim ukuran font
        />
      </div>

      {/* --- NAVIGATION FOOTER --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:static md:bg-transparent md:border-0 md:p-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          
          {/* Tombol Previous */}
          <Button 
            variant="outline" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-[120px]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Sebelumnya
          </Button>

          {/* Area Tengah: Tombol Cek / Status */}
          <div className="flex-1 flex justify-center">
            {status === 'idle' ? (
              <Button 
                onClick={handleCheckAnswer}
                disabled={!selectedOption} // Disabled jika belum pilih
                className="w-full md:w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-blue-200 shadow-lg"
              >
                Cek Jawaban
              </Button>
            ) : (
              // Status Benar/Salah (Tampilan Desktop)
              <div className={`hidden md:flex items-center gap-2 font-bold animate-in zoom-in ${status === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {status === 'correct' ? '🎉 Jawaban Benar!' : '😅 Jawaban Salah'}
              </div>
            )}
          </div>

          {/* Tombol Next */}
          <Button 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`w-[120px] transition-all ${status !== 'idle' ? 'ring-2 ring-blue-200' : ''}`}
            variant={status === 'idle' ? 'outline' : 'default'} // Jadi biru solid jika sudah dijawab
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>

        </div>
      </div>
    </div>
  )
}