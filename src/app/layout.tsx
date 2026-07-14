import type { Metadata } from "next";
import { Geist, Geist_Mono, Bangers } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MangaLens — Traductor de Manga para Chrome | MIT · Groq · Docker",
  description:
    "Extensión de Chrome que traduce manga, cómics y manhwa directamente en el navegador. OCR + IA + Inpainting con 5 motores (MIT, Groq, MiMo, Docker Local) y 10 idiomas. 100% gratis.",
  keywords: [
    "MangaLens",
    "traductor de manga",
    "manga image translator",
    "chrome extension",
    "OCR manga",
    "inpainting manga",
    "Groq translator",
    "Ollama translator",
    "LibreTranslate",
  ],
  authors: [{ name: "MangaLens" }],
  icons: {
    icon: "/mangalens/icon128.png",
  },
  openGraph: {
    title: "MangaLens — Traductor de Manga para Chrome",
    description:
      "Traducí manga, cómics y manhwa directamente en tu navegador. 5 motores de IA, 10 idiomas, 100% gratis.",
    url: "https://mangalens.app",
    siteName: "MangaLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MangaLens — Traductor de Manga para Chrome",
    description:
      "Traducí manga, cómics y manhwa directamente en tu navegador. 5 motores de IA, 10 idiomas, 100% gratis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bangers.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
