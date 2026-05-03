import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ぷよぷよ — Modern Puyo Puyo",
  description: "A modern Puyo Puyo game built with Next.js 16, React 19, and Framer Motion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ height: '100%' }}
    >
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}
