import { createClient } from '@/utils/supabase/server'
import BankSoalClient from "@/components/BankSoalClient"
import DashboardLayout from "@/components/DashboardLayout"
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.category

  const supabase = await createClient()

  console.log("🔍 Mencari soal untuk slug:", categorySlug)

  // 1. Ambil Soal + Data Kategorinya (JOIN)
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      categories!inner (
        name,
        slug
      )
    `)
    // Filter berdasarkan 'slug' di tabel categories, BUKAN kolom di tabel questions
    .eq('categories.slug', categorySlug)

  if (error) {
    console.error("❌ Error Database:", error.message)
    // Jangan biarkan error, tampilkan array kosong saja agar UI tidak crash
  }

  const safeQuestions = questions || []
  
  // Ambil Judul Kategori langsung dari data hasil join
  // @ts-ignore
  const title = safeQuestions.length > 0 ? safeQuestions[0].categories?.name : "Latihan Soal"

  return (
    <DashboardLayout>
      <BankSoalClient 
        questions={safeQuestions} 
        title={title}
        categorySlug={categorySlug}
      />
    </DashboardLayout>
  )
}