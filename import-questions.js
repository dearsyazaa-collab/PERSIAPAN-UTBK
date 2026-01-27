// import-questions.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Pastikan .env.local memiliki URL dan KEY Supabase.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- MAPPING REVISI (Disesuaikan dengan JSON Anda) ---
const CATEGORY_MAP = {
  // Format: "Nama di JSON" : "Slug di Database"
  
  "Penalaran Umum (PU)": "penalaran-umum",
  
  // Perbaikan: Di JSON tertulis "Pemahaman...", bukan "Pengetahuan..."
  "Pemahaman Bacaan & Menulis (PBM)": "pengetahuan-bacaan-menulis", 
  
  "Pengetahuan & Pemahaman Umum (PPU)": "pengetahuan-pemahaman-umum",
  "Pengetahuan Kuantitatif (PK)": "pengetahuan-kuantitatif",
  "Literasi Bahasa Indonesia": "literasi-bahasa-indonesia",
  "Literasi Bahasa Inggris": "literasi-bahasa-inggris",
  
  // Mapping KMBI (Biasanya masuk ke Literasi Inggris di kurikulum baru, atau buat kategori sendiri jika mau)
  "Kemampuan Memahami Bacaan & Menulis Bahasa Inggris (KMBI)": "literasi-bahasa-inggris", 
  
  // Perbaikan: Menambahkan (PM) agar terdeteksi
  "Penalaran Matematika (PM)": "penalaran-matematika"
};

async function importData() {
  console.log('🚀 Memulai proses import (Revisi)...');

  const jsonPath = path.join(__dirname, 'questions.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const jsonData = JSON.parse(rawData);

  console.log(`📦 Ditemukan ${jsonData.packs.length} paket soal.`);

  for (const pack of jsonData.packs) {
    const slug = CATEGORY_MAP[pack.subtest];
    
    // Cek jika slug tidak ketemu
    if (!slug) {
      console.warn(`⚠️  Lewati paket "${pack.title}": Subtest "${pack.subtest}" tidak ada di mapping.`);
      continue;
    }

    console.log(`\n🔹 Memproses Paket: ${pack.title} -> Masuk ke kategori: ${slug}`);

    // 1. Insert Paket
    const { data: packData, error: packError } = await supabase
      .from('question_packs')
      .insert({
        title: pack.title,
        category_slug: slug,
        difficulty: 'campuran',
        time_limit: pack.time_limit_minutes,
        description: `Latihan soal ${pack.subtest}`
      })
      .select()
      .single();

    if (packError) {
      console.error(`❌ Gagal buat paket: ${packError.message}`);
      continue;
    }

    const packId = packData.id;

    // 2. Format Soal
    const formattedQuestions = pack.questions.map(q => ({
      pack_id: packId,
      question_text: q.stem,
      options: q.choices,
      correct_answer: q.answer,
      discussion: q.explanation, // Sekarang kolom ini sudah ada di DB
      difficulty: 'sedang'
    }));

    // 3. Insert Soal
    const { error: qError } = await supabase
      .from('questions')
      .insert(formattedQuestions);

    if (qError) {
      console.error(`   ❌ Gagal upload soal: ${qError.message}`);
      // Hapus paket jika soal gagal, biar bersih
      await supabase.from('question_packs').delete().eq('id', packId);
    } else {
      console.log(`   ✅ Berhasil upload ${formattedQuestions.length} soal (ID Paket: ${packId})`);
    }
  }

  console.log('\n🏁 Proses Selesai!');
}

importData();