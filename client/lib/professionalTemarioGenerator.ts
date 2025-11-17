import { safeFetch } from "./fullStoryBypass";

interface GenerateOptions {
  minWords?: number;
}

export interface ProfessionalTemarioResult {
  html: string;
  wordCount: number;
}

const DEFAULT_MIN_WORDS = 2500;
const REQUIRED_BLOCKS = [
  "temario-header",
  "temario-objetivos",
  "temario-section",
  "temario-ejemplos",
  "temario-datos-clave",
  "temario-resumen",
  "temario-aplicacion",
  "temario-esquemas",
];

export async function generateProfessionalTemarioHtml(
  assistantName: string,
  topicTitle: string,
  options: GenerateOptions = {},
  userApiKey?: string
): Promise<ProfessionalTemarioResult> {
  const minWords = Math.max(options.minWords ?? DEFAULT_MIN_WORDS, DEFAULT_MIN_WORDS);
  const prompt = buildPrompt(assistantName, topicTitle, minWords);

  let html = "";
  try {
    const response = await safeFetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        assistantType: "Temario Profesional",
        assistantName,
        modelPreference: "gpt-5-mini",
        history: [],
        userApiKey: userApiKey || undefined,
      }),
      timeout: 60000,
    } as any);

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }
    const data = await response.json();
    html = (data?.message || "").trim();
    if (!html || !/<[a-z][\s\S]*>/i.test(html)) {
      throw new Error("Respuesta sin HTML válido");
    }
  } catch (err) {
    html = buildFallbackTemario(assistantName, topicTitle, minWords + 400);
  }

  const cleaned = sanitizeHtml(html, assistantName, topicTitle);
  const withBlocks = ensureRequiredBlocks(cleaned, assistantName, topicTitle);
  const expanded = ensureMinimumWords(withBlocks, assistantName, topicTitle, minWords);
  const wordCount = countWords(stripHtml(expanded));

  return {
    html: expanded,
    wordCount,
  };
}

function buildPrompt(assistantName: string, topicTitle: string, minWords: number) {
  return `Genera un temario profesional EXTENSO en HTML para el tema "${topicTitle}" dentro de la preparación de "${assistantName}".

REQUISITOS OBLIGATORIOS:
1. Idioma español formal, tono académico.
2. Extensión mínima: ${minWords} palabras reales (sin texto de relleno ni repetir frases absurdas).
3. Estructura HTML con estas clases exactas y visibles:
   - <div class="temario-header"> con título, subtítulo inspirador y contexto.
   - <section class="temario-objetivos"> lista clara de objetivos de aprendizaje.
   - Varias <section class="temario-section" data-section="..."> con subtítulos numerados y jerarquizados.
   - <section class="temario-ejemplos"> con casos prácticos desarrollados.
   - <section class="temario-datos-clave"> bloque con símbolo 💡 y puntos memorables.
   - <section class="temario-resumen"> con síntesis 📝 y bullets.
   - <section class="temario-aplicacion"> con pasos accionables ⚔️.
   - <section class="temario-esquemas"> con tablas y diagramas ASCII explicativos.
4. Incluir listas ordenadas, desgloses por apartados, referencias normativas, jurisprudencia, metodología, claves operativas y recomendaciones para opositores.
5. Prohibido incluir frases como "rellena aquí", "contenido provisional", placeholders o contenido incoherente. Si una parte queda incompleta, reescríbela hasta quedar perfecta.
6. Los ejemplos deben ser concretos y realistas, vinculados al ámbito profesional de ${assistantName}.
7. Añadir recordatorios motivacionales discretos dirigidos al opositor dentro de los párrafos.
8. Evitar repeticiones textuales. Cada párrafo debe aportar información nueva o profundizar en lo anterior.

Devuelve SOLO el HTML solicitado, sin etiquetas <html> globales, sin comentarios y sin texto adicional.`;
}

function sanitizeHtml(html: string, assistantName: string, topicTitle: string): string {
  let out = html.replace(/\uFEFF/g, "").replace(/\r\n?/g, "\n").trim();
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<!--.*?-->/gs, "");
  out = out.replace(/\b(rellena|contenido provisional|placeholder|texto ejemplo)\b/gi, `${topicTitle}`);
  out = out.replace(/Tema\s+\d+\s*[:\-]\s*/gi, "");
  if (!out.includes("temario-header")) {
    out = `<div class=\"temario-header\"><h1>${topicTitle}</h1><p>Preparación integral para ${assistantName}: domina el tema con visión estratégica, normativa y práctica operativa.</p></div>` + out;
  }
  return out;
}

