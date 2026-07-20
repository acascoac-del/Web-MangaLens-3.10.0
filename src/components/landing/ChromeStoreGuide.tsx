"use client";

import { motion } from "framer-motion";
import {
  Chrome,
  Upload,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  DollarSign,
  Clock,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  {
    icon: Chrome,
    title: "Crear cuenta de desarrollador",
    description:
      "Entrá al Chrome Web Store Developer Dashboard con tu cuenta de Google. Pagás una única vez USD 5 (se cobra al registrar la cuenta, no por extensión). Este fee es de por vida.",
    code: "https://chrome.google.com/webstore/devconsole",
    codeLabel: "URL del Developer Dashboard",
    external: true,
    tips: [
      "El pago se hace con Google Wallet · acepta tarjetas internacionales y PayPal",
      "La cuenta queda verificada en menos de 5 minutos",
      "Podés publicar extensiones ilimitadas con la misma cuenta",
    ],
  },
  {
    icon: Upload,
    title: "Subir el .zip de la extensión",
    description:
      "En el dashboard, hacé clic en 'Add new item' → 'Upload'. Subí el archivo MangaLens-3.10.2.zip (no hace falta descomprimirlo). Chrome valida automáticamente el manifest.json y la estructura.",
    code: "MangaLens-3.10.2.zip",
    codeLabel: "Archivo a subir (36 KB)",
    external: false,
    tips: [
      "El .zip debe contener manifest.json en la raíz (no dentro de una subcarpeta)",
      "El campo version en manifest.json debe incrementarse en cada upload nuevo",
      "Si la extensión usa service worker, debe estar referenciado en manifest.background.service_worker",
    ],
  },
  {
    icon: ImageIcon,
    title: "Subir capturas de pantalla y assets",
    description:
      "Necesitás al menos 1-5 capturas (1280x800 o 640x400 px PNG). Recomendamos 5 capturas mostrando: popup, opciones, modo clic, antes/después de traducción, e idiomas. También un ícono de tienda 128x128 y un tile 440x280.",
    code: "5 screenshots · 1 store icon · 1 small tile",
    codeLabel: "Assets requeridos",
    external: false,
    tips: [
      "Las capturas son lo que más impacta la tasa de instalación — hacelas profesionales",
      "Usá https://screenshot.rocks para generar mockups en navegador automáticamente",
      "El tile pequeño (440x280) aparece en los resultados de búsqueda",
    ],
  },
  {
    icon: FileText,
    title: "Completar metadata del listing",
    description:
      "Llená nombre (máx 75 chars), descripción corta (132 chars), descripción larga (16.000 chars), categoría (Productivity), idiomas soportados, y link a la política de privacidad. La descripción larga admite Markdown básico.",
    code: "MangaLens Translator — Traductor de manga, cómics y manhwa",
    codeLabel: "Ejemplo de título optimizado",
    external: false,
    tips: [
      "Poné palabras clave en el título y descripción: 'manga', 'translator', 'OCR', 'comics'",
      "La política de privacidad debe ser pública (la podés hostear en GitHub Pages)",
      "Marca 'single purpose' en el formulario: la extensión solo traduce imágenes",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Declarar permisos y privacidad",
    description:
      "Chrome pide justificar cada permiso. MangaLens usa: activeTab (para acceder a la pestaña activa), storage (configuración), contextMenus (menú clic derecho), scripting (inyectar scripts). host_permissions: '<all_urls>'.",
    code: "activeTab, storage, contextMenus, scripting, <all_urls>",
    codeLabel: "Permisos del manifest.json",
    external: false,
    tips: [
      "Justificá <all_urls> así: 'La extensión necesita detectar imágenes de manga en cualquier sitio que el usuario visite'",
      "Si tu extensión pide permisos amplios, el review tarda más (hasta 7 días hábiles)",
      "Marcá las casillas: 'No vende ni transfiere datos a terceros', 'No usa datos para fines no relacionados'",
    ],
  },
  {
    icon: Send,
    title: "Enviar para revisión",
    description:
      "Revisá todo en 'Submit for review'. Chrome Store revisa en 1-3 días hábiles (extensiones nuevas pueden tardar hasta 7 días). Recibirás un email cuando se apruebe o si hay correcciones requeridas.",
    code: "Status: In review → Pending → Published",
    codeLabel: "Flujo de estados",
    external: false,
    tips: [
      "Si te rechazan, el email explica exactamente qué corregir. Subí una nueva versión con el fix",
      "Mientras esté en review, no podés editar el listing — solo el código",
      "Las actualizaciones posteriores a una extensión ya aprobada tardan menos (1-2 días)",
    ],
  },
];

export function ChromeStoreGuide() {
  return (
    <section
      id="publish"
      className="relative py-20 sm:py-28"
    >
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-amber-600/15 via-orange-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Publicar en Chrome Web Store"
          title={
            <>
              De tu PC a la{" "}
              <span className="text-gradient-red">Chrome Web Store</span> en 6 pasos
            </>
          }
          subtitle="Guía completa para publicar MangaLens en https://chrome.google.com/webstore/devconsole. Te lleva menos de 30 minutos preparar todo (sin contar el tiempo de revisión de Google)."
        />

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 glass-card-red rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Chrome className="h-5 w-5 text-red-400" />
              Abrí el Developer Dashboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Necesitás cuenta de Google + USD 5 (pago único de por vida).
            </p>
          </div>
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/30"
          >
            <a
              href="https://chrome.google.com/webstore/devconsole"
              target="_blank"
              rel="noreferrer"
            >
              Ir al Dashboard
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </motion.div>

        {/* Steps */}
        <div className="mt-14 space-y-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="relative"
            >
              <div className="glass-card rounded-2xl p-6 hover:border-red-500/30 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: number + icon */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:w-32 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <step.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold text-gradient-red">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Right: content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <div className="mb-4">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        {step.codeLabel}
                      </div>
                      <div className="code-block no-prefix">
                        <code>{step.code}</code>
                        {step.external && (
                          <ExternalLink className="inline-block h-3 w-3 ml-2 text-red-400" />
                        )}
                      </div>
                    </div>

                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value={`tips-${idx}`}
                        className="border-0"
                      >
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2 text-amber-300">
                          💡 Tips para este paso ({step.tips.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 mt-2">
                            {step.tips.map((tip, tipIdx) => (
                              <li
                                key={tipIdx}
                                className="text-xs text-muted-foreground flex gap-2"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Important considerations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid md:grid-cols-3 gap-4"
        >
          <div className="glass-card rounded-xl p-5">
            <DollarSign className="h-6 w-6 text-emerald-400 mb-3" />
            <h4 className="font-bold text-sm mb-1">Costo total</h4>
            <p className="text-xs text-muted-foreground">
              USD 5 únicos · sin costos recurrentes · sin comisión por
              instalación
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <Clock className="h-6 w-6 text-amber-400 mb-3" />
            <h4 className="font-bold text-sm mb-1">Tiempo de revisión</h4>
            <p className="text-xs text-muted-foreground">
              1-3 días hábiles para extensiones nuevas · hasta 7 días si usa
              permisos amplios
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <AlertTriangle className="h-6 w-6 text-rose-400 mb-3" />
            <h4 className="font-bold text-sm mb-1">Requisitos</h4>
            <p className="text-xs text-muted-foreground">
              Cuenta Google + política de privacidad pública + manifest V3
              válido
            </p>
          </div>
        </motion.div>

        {/* Privacy policy template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 glass-card-red rounded-2xl p-6 sm:p-8"
        >
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            Política de Privacidad (plantilla lista para usar)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Google requiere una URL pública con tu política de privacidad.
            Copiá este texto en un archivo <code>privacy.md</code> en tu repo de
            GitHub y activá GitHub Pages para tener una URL pública gratuita.
          </p>
          <pre className="code-block no-prefix whitespace-pre-wrap text-xs leading-relaxed">
{`# Política de Privacidad — MangaLens

Última actualización: ${new Date().toLocaleDateString("es-AR")}

## Datos que recopilamos
MangaLens NO recopila, almacena ni transmite datos personales
identificables. La extensión funciona 100% en el navegador del usuario.

## Permisos que usa
- activeTab: acceder a la pestaña activa cuando el usuario hace clic
- storage: guardar configuración (idioma, fuente, motor) vía chrome.storage
- contextMenus: agregar opción "Traducir manga" al menú contextual
- scripting: inyectar scripts de traducción en la página activa
- <all_urls>: detectar imágenes en cualquier sitio que el usuario visite

## Servicios de terceros
MangaLens permite al usuario configurar motores de traducción externos:
- MangaImageTranslator (mangaimagetranslator.com): servidor público MIT
- Groq (groq.com): inferencia LLM con plan gratuito
- Xiaomi MiMo (platform.xiaomimimo.com): modelos MiMo-V2.5

Las imágenes se envían a estos servicios SOLO cuando el usuario los
configura explícitamente. Las API keys se almacenan localmente con
chrome.storage.sync y nunca se comparten con terceros.

## Modo 100% local
Con Docker Local / Ollama / LibreTranslate, ninguna imagen sale del
dispositivo del usuario. Recomendado para contenido sensible.

## Contacto
Para consultas de privacidad: abrí un issue en
https://github.com/zyddnys/manga-image-translator`}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
