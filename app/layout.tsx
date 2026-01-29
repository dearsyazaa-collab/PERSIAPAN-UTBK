import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Platform UTBK",
  description: "Latihan Soal UTBK Intensif",
  // KONFIGURASI FAVICON
  icons: {
    icon: '/garuda.png', 
    shortcut: '/garuda.png',
    apple: '/garuda.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <NextTopLoader 
          color="#4F46E5"
          height={4} 
          showSpinner={false} 
        />
        {children}
      </body>
    </html>
  );
}