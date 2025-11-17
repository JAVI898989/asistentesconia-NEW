/**
 * Sistema de Respuestas Temporales para Asistentes IA
 * Maneja fechas, contexto temporal y datos actualizados
 */

export interface TemporalContext {
  targetDate: Date;
  currentDate: Date;
  timezone: string;
  isHistorical: boolean;
  isFuture: boolean;
  isCurrentData: boolean;
}

export interface TemporalResponse {
  summary: string;
  targetDate: string;
  content: string;
  sources?: string[];
  disclaimer: string;
  needsVerification: boolean;
}

/**
 * Extrae la fecha objetivo de la consulta del usuario
 */
export function extractTargetDate(userQuery: string): TemporalContext {
  const currentDate = new Date();
  const timezone = 'Europe/Madrid';
  
  // Patrones para detectar fechas en español
  const datePatterns = [
    // Año específico: "en 2023", "del 2024", "para 2025"
    /(?:en|del|para|durante)\s+(\d{4})/i,
    // Fecha específica: "a 1/1/2024", "el 15/03/2023"
    /(?:a|el)\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
    // Mes y año: "enero 2024", "marzo del 2023"
    /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(?:del?\s+)?(\d{4})/i,
    // Referencias temporales: "el año pasado", "hace dos años"
    /(el\s+año\s+pasado|año\s+anterior)/i,
    /(hace\s+(\d+)\s+años?)/i,
  ];

  let targetDate = currentDate;
  let detectedPattern = false;

  for (const pattern of datePatterns) {
    const match = userQuery.match(pattern);
    if (match) {
      detectedPattern = true;
      
      if (pattern.source.includes('\\d{4}')) {
        // Año específico
        const year = parseInt(match[1]);
        targetDate = new Date(year, 0, 1);
      } else if (pattern.source.includes('\\d{1,2}')) {
        // Fecha específica
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1; // JavaScript months are 0-based
        const year = parseInt(match[3]);
        targetDate = new Date(year, month, day);
      } else if (pattern.source.includes('enero|febrero')) {
        // Mes y año
        const monthNames = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const monthIndex = monthNames.indexOf(match[1].toLowerCase());
        const year = parseInt(match[2]);
        targetDate = new Date(year, monthIndex, 1);
      } else if (match[0].includes('año pasado') || match[0].includes('año anterior')) {
        // Año pasado
        targetDate = new Date(currentDate.getFullYear() - 1, 0, 1);
      } else if (match[0].includes('hace')) {
        // Hace X a��os
        const yearsAgo = parseInt(match[2] || '1');
        targetDate = new Date(currentDate.getFullYear() - yearsAgo, 0, 1);
      }
      break;
    }
  }

  const isHistorical = targetDate < currentDate;
  const isFuture = targetDate > currentDate;
  const isCurrentData = !detectedPattern || Math.abs(targetDate.getTime() - currentDate.getTime()) < 24 * 60 * 60 * 1000;

  return {
    targetDate,
    currentDate,
    timezone,
    isHistorical,
    isFuture,
    isCurrentData,
  };
}

/**
 * Formatea fecha para el contexto español
 */
export function formatSpanishDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Europe/Madrid'
  });
}

/**
 * Genera el contexto temporal para el prompt del asistente
 */
export function generateTemporalPrompt(
  userQuery: string, 
  assistantScope: string
): { contextPrompt: string; temporalContext: TemporalContext } {
  const temporalContext = extractTargetDate(userQuery);
  const targetDateStr = formatSpanishDate(temporalContext.targetDate);
  const currentDateStr = formatSpanishDate(temporalContext.currentDate);

  const basePrompt = `
**SISTEMA DE RESPUESTA TEMPORAL ACTIVADO**

Rol: Eres un asistente experto que responde en español y siempre en el contexto temporal correcto.
Zona horaria: Europe/Madrid.
Ámbito: ${assistantScope}

🗓️ **INTERPRETACIÓN TEMPORAL (OBLIGATORIA)**
TARGET_DATE = ${targetDateStr}
FECHA_ACTUAL = ${currentDateStr}
CONTEXTO: ${temporalContext.isHistorical ? 'DATOS HISTÓRICOS' : temporalContext.isFuture ? 'DATOS FUTUROS' : 'DATOS ACTUALES'}

**Para datos sensibles al tiempo** (cifras, normas, tablas, temarios, límites, tasas):
- Responde con lo vigente en TARGET_DATE
- Si TARGET_DATE es pasado, da el valor de entonces ${!temporalContext.isCurrentData ? '(y añade situación actual si ayuda)' : ''}
- Si TARGET_DATE es futuro, explica que no hay datos definitivos y aporta la última referencia oficial

**🔎 ACTUALIZACIÓN Y FUENTES**
${temporalContext.isCurrentData ? 
  'IMPORTANTE: Usa navegación/consultas para verificar datos actuales en fuentes oficiales (BOE, ministerios, organismos oficiales).' :
  'Para datos históricos, usa la información conocida de esa fecha específica.'
}

**🧩 FORMATO DE RESPUESTA OBLIGATORIO:**

1. **Resumen con fecha utilizada:**
   "Datos a ${currentDateStr} (Europe/Madrid). Para ${targetDateStr}: [respuesta clave]"

2. **Detalle paso a paso** (claro, preciso)

3. **Tabla/desglose** si aplica (tramos, importes mensual/anual, etc.)

4. **Qué depende de...** (CCAA, convenio, normativa local, supuestos)

5. **Fuentes** (1–3, solo cuando el dato es temporal o se consultó)

6. **Aviso breve:** "Orientación general, no asesoramiento individual"

**✅ REGLAS ESTRICTAS:**
- NUNCA digas "no puedo responder" si es del ámbito del asistente
- SIEMPRE indica la fecha exacta empleada (TARGET_DATE)
- Distingue vigente vs. en trámite (proyectos/borradores)
- NO inventes referencias legales ni cifras: si no puedes verificar, marca "Verificar fuente"
- Para IRPF, SMI, bases cotización: ofrece desglose completo con tramos y importes

**CONSULTA DEL USUARIO:** "${userQuery}"
`;

  return {
    contextPrompt: basePrompt,
    temporalContext
  };
}

