'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle } from "lucide-react"

// Definisikan tipe data sesuai tabel Anda
type Question = {
  id: string
  question_text: string
  options: any // Bisa berupa Array atau JSON Object
  correct_answer: string
  explanation: string
}

export default function QuizCore({ questions }: { questions: Question[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[currentIndex]

  // Helper: Mengubah data options menjadi format yang bisa dibaca
  // Supabase sering menyimpan JSON sebagai object atau array
  const parseOptions = (opts: any) => {
    if (Array.isArray(opts)) return opts // Jika formatnya ["A", "B", "C"]
    if (typeof opts === 'object') return Object.values(opts) // Jika formatnya {"a":"..", "b":".."}
    return []
  }

  const optionsList = parseOptions(currentQuestion.options)

  const handleNext = () => {
    // Cek Jawaban
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1)
    }

    // Pindah ke soal berikutnya
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer("") // Reset pilihan
    } else {
      setShowResult(true) // Selesai
    }
  }

  // TAMPILAN SKOR AKHIR
  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-10 text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Hasil Latihan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {Math.round((score / questions.length) * 100)}
          </div>
          <p className="text-slate-500">
            Benar {score} dari {questions.length} soal
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </CardFooter>
      </Card>
    )
  }

  // TAMPILAN SOAL
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar Sederhana */}
      <div className="mb-4 flex justify-between text-sm text-slate-500">
        <span>Soal {currentIndex + 1} dari {questions.length}</span>
        <span>Skor Sementara: {score}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {optionsList.map((opt: any, index: number) => (
              <div key={index} className={`flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-slate-50 ${selectedAnswer === opt ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                <RadioGroupItem value={opt} id={`opt-${index}`} />
                <Label htmlFor={`opt-${index}`} className="flex-grow cursor-pointer font-normal">
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext} disabled={!selectedAnswer}>
            {currentIndex === questions.length - 1 ? "Selesai & Lihat Nilai" : "Selanjutnya"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}