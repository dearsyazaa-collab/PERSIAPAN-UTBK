// scripts/seed-questions.ts

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// ... imports

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// [PERUBAHAN DISINI]
// Kita prioritaskan Service Role Key agar bisa menembus RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Pastikan SUPABASE_SERVICE_ROLE_KEY sudah ada di .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ... sisanya sama

// Lokasi file JSON Anda
const JSON_FILE_PATH = path.join(process.cwd(), 'questions.json'); 

async function seed() {
  console.log('🚀 Memulai migrasi data dari questions.json...');

  try {
    // 1. Baca File JSON
    const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    // 2. Loop setiap "Pack" (Setiap Tryout)
    for (const pack of data.packs) {
      console.log(`\n📦 Memproses Paket: ${pack.title}`);

      // A. Insert ke tabel 'tryouts'
      const { data: tryoutData, error: tryoutError } = await supabase
        .from('tryouts')
        .insert({
          title: pack.title,
          description: `Subtest: ${pack.subtest}`,
          duration_minutes: pack.time_limit_minutes,
          is_public: true, // Langsung publish untuk testing
        })
        .select()
        .single();

      if (tryoutError) {
        console.error(`   ❌ Gagal membuat tryout: ${tryoutError.message}`);
        continue;
      }

      const tryoutId = tryoutData.id;
      console.log(`   ✅ Tryout Created (ID: ${tryoutId})`);

      // B. Proses Soal-soal dalam Paket ini
      let questionCounter = 0;
      for (const q of pack.questions) {
        questionCounter++;

        // TRANSFORMASI PENTING: Ubah format 'choices' object ke array JSONB
        // Dari: { "A": "Teks A", "B": "Teks B" }
        // Ke:   [ { "code": "A", "text": "Teks A" }, ... ]
        const optionsArray = Object.entries(q.choices).map(([key, value]) => ({
            code: key,
            text: value
        }));

        // Bersihkan subject (Ambil singkatan dalam kurung jika ada, misal "Penalaran Umum (PU)" -> "PU")
        const subjectMatch = pack.subtest.match(/\(([^)]+)\)/);
        const subjectCode = subjectMatch ? subjectMatch[1] : pack.subtest;

        // C. Insert ke tabel 'questions'
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .insert({
            content: q.stem,
            options: optionsArray, // Format baru
            correct_answer: q.answer,
            explanation: q.explanation,
            subject: subjectCode,
            tags: q.tags
          })
          .select()
          .single();

        if (questionError) {
          console.error(`      ❌ Gagal insert soal ${q.qid}: ${questionError.message}`);
          continue;
        }

        // D. Hubungkan Soal ke Tryout (Tabel Relasi)
        const { error: relationError } = await supabase
          .from('tryout_questions')
          .insert({
            tryout_id: tryoutId,
            question_id: questionData.id,
            display_order: questionCounter
          });

        if (relationError) {
          console.error(`      ❌ Gagal menghubungkan soal: ${relationError.message}`);
        } else {
            process.stdout.write('.'); // Indikator sukses sederhana
        }
      }
      console.log(`\n   ✅ Selesai mengimpor ${questionCounter} soal untuk paket ini.`);
    }

    console.log('\n🎉 SEMUA MIGRASI SELESAI!');

  } catch (err) {
    console.error('❌ Terjadi kesalahan fatal:', err);
  }
}

seed();