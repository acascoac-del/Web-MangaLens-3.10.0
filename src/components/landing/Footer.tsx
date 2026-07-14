"use client";

import { Chrome, Github, Heart, ExternalLink } from "lucide-react";

const footerLinks = [
  {
    title: "Producto",
    links: [
      { label: "Características", href: "#features" },
      { label: "Cómo funciona", href: "#how-it-works" },
      { label: "Motores", href: "#modes" },
      { label: "Idiomas", href: "#languages" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Instalación",
    links: [
      { label: "Agregar a Chrome", href: "#install" },
      { label: "Configurar Docker + MIT", href: "#install" },
      { label: "Configurar Ollama", href: "#install" },
      { label: "Configurar LibreTranslate", href: "#install" },
      { label: "Crear cuenta en Groq", href: "#install" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "MangaImageTranslator", href: "https://github.com/zyddnys/manga-image-translator" },
      { label: "Groq Console", href: "https://console.groq.com" },
      { label: "Ollama", href: "https://ollama.com" },
      { label: "LibreTranslate", href: "https://libretranslate.com" },
      { label: "LocalAI", href: "https://localai.io" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-gradient-to-b from-transparent to-red-950/20">
      <div className="absolute inset-0 bg-halftone-red opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* CTA banner */}
        <div className="glass-card-red rounded-2xl p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-1">
              ¿Listo para traducir manga?
            </h3>
            <p className="text-sm text-muted-foreground">
              Instalá MangaLens ahora y empezá a leer tu manga favorito en
              español en menos de un minuto.
            </p>
          </div>
          <a
            href="#install"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all whitespace-nowrap"
          >
            <Chrome className="h-4 w-4" />
            Agregar a Chrome
          </a>
        </div>

        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-red-400 transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md overflow-hidden ring-1 ring-red-500/40">
              <img
                src="/mangalens/icon128.png"
                alt="MangaLens"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-sm">
              <span className="font-bold">
                Manga<span className="text-red-500">Lens</span>
              </span>
              <span className="text-muted-foreground ml-2 text-xs">
                v3.10.0 · Manifest V3
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://github.com/zyddnys/manga-image-translator"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span className="text-muted-foreground/40">·</span>
            <a
              href="https://chrome.google.com/webstore/devconsole"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Chrome className="h-3.5 w-3.5" />
              Chrome Store
            </a>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              Hecho con{" "}
              <Heart className="h-3 w-3 text-red-500 fill-red-500" /> para la
              comunidad manga
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
