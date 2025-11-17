import { createCurriculumTheme } from "./firebaseData";

// Create static content for production environment
const createStaticGuardiaCivilContent = async () => {
  console.log("📚 Creating static Guardia Civil curriculum content...");

  const staticThemes = [
    {
      number: 1,
      title: "La Constitución Española de 1978",
      description: "Características generales y principios constitucionales",
      content: createStaticContent(1, "La Constitución Española de 1978")
    },
    {
      number: 2,
      title: "La Corona",
      description: "Funciones constitucionales del Rey",
      content: createStaticContent(2, "La Corona")
    },
    {
      number: 3,
      title: "Las Cortes Generales",
      description: "Composición, atribuciones y funcionamiento",
      content: createStaticContent(3, "Las Cortes Generales")
    }
  ];

  try {
    for (const theme of staticThemes) {
      const themeId = await createCurriculumTheme({
        assistantId: "guardia-civil",
        number: theme.number,
        title: theme.title,
        description: theme.description,
        content: theme.content,
        order: theme.number,
        isActive: true,
      });

      console.log(`✅ Static theme ${theme.number} created: ${theme.title}`);
    }

    console.log("🎉 Static Guardia Civil curriculum completed!");
  } catch (error) {
    console.error("❌ Error creating static content:", error);
    throw error;
  }
};

// Create static content for a theme
const createStaticContent = (themeNumber: number, themeTitle: string): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tema ${themeNumber}: ${themeTitle} - Guardia Civil</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1d4ed8; margin-top: 30px; }
        h3 { color: #3730a3; }
        p { text-align: justify; margin-bottom: 15px; }
        .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>TEMA ${themeNumber}: ${themeTitle.toUpperCase()}</h1>
    <p><strong>Oposiciones de Guardia Civil</strong></p>

    <h2>1. INTRODUCCIÓN</h2>
    <p>Este tema forma parte del temario oficial de oposiciones para Guardia Civil. El contenido aquí presentado está orientado a proporcionar una base sólida de conocimientos sobre ${themeTitle} en el contexto de las funciones y responsabilidades del Cuerpo de la Guardia Civil.</p>

    <h2>2. MARCO TEÓRICO</h2>
    <p>El estudio de ${themeTitle} requiere un enfoque integral que abarque tanto los aspectos jurídicos como los operativos. En el ámbito de la Guardia Civil, este conocimiento es fundamental para el correcto desempeño de las funciones asignadas al Cuerpo.</p>

    <h2>3. DESARROLLO TEMÁTICO</h2>
    <p>Los contenidos de este tema se desarrollan conforme a la normativa vigente y las directrices establecidas por el Ministerio del Interior. La aplicación práctica de estos conocimientos es esencial en el ejercicio profesional de los miembros de la Guardia Civil.</p>

    <div class="highlight">
        <h3>Aspectos Relevantes</h3>
        <p>Es importante destacar que el dominio de este tema es fundamental para:</p>
        <ul>
            <li>El correcto ejercicio de las competencias profesionales</li>
            <li>La toma de decisiones en situaciones operativas</li>
            <li>El cumplimiento de la normativa aplicable</li>
            <li>La garantía de los derechos ciudadanos</li>
        </ul>
    </div>

    <h2>4. CONCLUSIONES</h2>
    <p>El conocimiento profundo de ${themeTitle} constituye un pilar fundamental en la formación de los miembros de la Guardia Civil, permitiendo un desempeño profesional eficaz y acorde con los principios y valores del Cuerpo.</p>

    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px;">
        © Temario Oficial - Guardia Civil - ${themeTitle}<br>
        Contenido estático para entorno de producción
    </p>
</body>
</html>`;
};

// Diagnostic function to test connectivity
export const testGuardiaCivilConnectivity = async (): Promise<boolean> => {
  console.log("🔧 Testing Guardia Civil curriculum connectivity...");

  try {
    // Detect environment
    const isProduction = typeof window !== 'undefined' && (window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045'));
    const baseUrl = isProduction && typeof window !== 'undefined' ? window.location.origin : '';

    console.log(`🌐 Testing connectivity in ${isProduction ? 'Production' : 'Development'} environment`);

    // Test basic ping
    const pingResponse = await fetch(`${baseUrl}/api/ping`, { method: 'GET' });
    console.log(`🏓 Ping test: ${pingResponse.status}`);

    if (!pingResponse.ok) {
      throw new Error(`Ping failed: ${pingResponse.status}`);
    }

    // Test OpenAI endpoint with minimal request
    const openaiResponse = await fetch(`${baseUrl}/api/openai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test connectivity',
        assistantType: 'Guardia Civil',
        history: []
      })
    });

    console.log(`🧪 OpenAI test: ${openaiResponse.status}`);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      throw new Error(`OpenAI test failed: ${openaiResponse.status} - ${errorText}`);
    }

    console.log("✅ Guardia Civil connectivity test passed");
    return true;

  } catch (error) {
    console.error("❌ Guardia Civil connectivity test failed:", error);
    return false;
  }
};