/**
 * Valida si la respuesta cumple con el formato temporal requerido
 */
export function validateTemporalResponse(response: string, context: TemporalContext): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Verificar que incluye fecha en el resumen
  if (!response.includes('Datos a') || !response.includes('Europe/Madrid')) {
    issues.push('Falta el resumen con fecha en formato requerido');
    suggestions.push('Incluir: "Datos a [dd/mm/aaaa] (Europe/Madrid). Para [TARGET_DATE]: ..."');
  }

  // Verificar estructura de respuesta
  const requiredSections = ['Resumen', 'Detalle', 'Fuentes', 'Aviso'];
  const hasStructure = requiredSections.some(section => 
    response.includes(section) || response.includes(section.toLowerCase())
  );

  if (!hasStructure) {
    issues.push('Falta estructura clara de respuesta');
    suggestions.push('Incluir secciones: Resumen, Detalle, Fuentes (si aplica), Aviso');
  }

  // Verificar aviso legal
  if (!response.includes('orientación general') && !response.includes('asesoramiento')) {
    issues.push('Falta aviso legal obligatorio');
    suggestions.push('Incluir: "Orientación general, no asesoramiento individual"');
  }

  // Para datos temporales, verificar que menciona la fecha objetivo
  if (!context.isCurrentData && !response.includes(formatSpanishDate(context.targetDate))) {
    issues.push('No menciona claramente la fecha objetivo en respuesta temporal');
    suggestions.push(`Mencionar explícitamente: ${formatSpanishDate(context.targetDate)}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * URLs de fuentes oficiales por ámbito
 */
export const OFFICIAL_SOURCES = {
  fiscal: [
    'https://www.boe.es',
    'https://sede.agenciatributaria.gob.es',
    'https://www.hacienda.gob.es'
  ],
  laboral: [
    'https://www.boe.es',
    'https://www.mites.gob.es',
    'https://www.sepe.es',
    'https://www.seg-social.es'
  ],
  trafico: [
    'https://www.boe.es',
    'https://sede.dgt.gob.es',
    'https://www.dgt.es'
  ],
  vivienda: [
    'https://www.boe.es',
    'https://www.mitma.gob.es',
    'https://sede.gob.es'
  ],
  oposiciones: [
    'https://www.boe.es',
    'https://administracion.gob.es',
    'https://sede.gob.es'
  ],
  default: [
    'https://www.boe.es',
    'https://sede.gob.es'
  ]
};

/**
 * Obtiene las fuentes oficiales recomendadas para un ámbito
 */
export function getOfficialSources(scope: string): string[] {
  const normalizedScope = scope.toLowerCase();
  
  if (normalizedScope.includes('fiscal') || normalizedScope.includes('impuesto') || normalizedScope.includes('hacienda')) {
    return OFFICIAL_SOURCES.fiscal;
  }
  if (normalizedScope.includes('laboral') || normalizedScope.includes('trabajo') || normalizedScope.includes('empleo')) {
    return OFFICIAL_SOURCES.laboral;
  }
  if (normalizedScope.includes('trafico') || normalizedScope.includes('conducir') || normalizedScope.includes('dgt')) {
    return OFFICIAL_SOURCES.trafico;
  }
  if (normalizedScope.includes('vivienda') || normalizedScope.includes('inmobiliario')) {
    return OFFICIAL_SOURCES.vivienda;
  }
  if (normalizedScope.includes('oposicion') || normalizedScope.includes('administracion')) {
    return OFFICIAL_SOURCES.oposiciones;
  }
  
  return OFFICIAL_SOURCES.default;
}
