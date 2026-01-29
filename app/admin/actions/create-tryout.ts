'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTryout(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Cek Auth & Role Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { message: "Unauthorized", error: "Anda belum login." };

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
      return { message: "Forbidden", error: "Akses ditolak. Anda bukan Admin." };
  }

  // 2. Ambil Data dari Form
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const duration = parseInt(formData.get("duration") as string);
  const isPublic = formData.get("is_public") === "on"; // Checkbox mengembalikan "on" jika dicentang

  // Validasi Input
  if (!title || !category || isNaN(duration)) {
    return { message: "Validasi Gagal", error: "Judul, Kategori, dan Durasi wajib diisi!" };
  }

  // 3. Insert ke Database
  try {
    const { error } = await supabase.from("tryouts").insert({
      title,
      category,
      duration_minutes: duration,
      is_public: isPublic,
    });

    if (error) throw error;

  } catch (error: any) {
    return { message: "Database Error", error: error.message };
  }

  // 4. Refresh & Redirect
  revalidatePath("/admin");
  redirect("/admin");
}