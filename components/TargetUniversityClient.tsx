// src/components/TargetUniversityClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type Univ = {
  id: string;
  name: string;
  // You can replace logo with URL or inline SVG node
  logo: React.ReactNode;
};

export default function TargetUniversityClient({ initialSelected }: { initialSelected: string | null }) {
  // Static list — bisa diambil dari DB nanti. ID harus sama dengan DB.universities.id jika persisten.
  const UNIVERSITIES: Univ[] = [
    {
      id: "ui",
      name: "Universitas Indonesia",
      logo: (
        <svg width="56" height="56" viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" rx="18" fill="#1E3A8A" />
          <text x="50%" y="55%" textAnchor="middle" fill="white" fontWeight="700" fontSize="44" fontFamily="Inter, sans-serif">
            UI
          </text>
        </svg>
      ),
    },
    {
      id: "itb",
      name: "Institut Teknologi Bandung",
      logo: (
        <svg width="56" height="56" viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" rx="18" fill="#0F172A" />
          <text x="50%" y="55%" textAnchor="middle" fill="#FDE68A" fontWeight="700" fontSize="36" fontFamily="Inter, sans-serif">
            ITB
          </text>
        </svg>
      ),
    },
    {
      id: "ugm",
      name: "Universitas Gadjah Mada",
      logo: (
        <svg width="56" height="56" viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" rx="18" fill="#065F46" />
          <text x="50%" y="55%" textAnchor="middle" fill="#FDE68A" fontWeight="700" fontSize="34" fontFamily="Inter, sans-serif">
            UGM
          </text>
        </svg>
      ),
    },
    {
      id: "ub",
      name: "Universitas Brawijaya",
      logo: (
        <svg width="56" height="56" viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" rx="18" fill="#7C3AED" />
          <text x="50%" y="55%" textAnchor="middle" fill="#FFF" fontWeight="700" fontSize="30" fontFamily="Inter, sans-serif">
            UB
          </text>
        </svg>
      ),
    },
    {
      id: "unair",
      name: "Universitas Airlangga",
      logo: (
        <svg width="56" height="56" viewBox="0 0 100 100" className="rounded-full">
          <rect width="100" height="100" rx="18" fill="#0EA5A4" />
          <text x="50%" y="55%" textAnchor="middle" fill="#083344" fontWeight="700" fontSize="28" fontFamily="Inter, sans-serif">
            UNAIR
          </text>
        </svg>
      ),
    },
  ];

  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage if no initialSelected and not saved in DB yet
  useEffect(() => {
    if (!initialSelected) {
      try {
        const stored = localStorage.getItem("utbk:target_university");
        if (stored) setSelected(stored);
      } catch {
        // ignore
      }
    } else {
      setSelected(initialSelected);
    }
  }, [initialSelected]);

  useEffect(() => {
    setSaved(false);
    setError(null);
  }, [selected]);

  const current = UNIVERSITIES.find((u) => u.id === selected) ?? null;

  async function handleSave() {
    if (!selected) return;
    setIsSaving(true);
    setError(null);
    try {
      // POST ke API route server untuk menyimpan ke DB
      const res = await fetch("/api/target-university", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ targetId: selected }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || "Gagal menyimpan. Cek koneksi atau login.");
        setIsSaving(false);
        return;
      }

      // Simpan juga di localStorage sebagai fallback cepat
      try {
        localStorage.setItem("utbk:target_university", selected);
      } catch {
        // ignore
      }

      setSaved(true);
    } catch (e) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleClear() {
    setSelected(null);
    setSaved(false);
    setError(null);
    try {
      localStorage.removeItem("utbk:target_university");
    } catch {}
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600">Pilih Universitas Target</label>

      <div className="mt-2 flex items-center gap-2">
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(e.target.value || null)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          disabled={isSaving}
        >
          <option value="">— Pilih —</option>
          {UNIVERSITIES.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={!selected || isSaving}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
          <Check className="h-4 w-4" />
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {selected && (
        <div className="mt-4 rounded-md border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">{current?.logo}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{current?.name}</p>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-green-600">
                      <Check className="h-4 w-4" /> Tersimpan
                    </span>
                  )}
                  <button
                    onClick={handleClear}
                    title="Hapus target"
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-slate-500">Targetmu dapat disimpan ke profil (jika sudah login).</p>
            </div>
          </div>
        </div>
      )}

      {!selected && <div className="mt-3 text-xs text-slate-500">Belum memilih target universitas.</div>}
    </div>
  );
}
