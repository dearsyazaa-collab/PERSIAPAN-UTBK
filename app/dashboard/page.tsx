// src/app/dashboard/page.tsx

import { createClient } from "@/utils/supabase/server";
import {
  User,
  BookOpen,
  ClipboardList,
  Target,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  // NOTE: createClient() returns a Promise<SupabaseClient> in your utils,
  // so we must await it. Tanpa await, `supabase` akan jadi Promise dan TS
  // akan mengeluh bahwa `.auth` / `.from` tidak ada di Promise.
  const supabase = await createClient();

  // Ambil user auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika tidak ada user (shouldn't happen kalau route protected), return null
  if (!user) {
    return null;
  }

  // Ambil data profile dari public.users
  const { data: profile } = await supabase
    .from("users")
    .select("username, full_name, role")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name?.trim() ||
    profile?.username ||
    "Siswa";

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Header Personal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Halo, {displayName}!
              </h1>
              <p className="text-sm text-slate-500">
                {today}
              </p>
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
            <p className="mt-3 text-base font-medium text-slate-900">Belum Ditentukan</p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Mulai Persiapan UTBK Sekarang</h2>
              <p className="mt-1 text-sm text-slate-500">Kerjakan soal latihan dan pantau perkembangan belajarmu.</p>
            </div>

            <a
              href="/bank-soal"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Masuk Bank Soal
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}