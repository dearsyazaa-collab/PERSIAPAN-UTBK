// src/app/bank-soal/kerjakan/[id]/page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BankSoalClient from "@/components/BankSoalClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BankSoalDetailPage(props: PageProps) {
  const params = await props.params;
  const { id } = params;

  const supabase = await createClient();

  // 1. Ambil Data Paket Soal & Relasi Soal
  // PERBAIKAN: Komentar dihapus dari dalam string select()
  const { data: tryout, error } = await supabase
    .from("tryouts")
    .select(`
      id, 
      title,
      category,
      tryout_questions (
        display_order,
        questions (
          id,
          content,
          options,
          correct_answer,
          explanation
        )
      )
    `)
    .eq("id", id)
    .single();

  // 2. Validasi Error Database
  if (error) {
    console.error("❌ DB Error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md text-center">
            <h1 className="text-xl font-bold text-red-600 mb-2">Gagal Memuat Soal</h1>
            <p className="text-slate-500 mb-6 text-sm">{error.message}</p>
            <Link href="/bank-soal" className="text-indigo-600 font-bold hover:underline">
                Kembali ke Menu
            </Link>
        </div>
      </div>
    );
  }

  if (!tryout) return notFound();

  // 3. Transformasi Data
  let formattedQuestions: Question[] = [];

  if (tryout.tryout_questions) {
    // @ts-ignore
    formattedQuestions = tryout.tryout_questions.flatMap((item: any) => {
      const q = item.questions;
      if (!q) return [];
      
      const qArray = Array.isArray(q) ? q : [q];

      return qArray.map((question: any) => ({
        ...question,
        options: Array.isArray(question.options) 
          ? question.options 
          : Object.entries(question.options || {}).map(([key, val]) => ({
              code: key,
              text: val as string
            }))
      }));
    });
  }

  const finalQuestions = formattedQuestions.filter((q) => q && q.id);

  // 4. Handle Jika Soal Kosong
  if (finalQuestions.length === 0) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Paket Soal Kosong</h3>
                <p className="text-slate-500 mb-6">Paket "{tryout.title}" belum memiliki butir soal aktif.</p>
                <Link href="/bank-soal" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition">
                    <ArrowLeft size={18}/> Kembali
                </Link>
            </div>
        </div>
     );
  }

  // 5. Render Komponen Client
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header Mobile */}
      <div className="md:hidden bg-white p-4 border-b border-slate-200 mb-4 flex items-center gap-3 sticky top-0 z-10">
         <Link href="/bank-soal" className="p-2 -ml-2 text-slate-500">
            <ArrowLeft size={20} />
         </Link>
         <span className="font-bold text-slate-800 truncate">{tryout.title}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:pt-8">
        {/* Tombol Back Desktop */}
        <div className="hidden md:flex mb-6">
            <Link href={`/bank-soal/${tryout.category || 'penalaran-umum'}`} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition font-medium text-sm">
                <ArrowLeft size={18} /> Kembali ke List
            </Link>
        </div>

        <BankSoalClient 
          questions={finalQuestions} 
          title={tryout.title}
          categorySlug={tryout.category || "latihan-soal"}
        />
      </div>
    </div>
  );
}