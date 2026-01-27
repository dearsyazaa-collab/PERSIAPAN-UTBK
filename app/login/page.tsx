"use client";

import { useState } from "react";
import { login } from "./actions";
import { Loader2, Lock, User, KeyRound } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Logic UX Loading yang Benar
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Mencegah reload halaman
    setIsLoading(true);     // Mulai Loading
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      await login(formData);
      // PENTING: Jangan matikan loading jika sukses. 
      // Biarkan loading berputar sampai halaman dashboard muncul.
    } catch (error: any) {
      // Jika errornya karena redirect (berhasil), abaikan errornya
      if (error.message && error.message.includes("NEXT_REDIRECT")) {
        return; 
      }
      
      // Jika error beneran (password salah), matikan loading
      setErrorMessage("Username atau Password salah.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200">
        
        {/* Header Tetap Sama */}
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Portal Ujian</h1>
          <p className="text-slate-500 text-sm mt-1">Masuk menggunakan akun siswa/admin</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 flex items-center gap-2 animate-pulse">
             ⚠️ {errorMessage}
          </div>
        )}

        {/* Form dengan onSubmit Handler */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                name="username" 
                type="text" 
                required 
                autoComplete="off"
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50" 
                placeholder="Contoh: siswa01" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                name="password" 
                type="password" 
                required 
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-50" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-md active:scale-[0.98] active:bg-black disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Memproses...</span>
              </>
            ) : (
              "Mulai System"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
             <p className="text-xs text-slate-400">Hubungi Admin jika lupa password</p>
        </div>
      </div>
    </div>
  );
}