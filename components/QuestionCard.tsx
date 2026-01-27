'use client'

import { Card, CardContent } from "@/components/ui/card"
// HAPUS import Badge yang bikin error
import { cn } from "@/lib/utils" 
import { CheckCircle2, XCircle } from "lucide-react"

interface QuestionCardProps {
  data: any
  number: number
  selected: string | null
  onSelect: (opt: string) => void
  status: 'idle' | 'correct' | 'wrong'
  fontSize?: 'small' | 'medium' | 'large' // Props untuk ukuran font
}

export default function QuestionCard({ 
  data, 
  number, 
  selected, 
  onSelect, 
  status,
  fontSize = 'medium' 
}: QuestionCardProps) {

  // Logic Ukuran Font
  const textSize = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  }

  return (
    <Card className="border-0 shadow-sm overflow-hidden ring-1 ring-slate-200">
      <CardContent className="p-6">
        {/* HEADER: Nomor & Label Kesulitan (Ganti Badge dengan Span) */}
        <div className="flex justify-between items-start mb-4">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none bg-slate-100 text-slate-600 border-slate-200">
            No. {number}
          </span>
          
          <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none capitalize",
            data.difficulty === 'SUSAH' ? "bg-red-100 text-red-700 border-red-200" :
            data.difficulty === 'SEDANG' ? "bg-amber-100 text-amber-700 border-amber-200" :
            "bg-emerald-100 text-emerald-700 border-emerald-200"
          )}>
            {data.difficulty || 'Latihan'}
          </span>
        </div>

        {/* TEKS SOAL (Sekarang dinamis mengikuti fontSize) */}
        <div className={`mb-8 text-slate-800 leading-relaxed font-medium ${textSize[fontSize]}`}>
          {data.question_text}
        </div>

        {/* OPSI JAWABAN */}
        <div className="grid gap-3">
          {/* Kita asumsikan opsi bisa object {a:..., b:...} atau array */}
          {Object.keys(data.options || {}).map((key, idx) => {
            // Normalisasi key (misal db pakai 'A', kita handle lowercasenya)
            const optKey = key.toLowerCase()
            const optText = data.options[key]
            
            // Logic Pilihan
            const isSelected = selected === optKey
            let containerClass = "relative flex items-center p-4 rounded-xl border cursor-pointer select-none transition-all duration-200"
            let circleClass = "w-8 h-8 flex items-center justify-center rounded-full mr-4 text-sm font-bold border transition-colors shrink-0"
            let icon = null

            // LOGIKA WARNA (IDLE / CORRECT / WRONG)
            if (status !== 'idle') {
                // Mode Koreksi
                const correctKey = data.correct_answer?.toLowerCase() // Pastikan format sama

                if (optKey === correctKey) {
                    // Jawaban Benar (Hijau)
                    containerClass += " bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                    circleClass += " bg-emerald-500 text-white border-emerald-500"
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-4" />
                } else if (isSelected && status === 'wrong') {
                    // Jawaban Salah yang Dipilih (Merah)
                    containerClass += " bg-rose-50 border-rose-500 ring-1 ring-rose-500"
                    circleClass += " bg-rose-500 text-white border-rose-500"
                    icon = <XCircle className="w-5 h-5 text-rose-600 absolute right-4" />
                } else {
                    // Opsi lain (redup)
                    containerClass += " opacity-50 border-slate-100 grayscale-[0.5]"
                    circleClass += " bg-slate-100 text-slate-400 border-slate-200"
                }
            } else {
                // Mode Normal (Belum jawab)
                if (isSelected) {
                    containerClass += " bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm active:scale-[0.98]"
                    circleClass += " bg-blue-500 text-white border-blue-500"
                } else {
                    containerClass += " bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-300 hover:shadow-sm active:scale-[0.98]"
                    circleClass += " bg-slate-50 text-slate-500 border-slate-200"
                }
            }

            return (
              <div 
                key={optKey}
                onClick={() => status === 'idle' && onSelect(optKey)}
                className={`${containerClass} ${textSize[fontSize]}`} // Font size dinamis di sini juga
              >
                <div className={circleClass}>
                  {String.fromCharCode(65 + idx)} {/* A, B, C... */}
                </div>
                
                <span className="flex-1 pr-6">{optText}</span>
                {icon}
              </div>
            )
          })}
        </div>

        {/* PEMBAHASAN (Hanya muncul jika sudah dicek) */}
        {status !== 'idle' && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              💡 Pembahasan
            </h4>
            <p className={`text-slate-700 leading-relaxed ${textSize[fontSize]}`}>
              {data.explanation || data.discussion || "Belum ada pembahasan."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}