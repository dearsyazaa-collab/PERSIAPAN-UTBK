import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-600 font-medium animate-pulse">Memuat data...</p>
      </div>
    </div>
  );
}