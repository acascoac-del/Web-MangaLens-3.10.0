"use client";

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TranslationModes } from "@/components/landing/TranslationModes";
import { Languages } from "@/components/landing/Languages";
import { Installation } from "@/components/landing/Installation";
import { ChromeStoreGuide } from "@/components/landing/ChromeStoreGuide";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-red-950/30 via-rose-950/10 to-transparent" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <TranslationModes />
        <Languages />
        <Installation />
        <ChromeStoreGuide />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
