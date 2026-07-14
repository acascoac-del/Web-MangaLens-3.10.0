"use client";

import { motion } from "framer-motion";
import { languages } from "./data";
import { SectionHeading } from "./SectionHeading";

export function Languages() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Idiomas Soportados"
          title={
            <>
              10 idiomas destino,{" "}
              <span className="text-gradient-red">uno por clic</span>
            </>
          }
          subtitle="Cambiá el idioma destino desde el popup sin reiniciar la página. MangaLens detecta automáticamente el idioma origen del manga (japonés, coreano, chino o inglés)."
        />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {languages.map((lang, idx) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="glass-card rounded-xl p-5 text-center cursor-default hover:border-red-500/40 hover:bg-accent/40 transition-colors"
            >
              <div className="text-4xl mb-2">{lang.flag}</div>
              <div className="text-sm font-bold">{lang.name}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                {lang.code}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          ¿Necesitás otro idioma?{" "}
          <a
            href="https://github.com/zyddnys/manga-image-translator"
            target="_blank"
            rel="noreferrer"
            className="text-red-400 hover:text-red-300 font-semibold"
          >
            Solicitalo en GitHub →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
