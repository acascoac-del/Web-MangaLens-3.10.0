import {
  Globe,
  Zap,
  Eye,
  Languages as LanguagesIcon,
  ShieldCheck,
  MousePointerClick,
  Cpu,
  Sparkles,
  Container,
  Cloud,
  Lock,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
};

export const features: Feature[] = [
  {
    icon: Globe,
    title: "5 Motores Híbridos",
    description:
      "Combiná MIT, Groq, Xiaomi MiMo y Docker Local en modo híbrido con fallback automático. Si un proveedor falla o se satura, MangaLens salta al siguiente sin que notes la interrupción.",
    accent: "from-red-500 to-rose-700",
  },
  {
    icon: Sparkles,
    title: "Inpainting Inteligente",
    description:
      "Detecta los bocadillos de texto, borra el original japonés y reconstruye el fondo del dibujo con IA. Después superpone tu traducción con fuente estilo cómic para un acabado profesional.",
    accent: "from-amber-400 to-orange-600",
  },
  {
    icon: Zap,
    title: "Ultra Rápido",
    description:
      "El modo OCR-only es 3-5x más rápido que la pipeline completa. MIT extrae los bloques de texto y la traducción se ejecuta en paralelo con Groq o NLLB local. Resultado: páginas listas en segundos.",
    accent: "from-yellow-400 to-amber-600",
  },
  {
    icon: LanguagesIcon,
    title: "10 Idiomas",
    description:
      "Traducí a Español, Inglés, Portugués, Francés, Alemán, Italiano, Ruso, Chino, Coreano o Japonés. Cada idioma se sirve desde el mejor motor disponible según velocidad y calidad.",
    accent: "from-rose-400 to-red-600",
  },
  {
    icon: ShieldCheck,
    title: "100% Privado",
    description:
      "Con Docker Local (LocalAI/Ollama) toda la inferencia ocurre en tu máquina. Sin API keys, sin internet, sin enviar tus imágenes a servidores de terceros. Perfecto para manhwa 18+ o contenido sensible.",
    accent: "from-emerald-400 to-teal-600",
  },
  {
    icon: MousePointerClick,
    title: "Dos Modos de Uso",
    description:
      "Traducir toda la página de un clic, o activar el modo clic para ir imagen por imagen. Botón flotante configurable, auto-traducción al cargar, y atajos de teclado para potenciales flujos de lectura.",
    accent: "from-fuchsia-400 to-purple-600",
  },
];

export type TranslationMode = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  speed: number; // 1-5
  privacy: number; // 1-5
  cost: "Gratis" | "Freemium" | "Token Plan";
  setup: "Cero" | "Fácil" | "Media" | "Avanzada";
  needs: string;
  best: string;
  accent: string;
};

export const modes: TranslationMode[] = [
  {
    id: "hybrid",
    name: "Híbrido",
    emoji: "🔀",
    tagline: "MIT → Groq → MiMo → Docker. El mejor motor gana.",
    speed: 5,
    privacy: 3,
    cost: "Gratis",
    setup: "Fácil",
    needs: "Cualquier motor configurado",
    best: "Uso diario — recomendado por defecto",
    accent: "from-red-500 to-rose-700",
  },
  {
    id: "mit",
    name: "MIT Público",
    emoji: "🌐",
    tagline: "Servidor público mangaimagetranslator.com. Sin setup.",
    speed: 3,
    privacy: 2,
    cost: "Gratis",
    setup: "Cero",
    needs: "Solo instalar la extensión",
    best: "Empezar sin configurar nada",
    accent: "from-sky-400 to-blue-600",
  },
  {
    id: "groq",
    name: "Groq",
    emoji: "⚡",
    tagline: "LPU de Groq — la inferencia más rápida del mercado.",
    speed: 5,
    privacy: 2,
    cost: "Freemium",
    setup: "Fácil",
    needs: "API Key gratuita de console.groq.com",
    best: "Velocidad máxima con plan gratuito generoso",
    accent: "from-amber-400 to-orange-600",
  },
  {
    id: "mimo",
    name: "Xiaomi MiMo",
    emoji: "🤖",
    tagline: "MiMo-V2.5 con visión multimodal. Compatible OpenAI.",
    speed: 4,
    privacy: 2,
    cost: "Token Plan",
    setup: "Media",
    needs: "Suscripción Token Plan + API Key",
    best: "Calidad superior en chino y coreano",
    accent: "from-fuchsia-400 to-pink-600",
  },
  {
    id: "docker",
    name: "Docker Local",
    emoji: "🐳",
    tagline: "LocalAI / Ollama / LibreTranslate en tu PC.",
    speed: 3,
    privacy: 5,
    cost: "Gratis",
    setup: "Avanzada",
    needs: "Docker + contenedor LocalAI/MIT",
    best: "Máxima privacidad — sin internet",
    accent: "from-emerald-400 to-teal-600",
  },
];

