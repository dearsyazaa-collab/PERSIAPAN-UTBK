"use client";

import { useActionState } from "react"; 
import { createTryout } from "../actions/create-tryout"; 
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

// Opsi Kategori sesuai UTBK
const categories = [
  { id: "penalaran-umum", label: "Penalaran Umum" },
  { id: "pengetahuan-kuantitatif", label: "Pengetahuan Kuantitatif" },
  { id: "pemahaman-bacaan", label: "Pemahaman Bacaan (PBM)" },
  { id: "pengetahuan-umum", label: "Pengetahuan & Pemahaman Umum (PPU)" },
  { id: "literasi-inggris", label: "Literasi Bahasa Inggris" },
  { id: "literasi-indonesia", label: "Literasi Bahasa Indonesia" },
  { id: "matematika", label: "Penalaran Matematika" },
];

export default function CreateTryoutPage() {
  const [state, formAction, isPending] = useActionState(createTryout, null);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition">
            <ArrowLeft size={20} className="text-slate-600"/>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Buat Paket Soal Baru</h1>
        </div>

        {/* Alert Error */}
        {state?.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                🚨 {state.error}
            </div>
        )}

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form action={formAction} className="space-y-6">
            
            {/* Judul */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Judul Paket</label>
              <input 
                name="title"
                type="text" 
                placeholder="Contoh: Latihan Penalaran Umum - Set 1"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kategori */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Subtes</label>
                    <div className="relative">
                        <select 
                            name="category"
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                            required
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Durasi */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Durasi (Menit)</label>
                    <input 
                        name="duration"
                        type="number" 
                        defaultValue={30}
                        min={1}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                    />
                </div>
            </div>

            {/* Toggle Public */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                    id="is_public"
                    name="is_public"
                    type="checkbox" 
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="is_public" className="cursor-pointer text-sm font-medium text-slate-700 select-none">
                    Publikasikan Langsung? (Siswa bisa melihat)
                </label>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isPending ? <><Loader2 className="animate-spin" size={20}/> Menyimpan...</> : <><Save size={20} /> Simpan Paket Soal</>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}