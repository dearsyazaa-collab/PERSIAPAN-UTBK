import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import BankSoalClient from "@/components/BankSoalClient"

// 1. Definisi Tipe Props Baru
type Props = {
  params: Promise<{ category: string; packId: string }>
}

export default async function QuizPage({ params }: Props) {
  // 2. WAJIB: Await params
  const { category, packId } = await params

  const supabase = await createClient()

  // 3. Ambil data Paket
  const { data: pack } = await supabase
    .from('question_packs')
    .select('*')
    .eq('id', packId)
    .single()

  if (!pack) {
    return <div className="p-10 text-center">Paket soal tidak ditemukan.</div>
  }

  // 4. Ambil Soal-soalnya
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('pack_id', packId)
    .order('created_at', { ascending: true })

  // 5. Kirim ke Client Component
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <BankSoalClient 
        questions={questions || []} 
        title={pack.title}
        categorySlug={category}
      />
    </div>
  )
}