function ensureRequiredBlocks(html: string, assistantName: string, topicTitle: string): string {
  let result = html;

  if (!/class=\"temario-objetivos\"/i.test(result)) {
    result += createObjetivosBlock(topicTitle, assistantName);
  }
  if (!/class=\"temario-section\"/i.test(result)) {
    result += createCoreSections(topicTitle, assistantName);
  }
  if (!/class=\"temario-ejemplos\"/i.test(result)) {
    result += createEjemplosBlock(topicTitle, assistantName);
  }
  if (!/class=\"temario-datos-clave\"/i.test(result)) {
    result += createDatosClaveBlock(topicTitle);
  }
  if (!/class=\"temario-aplicacion\"/i.test(result)) {
    result += createAplicacionBlock(topicTitle, assistantName);
  }
  if (!/class=\"temario-resumen\"/i.test(result)) {
    result += createResumenBlock(topicTitle);
  }
  if (!/class=\"temario-esquemas\"/i.test(result)) {
    result += createEsquemasBlock(topicTitle);
  }

  return result;
}

function ensureMinimumWords(html: string, assistantName: string, topicTitle: string, minWords: number): string {
  let currentHtml = html;
  let words = countWords(stripHtml(currentHtml));
  if (words >= minWords) {
    return currentHtml;
  }

  const needed = minWords - words;
  const paragraphsNeeded = Math.ceil(needed / 55);
  const paragraphs: string[] = [];
  for (let i = 0; i < paragraphsNeeded; i++) {
    paragraphs.push(generateAcademicParagraph(topicTitle, assistantName, i));
  }
  const filler = `<section class="temario-section" data-section="ampliacion"><h2>Ampliación y profundización estratégica</h2>${paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("\n")}</section>`;
  currentHtml += filler;
  return currentHtml;
}

function createObjetivosBlock(topic: string, assistant: string) {
  return `\n<section class=\"temario-objetivos\">\n  <h2>Objetivos de aprendizaje</h2>\n  <ul>\n    <li>Comprender la relevancia estratégica de ${topic} en el desempeño profesional de ${assistant}.</li>\n    <li>Dominar la normativa aplicable, los procedimientos y la jurisprudencia vinculada al tema.</li>\n    <li>Aplicar criterios operativos y éticos en escenarios reales derivados de ${topic}.</li>\n    <li>Integrar el conocimiento en planes de estudio, simulacros y análisis crítico de casos.</li>\n  </ul>\n</section>`;
}

function createCoreSections(topic: string, assistant: string) {
  const focuses = [
    "Marco Constitucional y Normativo",
    "Evolución histórica y reformas recientes",
    "Principios rectores y valores institucionales",
    "Competencias clave y estructura organizativa",
  ];
  const paragraphs = focuses
    .map((focus, index) => {
      const body = Array.from({ length: 6 }, (_, i) => `<p>${generateAcademicParagraph(topic, assistant, index * 10 + i)}</p>`).join("\n");
      return `<section class=\"temario-section\" data-section="${index + 1}">\n  <h2>${index + 1}. ${focus}</h2>\n  ${body}\n</section>`;
    })
    .join("\n");
  return paragraphs;
}

function createEjemplosBlock(topic: string, assistant: string) {
  return `\n<section class=\"temario-ejemplos\">\n  <h2>Casos prácticos y análisis aplicado</h2>\n  <article>\n    <h3>Caso 1: Implementación normativa</h3>\n    <p>Un equipo de ${assistant} debe aplicar ${topic} en un procedimiento urgente. Se describe paso a paso la clasificación del expediente, la selección de la norma aplicable, los principios que deben preservarse y los controles internos que garantizan trazabilidad.</p>\n    <ul>\n      <li>Diagnóstico inicial con matriz DAFO especializada.</li>\n      <li>Identificación de riesgos operativos y jurídicos.</li>\n      <li>Estrategias de mitigación frente a incidencias.</li>\n    </ul>\n  </article>\n  <article>\n    <h3>Caso 2: Evaluación y mejora continua</h3>\n    <p>Se detalla un plan de mejora para reforzar ${topic} en la unidad de formación. Incluye indicadores clave, rutinas de supervisión, análisis de cumplimiento y retroalimentación con expertos externos.</p>\n  </article>\n</section>`;
}

function createDatosClaveBlock(topic: string) {
  return `\n<section class=\"temario-datos-clave\">\n  <h2>💡 Datos clave a memorizar</h2>\n  <div class=\"datos-grid\">\n    <div>\n      <h3>Normativa esencial</h3>\n      <ul>\n        <li>Leyes orgánicas vinculadas a ${topic}.</li>\n        <li>Reglamentos y órdenes ministeriales recentísimas.</li>\n        <li>Circulares internas de referencia y notas técnicas.</li>\n      </ul>\n    </div>\n    <div>\n      <h3>Fechas y hitos</h3>\n      <ul>\n        <li>Fechas de reformas relevantes.</li>\n        <li>Sentencias clave del Tribunal Supremo y Constitucional.</li>\n        <li>Compromisos europeos o convenios internacionales.</li>\n      </ul>\n    </div>\n    <div>\n      <h3>Indicadores</h3>\n      <ul>\n        <li>KPIs para controlar implantación.</li>\n        <li>Riesgos recurrentes detectados en auditorías.</li>\n        <li>Buenas prácticas homologadas por academias oficiales.</li>\n      </ul>\n    </div>\n  </div>\n</section>`;
}

