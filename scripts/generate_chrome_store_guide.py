"""
Generate the MangaLens Chrome Web Store Publishing Guide PDF.
Spanish language guide with step-by-step instructions for publishing
the MangaLens Chrome extension on chrome.google.com/webstore/devconsole.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    KeepTogether,
    Table,
    TableStyle,
    Image,
    Flowable,
    HRFlowable,
    ListFlowable,
    ListItem,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.platypus.frames import Frame

# ───────────────────────────────────────────────────────────
# Font registration (Noto Serif SC for body, Noto Sans SC for headings)
# ───────────────────────────────────────────────────────────
FONT_DIR = "/usr/share/fonts"

# Body: NotoSerifSC (serif, supports Spanish + CJK if needed)
pdfmetrics.registerFont(
    TTFont("NotoSerifSC", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf")
)
pdfmetrics.registerFont(
    TTFont("NotoSerifSC-Bold", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf")
)

# Sans-serif headings: LiberationSans (Latin only, fine for Spanish)
pdfmetrics.registerFont(
    TTFont("NotoSansSC", f"{FONT_DIR}/truetype/liberation/LiberationSans-Regular.ttf")
)
pdfmetrics.registerFont(
    TTFont("NotoSansSC-Bold", f"{FONT_DIR}/truetype/liberation/LiberationSans-Bold.ttf")
)

# Mono: LiberationMono
pdfmetrics.registerFont(
    TTFont("LiberationMono", f"{FONT_DIR}/truetype/liberation/LiberationMono-Regular.ttf")
)
pdfmetrics.registerFont(
    TTFont("LiberationMono-Bold", f"{FONT_DIR}/truetype/liberation/LiberationMono-Bold.ttf")
)

registerFontFamily(
    "NotoSerifSC",
    normal="NotoSerifSC",
    bold="NotoSerifSC-Bold",
    italic="NotoSerifSC",
    boldItalic="NotoSerifSC-Bold",
)
registerFontFamily(
    "NotoSansSC",
    normal="NotoSansSC",
    bold="NotoSansSC-Bold",
    italic="NotoSansSC",
    boldItalic="NotoSansSC-Bold",
)
registerFontFamily(
    "LiberationMono",
    normal="LiberationMono",
    bold="LiberationMono-Bold",
    italic="LiberationMono",
    boldItalic="LiberationMono-Bold",
)

# ───────────────────────────────────────────────────────────
# Colors
# ───────────────────────────────────────────────────────────
RED_PRIMARY = HexColor("#e53935")
RED_DARK = HexColor("#b71c1c")
RED_DARKER = HexColor("#7f0000")
BG_DARK = HexColor("#0f0f12")
BG_DARKER = HexColor("#08080a")
BG_CARD = HexColor("#1a1a1f")
BG_CODE = HexColor("#15151a")
TEXT_PRIMARY = HexColor("#f5f5f5")
TEXT_SECONDARY = HexColor("#a0a0a8")
TEXT_MUTED = HexColor("#6b6b75")
AMBER = HexColor("#fbbf24")
EMERALD = HexColor("#10b981")
SKY = HexColor("#38bdf8")
BORDER = HexColor("#2a2a32")
WHITE_SNOW = HexColor("#fafafa")
INK = HexColor("#1a1a1a")

# ───────────────────────────────────────────────────────────
# Styles
# ───────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

H1 = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontName="NotoSansSC-Bold",
    fontSize=22,
    leading=28,
    textColor=RED_PRIMARY,
    spaceBefore=18,
    spaceAfter=12,
    keepWithNext=True,
)

H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontName="NotoSansSC-Bold",
    fontSize=16,
    leading=22,
    textColor=INK,
    spaceBefore=14,
    spaceAfter=8,
    keepWithNext=True,
)

H3 = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontName="NotoSansSC-Bold",
    fontSize=12,
    leading=18,
    textColor=RED_DARK,
    spaceBefore=10,
    spaceAfter=6,
    keepWithNext=True,
)

BODY = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="NotoSerifSC",
    fontSize=10.5,
    leading=16,
    textColor=HexColor("#2a2a32"),
    alignment=TA_JUSTIFY,
    spaceAfter=8,
)

BODY_LEFT = ParagraphStyle(
    "BodyLeft",
    parent=BODY,
    alignment=TA_LEFT,
)

CODE_STYLE = ParagraphStyle(
    "Code",
    parent=styles["Code"],
    fontName="LiberationMono",
    fontSize=9,
    leading=13,
    textColor=AMBER,
    backColor=BG_CODE,
    borderPadding=8,
    leftIndent=12,
    rightIndent=12,
    spaceBefore=6,
    spaceAfter=6,
    alignment=TA_LEFT,
)

TIP_STYLE = ParagraphStyle(
    "Tip",
    parent=BODY,
    fontName="NotoSerifSC",
    fontSize=9.5,
    leading=14,
    textColor=HexColor("#1e3a8a"),
    backColor=HexColor("#eff6ff"),
    borderColor=HexColor("#bfdbfe"),
    borderWidth=1,
    borderPadding=8,
    leftIndent=0,
    spaceBefore=6,
    spaceAfter=6,
    alignment=TA_LEFT,
)

WARNING_STYLE = ParagraphStyle(
    "Warning",
    parent=TIP_STYLE,
    textColor=HexColor("#92400e"),
    backColor=HexColor("#fffbeb"),
    borderColor=HexColor("#fde68a"),
)

STEP_NUM = ParagraphStyle(
    "StepNum",
    parent=styles["Heading1"],
    fontName="NotoSansSC-Bold",
    fontSize=42,
    leading=42,
    textColor=RED_PRIMARY,
    spaceBefore=0,
    spaceAfter=0,
    alignment=TA_LEFT,
)

LIST_ITEM_STYLE = ParagraphStyle(
    "ListItem",
    parent=BODY,
    fontSize=10,
    leading=15,
    spaceAfter=4,
    alignment=TA_LEFT,
)


# ───────────────────────────────────────────────────────────
# Custom Flowables
# ───────────────────────────────────────────────────────────
class CoverPage(Flowable):
    """Custom dark cover page with red gradient simulated."""

    def __init__(self, width, height):
        Flowable.__init__(self)
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        # Background — dark
        c.setFillColor(BG_DARKER)
        c.rect(-30, -30, self.width + 60, self.height + 60, fill=1, stroke=0)

        # Halftone dots pattern (subtle)
        c.setFillColor(HexColor("#1a1a22"))
        for x in range(-30, int(self.width) + 30, 18):
            for y in range(-30, int(self.height) + 30, 18):
                c.circle(x, y, 1.2, fill=1, stroke=0)

        # Red glow at top
        c.setFillColorRGB(0.9, 0.22, 0.20, alpha=0.18)
        c.circle(self.width / 2, self.height - 80, 280, fill=1, stroke=0)
        c.setFillColorRGB(0.9, 0.22, 0.20, alpha=0.08)
        c.circle(self.width / 2, self.height - 80, 380, fill=1, stroke=0)

        # Top accent line
        c.setStrokeColor(RED_PRIMARY)
        c.setLineWidth(3)
        c.line(50, self.height - 50, 200, self.height - 50)

        # Eyebrow text
        c.setFillColor(RED_PRIMARY)
        c.setFont("NotoSansSC-Bold", 10)
        c.drawString(50, self.height - 70, "GUIA OFICIAL · v3.10.0")

        # Title
        c.setFillColor(WHITE_SNOW)
        c.setFont("NotoSansSC-Bold", 42)
        c.drawString(50, self.height - 180, "Publicar MangaLens")
        c.drawString(50, self.height - 225, "en la Chrome Web Store")

        # Subtitle
        c.setFillColor(TEXT_SECONDARY)
        c.setFont("NotoSerifSC", 13)
        c.drawString(
            50,
            self.height - 260,
            "Guia paso a paso para publicar tu extension MangaLens en",
        )
        c.drawString(
            50, self.height - 278, "https://chrome.google.com/webstore/devconsole"
        )

        # Tags
        tag_y = self.height - 330
        tags = ["Manifest V3", "6 Pasos", "30 min", "USD 5", "Spanish"]
        x_offset = 50
        for tag in tags:
            tag_width = c.stringWidth(tag, "NotoSansSC-Bold", 9) + 20
            c.setFillColor(HexColor("#1a1a22"))
            c.setStrokeColor(RED_PRIMARY)
            c.setLineWidth(1)
            c.roundRect(x_offset, tag_y, tag_width, 22, 11, fill=1, stroke=1)
            c.setFillColor(RED_PRIMARY)
            c.setFont("NotoSansSC-Bold", 9)
            c.drawString(x_offset + 10, tag_y + 7, tag)
            x_offset += tag_width + 8

        # Bottom card — what's inside
        card_y = 180
        c.setFillColor(HexColor("#15151a"))
        c.setStrokeColor(HexColor("#2a2a32"))
        c.setLineWidth(1)
        c.roundRect(50, card_y - 100, self.width - 100, 120, 8, fill=1, stroke=1)

        c.setFillColor(AMBER)
        c.setFont("NotoSansSC-Bold", 9)
        c.drawString(70, card_y + 5, "EN ESTA GUIA")

        c.setFillColor(WHITE_SNOW)
        c.setFont("NotoSansSC-Bold", 11)
        c.drawString(70, card_y - 18, "1. Crear cuenta de desarrollador")
        c.drawString(70, card_y - 36, "2. Subir el .zip de la extension")
        c.drawString(70, card_y - 54, "3. Capturas de pantalla y assets")
        c.drawString(70, card_y - 72, "4. Completar metadata del listing")

        c.drawString(self.width / 2 + 20, card_y - 18, "5. Declarar permisos")
        c.drawString(self.width / 2 + 20, card_y - 36, "6. Enviar para revision")
        c.drawString(
            self.width / 2 + 20, card_y - 54, "+ Plantilla de politica de"
        )
        c.drawString(
            self.width / 2 + 20, card_y - 72, "  privacidad lista para usar"
        )

        # Footer
        c.setFillColor(TEXT_MUTED)
        c.setFont("NotoSerifSC", 9)
        c.drawString(50, 60, "MangaLens Translator v3.10.0")
        c.drawString(50, 46, "https://chrome.google.com/webstore/devconsole")
        c.setFillColor(RED_PRIMARY)
        c.setFont("NotoSansSC-Bold", 9)
        c.drawRightString(self.width - 50, 60, "Open Source · MIT License")
        c.setFillColor(TEXT_MUTED)
        c.setFont("NotoSerifSC", 9)
        c.drawRightString(self.width - 50, 46, "2026 · Guia actualizada")


class SectionDivider(Flowable):
    """A decorative divider with red accent."""

    def __init__(self, width=440):
        Flowable.__init__(self)
        self.width = width
        self.height = 14

    def draw(self):
        c = self.canv
        # Short red segment
        c.setStrokeColor(RED_PRIMARY)
        c.setLineWidth(2)
        c.line(0, 7, 30, 7)
        # Long thin gray line
        c.setStrokeColor(HexColor("#d4d4d8"))
        c.setLineWidth(0.5
        )
        c.line(35, 7, self.width, 7)


# ───────────────────────────────────────────────────────────
# Page templates
# ───────────────────────────────────────────────────────────
def cover_page_template(canvas, doc):
    """No header/footer on cover."""
    pass


def body_page_template(canvas, doc):
    """Header and footer for body pages."""
    canvas.saveState()

    # Header
    canvas.setStrokeColor(RED_PRIMARY)
    canvas.setLineWidth(1.5)
    canvas.line(50, A4[1] - 35, 80, A4[1] - 35)
    canvas.setFillColor(RED_PRIMARY)
    canvas.setFont("NotoSansSC-Bold", 8)
    canvas.drawString(85, A4[1] - 38, "MANGALENS · CHROME STORE GUIDE")
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("NotoSerifSC", 8)
    canvas.drawRightString(A4[0] - 50, A4[1] - 38, "v3.10.0")

    # Top thin line
    canvas.setStrokeColor(HexColor("#e4e4e7"))
    canvas.setLineWidth(0.3)
    canvas.line(50, A4[1] - 45, A4[0] - 50, A4[1] - 45)

    # Footer
    canvas.setStrokeColor(HexColor("#e4e4e7"))
    canvas.setLineWidth(0.3)
    canvas.line(50, 40, A4[0] - 50, 40)
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("NotoSerifSC", 8)
    canvas.drawString(50, 28, "MangaLens · Open Source · MIT License")
    canvas.setFillColor(RED_PRIMARY)
    canvas.setFont("NotoSansSC-Bold", 9)
    canvas.drawRightString(A4[0] - 50, 28, f"Pag. {doc.page - 1}")

    canvas.restoreState()


# ───────────────────────────────────────────────────────────
# Helper builders
# ───────────────────────────────────────────────────────────
def code_block(code_text, prefix_dollar=False):
    """Build a styled code block."""
    lines = code_text.strip().split("\n")
    if prefix_dollar:
        formatted = "<br/>".join(
            f'<font color="#e53935">$</font> <font color="#fbbf24">{line}</font>'
            for line in lines
        )
    else:
        formatted = "<br/>".join(
            f'<font color="#fbbf24">{line}</font>' for line in lines
        )
    return Paragraph(formatted, CODE_STYLE)


def tip_box(text, kind="tip"):
    """Build a tip or warning box."""
    if kind == "warning":
        style = WARNING_STYLE
        label = '<font name="NotoSansSC-Bold" color="#92400e">ATENCION:</font> '
        icon = "[!]"
    else:
        style = TIP_STYLE
        label = '<font name="NotoSansSC-Bold" color="#1e3a8a">TIP:</font> '
        icon = "[i]"
    return Paragraph(f"{icon} {label}{text}", style)


def step_header(num, title, subtitle):
    """Build a step header with large number and title."""
    data = [
        [
            Paragraph(f'<font color="#e53935">{num}</font>', STEP_NUM),
            [
                Paragraph(
                    f'<font name="NotoSansSC-Bold" color="#1a1a1a" size="16">{title}</font>',
                    BODY_LEFT,
                ),
                Paragraph(
                    f'<font name="NotoSerifSC" color="#6b6b75" size="10">{subtitle}</font>',
                    BODY_LEFT,
                ),
            ],
        ]
    ]
    t = Table(data, colWidths=[60, 380])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LINEBELOW", (0, 0), (-1, -1), 2, RED_PRIMARY),
            ]
        )
    )
    return t


def tips_list(tips):
    """Build a bullet list of tips."""
    items = []
    for tip in tips:
        items.append(
            ListItem(
                Paragraph(tip, LIST_ITEM_STYLE),
                leftIndent=12,
                value="circle",
            )
        )
    return ListFlowable(
        items,
        bulletType="bullet",
        bulletColor=EMERALD,
        bulletFontSize=8,
        leftIndent=18,
        bulletOffsetY=2,
    )


# ───────────────────────────────────────────────────────────
# Build the story
# ───────────────────────────────────────────────────────────
def build_story():
    story = []

    # ─── COVER PAGE ───
    story.append(CoverPage(A4[0], A4[1]))
    story.append(PageBreak())

    # ─── INTRODUCTION ───
    story.append(Paragraph("Introduccion", H1))
    story.append(SectionDivider())
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Esta guia te lleva paso a paso por el proceso completo para publicar "
            "la extension MangaLens Translator en la Chrome Web Store de Google. "
            "El proceso esta optimizado para hispanohablantes y cubre todos los "
            "requisitos tecnicos y administrativos que Google exige para aprobar "
            "una extension basada en Manifest V3.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "MangaLens es una extension de Chrome que traduce manga, comics y "
            "manhwa directamente en el navegador usando OCR, IA e inpainting. "
            "Soporta 5 motores de traduccion (MIT, Groq, Xiaomi MiMo, Docker "
            "Local) y 10 idiomas destino. La extension usa Manifest V3, el "
            "estandar actual de Chrome, y no requiere permisos sensibles mas "
            "alla del acceso a la pestana activa.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Antes de empezar, asegurate de tener listo el archivo "
            "<b>MangaLens-3.10.0.zip</b> que contiene la extension compilada. "
            "Si lo descargaste desde el repositorio oficial, ya esta listo para "
            "subir. Si lo modificaste, asegurate de incrementar el campo "
            "<i>version</i> en manifest.json antes de comprimir.",
            BODY,
        )
    )

    story.append(Spacer(1, 8))
    story.append(tip_box(
        "El costo total de publicar en la Chrome Web Store es de USD 5 (pago "
        "unico de por vida). No hay costos recurrentes ni comisiones por "
        "instalacion. Con esa misma cuenta podes publicar extensiones "
        "ilimitadas.",
        "tip",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 1 ───
    story.append(step_header(
        "01",
        "Crear cuenta de desarrollador",
        "Pago unico de USD 5 con cuenta de Google · 5 minutos",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "Google requiere que todo desarrollador que quiera publicar en la "
            "Chrome Web Store tenga una cuenta de desarrollador verificada. "
            "Esta cuenta se asocia a tu cuenta de Google existente y requiere "
            "un pago unico de USD 5 que se cobra una sola vez en el momento del "
            "registro. Una vez verificada, la cuenta queda habilitada de por "
            "vida para publicar extensiones ilimitadas.",
            BODY,
        )
    )

    story.append(Paragraph("Instrucciones", H3))
    story.append(
        Paragraph(
            "<b>1.</b> Andá a la URL del Developer Dashboard de Chrome Web "
            "Store:",
            BODY_LEFT,
        )
    )
    story.append(code_block("https://chrome.google.com/webstore/devconsole"))

    story.append(
        Paragraph(
            "<b>2.</b> Inicia sesion con tu cuenta de Google. Si no tenes una, "
            "creala gratis en accounts.google.com. Te recomiendo usar una "
            "cuenta personal y permanente (no una del trabajo) para no perder "
            "acceso a la extension si cambias de empleo.",
            BODY_LEFT,
        )
    )

    story.append(
        Paragraph(
            "<b>3.</b> Acepta los terminos del programa para desarrolladores. "
            "Lee con atencion la seccion sobre politicas de contenido y "
            "privacidad — Google puede suspender cuentas que las violen.",
            BODY_LEFT,
        )
    )

    story.append(
        Paragraph(
            "<b>4.</b> Realiza el pago de USD 5 a traves de Google Wallet. "
            "Acepta tarjetas de credito internacionales, debit y PayPal. El "
            "pago se procesa en segundos y la verificacion suele ser "
            "instantanea.",
            BODY_LEFT,
        )
    )

    story.append(tip_box(
        "El pago se hace con Google Wallet. Acepta tarjetas internacionales y "
        "PayPal. La cuenta queda verificada en menos de 5 minutos.",
        "tip",
    ))
    story.append(tip_box(
        "Si pierdes acceso a tu cuenta de Google, perderas acceso a todas las "
        "extensiones publicadas. Configura verificacion en dos pasos (2FA) y "
        "guarda los codigos de respaldo en un lugar seguro.",
        "warning",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 2 ───
    story.append(step_header(
        "02",
        "Subir el .zip de la extension",
        "Subir MangaLens-3.10.0.zip al dashboard · 2 minutos",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "Una vez que tienes la cuenta verificada, el siguiente paso es "
            "subir el archivo .zip que contiene el codigo de la extension. "
            "Google valida automaticamente el manifest.json, la estructura de "
            "carpetas y la consistencia de los permisos declarados. Si algo "
            "falla, te mostrara un mensaje especifico indicando que corregir.",
            BODY,
        )
    )

    story.append(Paragraph("Instrucciones", H3))
    story.append(
        Paragraph(
            "<b>1.</b> En el dashboard principal, haz clic en el boton azul "
            '"Add new item" ubicado en la esquina superior derecha.',
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>2.</b> Selecciona la opcion 'Upload' (no 'Package'). Esto abrira "
            "el dialogo de seleccion de archivos.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>3.</b> Selecciona el archivo MangaLens-3.10.0.zip. NO lo "
            "descomprimas — Chrome espera el .zip directamente.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>4.</b> Espera a que se complete la subida (1-2 minutos para "
            "archivos pequenos como MangaLens que pesa ~36 KB).",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>5.</b> Si la validacion pasa, veras el mensaje 'Upload success' "
            "y seras redirigido al formulario de metadata. Si falla, lee el "
            "error y corrigelo antes de reintentar.",
            BODY_LEFT,
        )
    )

    story.append(Paragraph("Estructura del .zip", H3))
    story.append(
        Paragraph(
            "El .zip debe contener manifest.json en la raiz — no dentro de una "
            "subcarpeta. La estructura de MangaLens-3.10.0.zip es:",
            BODY_LEFT,
        )
    )
    story.append(code_block("""MangaLens-3.10.0.zip
