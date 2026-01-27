import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader'; // 1. Import ini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Platform UTBK",
  description: "Latihan Soal UTBK Intensif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* 2. Pasang Component ini disini */}
        <NextTopLoader 
          color="#4F46E5" // Warna Indigo
          height={4} 
          showSpinner={false} 
        />
        {children}
      </body>
    </html>
  );
}