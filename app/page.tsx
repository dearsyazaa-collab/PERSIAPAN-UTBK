// src/app/page.tsx
import React from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { User, BookOpen, ClipboardList, Target, ArrowRight } from "lucide-react";
import TargetUniversityClient from "@/components/TargetUniversityClient";
import Sidebar from "@/components/Sidebar";

export default async function HomePage() {
  // Supabase server client (await karena util async)
  const supabase = await createClient();

  // Ambil user auth (server-side)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil profile dari public.users jika user ada
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
    profile?.full_name?.trim() || profile?.username || (user ? user.email?.split("@")[0] : "Calon Mahasiswa");

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar - gunakan komponen Sidebar yang sama seperti di Bank Soal */}
        <aside className="hidden md:block">
           <Sidebar isExpanded={true} />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Header */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Halo, {displayName}!</h1>
                    <p className="text-sm text-slate-500">
                      Selamat datang kembali. Silakan pilih menu di sidebar untuk mulai belajar.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{today}</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    href="/profil"
                    className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:shadow"
                  >
                    Profil Saya
                  </Link>
                  <Link
                    href="/logout"
                    className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Keluar
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm text-slate-500">Soal Dikerjakan</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">0</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm text-slate-500">Tryout Diikuti</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-900">0</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm text-slate-500">Target UTBK</p>
                </div>
                <p className="mt-3 text-base font-medium text-slate-900">
                  {profile?.target_university ? profile.target_university : "Belum Ditentukan"}
                </p>
              </div>
            </div>

            {/* CTA + Target Widget */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Mulai Persiapan UTBK Sekarang</h2>
                    <p className="mt-1 text-sm text-slate-500">Kerjakan soal latihan dan pantau perkembangan belajarmu.</p>
                  </div>

                  <Link
                    href="/bank-soal"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Masuk Bank Soal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Target University Widget (client) */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-medium text-slate-900">Target Universitas</h3>
                <p className="mt-1 text-xs text-slate-500">Pilih universitas targetmu. Logo akan muncul setelah dipilih.</p>

                <div className="mt-4">
                  {/* initialSelected: kalau profile?.target_university berisi id, kita pass ke client untuk initial */}
                  <TargetUniversityClient initialSelected={profile?.target_university ?? null} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
