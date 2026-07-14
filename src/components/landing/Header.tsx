"use client";

import { useEffect, useState } from "react";
import { Menu, X, Chrome, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Características" },
  { href: "#how-it-works", label: "Cómo funciona" },
  { href: "#modes", label: "Motores" },
  { href: "#install", label: "Instalación" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-lg overflow-hidden ring-2 ring-red-500/40 group-hover:ring-red-500/80 transition-all">
              <img
                src="/mangalens/icon128.png"
                alt="MangaLens"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight">
                Manga<span className="text-red-500">Lens</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                v3.10.0
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <a
                href="https://github.com/zyddnys/manga-image-translator"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/30"
            >
              <a href="#install">
                <Chrome className="h-4 w-4 mr-2" />
                Agregar a Chrome
              </a>
            </Button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-md hover:bg-accent"
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 border-t border-border/60 pt-2">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-md transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button
                size="sm"
                asChild
                className="mt-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white"
              >
                <a href="#install" onClick={() => setOpen(false)}>
                  <Chrome className="h-4 w-4 mr-2" />
                  Agregar a Chrome
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
