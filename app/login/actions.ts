"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Domain dummy untuk menyamarkan username jadi email
const DUMMY_DOMAIN = "@sekolah.id";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // 1. Ambil input sebagai "username"
  const rawUsername = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 2. Ubah jadi format email untuk Supabase (misal: admin -> admin@sekolah.id)
  // Kecuali jika user mengetik email lengkap, kita biarkan.
  const email = rawUsername.includes("@") 
    ? rawUsername 
    : `${rawUsername}${DUMMY_DOMAIN}`;

  // 3. Login ke Supabase
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Login gagal. Periksa Username & Password.");
  }

  // 4. Cek Role (Admin/Siswa)
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const role = userData?.role || 'siswa';

  revalidatePath("/", "layout");
  
  // 5. Redirect sesuai Role
  if (role === 'admin') {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}