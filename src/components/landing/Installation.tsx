"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Cpu,
  Languages,
  Zap,
  Apple,
  Monitor,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Info,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function CodeBlock({
  code,
  prefix = true,
  language = "bash",
}: {
  code: string;
  prefix?: boolean;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group my-3">
      <pre
        className={`code-block ${prefix ? "" : "no-prefix"} overflow-x-auto`}
      >
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-black/40 hover:bg-black/60 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copiar código"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

function InfoBox({
  type = "info",
  children,
}: {
  type?: "info" | "warning";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`my-4 p-4 rounded-lg border flex gap-3 text-sm ${
        type === "warning"
          ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
          : "bg-sky-500/10 border-sky-500/30 text-sky-200"
      }`}
    >
      {type === "warning" ? (
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      ) : (
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}

function StepItem({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 mb-6 last:mb-0">
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-red-600/30">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-2 text-foreground">{title}</h4>
        <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function OsIcon({ os }: { os: "windows" | "mac" | "linux" }) {
  if (os === "windows") return <Monitor className="h-4 w-4" />;
  if (os === "mac") return <Apple className="h-4 w-4" />;
  return <Terminal className="h-4 w-4" />;
}

function DockerTab() {
  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Docker te permite correr el servidor oficial de{" "}
          <strong className="text-foreground">MangaImageTranslator (MIT)</strong>{" "}
          en tu máquina. Esto da acceso a OCR de alta calidad + inpainting sin
          depender del servidor público. También es la base para NLLB local (3-5x
          más rápido que MIT completo).
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="windows">
        <AccordionItem value="windows">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <OsIcon os="windows" /> Windows 10/11
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Descargá Docker Desktop">
              <p>
                Visita{" "}
                <a
                  href="https://www.docker.com/products/docker-desktop/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
                >
                  docker.com/products/docker-desktop
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                y descargá el instalador para Windows. Tamaño aproximado: 500 MB.
              </p>
            </StepItem>
            <StepItem num={2} title="Instalá y habilitá WSL 2">
              <p>
                Ejecutá el instalador. Cuando lo pida, habilitá{" "}
                <strong className="text-foreground">
                  "Use WSL 2 instead of Hyper-V"
                </strong>
                . Reiniciá la PC si lo solicita.
              </p>
              <InfoBox type="warning">
                Si no tenés WSL 2 instalado, abrí PowerShell como administrador
                y ejecutá: <code>wsl --install</code> · después reiniciá.
              </InfoBox>
            </StepItem>
            <StepItem num={3} title="Iniciá Docker Desktop">
              <p>
                Abrí Docker Desktop desde el menú inicio. Esperá a que el ícono
                de ballena en la barra de tareas deje de animarse (puede tardar
                1-2 minutos la primera vez).
              </p>
            </StepItem>
            <StepItem num={4} title="Levantá el contenedor MIT">
              <p>
                Abrí PowerShell o CMD y ejecutá:
              </p>
              <CodeBlock code="docker run -d --name mit -p 5003:5003 zyddnys/manga-image-translator:main" />
              <p>
                El flag <code>-d</code> lo corre en background. La primera vez
                descarga ~3 GB (modelos de OCR + inpainting). Sé paciente.
              </p>
            </StepItem>
            <StepItem num={5} title="Configurá MangaLens">
              <p>
                Abrí MangaLens → ⚙️ Avanzado → MIT Local → marcá "Usar MIT Local"
                · puerto <code>5003</code> · guardá. Hacé clic en "Verificar
                servidor".
              </p>
            </StepItem>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mac">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <OsIcon os="mac" /> macOS (Intel y Apple Silicon)
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Descargá Docker Desktop para Mac">
              <p>
                Desde{" "}
                <a
                  href="https://www.docker.com/products/docker-desktop/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
                >
                  docker.com
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                elegí "Mac with Apple chip" (M1/M2/M3/M4) o "Mac with Intel
                chip" según tu procesador.
              </p>
            </StepItem>
            <StepItem num={2} title="Instalá">
              <p>
                Abrí el <code>.dmg</code> descargado y arrastrá Docker.app a la
                carpeta Applications. Abrí Docker.app desde Launchpad.
              </p>
            </StepItem>
            <StepItem num={3} title="Otorgá permisos">
              <p>
                Aceptá los permisos de sistema cuando se soliciten. Esperá a que
                el motor Docker arranque (ícono de ballena en la barra de menú).
              </p>
            </StepItem>
            <StepItem num={4} title="Levantá el contenedor MIT">
              <p>Abrí Terminal y ejecutá:</p>
              <CodeBlock code="docker run -d --name mit -p 5003:5003 zyddnys/manga-image-translator:main" />
              <InfoBox>
                En Apple Silicon, Docker usa emulación Rosetta para imágenes
                amd64. El primer arranque puede tardar 5-10 minutos extra.
              </InfoBox>
            </StepItem>
            <StepItem num={5} title="Configurá MangaLens">
              <p>
                En MangaLens → Opciones Avanzadas → MIT Local → puerto 5003 →
                guardá y verificá.
              </p>
            </StepItem>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="linux">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <OsIcon os="linux" /> Linux (Ubuntu / Debian / Fedora)
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Instalá Docker Engine">
              <p>En Ubuntu/Debian, ejecutá estos comandos en orden:</p>
              <CodeBlock
                code={`sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`}
                prefix={false}
              />
            </StepItem>
            <StepItem num={2} title="Permití usar Docker sin sudo">
              <CodeBlock
                code={`sudo usermod -aG docker $USER
newgrp docker`}
              />
              <p>
                Cerrá sesión y volvé a entrar para que el cambio de grupo
                aplique.
              </p>
            </StepItem>
            <StepItem num={3} title="Verificá la instalación">
              <CodeBlock code="docker run hello-world" />
              <p>Si ves "Hello from Docker!" todo está funcionando.</p>
            </StepItem>
            <StepItem num={4} title="Levantá el contenedor MIT">
              <CodeBlock code="docker run -d --name mit -p 5003:5003 --restart unless-stopped zyddnys/manga-image-translator:main" />
              <p>
                El flag <code>--restart unless-stopped</code> hace que el
                contenedor arranque solo al reiniciar el sistema.
              </p>
            </StepItem>
            <StepItem num={5} title="Configurá MangaLens">
              <p>Misma configuración que Windows/Mac: puerto 5003 en Opciones.</p>
            </StepItem>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="glass-card-red rounded-xl p-5">
        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-red-400" />
          Comandos útiles para Docker
        </h4>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div>
            <span className="text-foreground font-mono">docker logs -f mit</span>{" "}
            — ver logs en tiempo real
          </div>
          <div>
            <span className="text-foreground font-mono">docker stop mit</span> —
            detener el contenedor
          </div>
          <div>
            <span className="text-foreground font-mono">docker start mit</span>{" "}
            — iniciar de nuevo sin recrear
          </div>
          <div>
            <span className="text-foreground font-mono">
              docker pull zyddnys/manga-image-translator:main
            </span>{" "}
            — actualizar a la última versión
          </div>
          <div>
            <span className="text-foreground font-mono">
              docker rm -f mit
            </span>{" "}
            — eliminar el contenedor (no la imagen)
          </div>
        </div>
      </div>
    </div>
  );
}

function OllamaTab() {
  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Ollama</strong> es un runtime
          local para modelos LLM. Lo usamos como motor de traducción 100%
          privado: las imágenes nunca salen de tu máquina. MangaLens se conecta
          vía API compatible OpenAI en <code>localhost:11434</code>.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="install">
        <AccordionItem value="install">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 1 · Instalar Ollama
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Windows / macOS
                </h5>
                <p className="text-sm mb-2">
                  Descargá el instalador desde{" "}
                  <a
                    href="https://ollama.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
                  >
                    ollama.com/download
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  y ejecutalo. En macOS arrastrá a Applications. En Windows
                  seguí el wizard.
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Linux
                </h5>
                <CodeBlock code="curl -fsSL https://ollama.com/install.sh | sh" />
              </div>

              <InfoBox>
                Ollama se ejecuta automáticamente como servicio en background.
                No necesitás abrir ninguna app: el servidor queda escuchando en{" "}
                <code>localhost:11434</code>.
              </InfoBox>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="model">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 2 · Descargar un modelo de visión
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm mb-3">
              Para traducir manga necesitás un modelo con capacidades de visión.
              Recomendamos:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div className="glass-card rounded-lg p-3">
                <div className="text-sm font-bold text-amber-300 mb-1">
                  ⚡ Llama 3.2 Vision (11B)
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Recomendado · ~7 GB · Rápido · Buen balance
                </div>
                <CodeBlock code="ollama pull llama3.2-vision" />
              </div>
              <div className="glass-card rounded-lg p-3">
                <div className="text-sm font-bold text-emerald-300 mb-1">
                  💎 Qwen2.5-VL (7B)
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Excelente en CJK · ~5 GB · Mejor calidad en japonés
                </div>
                <CodeBlock code="ollama pull qwen2.5vl:7b" />
              </div>
            </div>
            <InfoBox type="warning">
              Necesitás al menos 8 GB de RAM para correr estos modelos
              cómodamente. En macOS con 16 GB unified memory vuela. En PCs con
              GPU NVIDIA de 8 GB+ VRAM también.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="serve">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 3 · Iniciar el servidor
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm mb-2">
              Ollama arranca el servidor automáticamente. Para verificar:
            </p>
            <CodeBlock code="curl http://localhost:11434/api/tags" />
            <p className="text-sm mt-3">
              Si devuelve un JSON con la lista de modelos, está funcionando. Si
              el comando no responde, iniciá Ollama manualmente:
            </p>
            <CodeBlock code="ollama serve" />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mangalens">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 4 · Conectar con MangaLens
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>
                Abrí MangaLens → clic en <strong>⚙️ Avanzado</strong>
              </li>
              <li>
                Bajá hasta la sección{" "}
                <strong className="text-foreground">🐳 Docker Local</strong>
              </li>
              <li>
                En <strong>Host</strong> dejá <code>localhost</code> · en{" "}
                <strong>Puerto</strong> poné <code>11434</code>
              </li>
              <li>
                En <strong>Modelo instalado</strong> escribí{" "}
                <code>llama3.2-vision</code> o el que hayas descargado
              </li>
              <li>
                Marcá "Habilitar como fallback" y guardá
              </li>
              <li>
                Clic en <strong>"Ver modelos instalados"</strong> para confirmar
              </li>
            </ol>
            <InfoBox>
              Aunque la sección se llame "Docker Local", MangaLens la usa para
              cualquier servidor compatible con la API de OpenAI en localhost —
              incluyendo Ollama, vLLM, LM Studio y LocalAI.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function LibreTranslateTab() {
  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">LibreTranslate</strong> es un
          traductor de texto open source. No hace OCR ni inpainting, pero es
          perfecto como backend de traducción si ya extraíste el texto con MIT.
          Es más liviano que Ollama (corre en cualquier PC) y más rápido para
          traducir bloques de texto sueltos.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="docker">
        <AccordionItem value="docker">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Opción A · LibreTranslate con Docker (recomendado)
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Levantá el contenedor">
              <CodeBlock code="docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate:latest" />
              <p>
                La primera vez descarga ~2 GB. Cuando termine, el servidor
                queda disponible en <code>http://localhost:5000</code>.
              </p>
            </StepItem>
            <StepItem num={2} title="Verificá que arranque">
              <p>Abrí en el navegador:</p>
              <CodeBlock
                code="http://localhost:5000"
                prefix={false}
                language="url"
              />
              <p>
                Si ves la interfaz web de LibreTranslate, está funcionando.
              </p>
            </StepItem>
            <StepItem num={3} title="Probá la API">
              <CodeBlock
                code={`curl -X POST http://localhost:5000/translate \\
  -H "Content-Type: application/json" \\
  -d '{"q":"こんにちは","source":"ja","target":"es"}'`}
              />
              <p>Debería devolver un JSON con la traducción al español.</p>
            </StepItem>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="public">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Opción B · API pública de LibreTranslate (sin instalar nada)
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm mb-3">
              Si no querés instalar Docker, podés usar el endpoint público:
            </p>
            <CodeBlock code="https://libretranslate.com/translate" />
            <InfoBox type="warning">
              La API pública tiene límite de 60 requests/minuto y requiere una
              API key gratuita para uso intensivo. Para manga (varias imágenes
              por página) recomendamos el modo Docker local.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mangalens">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Conectar LibreTranslate con MangaLens
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>
                En MangaLens → <strong>⚙️ Avanzado</strong>
              </li>
              <li>
                Sección <strong className="text-foreground">🐳 Docker Local</strong>
              </li>
              <li>
                Host: <code>localhost</code> · Puerto: <code>5000</code>
              </li>
              <li>
                Activá <strong>"Habilitar como fallback"</strong>
              </li>
              <li>
                Guardá y verificá conexión
              </li>
            </ol>
            <InfoBox>
              MangaLens detecta automáticamente si el servidor responde a la API
              de OpenAI (LocalAI/Ollama) o a la de LibreTranslate, y usa el
              formato correcto. No necesitás configurar nada extra.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function GroqTab() {
  return (
    <div className="space-y-6">
      <div className="prose prose-invert max-w-none">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Groq</strong> ofrece la inferencia
          LLM más rápida del mercado gracias a sus LPU (Language Processing
          Unit). El plan gratuito incluye 30 req/min y 14.400 req/día, más que
          suficiente para manga. Soporta Llama 4 Scout 17B con visión
          multimodal — ideal para traducir directamente desde imágenes.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="signup">
        <AccordionItem value="signup">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 1 · Crear cuenta en Groq
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Visita la consola de Groq">
              <p>
                Andá a{" "}
                <a
                  href="https://console.groq.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
                >
                  console.groq.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </StepItem>
            <StepItem num={2} title="Registrate con Google o GitHub">
              <p>
                Clic en <strong>"Sign In"</strong> · podés usar tu cuenta de
                Google o GitHub para no crear otra contraseña. La cuenta es
                inmediata, sin espera.
              </p>
            </StepItem>
            <StepItem num={3} title="Aceptá los términos">
              <p>
                La primera vez te pedirá aceptar los términos de servicio del
                plan gratuito. Léelos y aceptá.
              </p>
            </StepItem>
            <InfoBox>
              Groq no requiere tarjeta de crédito para el plan gratuito. Podés
              empezar a usar la API inmediatamente después del registro.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="key">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 2 · Generar tu API Key
          </AccordionTrigger>
          <AccordionContent>
            <StepItem num={1} title="Andá a la sección API Keys">
              <p>
                En el menú lateral izquierdo de la consola, hacé clic en{" "}
                <strong>"API Keys"</strong> o visitá directamente{" "}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1"
                >
                  console.groq.com/keys
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </StepItem>
            <StepItem num={2} title="Creá una nueva key">
              <p>
                Clic en el botón verde{" "}
                <strong>"Create API Key"</strong>. Te pedirá un nombre
                descriptivo (ej: <code>mangalens-prod</code>). Aceptá.
              </p>
            </StepItem>
            <StepItem num={3} title="Copiá la key">
              <p>
                Groq te mostrará la key una sola vez. Empieza con{" "}
                <code className="text-amber-300">gsk_</code> y tiene ~56
                caracteres. Copiala y guardala en un lugar seguro (1Password,
                Bitwarden, etc.).
              </p>
              <InfoBox type="warning">
                Si perdés la key, no hay forma de recuperarla. Tendrás que
                eliminarla y crear una nueva. Pero podés tener varias keys
                activas en paralelo sin problema.
              </InfoBox>
            </StepItem>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mangalens">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Paso 3 · Configurar en MangaLens
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2 text-sm list-decimal list-inside text-muted-foreground">
              <li>
                Abrí MangaLens → <strong>⚙️ Avanzado</strong>
              </li>
              <li>
                Bajá hasta la sección{" "}
                <strong className="text-foreground">⚡ Groq</strong>
              </li>
              <li>
                Marcá <strong>"Habilitar como fallback"</strong>
              </li>
              <li>
                En <strong>API Key</strong> pegá tu key (empieza con{" "}
                <code>gsk_</code>)
              </li>
              <li>
                En <strong>Modelo Vision</strong> dejá{" "}
                <code>Llama 4 Scout 17B</code> (recomendado)
              </li>
              <li>
                Clic en <strong>"Probar API Key"</strong> · debería mostrar
                "Groq OK" con la latencia
              </li>
              <li>
                Guardá cambios
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limits">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline">
            Límites del plan gratuito
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="glass-card rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Requests por minuto
                </div>
                <div className="text-xl font-bold text-amber-300">30</div>
              </div>
              <div className="glass-card rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Requests por día
                </div>
                <div className="text-xl font-bold text-amber-300">14.400</div>
              </div>
              <div className="glass-card rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">
                  Tokens por minuto
                </div>
                <div className="text-xl font-bold text-amber-300">~6.000</div>
              </div>
              <div className="glass-card rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Costo</div>
                <div className="text-xl font-bold text-emerald-300">$0</div>
              </div>
            </div>
            <InfoBox>
              Una página de manga típica consume ~5 requests. Con 14.400/día
              podés traducir ~2.880 páginas diarias gratis. Para uso intensivo,
              Groq ofrece planes pagos desde $0.05/millón de tokens.
            </InfoBox>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function Installation() {
  const [tab, setTab] = useState("docker");

  const tabs = [
    {
      id: "docker",
      label: "Docker + MIT",
      icon: Container,
      desc: "Servidor MangaImageTranslator local",
    },
    {
      id: "ollama",
      label: "Ollama",
      icon: Cpu,
      desc: "Llama 3.2 Vision · Qwen2.5-VL",
    },
    {
      id: "libretranslate",
      label: "LibreTranslate",
      icon: Languages,
      desc: "Traductor de texto open source",
    },
    {
      id: "groq",
      label: "Groq API",
      icon: Zap,
      desc: "Inferencia más rápida · Plan gratis",
    },
  ];

  return (
    <section
      id="install"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-transparent via-red-950/10 to-transparent"
    >
      <div className="absolute inset-0 bg-halftone opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Guías de Instalación"
          title={
            <>
              Configurá tu{" "}
              <span className="text-gradient-red">motor de traducción</span>
            </>
          }
          subtitle="Elegí el backend que mejor se adapte a tu caso. Docker Local para privacidad total, Groq para velocidad máxima, Ollama para uso sin internet, o LibreTranslate para algo liviano."
        />

        <div className="mt-12">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-card/50 p-1.5 gap-1">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-600 data-[state=active]:to-rose-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/30 transition-all"
                >
                  <t.icon className="h-4 w-4" />
                  <span className="text-xs font-bold">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground data-[state=active]:text-white/70 hidden sm:block">
                    {t.desc}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="docker" className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="docker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <DockerTab />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="ollama" className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="ollama"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <OllamaTab />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="libretranslate" className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="libretranslate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LibreTranslateTab />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="groq" className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key="groq"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroqTab />
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 glass-card-red rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            ¿Cuál te conviene?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <div className="font-semibold text-amber-300 mb-1">
                ⚡ Velocidad
              </div>
              <p className="text-xs text-muted-foreground">
                Groq &gt; Híbrido &gt; MIT Público &gt; Docker Local
              </p>
            </div>
            <div>
              <div className="font-semibold text-emerald-300 mb-1">
                🔒 Privacidad
              </div>
              <p className="text-xs text-muted-foreground">
                Docker Local &gt; Ollama &gt; LibreTranslate &gt; Groq
              </p>
            </div>
            <div>
              <div className="font-semibold text-sky-300 mb-1">
                🚀 Facilidad
              </div>
              <p className="text-xs text-muted-foreground">
                MIT Público &gt; Groq &gt; Docker &gt; Ollama
              </p>
            </div>
            <div>
              <div className="font-semibold text-fuchsia-300 mb-1">
                💰 Costo
              </div>
              <p className="text-xs text-muted-foreground">
                Todos gratis · Groq con plan free generoso
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
