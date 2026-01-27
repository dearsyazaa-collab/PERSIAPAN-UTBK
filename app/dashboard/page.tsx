import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="p-6">
      {/* Container Putih dengan Shadow Halus */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
        
        {/* Header Sapaan */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Halo, Calon Mahasiswa! 👋
        </h1>
        <p className="text-slate-500 mb-8">
          Selamat datang kembali. Silakan pilih menu di sidebar untuk mulai belajar.
        </p>

        {/* Card Bank Soal (Simple Blue Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/bank-soal" 
            className="block p-6 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors group"
          >
            <h3 className="text-blue-700 font-bold text-lg mb-1 group-hover:underline">
              Bank Soal
            </h3>
            <p className="text-blue-600/80 text-sm">
              Akses ribuan soal latihan
            </p>
          </Link>

          {/* Anda bisa menambahkan card lain di sini jika perlu nanti */}
        </div>

      </div>
    </div>
  );
}