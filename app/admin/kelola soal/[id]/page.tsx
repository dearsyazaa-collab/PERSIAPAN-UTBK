import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft, Plus, Trash, CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function KelolaSoalPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params di Next.js 15
  const { id } = await params; 
  const supabase = await createClient();

  // 1. Ambil Info Paket Soal
  const { data: tryout } = await supabase
    .from("tryouts")
    .select("*")
    .eq("id", id)
    .single();

  if (!tryout) notFound();

  // 2. Ambil Daftar Soal di Paket ini
  const { data: questionsData } = await supabase
    .from("tryout_questions")
    .select(`
      id,
      questions (
        id, content, correct_answer, explanation
      )
    `)
    .eq("tryout_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white rounded-full border hover:bg-slate-100 transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{tryout.category}</p>
              <h1 className="text-2xl font-bold text-slate-900">{tryout.title}</h1>
            </div>
          </div>
          
          <Link 
            href={`/admin/kelola-soal/${id}/tambah`} // Kita buat halaman ini di langkah berikutnya
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            <Plus size={20} /> Tambah Soal Manual
          </Link>
        </div>

        {/* List Soal */}
        <div className="space-y-4">
          {questionsData?.map((item: any, index: number) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition">
              <div className="flex justify-between items-start gap-4">
                
                {/* Nomor Soal */}
                <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                  {index + 1}
                </div>

                {/* Konten Soal */}
                <div className="flex-1">
                  <div 
                    className="prose prose-sm max-w-none text-slate-800 mb-2"
                    dangerouslySetInnerHTML={{ __html: item.questions.content }} // Render HTML simple
                  />
                  
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <CheckCircle size={12} /> Kunci: {item.questions.correct_answer}
                    </span>
                    <span className="text-slate-400">ID: {item.questions.id.slice(0,8)}...</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}

          {questionsData?.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400 mb-4">Belum ada soal di paket ini.</p>
              <p className="text-sm text-slate-300">Klik tombol "Tambah Soal Manual" di pojok kanan atas.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}