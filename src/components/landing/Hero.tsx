"use client";

import { motion } from "framer-motion";
import { Chrome, Play, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "./data";

function PopupMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      className="relative w-[300px] mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-8 bg-gradient-to-br from-red-600/30 via-rose-600/20 to-transparent blur-3xl pointer-events-none" />

      {/* Popup container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-float">
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-rose-800 px-5 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-lg">
            🔍
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base leading-none">
              MangaLens
            </div>
            <div className="text-white/60 text-[10px] mt-1">
              Traductor de Manga
            </div>
          </div>
          <span className="bg-black/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            v3.10
          </span>
        </div>

        {/* Body */}
        <div className="bg-[#111] p-4 space-y-3.5">
          <button className="w-full bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold py-3 rounded-lg shadow-lg shadow-red-600/30">
            📄 Traducir toda la página
          </button>
          <button className="w-full bg-[#1c1c1c] text-[#bbb] text-xs font-bold py-3 rounded-lg border border-[#2a2a2a]">
            🔤 Activar modo clic
          </button>

          <div className="pt-1">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[#555] mb-2">
              Configuración
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">🌍</span>
                <span className="text-[11px] text-[#999] font-semibold w-10">
                  Idioma
                </span>
                <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] text-[#eee] text-[11px] font-semibold py-1.5 px-2.5 rounded-lg">
                  🇦🇷 Español
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">🔤</span>
                <span className="text-[11px] text-[#999] font-semibold w-10">
                  Fuente
                </span>
                <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] text-[#eee] text-[11px] font-semibold py-1.5 px-2.5 rounded-lg">
                  Bangers — Cómic
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">⚙️</span>
                <span className="text-[11px] text-[#999] font-semibold w-10">
                  Motor
                </span>
                <div className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] text-[#eee] text-[11px] font-semibold py-1.5 px-2.5 rounded-lg">
                  🔀 Híbrido
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0a0a0a] px-4 py-2.5 flex justify-between items-center border-t border-[#1a1a1a]">
          <span className="text-[10px] text-[#555] font-semibold">
            ⚙️ Avanzado
          </span>
          <span className="text-[9px] text-[#333]">MIT</span>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -right-6 top-12 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl rotate-6"
      >
        ⚡ Ultra rápido
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -left-6 bottom-20 bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl -rotate-6"
      >
        🔒 100% privado
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-halftone-red opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-red-600/20 via-rose-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left column */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card-red text-xs font-medium text-red-300 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              v3.10.2 · MIT · Groq · MiMo · Docker Local
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
            >
              Traducí{" "}
              <span className="text-gradient-red">Manga</span> en
              <br className="hidden sm:block" /> tu Navegador
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              MangaLens traduce manga, cómics y manhwa directamente en Chrome.
              OCR + IA + Inpainting con{" "}
              <span className="text-foreground font-semibold">
                5 motores híbridos
              </span>{" "}
              y{" "}
              <span className="text-foreground font-semibold">
                10 idiomas
              </span>
              . 100% gratis y open source.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-xl shadow-red-600/30 text-base h-12 px-6"
              >
                <a href="https://chromewebstore.google.com/detail/iifomfljpcmmpmjhapinfmahfoccikjc?utm_source=item-share-cb" target="_blank" rel="noreferrer">
                  <Chrome className="h-5 w-5 mr-2" />
                  Agregar a Chrome
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-border/60 hover:bg-accent text-base h-12 px-6"
              >
                <a href="#how-it-works">
                  <Play className="h-4 w-4 mr-2" />
                  Ver cómo funciona
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex items-center gap-3 justify-center lg:justify-start text-xs text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {["🇦🇷", "🇺🇸", "🇧🇷", "🇯🇵", "🇰🇷"].map((flag, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full bg-card border-2 border-background flex items-center justify-center text-xs"
                  >
                    {flag}
                  </div>
                ))}
              </div>
              <span>
                Sin registro · Sin tracking · Compatible con Chrome, Edge,
                Brave y Arc
              </span>
            </motion.div>
          </div>

          {/* Right column - popup mockup */}
          <div className="relative">
            <PopupMockup />
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-5 text-center hover:border-red-500/30 transition-colors"
            >
              <stat.icon className="h-5 w-5 mx-auto text-red-400 mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-gradient-red">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
