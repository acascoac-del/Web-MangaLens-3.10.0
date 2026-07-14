"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, DollarSign, Wrench } from "lucide-react";
import { modes } from "./data";
import { SectionHeading } from "./SectionHeading";

function RatingBar({
  value,
  max = 5,
  color = "amber",
}: {
  value: number;
  max?: number;
  color?: "amber" | "emerald";
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-6 rounded-full ${
            i < value
              ? color === "amber"
                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                : "bg-gradient-to-r from-emerald-400 to-teal-500"
              : "bg-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

export function TranslationModes() {
  return (
    <section id="modes" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Motores de Traducción"
          title={
            <>
              Elegí el motor{" "}
              <span className="text-gradient-red">perfecto</span> para cada caso
            </>
          }
          subtitle="Cada modo tiene sus ventajas. El modo híbrido los combina a todos con fallback automático, pero también podés forzar uno específico desde el popup."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode, idx) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                mode.id === "hybrid"
                  ? "glass-card-red ring-2 ring-red-500/40 glow-soft"
                  : "glass-card hover:border-red-500/30"
              }`}
            >
              {mode.id === "hybrid" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-bold shadow-lg">
                  ⭐ RECOMENDADO
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${mode.accent} flex items-center justify-center text-2xl shadow-lg`}
                >
                  {mode.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">
                    {mode.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {mode.tagline}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    Velocidad
                  </div>
                  <RatingBar value={mode.speed} color="amber" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    Privacidad
                  </div>
                  <RatingBar value={mode.privacy} color="emerald" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    Costo
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {mode.cost}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="h-3.5 w-3.5 text-sky-400" />
                    Setup
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {mode.setup}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  Necesitás
                </div>
                <p className="text-xs text-foreground/80 mb-3">
                  {mode.needs}
                </p>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  Ideal para
                </div>
                <p className="text-xs text-foreground/80">{mode.best}</p>
              </div>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-red-950/60 via-rose-950/40 to-background border border-red-500/30 flex flex-col justify-center"
          >
            <Star className="h-8 w-8 text-amber-400 mb-3" />
            <h3 className="text-lg font-bold mb-2">¿No sabés cuál elegir?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Dejá el modo <strong className="text-foreground">Híbrido</strong>{" "}
              activado. MangaLens prueba cada motor en orden y usa el primero que
              responda, asegurando máxima disponibilidad.
            </p>
            <a
              href="#install"
              className="text-sm font-semibold text-red-400 hover:text-red-300 inline-flex items-center gap-1"
            >
              Configurar motores →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