|-- manifest.json          (Manifest V3, requerido en raiz)
|-- background/
|   |-- service-worker.js
|   |-- inpainter-gpu.js
|   \`-- apis/mit.js
|-- content/
|   |-- constants.js
|   |-- utils.js
|   |-- detector.js
|   |-- capturer.js
|   |-- inpainter.js
|   |-- ui.js
|   \`-- content.js
|-- popup/
|   |-- popup.html
|   \`-- popup.js
|-- options/
|   |-- options.html
|   \`-- options.js
|-- icons/
|   |-- icon16.png
|   |-- icon32.png
|   |-- icon48.png
|   \`-- icon128.png
\`-- content/content.css""", prefix_dollar=False))

    story.append(tip_box(
        "Si tu .zip tiene una carpeta contenedora (por ejemplo, "
        "MangaLens-3.10.0/manifest.json en lugar de manifest.json en la raiz), "
        "Chrome rechazara la subida. Comprime el contenido directamente, no la "
        "carpeta.",
        "warning",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 3 ───
    story.append(step_header(
        "03",
        "Subir capturas de pantalla y assets",
        "5 screenshots + store icon + small tile · 10 minutos",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "Google exige un conjunto minimo de assets visuales para mostrar "
            "tu extension en la Chrome Web Store. Estos assets son lo primero "
            "que ven los usuarios al encontrar tu extension, asi que "
            "directamente impactan en la tasa de instalacion. Las capturas "
            "profesionales pueden triplicar las instalaciones frente a "
            "capturas improvisadas.",
            BODY,
        )
    )

    story.append(Paragraph("Assets requeridos", H3))
    story.append(
        Paragraph(
            "Google exige los siguientes assets. Todos deben estar en formato "
            "PNG (no JPG, no WebP):",
            BODY_LEFT,
        )
    )

    # Assets table
    assets_data = [
        ["Asset", "Dimensiones", "Cantidad", "Descripcion"],
        [
            "Capturas",
            "1280x800\no 640x400",
            "1-5\n(minimo 1)",
            "Muestran la extension en uso. Pueden ser PNG o JPEG.",
        ],
        [
            "Icono de tienda",
            "128x128 px",
            "1",
            "Se muestra en los resultados de busqueda y en la pagina de la extension.",
        ],
        [
            "Tile pequeno",
            "440x280 px",
            "1",
            "Aparece en los resultados de busqueda como miniatura.",
        ],
        [
            "Tile grande",
            "920x680 px",
            "0-1\n(opcional)",
            "Aparece en la portada de la tienda si tu extension es destacada.",
        ],
        [
            "Promocional",
            "1400x560 px",
            "0-1\n(opcional)",
            "Banner para promociones internas de Google.",
        ],
    ]
    assets_table = Table(assets_data, colWidths=[80, 90, 70, 200])
    assets_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), RED_PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("FONTNAME", (0, 0), (-1, 0), "NotoSansSC-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "NotoSerifSC"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, HexColor("#fafafa")]),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(assets_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("Capturas recomendadas para MangaLens", H3))
    story.append(
        Paragraph(
            "Te recomiendo subir exactamente 5 capturas que muestren los "
            "siguientes flujos. Cada captura debe tener un titulo descriptivo "
            "en español para que el usuario entienda que esta viendo:",
            BODY,
        )
    )
    story.append(tips_list([
        "Captura 1 — Popup principal con el boton 'Traducir toda la pagina' "
        "y la seccion de configuracion visible.",
        "Captura 2 — Opciones avanzadas mostrando los 4 motores de traduccion "
        "configurables (MIT, Groq, MiMo, Docker Local).",
        "Captura 3 — Modo clic activo sobre una pagina de manga, mostrando el "
        "cursor sobre una imagen con el tooltip 'Clic para traducir'.",
        "Captura 4 — Antes y despues de la traduccion, lado a lado, mostrando "
        "el inpainting y la superposicion de texto traducido.",
        "Captura 5 — Grid de los 10 idiomas soportados con sus banderas, "
        "mostrando la diversidad linguistica de la extension.",
    ]))

    story.append(tip_box(
        "Usa la herramienta gratuita screenshot.rocks para generar mockups "
        "profesionales con marco de navegador automatico. Tambien puedes "
        "usar Carbon (carbon.now.sh) para mostrar fragmentos de codigo con "
        "sintaxis resaltada.",
        "tip",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 4 ───
    story.append(step_header(
        "04",
        "Completar metadata del listing",
        "Titulo, descripcion, categoria, idiomas · 15 minutos",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "El listing es la pagina publica de tu extension en la Chrome Web "
            "Store. La metadata que completas aqui determina como se encuentra "
            "tu extension via busqueda y como se presenta a los usuarios. "
            "Google pone especial enfasis en la claridad de la descripcion y "
            "en la honestidad del titulo — no exageres capacidades ni uses "
            "nombres de marcas registradas que no te pertenecen.",
            BODY,
        )
    )

    story.append(Paragraph("Campos a completar", H3))

    metadata_data = [
        ["Campo", "Limite", "Valor sugerido"],
        ["Nombre", "75 caracteres", "MangaLens Translator"],
        ["Descripcion corta", "132 caracteres", "Traductor de manga, comics y manhwa para Chrome. OCR + IA + 5 motores."],
        ["Descripcion larga", "16.000 caracteres", "Texto completo con features, motores, idiomas y troubleshooting."],
        ["Categoria", "1 opcion", "Productivity"],
        ["Idiomas soportados", "Multi-seleccion", "Espanol, Ingles, Portugues, Frances, Aleman, Italiano, Ruso, Chino, Coreano, Japones"],
        ["Politica de privacidad", "URL publica", "https://TUCUENTA.github.io/mangalens/privacy.html"],
        ["Sitio web", "URL (opcional)", "https://github.com/zyddnys/manga-image-translator"],
        ["Support URL", "URL (opcional)", "https://github.com/zyddnys/manga-image-translator/issues"],
    ]
    metadata_table = Table(metadata_data, colWidths=[110, 80, 250])
    metadata_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), RED_PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("FONTNAME", (0, 0), (-1, 0), "NotoSansSC-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "NotoSerifSC"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, HexColor("#fafafa")]),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(metadata_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("Plantilla de descripcion larga", H3))
    story.append(
        Paragraph(
            "Copia y pega esta plantilla en el campo 'Descripcion larga'. "
            "Admite Markdown basico (negritas, listas, enlaces):",
            BODY_LEFT,
        )
    )

    story.append(code_block("""**MangaLens Translator** — Traduce manga, comics y manhwa
directamente en tu navegador Chrome.

MangaLens combina OCR de ultima generacion, IA multimodal y tecnicas
de inpainting para darte traducciones profesionales sin salir del
navegador. Soporta 5 motores de traduccion y 10 idiomas destino.

## Caracteristicas principales

- **5 motores hibridos** con fallback automatico (MIT, Groq, MiMo, Docker)
- **Inpainting inteligente** que borra el texto original y reconstruye el fondo
- **10 idiomas destino**: Espanol, Ingles, Portugues, Frances, Aleman, Italiano,
  Ruso, Chino, Coreano y Japones
- **100% privado** con Docker Local / Ollama / LibreTranslate
- **Modo clic** para traducir imagen por imagen
- **Auto-traduccion** al cargar la pagina

## Como usar

1. Instala la extension
2. Abre el popup y selecciona tu idioma destino
3. Haz clic en 'Traducir toda la pagina' o activa el modo clic

## Motores de traduccion

- **MIT Publico** (gratis, sin configuracion)
- **Groq** (gratis, ultra rapido con Llama 4)
- **Xiaomi MiMo** (calidad premium en CJK)
- **Docker Local** (maxima privacidad, sin internet)
- **Modo Hibrido** (recomendado, combina todos)

## Privacidad

MangaLens NO recopila datos personales. La configuracion se almacena
localmente. Las imagenes se envian a terceros solo si configuras
explicitamente un motor en la nube.""", prefix_dollar=False))

    story.append(tip_box(
        "Incluye palabras clave en el titulo y la descripcion: 'manga', "
        "'translator', 'OCR', 'comics', 'manhwa', 'traductor'. Google indexa "
        "estos campos para la busqueda en la Chrome Web Store.",
        "tip",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 5 ───
    story.append(step_header(
        "05",
        "Declarar permisos y privacidad",
        "Justificar cada permiso · 10 minutos",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "Google exige que justifiques cada permiso que tu extension "
            "solicita. Cuantos mas permisos pidas, mas largo sera el proceso "
            "de revision. MangaLens usa un conjunto minimo y razonable de "
            "permisos, todos justificados por su funcion principal: traducir "
            "texto en imagenes de manga.",
            BODY,
        )
    )

    story.append(Paragraph("Permisos declarados en manifest.json", H3))

    permissions_data = [
        ["Permiso", "Justificacion para Google"],
        [
            "activeTab",
            "Acceder a la pestana activa solo cuando el usuario hace clic en el "
            "icono de la extension o en el boton traducir. No accede en segundo plano.",
        ],
        [
            "storage",
            "Guardar la configuracion del usuario (idioma destino, fuente, motor "
            "seleccionado, API keys) usando chrome.storage.sync. No almacena datos "
            "personales ni historial de navegacion.",
        ],
        [
            "contextMenus",
            "Agregar la opcion 'Traducir manga con MangaLens' al menu contextual "
            "(clic derecho) sobre imagenes.",
        ],
        [
            "scripting",
            "Inyectar los scripts de deteccion de imagenes, OCR e inpainting en la "
            "pagina activa cuando el usuario solicita la traduccion.",
        ],
        [
            "<all_urls>",
            "La extension necesita detectar imagenes de manga en cualquier sitio "
            "que el usuario visite. MangaLens NO recopila datos de navegacion ni "
            "envia URLs a servidores externos.",
        ],
    ]
    perm_table = Table(permissions_data, colWidths=[100, 340])
    perm_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), RED_PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("FONTNAME", (0, 0), (-1, 0), "NotoSansSC-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "NotoSerifSC"),
                ("FONTNAME", (0, 1), (0, -1), "LiberationMono-Bold"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, HexColor("#fafafa")]),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(perm_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("Casillas de privacidad (Data Usage)", H3))
    story.append(
        Paragraph(
            "Google te hara una serie de preguntas sobre como usas los datos. "
            "Para MangaLens, marca estas casillas especificamente:",
            BODY_LEFT,
        )
    )

    story.append(tips_list([
        "<b>'I do not sell or transfer user data to third parties'</b> — Marca "
        "SI. MangaLens no vende ni transfiere datos.",
        "<b>'I do not use or transfer user data for purposes unrelated to my "
        "item's single purpose'</b> — Marca SI. La unica funcion es traducir.",
        "<b>'I do not use or transfer user data to determine creditworthiness "
        "or for lending purposes'</b> — Marca SI.",
        "<b>'Does your extension request the permissions listed below?'</b> — "
        "Para cada permiso, escribe una justificacion de 1-2 lineas basada en "
        "la tabla anterior.",
        "<b>'Single purpose'</b> — Describe en una frase: 'Translate text in "
        "manga, comic and manhwa images directly in the browser.'",
    ]))

    story.append(tip_box(
        "El permiso <all_urls> es el que mas escrutinio recibe. Google puede "
        "tardar hasta 7 dias habiles en aprobar extensiones que lo usan. Si "
        "puedes limitarlo a dominios especificos (manga sites conocidos), el "
        "proceso sera mas rapido, pero perderas flexibilidad.",
        "warning",
    ))

    story.append(Spacer(1, 16))

    # ─── STEP 6 ───
    story.append(step_header(
        "06",
        "Enviar para revision",
        "Submit for review · espera de 1-7 dias habiles",
    ))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Que vas a hacer", H3))
    story.append(
        Paragraph(
            "Una vez completados todos los pasos anteriores, el ultimo paso es "
            "enviar la extension para revision por parte de Google. El equipo "
            "de revision de Chrome Web Store verifica que la extension cumpla "
            "con las politicas de Chrome, no contenga malware, y los permisos "
            "estén justificados.",
            BODY,
        )
    )

    story.append(Paragraph("Instrucciones", H3))
    story.append(
        Paragraph(
            "<b>1.</b> Revisa que todos los campos del listing esten "
            "completos: titulo, descripcion, capturas, icono, tile, categoria, "
            "idiomas, politica de privacidad.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>2.</b> Revisa que las preguntas de privacidad (Data Usage) "
            "estén respondidas correctamente.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>3.</b> Haz clic en el boton 'Submit for review' en la parte "
            "superior derecha del dashboard.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>4.</b> Confirma en el dialogo que aparece. A partir de este "
            "momento, el estado cambia a 'In review' y no podras editar el "
            "listing hasta que termine la revision.",
            BODY_LEFT,
        )
    )
    story.append(
        Paragraph(
            "<b>5.</b> Recibiras un email cuando la extension sea aprobada o "
            "rechazada. Si es aprobada, quedara publica inmediatamente.",
            BODY_LEFT,
        )
    )

    story.append(Paragraph("Estados de la extension", H3))

    states_data = [
        ["Estado", "Significado", "Duracion"],
        ["Draft", "Todavia no enviaste para revision", "Indefinido"],
        ["In review", "Google esta revisando la extension", "1-7 dias habiles"],
        ["Pending", "Revision completa, esperando publicacion", "Minutos a horas"],
        ["Published", "La extension esta publica en la tienda", "Permanente"],
        ["Rejected", "Google encontro problemas", "Ver email, corregir y reenviar"],
        ["Taken down", "Removida por violacion de politicas", "Revisar email urgente"],
    ]
    states_table = Table(states_data, colWidths=[90, 240, 110])
    states_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), RED_PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("FONTNAME", (0, 0), (-1, 0), "NotoSansSC-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "NotoSerifSC"),
                ("FONTNAME", (0, 1), (0, -1), "LiberationMono-Bold"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, HexColor("#fafafa")]),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(states_table)

    story.append(Spacer(1, 10))
    story.append(tip_box(
        "Las extensiones nuevas con permisos amplios (<all_urls>) pueden "
        "tardar hasta 7 dias habiles en ser aprobadas. Las actualizaciones de "
        "extensiones ya aprobadas suelen tardar solo 1-2 dias.",
        "tip",
    ))

    story.append(Spacer(1, 16))

    # ─── APPENDIX A: Privacy Policy ───
    story.append(Paragraph("Apéndice A — Plantilla de Politica de Privacidad", H1))
    story.append(SectionDivider())
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Google requiere una URL publica con tu politica de privacidad. La "
            "forma mas sencilla de hostearla gratis es crear un repositorio en "
            "GitHub, agregar este archivo como privacy.md, y activar GitHub "
            "Pages. La URL resultante sera "
            "https://TUCUENTA.github.io/TUREPO/privacy.md.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Copia el siguiente texto y pegalo en un archivo llamado "
            "<b>privacy.md</b>. Personaliza la fecha, el email de contacto y "
            "la URL del repositorio con tus datos reales.",
            BODY,
        )
    )

    story.append(Spacer(1, 8))
    story.append(code_block("""# Politica de Privacidad — MangaLens

Ultima actualizacion: 2026-07-15

## 1. Datos que recopilamos

MangaLens NO recopila, almacena ni transmite datos personales
identificables. La extension funciona 100% en el navegador del
usuario y no incluye analytics ni telemetria.

## 2. Permisos que usa

La extension solicita los siguientes permisos en manifest.json:

- **activeTab**: acceder a la pestana activa cuando el usuario
  hace clic en el icono de la extension
- **storage**: guardar la configuracion del usuario (idioma,
  fuente, motor seleccionado, API keys) usando chrome.storage.sync
- **contextMenus**: agregar opcion "Traducir manga" al menu
  contextual (clic derecho)
- **scripting**: inyectar scripts de traduccion en la pagina activa
- **<all_urls>**: detectar imagenes de manga en cualquier sitio
  que el usuario visite

## 3. Servicios de terceros

MangaLens permite al usuario configurar motores de traduccion
externos opcionalmente:

- **MangaImageTranslator** (mangaimagetranslator.com): servidor
  publico MIT para OCR + inpainting
- **Groq** (groq.com): inferencia LLM con plan gratuito
- **Xiaomi MiMo** (platform.xiaomimimo.com): modelos MiMo-V2.5

Las imagenes se envian a estos servicios SOLO cuando el usuario
los configura explicitamente en Opciones Avanzadas. Las API keys
se almacenan localmente con chrome.storage.sync y nunca se
comparten con terceros.

## 4. Modo 100% local

Con Docker Local / Ollama / LibreTranslate, ninguna imagen sale
del dispositivo del usuario. Recomendado para contenido sensible
o cuando se requiere maxima privacidad.

## 5. Almacenamiento local

La extension almacena localmente:

- Idioma destino seleccionado
- Fuente tipografica seleccionada
- Motor de traduccion seleccionado
- API keys (Groq, MiMo) — encriptadas por chrome.storage.sync
- Estado del boton flotante (mostrado/oculto)

## 6. Derechos del usuario

El usuario puede:

- Desinstalar la extension en cualquier momento
- Borrar todos los datos almacenados desde
  chrome://settings/siteData
- Deshabilitar motores en la nube desde Opciones Avanzadas
- Usar exclusivamente el modo Docker Local para privacidad total

## 7. Cambios a esta politica

Cualquier cambio en esta politica sera publicado en esta misma
URL con fecha actualizada.

## 8. Contacto

Para consultas de privacidad, abre un issue en:
https://github.com/zyddnys/manga-image-translator/issues""",
        prefix_dollar=False))

    story.append(Spacer(1, 16))

    # ─── APPENDIX B: Quick Reference ───
    story.append(Paragraph("Apéndice B — Tarjeta de Referencia Rapida", H1))
    story.append(SectionDivider())
    story.append(Spacer(1, 12))

    story.append(
        Paragraph(
            "Esta tarjeta resume los datos clave del proceso de publicacion. "
            "Imprimela o tenela a mano mientras completas el listing.",
            BODY,
        )
    )

    story.append(Spacer(1, 8))

    ref_data = [
        ["Dato", "Valor"],
        ["URL del Developer Dashboard", "https://chrome.google.com/webstore/devconsole"],
        ["Costo de cuenta de desarrollador", "USD 5 (unico, de por vida)"],
        ["Tiempo de verificacion de cuenta", "1-5 minutos"],
        ["Tiempo de revision de extension nueva", "1-7 dias habiles"],
        ["Tiempo de revision de actualizacion", "1-2 dias habiles"],
        ["Manifest version requerido", "V3 (obligatorio desde 2024)"],
        ["Tamano maximo del .zip", "100 MB (extension) / 10 MB (codigo fuente)"],
        ["Formato de capturas", "PNG 1280x800 o 640x400"],
        ["Formato de icono de tienda", "PNG 128x128"],
        ["Formato de tile pequeno", "PNG 440x280"],
        ["Categoria recomendada", "Productivity"],
        ["Idiomas del listing", "Espanol (primario), Ingles (secundario)"],
        ["Politica de privacidad", "URL publica obligatoria"],
        ["Soporte (URL)", "GitHub Issues recomendado"],
        ["Licencia", "MIT (open source)"],
    ]
    ref_table = Table(ref_data, colWidths=[200, 240])
    ref_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), RED_PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("FONTNAME", (0, 0), (-1, 0), "NotoSansSC-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("FONTNAME", (0, 1), (-1, -1), "NotoSerifSC"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#d4d4d8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, HexColor("#fafafa")]),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(ref_table)

    story.append(Spacer(1, 16))

    # ─── CLOSING ───
    story.append(Paragraph("Resumen final", H2))
    story.append(
        Paragraph(
            "Publicar MangaLens en la Chrome Web Store es un proceso "
            "directo si sigues los 6 pasos de esta guia en orden. El factor "
            "critico mas importante es la claridad de las justificaciones de "
            "permisos: Google rechaza extensiones que no expliquen claramente "
            "por que necesitan cada permiso. Usa las plantillas de "
            "justificaciones de esta guia y tu extension sera aprobada sin "
            "problemas.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Si Google te rechaza la extension, no te preocupes. El email de "
            "rechazo incluye el motivo exacto. Corrigelo, incrementa la "
            "version en manifest.json, regenera el .zip y vuelve a subirlo. "
            "El proceso de segunda revision suele ser mas rapido porque la "
            "cuenta ya esta verificada.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Una vez publicada, mantén la extension actualizada. Las "
            "extensiones que no se actualizan en 12 meses pueden ser "
            "removidas de la tienda por inactividad. Publica al menos una "
            "actualizacion menor por año (cambiar el version number y "
            "re-subir el .zip) para mantenerla activa.",
            BODY,
        )
    )

    return story


# ───────────────────────────────────────────────────────────
# Build the PDF
# ───────────────────────────────────────────────────────────
def build_pdf(output_path):
    doc = BaseDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=55,
        bottomMargin=50,
        title="MangaLens — Guia de Publicacion en Chrome Web Store",
        author="MangaLens",
        subject="Guia paso a paso para publicar MangaLens en la Chrome Web Store",
        creator="MangaLens v3.10.0",
    )

    # Cover frame (full bleed)
    cover_frame = Frame(
        0, 0, A4[0], A4[1],
        leftPadding=0, rightPadding=0,
        topPadding=0, bottomPadding=0,
        id="cover",
    )

    # Body frame
    body_frame = Frame(
        50, 50, A4[0] - 100, A4[1] - 105,
        leftPadding=0, rightPadding=0,
        topPadding=0, bottomPadding=0,
        id="body",
    )

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page_template),
        PageTemplate(id="Body", frames=[body_frame], onPage=body_page_template),
    ])

    story = build_story()

    # Force switch to Body template after the cover PageBreak
    from reportlab.platypus.doctemplate import NextPageTemplate

    final_story = []
    # First, the cover (on Cover template)
    final_story.append(story[0])  # CoverPage
    final_story.append(NextPageTemplate("Body"))
    final_story.append(PageBreak())
    # Then everything else on Body template
    final_story.extend(story[2:])

    doc.build(final_story)


if __name__ == "__main__":
    output = "/home/z/my-project/download/MangaLens-Guia-Chrome-Web-Store.pdf"
    os.makedirs(os.path.dirname(output), exist_ok=True)
    build_pdf(output)
    size_kb = os.path.getsize(output) / 1024
    print(f"PDF generado: {output}")
    print(f"Tamano: {size_kb:.1f} KB")