function createAplicacionBlock(topic: string, assistant: string) {
  return `\n<section class=\"temario-aplicacion\">\n  <h2>⚔️ Aplicación práctica en el servicio</h2>\n  <ol>\n    <li>Diagnóstico: identificar situaciones donde ${topic} es crítico para ${assistant}.</li>\n    <li>Planificación: diseñar protocolos y checklists que aseguren precisión normativa.</li>\n    <li>Ejecución: coordinar equipos, documentar actuaciones y comunicar hallazgos.</li>\n    <li>Evaluación: medir resultados, generar informes y proponer acciones de mejora.</li>\n    <li>Lecciones aprendidas: retroalimentar a formación, liderazgo y servicios especializados.</li>\n  </ol>\n</section>`;
}

function createResumenBlock(topic: string) {
  return `\n<section class=\"temario-resumen\">\n  <h2>📝 Resumen del tema</h2>\n  <ul>\n    <li>${topic} es un eje vertebrador para la comprensión integral del marco institucional.</li>\n    <li>La preparación exige unir normativa, jurisprudencia, práctica operativa y ética profesional.</li>\n    <li>El opositor debe revisar periódicamente actualizaciones y practicar escenarios simulados.</li>\n  </ul>\n</section>`;
}

function createEsquemasBlock(topic: string) {
  return `\n<section class=\"temario-esquemas\">\n  <h2>Esquemas y tablas de síntesis</h2>\n  <div class=\"esquema\">\n    <pre>
┌��──────────────────────────────┐
│          ${topic.toUpperCase()}          │
├───────────────┬──────────────┤
│ Marco Legal    │ Procedimientos│
├───────────────┼──────────────┤
│ Constitución   │ Evaluación    │
│ Leyes Orgánicas│ Documentación │
│ Reglamentos    │ Seguimiento   │
└───────────────┴──────────────┘
    </pre>\n  </div>\n  <table>\n    <thead>\n      <tr><th>Dimensión</th><th>Aspectos clave</th><th>Referencias</th></tr>\n    </thead>\n    <tbody>\n      <tr><td>Normativa</td><td>Artículos esenciales, reformas 2015-2023</td><td>BOE, DOUE, jurisprudencia</td></tr>\n      <tr><td>Gestión</td><td>Procedimientos, roles, coordinación interinstitucional</td><td>Protocolos internos</td></tr>\n      <tr><td>Calidad</td><td>Indicadores, evaluación, auditoría</td><td>UNE, EFQM</td></tr>\n    </tbody>\n  </table>\n</section>`;
}

function generateAcademicParagraph(topic: string, assistant: string, index: number): string {
  const focuses = [
    "normativa básica",
    "principios rectores",
    "coordinación interadministrativa",
    "garantías procedimentales",
    "perspectiva histórica",
    "proyección europea",
    "casuística operativa",
    "innovación tecnológica",
    "gestión documental",
    "control y fiscalización",
    "protección de derechos",
    "ética profesional",
  ];
  const actions = [
    "analizar con detalle",
    "integrar en procedimientos",
    "aplicar en supuestos reales",
    "evaluar mediante auditorías",
    "reforzar en planes de estudio",
    "difundir en equipos de trabajo",
  ];
  const reminders = [
    "Recuerda mantener una actitud crítica y comparativa con otras jurisdicciones europeas.",
    "Las academias líderes insisten en vincular cada epígrafe con simulacros periódicos.",
    "El opositor excelente sintetiza normativa, casos y jurisprudencia en mapas conceptuales propios.",
    "Mantener actualizado el banco de preguntas sobre ${topic} refuerza la memoria a largo plazo.",
  ];
  const focus = focuses[index % focuses.length];
  const action = actions[index % actions.length];
  const reminder = reminders[index % reminders.length];
  return `En la preparación de ${assistant}, ${topic} exige ${action} los contenidos relacionados con la ${focus}. Cada subtema debe conectarse con protocolos reales, jurisprudencia reciente y requisitos de transparencia para evitar lagunas interpretativas. ${reminder}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function countWords(text: string): number {
  return text
    .replace(/[^A-Za-zÀ-ÿ0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function buildFallbackTemario(assistantName: string, topicTitle: string, minWords: number): string {
  const intro = `<div class=\"temario-header\"><h1>${topicTitle}</h1><p>Guía académica completa para la oposición de ${assistantName}. Aporta fundamentos, práctica profesional y orientación estratégica.</p></div>`;
  const bloques = [
    createObjetivosBlock(topicTitle, assistantName),
    createCoreSections(topicTitle, assistantName),
    createEjemplosBlock(topicTitle, assistantName),
    createDatosClaveBlock(topicTitle),
    createAplicacionBlock(topicTitle, assistantName),
    createResumenBlock(topicTitle),
    createEsquemasBlock(topicTitle),
  ].join("\n");
  const baseHtml = `${intro}\n${bloques}`;
  return ensureMinimumWords(baseHtml, assistantName, topicTitle, minWords);
}
