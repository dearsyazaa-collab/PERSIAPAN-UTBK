"use client";

import { useActionState, useEffect } from "react"; // Next.js 15 Hook
import { createQuestion } from "@/app/admin/actions/create-question"; // Import Server Action tadi
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react"; // Tambahkan ini

export default function TambahSoalPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params dengan React.use() karena params di Next 15 adalah Promise
  const { id } = React.use(params);
  const router = useRouter();

  // Integrasi Server Action
  const [state, formAction, isPending] = useActionState(createQuestion, null);

  // Jika sukses, kembali ke list soal
  useEffect(() => {
    if (state?.message === "Success") {
      router.push(`/admin/kelola-soal/${id}`);
    }
  }, [state, id, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/kelola-soal/${id}`} className="p-2 bg-white rounded-full border hover:bg-slate-100 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Input Soal Manual</h1>
        </div>

        <form action={formAction}>
          <input type="hidden" name="tryoutId" value={id} />

          {/* Error Alert */}
          {state?.error && (
             <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6 font-medium">
               🚨 {state.error}
             </div>
          )}

          <div className="space-y-6">
            
            {/* 1. Konten Soal */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-bold text-slate-700 mb-2">Pertanyaan / Soal</label>
              <textarea 
                name="content"
                rows={4}
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                placeholder="Tulis soal di sini..."
                required
              ></textarea>
            </div>

            {/* 2. Opsi Jawaban */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Pilihan Jawaban</h3>
              
              {["A", "B", "C", "D", "E"].map((opt) => (
                <div key={opt} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {opt}
                  </div>
                  <input 
                    name={`option_${opt}`}
                    type="text" 
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={`Isi jawaban opsi ${opt}`}
                    required
                  />
                </div>
              ))}
            </div>

            {/* 3. Kunci & Pembahasan */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kunci Jawaban</label>
                  <select 
                    name="correctAnswer" 
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    required
                  >
                    <option value="">Pilih...</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
               </div>
               
               <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pembahasan (Opsional)</label>
                  <textarea 
                    name="explanation"
                    rows={2}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Kenapa jawabannya itu?"
                  ></textarea>
               </div>
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end">
               <button 
                 type="submit" 
                 disabled={isPending}
                 className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition flex items-center gap-2 disabled:bg-slate-400"
               >
                 {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                 {isPending ? "Menyimpan..." : "Simpan Soal"}
               </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}