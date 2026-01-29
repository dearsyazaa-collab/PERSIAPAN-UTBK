'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createQuestion(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Ambil Data dari Form
  const tryoutId = formData.get("tryoutId") as string;
  const content = formData.get("content") as string;
  const correctAnswer = formData.get("correctAnswer") as string;
  const explanation = formData.get("explanation") as string;

  // Tangkap 5 Opsi Jawaban (A-E)
  const options = [
    { code: "A", text: formData.get("option_A") as string },
    { code: "B", text: formData.get("option_B") as string },
    { code: "C", text: formData.get("option_C") as string },
    { code: "D", text: formData.get("option_D") as string },
    { code: "E", text: formData.get("option_E") as string },
  ];

  // 2. Validasi Simple
  if (!content || !correctAnswer || options.some(o => !o.text)) {
    return { message: "Error", error: "Soal, Kunci Jawaban, dan Semua Opsi wajib diisi!" };
  }

  try {
    // 3. Insert ke tabel QUESTIONS (Master Soal)
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .insert({
        content,
        options, // Disimpan sebagai JSONB
        correct_answer: correctAnswer,
        explanation
      })
      .select("id")
      .single();

    if (questionError) throw questionError;

    // 4. Hubungkan ke tabel TRYOUT_QUESTIONS (Relasi)
    const { error: relationError } = await supabase
      .from("tryout_questions")
      .insert({
        tryout_id: tryoutId,
        question_id: questionData.id,
        display_order: 1 // Nanti bisa dibikin logic auto-increment
      });

    if (relationError) throw relationError;

  } catch (error: any) {
    return { message: "Database Error", error: error.message };
  }

  // 5. Sukses
  revalidatePath(`/admin/kelola-soal/${tryoutId}`);
  return { message: "Success" };
}