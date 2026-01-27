'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // 1. Ambil Username
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // 2. Trik: Gabungkan dengan domain fiktif
  // Jadi kalau user ketik "budi", sistem baca "budi@utbk.com"
  const fakeEmail = `${username}@utbk.com`

  // 3. Login ke Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email: fakeEmail,
    password,
  })

  if (error) {
    // Pesan error lebih ramah
    return redirect('/login?message=Username atau Password Salah')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// Function Signup SUDAH DIHAPUS karena user tidak boleh daftar sendiri.