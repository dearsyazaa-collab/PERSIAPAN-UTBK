import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { createClient } from "@/utils/supabase/server";
import { User, BookOpen, GraduationCap, ArrowRight, Sparkles, Layout, Library, Trophy } from "lucide-react";
import TargetUniversityClient from "@/components/TargetUniversityClient";
import Sidebar from "@/components/Sidebar"; 

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Ambil Data User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { username?: string; full_name?: string; role?: string; target_university?: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("username, full_name, role, target_university")
      .eq("id", user.id)
      .maybeSingle();
    profile = data || null;
  }

  const displayName =
    profile?.full_name?.trim() ||
    profile?.username ||
    (user ? user.email?.split("@")[0] : "Calon Mahasiswa");

  // Cek apakah user sudah punya target universitas
  const hasTarget = !!profile?.target_university;

  return (
    // FIX LAYOUT: w-full & overflow-hidden mencegah geser samping
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* --- SIDEBAR (Desktop) --- */}
      {/* Wrapper Sidebar dibuat fix width agar tidak tertekan content */}
      <div className="hidden md:block w-[240px] flex-shrink-0 border-r border-slate-200 bg-[#0F172A] z-20 relative transition-all">
        <Sidebar isExpanded={true} />
      </div>

      {/* --- KONTEN UTAMA --- */}
      {/* overflow-x-hidden disini krusial untuk responsivitas mobile */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden h-full scrollbar-hide">
        
        {/* BACKGROUND DECORATION */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* HEADER MOBILE */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
           <div className="flex items-center gap-3">
              {/* Logo Mobile */}
              <div className="relative h-8 w-8">
                <Image src="/garuda.png" alt="UTBK Plus" fill className="object-contain"/>
              </div>
              <span className="font-bold text-indigo-900 text-lg">UTBK Plus</span>
           </div>
           
           <Link href="/profil" className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <User size={18} />
           </Link>
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8">
          
          {/* HEADER SECTION */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={14} /> Portal Utama
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Halo, <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">{displayName}</span>! 👋
            </h1>
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl">
              Siap produktif hari ini? Pilih menu di bawah untuk mulai belajar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* KOLOM KIRI (Konten Utama) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* CARD NAVIGASI */}
              <div className="rounded-3xl border border-white/60 bg-white/70 backdrop-blur-md p-6 md:p-8 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Mulai Persiapan</h2>
                  <p className="text-slate-500 mb-6 text-sm">
                    Akses materi eksklusif dan bank soal terupdate.
                  </p>

                  {/* Grid Menu Responsif (1 Kolom Mobile, 3 Kolom Desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* 1. Bank Soal */}
                    <Link href="/bank-soal" className="flex flex-row items-center sm:flex-col sm:items-start sm:justify-between h-auto sm:h-32 p-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group/btn relative overflow-hidden gap-4 sm:gap-0">
                        <div className="bg-white/20 p-2 rounded-lg shrink-0"><BookOpen size={20} /></div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">Bank Soal</div>
                          <div className="text-indigo-100 text-[10px] mt-0.5 hidden sm:block">Latihan Topik</div>
                        </div>
                        <ArrowRight size={18} className="opacity-70 group-hover/btn:translate-x-1 transition-transform sm:absolute sm:top-4 sm:right-4"/>
                    </Link>

                    {/* 2. Tryout */}
                    <Link href="/tryout" className="flex flex-row items-center sm:flex-col sm:items-start sm:justify-between h-auto sm:h-32 p-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md transition-all group/btn gap-4 sm:gap-0">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-600 shrink-0"><GraduationCap size={20} /></div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">Tryout UTBK</div>
                          <div className="text-slate-500 text-[10px] mt-0.5 hidden sm:block">Simulasi Ujian</div>
                        </div>
                        <ArrowRight size={18} className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-slate-400 sm:absolute sm:top-4 sm:right-4"/>
                    </Link>

                    {/* 3. Materi */}
                    <Link href="/materi" className="flex flex-row items-center sm:flex-col sm:items-start sm:justify-between h-auto sm:h-32 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-200 transition-all group/btn gap-4 sm:gap-0">
                        <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm shrink-0"><Library size={20} /></div>
                        <div className="flex-1">
                          <div className="font-bold text-sm">Materi</div>
                          <div className="text-emerald-600/80 text-[10px] mt-0.5 hidden sm:block">Rangkuman</div>
                        </div>
                        <ArrowRight size={18} className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-emerald-600 sm:absolute sm:top-4 sm:right-4"/>
                    </Link>

                  </div>
                </div>
                {/* Efek Background */}
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white to-transparent opacity-60 -z-0"></div>
              </div>

              {/* Tips Section */}
              <div className="rounded-2xl bg-slate-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm shrink-0">
                        <Sparkles className="text-yellow-400" size={24}/>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Insight Hari Ini</h3>
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                          &quot;Konsistensi adalah kunci. Mengerjakan 5 soal setiap hari jauh lebih baik daripada 100 soal tapi hanya seminggu sekali.&quot;
                        </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
              </div>

            </div>

            {/* KOLOM KANAN (Widget) */}
            <aside className="space-y-6">
              
              {/* Widget Profil */}
              <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-white shadow-sm shrink-0">
                    <User size={20} />
                 </div>
                 <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 text-sm truncate">{displayName}</div>
                    <Link href="/profil" className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-1">
                      Edit Profil
                    </Link>
                 </div>
              </div>

              {/* Widget Target Universitas */}
              <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                   <Trophy size={16} className={hasTarget ? "text-yellow-500" : "text-slate-400"}/> 
                   {hasTarget ? "Target Impian" : "Target Universitas"}
                </h3>
                
                {!hasTarget && (
                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                    Pilih PTN tujuanmu.
                  </p>
                )}
                
                <div className="mt-1 w-full">
                  <TargetUniversityClient initialSelected={profile?.target_university ?? null} />
                </div>
              </div>

            </aside>
          </div>
        </div>

        {/* Footer Attribution Link */}
        <footer className="mt-8 border-t border-slate-200/50 bg-white/40 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
               <span>© {new Date().getFullYear()} UTBK Plus</span>
               <span className="hidden md:inline">•</span>
               <a 
                 href="https://www.flaticon.com/free-icons/garuda" 
                 title="garuda icons" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-indigo-600 transition underline decoration-dotted"
               >
                 Garuda icons created by Freepik - Flaticon
               </a>
            </div>
            <div className="flex items-center gap-6 font-medium">
              <Link href="/terms" className="hover:text-indigo-600">Syarat</Link>
              <Link href="/privacy" className="hover:text-indigo-600">Privasi</Link>
              <Link href="/help" className="hover:text-indigo-600">Bantuan</Link>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}