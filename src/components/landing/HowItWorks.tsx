"use client";

import { motion } from "framer-motion";
import { steps } from "./data";
import { SectionHeading } from "./SectionHeading";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-transparent via-red-950/10 to-transparent"
    >
      <div className="absolute inset-0 bg-halftone-red opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cómo Funciona"
          title={
            <>
              Tres pasos. <span className="text-gradient-red">Sin fricción.</span>
            </>
          }
          subtitle="Desde instalar la extensión hasta leer tu primer manga traducido, todo en menos de 60 segundos."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-red-500/0 via-red-500/40 to-red-500/0" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full" />
                <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center shadow-2xl shadow-red-600/30 ring-4 ring-background">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-400 text-black text-xs font-bold flex items-center justify-center shadow-lg ring-2 ring-background">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass-card-red text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-muted-foreground">
              Tiempo promedio de instalación:{" "}
              <span className="text-foreground font-semibold">45 segundos</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
