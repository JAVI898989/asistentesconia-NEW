import { getCurriculumThemes, createCurriculumTheme } from "./firebaseData";

interface GenerationProgress {
  currentAssistant: string;
  currentTheme: number;
  assistantProgress: number;
  totalProgress: number;
  completed: number;
  total: number;
  errors: string[];
  conflicts: string[];
}

interface Assistant {
  id: string;
  name: string;
}

// Check for existing curricula
export const checkExistingCurricula = async (assistantIds: string[]): Promise<string[]> => {
  const conflicts: string[] = [];
  
  try {
    for (const assistantId of assistantIds) {
      const existingThemes = await getCurriculumThemes(assistantId);
      if (existingThemes.length > 0) {
        const assistant = assistantIds.find(id => id === assistantId);
        conflicts.push(assistantId);
      }
    }
  } catch (error) {
    console.warn("Error checking existing curricula:", error);
  }
  
  return conflicts;
};

// Generate extensive curriculum content using AI
const generateExtensiveCurriculumWithAI = async (
  assistantName: string,
  themeNumber: number,
  themeTitle: string
): Promise<string> => {
  const prompt = `Genera un temario EXTENSO y DETALLADO para ${assistantName}, específicamente para el Tema ${themeNumber}: ${themeTitle}.

REQUISITOS OBLIGATORIOS:
- MÍNIMO 10 páginas de contenido sustancioso
- Contenido ALTAMENTE DETALLADO Y PROFESIONAL
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
[Desarrollo extenso de mínimo 1 página sobre la introducción al tema, contexto histórico, importancia en el ámbito de ${assistantName}, objetivos específicos de aprendizaje]

<h2>2. MARCO TEÓRICO Y CONCEPTUAL</h2>
[Desarrollo extenso de mínimo 1.5 páginas con definiciones detalladas, conceptos fundamentales, teorías aplicables, enfoques metodológicos]

<h2>3. MARCO NORMATIVO Y LEGAL</h2>
[Desarrollo extenso de mínimo 1 página con normativa específica, leyes aplicables, reglamentos, disposiciones legales, jurisprudencia relevante]

<h2>4. DESARROLLO DETALLADO DEL CONTENIDO</h2>
[Desarrollo extenso de mínimo 3 páginas con explicaciones muy detalladas del tema principal, subdivisiones, aspectos técnicos, metodologías, análisis profundo]

<h2>5. CASOS PRÁCTICOS Y APLICACIONES</h2>
[Desarrollo extenso de mínimo 1.5 páginas con ejemplos reales, casos de estudio, supuestos prácticos, simulaciones, aplicaciones en el mundo real]

<h2>6. PROCEDIMIENTOS Y PROTOCOLOS</h2>
[Desarrollo extenso de mínimo 1 página con procedimientos específicos, protocolos a seguir, paso a paso detallado, buenas prácticas]

<h2>7. COMPETENCIAS Y HABILIDADES REQUERIDAS</h2>
[Desarrollo extenso de mínimo 0.5 páginas sobre competencias técnicas, habilidades blandas, conocimientos específicos necesarios]

<h2>8. EVALUACIÓN Y CRITERIOS</h2>
[Desarrollo extenso de mínimo 0.5 páginas sobre métodos de evaluación, criterios de calificación, estándares de rendimiento]

<h2>9. RESUMEN FINAL</h2>
<div class="summary">
[Resumen completo y detallado de TODO el tema, puntos principales, conclusiones importantes, síntesis de conceptos clave - MÍNIMO media página]
</div>

<h2>10. DATOS CLAVES PARA MEMORIZAR</h2>
<div class="key-points">
<h3>FECHAS IMPORTANTES:</h3>
[Lista detallada de fechas relevantes]

<h3>NÚMEROS Y ESTADÍSTICAS CLAVE:</h3>
[Datos numéricos importantes]

<h3>DEFINICIONES ESENCIALES:</h3>
[Conceptos que hay que memorizar textualmente]

<h3>NORMATIVA FUNDAMENTAL:</h3>
[Leyes, artículos y disposiciones clave]

<h3>PROCEDIMIENTOS BÁSICOS:</h3>
[Pasos esenciales que hay que recordar]

<h3>COMPETENCIAS EVALUABLES:</h3>
[Habilidades y conocimientos que se evalúan en exámenes]
</div>

IMPORTANTE: 
- Usa terminología técnica y profesional específica de ${assistantName}
- Incluye referencias normativas reales cuando sea apropiado
- El contenido debe ser de nivel de oposiciones oficiales
- Cada sección debe ser EXHAUSTIVA y DETALLADA
- NO uses placeholders ni contenido genérico
- El contenido debe ser ESPECÍFICO para ${assistantName}

Genera el contenido completo siguiendo exactamente esta estructura.`;

  try {
    const response = await fetch("/api/openai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        assistantType: "AI Curriculum Generator",
        contextPrompt: `Eres un experto en ${assistantName} y generación de contenido educativo para oposiciones españolas. 
        Crea contenido extenso, detallado y profesional de mínimo 10 páginas. Usa HTML estructurado y 
        asegúrate de que el contenido sea específico y útil para estudiantes de oposiciones.`,
        history: []
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API de OpenAI: ${response.status}`);
    }

    const data = await response.json();
    
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
        © Temario Oficial - ${assistantName} - Tema ${themeNumber}: ${themeTitle}<br>
        Generado con IA - ${new Date().toLocaleDateString('es-ES')}
    </p>
</body>
</html>`;

    return fullHtmlContent;
  } catch (error) {
    console.error("Error generating curriculum with AI:", error);
    throw new Error(`Error al generar temario para ${themeTitle}: ${error.message}`);
  }
};

// Generate curricula for all assistants
export const generateAllCurricula = async (
  assistants: Assistant[],
  themeTemplates: string[],
  overwriteExisting: boolean,
  onProgress: (progress: GenerationProgress) => void
): Promise<void> => {
  const totalOperations = assistants.length * themeTemplates.length;
  let completedOperations = 0;
  const errors: string[] = [];

  console.log(`🚀 Starting mass generation for ${assistants.length} assistants, ${themeTemplates.length} themes each`);

  for (let assistantIndex = 0; assistantIndex < assistants.length; assistantIndex++) {
    const assistant = assistants[assistantIndex];
    
    try {
      console.log(`📚 Processing assistant: ${assistant.name} (${assistantIndex + 1}/${assistants.length})`);
      
      // Update progress
      onProgress({
        currentAssistant: assistant.name,
        currentTheme: 0,
        assistantProgress: 0,
        totalProgress: (completedOperations / totalOperations) * 100,
        completed: completedOperations,
        total: totalOperations,
        errors: [...errors],
        conflicts: [],
      });

      // Check if themes already exist (unless overwriting)
      if (!overwriteExisting) {
        const existingThemes = await getCurriculumThemes(assistant.id);
        if (existingThemes.length > 0) {
          console.log(`⏭️ Skipping ${assistant.name} - already has ${existingThemes.length} themes`);
          completedOperations += themeTemplates.length;
          continue;
        }
      }

      // Generate themes for this assistant
      for (let themeIndex = 0; themeIndex < themeTemplates.length; themeIndex++) {
        const themeTitle = themeTemplates[themeIndex];
        const themeNumber = themeIndex + 1;

        try {
          console.log(`  📝 Generating Theme ${themeNumber}: ${themeTitle}`);
          
          // Update progress for current theme
          onProgress({
            currentAssistant: assistant.name,
            currentTheme: themeNumber,
            assistantProgress: (themeIndex / themeTemplates.length) * 100,
            totalProgress: (completedOperations / totalOperations) * 100,
            completed: completedOperations,
            total: totalOperations,
            errors: [...errors],
            conflicts: [],
          });

          // Generate extensive content with AI
          const htmlContent = await generateExtensiveCurriculumWithAI(
            assistant.name,
            themeNumber,
            themeTitle
          );

          // Save to Firebase
          const themeId = await createCurriculumTheme({
            assistantId: assistant.id,
            number: themeNumber,
            title: themeTitle,
            description: `Temario completo generado con IA para ${themeTitle}`,
            content: htmlContent,
            order: themeNumber,
            isActive: true,
          });

          if (themeId) {
            console.log(`    ✅ Theme ${themeNumber} saved successfully`);
          } else {
            throw new Error("No se pudo guardar el tema en Firebase");
          }

          completedOperations++;

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (themeError) {
          console.error(`    ❌ Error generating theme ${themeNumber}:`, themeError);
          errors.push(`${assistant.name} - Tema ${themeNumber}: ${themeError.message}`);
          completedOperations++;
        }
      }

      console.log(`✅ Completed assistant: ${assistant.name}`);

    } catch (assistantError) {
      console.error(`❌ Error processing assistant ${assistant.name}:`, assistantError);
      errors.push(`${assistant.name}: ${assistantError.message}`);
      // Skip remaining themes for this assistant
      completedOperations += themeTemplates.length;
    }

    // Delay between assistants
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Final progress update
  onProgress({
    currentAssistant: "",
    currentTheme: 0,
    assistantProgress: 100,
    totalProgress: 100,
    completed: completedOperations,
    total: totalOperations,
    errors: [...errors],
    conflicts: [],
  });

  console.log(`🎯 Mass generation completed! ${completedOperations}/${totalOperations} operations completed`);
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} errors occurred during generation`);
  }
};