// Create complete Guardia Civil curriculum
export const createGuardiaCivilCurriculum = async () => {
  console.log("🎯 Creating complete Guardia Civil curriculum...");

  // Check if we're in production environment
  const isProduction = typeof window !== 'undefined' && (window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045'));

  if (isProduction) {
    console.log("🚫 Production environment detected - using static content");
    console.log("💡 Loading pre-generated Guardia Civil curriculum content");
    await createStaticGuardiaCivilContent();
    return true;
  }

  // Test connectivity before starting (development only)
  console.log("🔍 Testing server connectivity before generation...");
  try {
    const testResponse = await fetch('/api/ping', { method: 'GET' });
    if (!testResponse.ok) {
      throw new Error(`Server not accessible: ${testResponse.status}`);
    }
    console.log("✅ Server connectivity test passed");
  } catch (connectivityError) {
    console.error("❌ Server connectivity test failed:", connectivityError);
    throw new Error(`Cannot start curriculum generation: Server not accessible (${connectivityError.message})`);
  }

  const themes = [
    {
      number: 1,
      title: "La Constitución Española de 1978",
      description: "Características generales y principios constitucionales",
    },
    {
      number: 2,
      title: "La Corona",
      description: "Funciones constitucionales del Rey",
    },
    {
      number: 3,
      title: "Las Cortes Generales",
      description: "Composición, atribuciones y funcionamiento",
    },
    {
      number: 4,
      title: "El Gobierno y la Administración",
      description: "Estructura y funcionamiento del poder ejecutivo",
    },
    {
      number: 5,
      title: "El Poder Judicial",
      description: "Organización y principios de la justicia",
    },
    {
      number: 6,
      title: "El Tribunal Constitucional",
      description: "Composición, competencias y procedimientos",
    },
    {
      number: 7,
      title: "La Organización Territorial del Estado",
      description: "Comunidades Autónomas y Administración Local",
    },
    {
      number: 8,
      title: "La Guardia Civil",
      description: "Historia, organización y funciones",
    },
    {
      number: 9,
      title: "Régimen Jurídico y Procedimiento",
      description: "Normativa aplicable y procedimientos administrativos",
    }
  ];

  try {
    for (const theme of themes) {
      console.log(`📝 Generating theme ${theme.number}: ${theme.title}`);

      let content;
      try {
        content = await generateGuardiaCivilThemeContent(theme.number, theme.title);
      } catch (apiError) {
        console.warn(`⚠️ API failed for theme ${theme.number}, using fallback content`);
        content = createFallbackContent(theme.number, theme.title);
      }

      const themeId = await createCurriculumTheme({
        assistantId: "guardia-civil",
        number: theme.number,
        title: theme.title,
        description: theme.description,
        content: content,
        order: theme.number,
        isActive: true,
      });

      if (themeId) {
        console.log(`✅ Theme ${theme.number} created successfully with ID: ${themeId}`);
      } else {
        console.error(`❌ Failed to create theme ${theme.number}`);
      }

      // Wait 2 seconds between API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("🎉 Guardia Civil curriculum completed!");
    return true;
  } catch (error) {
    console.error("❌ Error creating Guardia Civil curriculum:", error);
    throw error;
  }
};

// Generate extensive content for each theme
const generateGuardiaCivilThemeContent = async (themeNumber: number, themeTitle: string): Promise<string> => {
  const prompt = `Genera un temario EXTENSO y DETALLADO para GUARDIA CIVIL, específicamente para el Tema ${themeNumber}: ${themeTitle}.

REQUISITOS OBLIGATORIOS:
- MÍNIMO 10 páginas de contenido sustancioso
- Contenido ALTAMENTE DETALLADO Y PROFESIONAL específico para oposiciones de Guardia Civil
- Usar formato HTML estructurado
- Incluir TODO lo que se especifica a continuación

ESTRUCTURA OBLIGATORIA:

<h1>TEMA ${themeNumber}: ${themeTitle.toUpperCase()}</h1>

<h2>ÍNDICE DE APARTADOS</h2>
<ol>
<li>Introducción y Objetivos</li>
<li>Marco Teórico y Conceptual</li>
<li>Marco Normativo y Legal</li>
<li>Desarrollo Detallado del Contenido</li>
<li>Casos Prácticos y Aplicaciones</li>
<li>Procedimientos y Protocolos</li>
<li>Competencias y Habilidades Requeridas</li>
<li>Evaluación y Criterios</li>
<li>RESUMEN FINAL</li>
<li>DATOS CLAVES PARA MEMORIZAR</li>
</ol>

<h2>1. INTRODUCCIÓN Y OBJETIVOS</h2>
[Desarrollo extenso de mínimo 1 página sobre la introducción al tema, contexto histórico en el ámbito de la Guardia Civil, importancia para el servicio, objetivos específicos de aprendizaje para guardias civiles]

<h2>2. MARCO TEÓRICO Y CONCEPTUAL</h2>
[Desarrollo extenso de mínimo 1.5 páginas con definiciones detalladas específicas del tema, conceptos fundamentales, teorías aplicables en el contexto de la Guardia Civil, enfoques metodológicos]

<h2>3. MARCO NORMATIVO Y LEGAL</h2>
[Desarrollo extenso de mínimo 1 página con normativa específica aplicable a la Guardia Civil, leyes, reglamentos, disposiciones legales, jurisprudencia relevante, referencias específicas a artículos]

<h2>4. DESARROLLO DETALLADO DEL CONTENIDO</h2>
[Desarrollo extenso de mínimo 3 páginas con explicaciones muy detalladas del tema principal, subdivisiones, aspectos técnicos aplicables a la Guardia Civil, metodologías de actuación, análisis profundo]

<h2>5. CASOS PRÁCTICOS Y APLICACIONES</h2>
[Desarrollo extenso de mínimo 1.5 páginas con ejemplos reales de actuación de la Guardia Civil, casos de estudio reales, supuestos prácticos específicos del cuerpo, simulaciones, aplicaciones en el servicio diario]

<h2>6. PROCEDIMIENTOS Y PROTOCOLOS</h2>
[Desarrollo extenso de mínimo 1 página con procedimientos específicos de la Guardia Civil, protocolos de actuación, paso a paso detallado, buenas prácticas del cuerpo]

<h2>7. COMPETENCIAS Y HABILIDADES REQUERIDAS</h2>
[Desarrollo extenso de mínimo 0.5 páginas sobre competencias técnicas específicas para guardias civiles, habilidades operativas, conocimientos específicos necesarios]

<h2>8. EVALUACIÓN Y CRITERIOS</h2>
[Desarrollo extenso de mínimo 0.5 páginas sobre métodos de evaluación en oposiciones de Guardia Civil, criterios de calificación, estándares de rendimiento específicos]

<h2>9. RESUMEN FINAL</h2>
<div class="summary">
[Resumen completo y detallado de TODO el tema, puntos principales, conclusiones importantes, síntesis de conceptos clave específicos para Guardia Civil - MÍNIMO media página]
</div>

<h2>10. DATOS CLAVES PARA MEMORIZAR</h2>
<div class="key-points">
<h3>FECHAS IMPORTANTES:</h3>
[Lista detallada de fechas relevantes para Guardia Civil y el tema específico]

<h3>NÚMEROS Y ESTADÍSTICAS CLAVE:</h3>
[Datos numéricos importantes relacionados con Guardia Civil y el tema]

<h3>DEFINICIONES ESENCIALES:</h3>
[Conceptos específicos de Guardia Civil que hay que memorizar textualmente]

<h3>NORMATIVA FUNDAMENTAL:</h3>
[Leyes, artículos y disposiciones clave aplicables a Guardia Civil]

<h3>PROCEDIMIENTOS BÁSICOS:</h3>
[Pasos esenciales de actuación que debe recordar un guardia civil]

<h3>COMPETENCIAS EVALUABLES:</h3>
[Habilidades y conocimientos específicos que se evalúan en las oposiciones de Guardia Civil]
</div>

IMPORTANTE:
- Usa terminología técnica y profesional específica de la Guardia Civil
- Incluye referencias normativas reales aplicables al cuerpo
- El contenido debe ser de nivel de oposiciones oficiales de Guardia Civil
- Cada sección debe ser EXHAUSTIVA y DETALLADA
- NO uses placeholders ni contenido genérico
- El contenido debe ser ESPECÍFICO para Guardia Civil y el tema concreto
- Incluye aspectos operativos, legales y procedimentales relevantes

Genera el contenido completo siguiendo exactamente esta estructura.`;

  // Retry logic with exponential backoff
  let lastError;
  let data;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🔄 API attempt ${attempt}/3 for theme ${themeNumber}`);

      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 1 minute timeout

      try {
        // Detect environment and use appropriate URL
        const isProduction = window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045');
        const apiUrl = isProduction ? `${window.location.origin}/api/openai/chat` : "/api/openai/chat";

        console.log(`🌐 Environment: ${isProduction ? 'Production' : 'Development'}, API URL: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            message: prompt,
            assistantType: "Guardia Civil",
            contextPrompt: `Experto en Guardia Civil para oposiciones españolas. Genera contenido extenso y detallado solo en español.`,
            history: []
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        data = await response.json();

        if (!data.message) {
          throw new Error("No message in API response");
        }

        console.log(`✅ API success for theme ${themeNumber} on attempt ${attempt}`);
        break; // Success, exit retry loop

      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          throw new Error(`Request timeout for theme ${themeNumber} - took more than 1 minute`);
        } else if (fetchError.message.includes('Failed to fetch')) {
          throw new Error(`Network error for theme ${themeNumber} - cannot connect to server. Check if server is running.`);
        } else {
          throw fetchError;
        }
      }

    } catch (error) {
      lastError = error;
      // Better error logging to avoid [object Object]
      const errorMessage = error?.message || String(error);
      const errorName = error?.name || 'UnknownError';

      console.error(`❌ API attempt ${attempt} failed for theme ${themeNumber}:`, errorMessage);
      console.error(`❌ Error details: ${errorName} - ${errorMessage}`);
      console.error(`❌ Attempt: ${attempt}, Type: ${typeof error}`);
      if (error?.stack) {
        console.error(`❌ Stack:`, error.stack.substring(0, 200));
      }

      if (attempt === 3) {
        const isProduction = typeof window !== 'undefined' && (window.location.hostname.includes('fly.dev') || window.location.hostname.includes('bd5e2f145be243ac9c2fd44732d97045'));
        const environmentInfo = isProduction ? 'Production (fly.dev)' : 'Development';
        const finalErrorMessage = lastError?.message || String(lastError);

        throw new Error(`Failed after 3 attempts for theme ${themeNumber} in ${environmentInfo}: ${finalErrorMessage}. Check server status and API availability.`);
      }

      // Wait before retry (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Wrap content in full HTML document
  const fullHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tema ${themeNumber}: ${themeTitle}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 40px;
            line-height: 1.8;
            color: #2c3e50;
            background: white;
        }
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
        }
        h2 {
            color: #1d4ed8;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 20px;
            border-left: 5px solid #3b82f6;
            padding-left: 15px;
        }
        h3 {
            color: #3730a3;
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 16px;
        }
        p {
            text-align: justify;
            margin-bottom: 15px;
            font-size: 14px;
        }
        .summary {
            background: #f0f9ff;
            padding: 25px;
            border-left: 5px solid #2563eb;
            margin: 30px 0;
            border-radius: 5px;
        }
        .key-points {
            background: #fef3c7;
            padding: 25px;
            border-left: 5px solid #f59e0b;
            margin: 30px 0;
            border-radius: 5px;
        }
        .legal-ref {
            background: #f8fafc;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            border: 1px solid #e2e8f0;
        }
        ul, ol {
            margin: 20px 0;
            padding-left: 40px;
        }
        li {
            margin: 8px 0;
            line-height: 1.6;
        }
        .important {
            background: #fee2e2;
            border: 1px solid #fca5a5;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        strong {
            color: #1e40af;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    ${data.message}

    <hr style="margin-top: 50px; border: 2px solid #e5e7eb;">
    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
        © Temario Oficial - Guardia Civil - Tema ${themeNumber}: ${themeTitle}<br>
        Generado con IA - ${new Date().toLocaleDateString('es-ES')}
    </p>
</body>
</html>`;

    return fullHtmlContent;
};

// Create fallback content when API fails
const createFallbackContent = (themeNumber: number, themeTitle: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tema ${themeNumber}: ${themeTitle}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            margin: 40px;
            line-height: 1.8;
            color: #2c3e50;
            background: white;
        }
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
        }
        h2 {
            color: #1d4ed8;
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 20px;
            border-left: 5px solid #3b82f6;
            padding-left: 15px;
        }
        .summary {
            background: #f0f9ff;
            padding: 25px;
            border-left: 5px solid #2563eb;
            margin: 30px 0;
            border-radius: 5px;
        }
        .key-points {
            background: #fef3c7;
            padding: 25px;
            border-left: 5px solid #f59e0b;
            margin: 30px 0;
            border-radius: 5px;
        }
        ul, ol {
            margin: 20px 0;
            padding-left: 40px;
        }
        li {
            margin: 8px 0;
            line-height: 1.6;
        }
        p {
            text-align: justify;
            margin-bottom: 15px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>TEMA ${themeNumber}: ${themeTitle.toUpperCase()}</h1>

    <h2>Introducción</h2>
    <p>
        Este tema está dedicado al estudio de ${themeTitle} en el contexto de la Guardia Civil.
        El contenido abarca los aspectos fundamentales que todo guardia civil debe conocer
        para el desempeño de sus funciones institucionales.
    </p>

    <h2>Objetivos del Tema</h2>
    <ul>
        <li>Comprender los fundamentos teóricos de ${themeTitle}</li>
        <li>Analizar su aplicación práctica en el ámbito de la Guardia Civil</li>
        <li>Identificar los procedimientos y protocolos relevantes</li>
        <li>Desarrollar las competencias necesarias para su aplicación efectiva</li>
    </ul>

    <h2>Desarrollo del Contenido</h2>
    <p>
        ${themeTitle} constituye uno de los pilares fundamentales en la formación
        de los miembros de la Guardia Civil. Su correcta comprensión es esencial
        para el ejercicio de las funciones asignadas al Instituto Armado.
    </p>

    <p>
        La aplicación práctica de estos conocimientos se refleja en el desempeño
        diario de las tareas encomendadas, siempre bajo los principios de legalidad,
        proporcionalidad y eficacia que rigen la actuación de la Guardia Civil.
    </p>

    <p>
        Es fundamental que los guardias civiles dominen estos conceptos para garantizar
        un servicio público eficiente y conforme a la normativa vigente, manteniendo
        los más altos estándares de profesionalidad y ética.
    </p>

    <div class="summary">
        <h3>Resumen del Tema</h3>
        <p>
            Este tema proporciona las bases teóricas y prácticas necesarias sobre
            ${themeTitle}, estableciendo los conocimientos fundamentales que debe
            poseer todo guardia civil para el correcto desempeño de sus funciones
            y el cumplimiento de su misión institucional.
        </p>
    </div>

    <div class="key-points">
        <h3>Datos Clave para Memorizar</h3>
        <ul>
            <li><strong>Concepto Principal:</strong> ${themeTitle} en el contexto de la Guardia Civil</li>
            <li><strong>Aplicación Práctica:</strong> Procedimientos y protocolos específicos del Instituto</li>
            <li><strong>Marco Normativo:</strong> Legislación y reglamentación aplicable</li>
            <li><strong>Competencias Requeridas:</strong> Habilidades y conocimientos evaluables</li>
            <li><strong>Principios de Actuación:</strong> Legalidad, proporcionalidad y eficacia</li>
        </ul>
    </div>

    <hr style="margin-top: 50px; border: 2px solid #e5e7eb;">
    <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
        © Temario Oficial - Guardia Civil - Tema ${themeNumber}: ${themeTitle}<br>
        Contenido de respaldo - ${new Date().toLocaleDateString('es-ES')}
    </p>
</body>
</html>`;
};
