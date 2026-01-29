import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, FileText, Edit, Trash, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Cek Security (Hanya Admin yang boleh akses)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Cek role di tabel users
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-bold">
        ⛔ Akses Ditolak: Anda bukan Admin.
      </div>
    );
  }

  // 2. Ambil Daftar Tryout (Update: Ambil is_public & duration_minutes)
  const { data: tryouts } = await supabase
    .from("tryouts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
             <h1 className="text-3xl font-bold text-slate-900">Panel Admin</h1>
             <p className="text-slate-500">Kelola Paket Soal & Materi</p>
          </div>
          <Link 
            href="/admin/buat-paket" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-200"
          >
            <Plus size={18} /> Buat Paket Baru
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tryouts?.map((tryout) => (
            <div key={tryout.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden group">
              
              {/* Badge Status V2 */}
              <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl ${tryout.is_public ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {tryout.is_public ? 'Published' : 'Draft'}
              </div>

              <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                   <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                      {tryout.category?.replace(/-/g, ' ') || "Umum"}
                   </span>
                   <h3 className="text-lg font-bold text-slate-800 mt-2">{tryout.title}</h3>
                   
                   {/* Info Durasi V2 */}
                   <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs font-medium">
                      <Clock size={14} />
                      {tryout.duration_minutes || 30} Menit
                   </div>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
                  <FileText size={20} />
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <Link 
                  href={`/admin/kelola-soal/${tryout.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
                >
                  <Edit size={16} /> Kelola Soal
                </Link>
                <button className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}

          {(!tryouts || tryouts.length === 0) && (
            <div className="col-span-2 text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
              Belum ada paket soal. Silakan buat baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}