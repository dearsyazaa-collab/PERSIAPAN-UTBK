import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  User, ClipboardList, BookOpen, Target, 
  ArrowRight, Sparkles, History, TrendingUp, Calendar 
} from "lucide-react";
import TargetUniversityClient from "@/components/TargetUniversityClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Ambil user auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Ambil profile user
  let profile: { username?: string; full_name?: string; role?: string; target_university?: string } | null = null;
  
  const { data: userData } = await supabase
    .from("users")
    .select("username, full_name, role, target_university")
    .eq("id", user.id)
    .maybeSingle();
  profile = userData || null;

  // 3. AMBIL DATA HASIL KUIS (New Feature)
  const { data: results } = await supabase
    .from("quiz_results")
    .select(`
      id,
      score,
      total_correct,
      total_wrong,
      created_at,
      tryouts (
        title,
        category
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const quizHistory = results || [];

  // 4. HITUNG STATISTIK (New Feature)
  const totalLatihan = quizHistory.length;
  // Hitung rata-rata skor
  const averageScore = totalLatihan > 0
    ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.score, 0) / totalLatihan)
    : 0;

  // Helpers
  const displayName =
    profile?.full_name?.trim() ||
    profile?.username ||
    user.email?.split("@")[0] || "Siswa";

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    // CONTAINER UTAMA
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl -z-10"></div>
      
      <div className="mx-auto max-w-7xl px-6 py-10 relative z-10">
        
        {/* HEADER PERSONAL */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-200 shadow-lg text-white">
                <User className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold tracking-wider uppercase">Dashboard Siswa</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Halo, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{displayName}</span>! 👋
                </h1>
                <p className="text-slate-500 mt-1">Selamat datang kembali. {today}.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/profil"
                className="rounded-xl border border-slate-200 bg-white/50 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white hover:shadow-md transition-all"
              >
                Profil Saya
              </Link>
            </div>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main area (Kiri) */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* STATS CARDS (Updated with Real Data) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Card 1: Total Soal/Latihan */}
              <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Latihan Selesai</p>
                </div>
                <p className="text-3xl font-bold text-slate-800 ml-1">{totalLatihan}</p>
              </div>

              {/* Card 2: Rata-rata Nilai (Diganti dari Tryout Diikuti) */}
              <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Rata-rata Skor</p>
                </div>
                <p className="text-3xl font-bold text-slate-800 ml-1">{averageScore}</p>
              </div>

              {/* Card 3: Target */}
              <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Target UTBK</p>
                </div>
                <p className="text-lg font-bold text-slate-800 ml-1 truncate">
                  {profile?.target_university ? profile.target_university : "Belum Set"}
                </p>
              </div>
            </div>

            {/* ACTION HUB (Tetap sama) */}
            <div className="rounded-3xl border border-white/60 bg-white/80 backdrop-blur-md p-8 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Mulai Belajar</h2>
                <p className="text-slate-500 mb-6 max-w-lg">
                  Pilih menu di bawah ini untuk mengasah kemampuanmu menuju PTN impian.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link href="/bank-soal" className="group flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5 hover:bg-blue-100 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900">Bank Soal</h4>
                        <p className="text-xs text-blue-600/80 mt-1">Latihan per topik</p>
                    </div>
                  </Link>

                  <Link href="/tryout" className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Target size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Tryout Full</h4>
                        <p className="text-xs text-slate-500 mt-1">Simulasi ujian asli</p>
                    </div>
                  </Link>

                  <Link href="/materi" className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                     <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800">Materi</h4>
                        <p className="text-xs text-slate-500 mt-1">Ringkasan lengkap</p>
                    </div>
                  </Link>
                </div>
              </div>
               <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white to-transparent opacity-80 -z-0 pointer-events-none"></div>
            </div>

            {/* --- RIWAYAT PENGERJAAN (BARU) --- */}
            <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                <History className="text-indigo-600" size={20} />
                <h3 className="font-bold text-slate-800">Riwayat Pengerjaan</h3>
              </div>

              {quizHistory.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Belum ada data latihan. Yuk mulai kerjakan soal!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-3">Paket Soal</th>
                        <th className="px-6 py-3">Waktu</th>
                        <th className="px-6 py-3 text-center">Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {quizHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4">
                            {/* @ts-ignore */}
                            <div className="font-bold text-slate-800">{item.tryouts?.title || "Paket Dihapus"}</div>
                            {/* @ts-ignore */}
                            <div className="text-xs text-slate-500 capitalize">{item.tryouts?.category?.replace(/-/g, ' ')}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <Calendar size={14}/> {formatDate(item.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-lg font-bold text-xs ${
                              item.score >= 70 ? 'bg-emerald-100 text-emerald-700' : 
                              item.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {item.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Right widget column (Kanan) */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm w-full">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target size={18} className="text-emerald-500"/>
                Target Universitas
              </h3>
              <p className="mt-1 text-xs text-slate-500 mb-4">Pilih universitas impianmu untuk memantau passing grade.</p>

              <div className="mt-2">
                <TargetUniversityClient initialSelected={profile?.target_university ?? null} />
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 text-sm text-slate-600 shadow-sm w-full">
              <h4 className="font-bold text-indigo-900 mb-2">Butuh Bantuan?</h4>
              <p className="mb-3 text-xs leading-relaxed">
                Bingung cara pakai platform atau nemu error? Tim kami siap bantu kamu kapan aja.
              </p>
              <Link href="/help" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline">
                Hubungi Support <ArrowRight size={12}/>
              </Link>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200/60 pt-8 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-slate-500 text-sm">
            <div>© {new Date().getFullYear()} UTBK Plus — Platform Belajar No.1</div>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}