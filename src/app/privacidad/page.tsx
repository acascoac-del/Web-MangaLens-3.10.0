import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Política de Privacidad | MangaLens",
  description: "Política de Privacidad de MangaLens - Traductor de Manga para Chrome",
};

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-red-950/30 via-rose-950/10 to-transparent" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl w-full mx-auto space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bangers tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">
              Política de <span className="text-red-500">Privacidad</span>
            </h1>
            <p className="text-muted-foreground">Última actualización: Julio 2026</p>
          </div>

          <div className="glass-card-red p-8 sm:p-10 rounded-2xl space-y-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">1. Recopilación de Datos</h2>
              <p>
                MangaLens <strong>no</strong> recopila, almacena ni transmite información personal o de identificación del usuario. Toda la configuración (como el motor de traducción preferido, idioma y credenciales de API) se guarda localmente en el almacenamiento de su navegador o en la memoria temporal de la sesión.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Procesamiento de Imágenes</h2>
              <p>
                La extensión procesa imágenes para realizar el Reconocimiento Óptico de Caracteres (OCR), traducción e inpainting. 
                Dependiendo del motor de traducción que elija, el comportamiento varía:
              </p>
              <ul className="list-disc pl-5 space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Motores Locales (Docker, Ollama):</strong> Las imágenes nunca salen de su entorno local. Todo el procesamiento se realiza en su propio equipo y no es monitoreado ni almacenado.
                </li>
                <li>
                  <strong className="text-foreground">Motores Externos (Groq, LibreTranslate):</strong> El texto extraído puede ser enviado a las APIs respectivas para su traducción. Es importante revisar las políticas de privacidad de los servicios de terceros que decida utilizar para entender el trato que se le da a la información.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">3. Permisos de la Extensión</h2>
              <p>
                MangaLens requiere permisos mínimos y justificados para funcionar correctamente en su navegador:
              </p>
              <ul className="list-disc pl-5 space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Acceso a la pestaña activa:</strong> Necesario para capturar la imagen de la página web que desea traducir y para inyectar la imagen traducida de vuelta al sitio y que se pueda leer de forma correcta.
                </li>
                <li>
                  <strong className="text-foreground">Almacenamiento (Storage):</strong> Utilizado exclusivamente para guardar su configuración y preferencias locales (idioma preferido, atajos de teclado, URL de los servidores de traducción, etc).
                </li>
                <li>
                  <strong className="text-foreground">Permisos de Red (Fetch/XHR):</strong> Necesarios para comunicarse con los motores de traducción, ya sean locales (localhost) o los diferentes servicios de terceros seleccionados.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">4. Terceros</h2>
              <p>
                Esta extensión puede integrar o conectarse con servicios desarrollados por terceros (por ejemplo, Groq, MangaImageTranslator u Ollama). MangaLens no se hace responsable del uso de datos por parte de dichos servicios externos, ya que no son operados por nosotros. Recomendamos leer detenidamente sus términos y políticas de privacidad para mayor información.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">5. Cambios a esta Política</h2>
              <p>
                Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento según las nuevas exigencias de las plataformas en las que publicamos. Cualquier cambio será publicado en esta página y entrará en vigencia inmediatamente. Su uso continuo de la extensión después de la publicación de cambios constituye su aceptación de dichos cambios.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
