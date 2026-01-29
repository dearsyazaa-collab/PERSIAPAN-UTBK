"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // CSS wajib untuk rumus matematika
import Image from "next/image";

interface QuestionRendererProps {
  content: string;
  imageUrl?: string | null;
  className?: string; // Untuk menerima ukuran font dari parent
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ content, imageUrl, className }) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {/* 1. Tampilkan Gambar (Jika ada) */}
      {imageUrl && (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-4">
           <Image 
             src={imageUrl} 
             alt="Ilustrasi Soal" 
             fill 
             className="object-contain" // Agar gambar utuh (tidak terpotong)
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           />
        </div>
      )}

      {/* 2. Render Teks Soal + Rumus (Markdown) */}
      {/* class 'prose' dari tailwind typography membuat teks rapi otomatis */}
      <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-strong:text-slate-900 prose-img:rounded-xl">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Override paragraph agar mengikuti ukuran font dinamis dari parent
            p: ({ node, ...props }) => <p className={className} {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default QuestionRenderer;