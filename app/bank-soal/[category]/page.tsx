import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Clock, BookOpen, ChevronRight, AlertCircle, FileQuestion } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const categorySlug = params.category;
  
  const supabase = await createClient();

  // Ambil paket soal sesuai kategori
  const { data: packs, error } = await supabase
    .from("tryouts")
    .select("*, tryout_questions(count)")
    .eq("is_public", true)
    .eq("category", categorySlug) // Filter by category
    .order("created_at", { ascending: false });

  // Judul Kategori (Format: penalaran-umum -> Penalaran Umum)
  const categoryTitle = categorySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
           <Link href="/bank-soal" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition font-medium">
            <ArrowLeft size={20} /> Kembali ke Menu
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Latihan {categoryTitle}</h1>
          <p className="text-slate-500 mt-2">Pilih paket latihan yang tersedia untuk topik ini.</p>
        </div>

        {/* List Paket Soal */}
        {packs && packs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <div key={pack.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all group flex flex-col h-full">
                
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileQuestion size={24} />
                    </div>
                    {/* Badge Durasi */}
                     <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> {pack.duration_minutes} Menit
                    </div>
                </div>
                
                <div className="mb-6 flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-snug">{pack.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{pack.description || "Latihan soal intensif untuk persiapan UTBK."}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                   {/* @ts-ignore */}
                   <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <BookOpen size={14}/> {pack.tryout_questions?.[0]?.count ?? 0} Soal
                   </span>

                  {/* TOMBOL MENUJU HALAMAN KERJAKAN */}
                  {/* Perhatikan linknya sekarang ada /kerjakan/ */}
                  <Link 
                    href={`/bank-soal/kerjakan/${pack.id}`} 
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:gap-3 transition-all"
                  >
                    Mulai <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
                <AlertCircle size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Belum ada soal</h3>
            <p className="text-slate-500 mt-1 max-w-sm text-center">
                Paket soal untuk kategori <strong>"{categoryTitle}"</strong> belum tersedia atau belum di-upload oleh admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}