export type LangItem = {
  code: string;
  name: string;
  flag: string;
};

export const languages: LangItem[] = [
  { code: "es", name: "Español", flag: "🇦🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

export type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const steps: Step[] = [
  {
    number: "01",
    title: "Instalá la extensión",
    description:
      "Hacé clic en 'Agregar a Chrome' y confirmá en la Chrome Web Store. En 5 segundos aparece el ícono 🔍 de MangaLens en tu barra de herramientas. Sin registros, sin permisos extraños.",
    icon: Container,
  },
  {
    number: "02",
    title: "Elegí tu motor e idioma",
    description:
      "Hacé clic en el ícono 🔍 → seleccioná tu idioma destino (español por defecto) y dejá 'Híbrido' como motor para máxima disponibilidad. ¿Querés más velocidad o privacidad? Explorá Opciones Avanzadas.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Traducí cualquier manga",
    description:
      "Navegá a tu sitio de manga favorito y hacé clic en 'Traducir toda la página'. ¿Preferís ir imagen por imagen? Activá el modo clic y seleccioná solo lo que quieras traducir. Listo.",
    icon: Eye,
  },
];

export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: FaqItem[] = [
  {
    q: "¿MangaLens es gratis?",
    a: "Sí, 100% gratis y open source. El modo MIT Público y el modo Docker Local no requieren ninguna cuenta ni API key. Los modos Groq y MiMo ofrecen planes gratuitos o de pago administrados por esos proveedores, no por MangaLens.",
  },
  {
    q: "¿Necesito conexión a internet?",
    a: "Solo para los modos MIT Público, Groq y MiMo. El modo Docker Local con LocalAI/Ollama corre 100% en tu máquina y no requiere internet. El modo híbrido usa internet cuando está disponible y cae a Docker Local si lo configuraste como fallback.",
  },
  {
    q: "¿Qué navegadores son compatibles?",
    a: "Cualquier navegador basado en Chromium: Google Chrome, Microsoft Edge, Brave, Arc, Vivaldi y Opera. La extensión usa Manifest V3, el estándar actual de Chrome. No es compatible con Firefox o Safari.",
  },
  {
    q: "¿Cómo funciona el modo híbrido?",
    a: "El modo híbrido prueba cada motor en orden: MIT → Groq → MiMo → Docker Local. Si el primero no responde en 90-120 segundos o devuelve error, salta al siguiente automáticamente. Esto maximiza la disponibilidad sin que tengas que intervenir.",
  },
  {
    q: "¿Mis imágenes se envían a la nube?",
    a: "Solo si usás MIT Público, Groq o MiMo. En el modo Docker Local las imágenes nunca salen de tu computadora. Podés deshabilitar los motores en la nube desde Opciones Avanzadas para garantizar privacidad total.",
  },
  {
    q: "¿Funciona con manhwa y webtoons coreanos?",
    a: "Sí. MangaLens detecta texto en cualquier imagen sin importar el origen. Para coreano recomendamos el motor Xiaomi MiMo, que tiene mejor calidad en CJK. Para japonés, MIT o Groq Llama 4 funcionan excelente.",
  },
  {
    q: "¿Puedo usar mi propia fuente tipográfica?",
    a: "MangaLens incluye 6 fuentes (Bangers, Comic Sans, Arial Black, Georgia, Courier, Trebuchet). Para fuentes personalizadas, podés editar el archivo content/constants.js dentro del .zip descomprimido antes de cargar la extensión.",
  },
  {
    q: "¿La extensión recopila datos personales?",
    a: "No. MangaLens no incluye analytics ni telemetría. La única información que se almacena localmente es tu configuración (idioma, fuente, motor y API keys) usando chrome.storage.sync. Las API keys nunca se envían a terceros más allá del proveedor correspondiente.",
  },
];

export type StatItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const stats: StatItem[] = [
  { value: "5", label: "Motores de IA", icon: Cpu },
  { value: "10", label: "Idiomas destino", icon: LanguagesIcon },
  { value: "6", label: "Fuentes tipográficas", icon: Eye },
  { value: "100%", label: "Gratis y open source", icon: ShieldCheck },
];
