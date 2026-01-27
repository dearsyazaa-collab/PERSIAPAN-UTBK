import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// 1. Definisi Tipe Props diperbarui
type Props = {
  params: Promise<{ category: string }>
}

export default async function CategoryPacksPage({ params }: Props) {
  // 2. WAJIB: Await params sebelum dipakai
  const resolvedParams = await params
  const categorySlug = resolvedParams.category // Ambil slug dari params yang sudah di-await

  // 3. Sekarang aman untuk memproses string
  const categoryTitle = categorySlug.replace(/-/g, ' ').toUpperCase()

  const supabase = await createClient()

  // Ambil data paket dari database
  const { data: packs, error } = await supabase
    .from('question_packs')
    .select('*')
    .eq('category_slug', categorySlug) // Gunakan variable yang sudah aman
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error Supabase:", error.message)
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Link href="/bank-soal" className="flex items-center text-slate-500 hover:text-slate-900 mb-6 w-fit">
        <ArrowLeft size={18} className="mr-2" />
        Kembali ke Kategori
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{categoryTitle}</h1>
        <p className="text-slate-600 mt-2">Pilih paket soal untuk mulai latihan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(!packs || packs.length === 0) ? (
           <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
             <p className="text-slate-500">Belum ada paket soal untuk kategori ini.</p>
           </div>
        ) : (
          packs.map((pack) => (
            // Perhatikan URL Link di sini juga menggunakan categorySlug yang benar
            <Link key={pack.id} href={`/bank-soal/${categorySlug}/${pack.id}`}>
              <div className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-500 transition-all cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                   <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-medium">
                     {pack.difficulty || 'Latihan'}
                   </span>
                   <span className="text-xs text-slate-400">
                     {pack.time_limit ? `${pack.time_limit} Menit` : 'Tanpa Waktu'}
                   </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 mb-2">
                  {pack.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {pack.description || 'Latihan soal intensif persiapan UTBK.'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}