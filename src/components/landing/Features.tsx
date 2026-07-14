"use client";

import { motion } from "framer-motion";
import { features } from "./data";
import { SectionHeading } from "./SectionHeading";

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Características"
          title={
            <>
              Todo lo que necesitás para{" "}
              <span className="text-gradient-red">traducir manga</span>
            </>
          }
          subtitle="MangaLens combina OCR de última generación, IA multimodal y técnicas de inpainting para darte resultados profesionales sin salir del navegador."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative glass-card rounded-2xl p-6 hover:border-red-500/30 hover:bg-accent/40 transition-all duration-300"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
