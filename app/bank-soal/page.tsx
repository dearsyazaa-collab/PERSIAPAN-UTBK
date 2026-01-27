'use client'

import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { 
  Brain, Calculator, BookOpen, PenTool, 
  Languages, FileText, Search 
} from "lucide-react"

export default function BankSoalPage() {
  // PENTING: 'id' di sini harus SAMA PERSIS dengan kolom 'slug' di tabel categories Supabase
  const categories = [
    { 
      id: "penalaran-umum", // DULU: "pu"
      name: "Penalaran Umum", 
      desc: "Logika verbal & analitik", 
      icon: Brain, 
      color: "text-rose-500", 
      bg: "bg-rose-50 border-rose-100 hover:border-rose-200" 
    },
    { 
      id: "pengetahuan-kuantitatif", // DULU: "pk"
      name: "Pengetahuan Kuantitatif", 
      desc: "Matematika dasar & logika", 
      icon: Calculator, 
      color: "text-blue-500", 
      bg: "bg-blue-50 border-blue-100 hover:border-blue-200" 
    },
    { 
      id: "pengetahuan-pemahaman-umum", // DULU: "ppu" (Sesuaikan dengan slug DB Anda)
      name: "PPU", 
      desc: "Pengetahuan & Pemahaman Umum", 
      icon: BookOpen, 
      color: "text-amber-500", 
      bg: "bg-amber-50 border-amber-100 hover:border-amber-200" 
    },
    { 
      id: "pemahaman-bacaan-menulis", // DULU: "pbm" (Sesuaikan dengan slug DB Anda)
      name: "PBM", 
      desc: "Pemahaman Bacaan & Menulis", 
      icon: PenTool, 
      color: "text-emerald-500", 
      bg: "bg-emerald-50 border-emerald-100 hover:border-emerald-200" 
    },
    { 
      id: "literasi-bahasa-indonesia", // DULU: "literasi-ind"
      name: "Literasi Bahasa Indonesia", 
      desc: "Analisis teks bahasa", 
      icon: FileText, 
      color: "text-red-500", 
      bg: "bg-red-50 border-red-100 hover:border-red-200" 
    },
    { 
      id: "literasi-bahasa-inggris", // DULU: "literasi-ing"
      name: "Literasi Bahasa Inggris", 
      desc: "English text analysis", 
      icon: Languages, 
      color: "text-indigo-500", 
      bg: "bg-indigo-50 border-indigo-100 hover:border-indigo-200" 
    },
    { 
      id: "penalaran-matematika", // DULU: "pm"
      name: "Penalaran Matematika", 
      desc: "Pecahkan masalah matematis", 
      icon: Search, 
      color: "text-orange-500", 
      bg: "bg-orange-50 border-orange-100 hover:border-orange-200" 
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Bank Soal UTBK</h1>
          <p className="text-slate-500 mt-2">Pilih subtes yang ingin kamu latih hari ini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/bank-soal/${cat.id}`}
              className={`block p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cat.bg}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-white shadow-sm ${cat.color}`}>
                  <cat.icon size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{cat.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}