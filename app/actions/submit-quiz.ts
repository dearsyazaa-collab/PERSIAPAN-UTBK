'use server'

import { createClient } from '@/utils/supabase/server' // Pastikan path ini sesuai utils kamu
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Definisi tipe data yang akan diterima
interface QuizResultPayload {
  tryout_id: string
  score: number
  total_correct: number
  total_wrong: number
}

export async function submitQuizResult(payload: QuizResultPayload) {
  const supabase = await createClient()

  // 1. Cek User Auth
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User tidak ditemukan. Harap login kembali.' }
  }

  // 2. Simpan ke Database
  const { error } = await supabase.from('quiz_results').insert({
    user_id: user.id,
    tryout_id: payload.tryout_id,
    score: payload.score,
    total_correct: payload.total_correct,
    total_wrong: payload.total_wrong,
  })

  if (error) {
    console.error('Error saving quiz result:', error)
    return { error: 'Gagal menyimpan nilai.' }
  }

  // 3. Revalidate (Opsional)
  // Ini berguna nanti jika kita punya halaman dashboard, supaya datanya langsung update
  // revalidatePath('/dashboard') 

  return { success: true }
}