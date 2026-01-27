import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardLayout from "@/components/DashboardLayout" // Gunakan Layout Baru

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Halo, Calon Mahasiswa! 👋</h1>
        <p className="text-slate-500 mt-2">
           Selamat datang kembali. Silakan pilih menu di sidebar untuk mulai belajar.
        </p>
        
        {/* Anda bisa tambahkan widget statistik disini nanti */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
           <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-700">Bank Soal</h3>
              <p className="text-sm text-blue-600">Akses ribuan soal latihan</p>
           </div>
           {/* Tambahkan widget lain sesuai selera */}
        </div>
      </div>
    </DashboardLayout>
  )
}