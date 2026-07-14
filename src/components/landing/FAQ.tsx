"use client";

import { motion } from "framer-motion";
import { faqs } from "./data";
import { SectionHeading } from "./SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Preguntas Frecuentes"
          title={
            <>
              Todo lo que querés{" "}
              <span className="text-gradient-red">saber</span>
            </>
          }
          subtitle="¿No encontrás tu respuesta? Abrí un issue en GitHub y te respondemos en menos de 24 horas."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="glass-card rounded-xl px-5 border-border/60 data-[state=open]:border-red-500/40 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-5 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="https://github.com/zyddnys/manga-image-translator/issues"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Hacer una pregunta en GitHub →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
