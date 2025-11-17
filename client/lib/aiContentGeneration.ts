import {
  createCurriculumTheme,
  updateCurriculumTheme,
  saveThemeTests,
  saveThemeFlashcards,
  getCurriculumThemes
} from "./firebaseData";

interface ContentOptions {
  temario: boolean;
  tests: boolean;
  flashcards: boolean;
}

interface GenerateContentParams {
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  contentTypes: ContentOptions;
  onProgress: (step: string, progress: number) => void;
}

interface AIGeneratedContent {
  temario?: string;
  tests?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  flashcards?: Array<{
    id: string;
    front: string;
    back: string;
    difficulty: "easy" | "medium" | "hard";
  }>;
}

export async function generateAIContent({
  assistantId,
  assistantName,
  themeId,
  themeName,
  contentTypes,
  onProgress,
}: GenerateContentParams): Promise<void> {
  const totalSteps = Object.values(contentTypes).filter(Boolean).length + 1; // +1 for saving
  let currentStep = 0;

  const updateProgress = (step: string) => {
    currentStep++;
    onProgress(step, (currentStep / totalSteps) * 90); // Leave 10% for saving
  };

  const generatedContent: AIGeneratedContent = {};

  try {
    // Extract theme number from themeId (e.g., "tema-1" -> "1")
    const themeNumber = themeId.replace("tema-", "");

    // Generate Temario (Curriculum)
    if (contentTypes.temario) {
      updateProgress("Generando temario completo...");
      try {
        const temarioContent = await generateTemario(assistantName, themeNumber, themeName);
        generatedContent.temario = temarioContent;
        console.log("✅ Temario generado correctamente");
      } catch (error) {
        console.error("❌ Error generando temario:", error);
        throw new Error("Error al generar el temario con IA");
      }
    }

    // Generate Tests
    if (contentTypes.tests) {
      updateProgress("Generando preguntas de test...");
      try {
        const testsContent = await generateTests(assistantName, themeNumber, themeName);
        generatedContent.tests = testsContent;
        console.log("✅ Tests generados correctamente");
      } catch (error) {
        console.error("❌ Error generando tests:", error);
        throw new Error("Error al generar los tests con IA");
      }
    }

    // Generate Flashcards
    if (contentTypes.flashcards) {
      updateProgress("Generando flashcards...");
      try {
        const flashcardsContent = await generateFlashcards(assistantName, themeNumber, themeName);
        generatedContent.flashcards = flashcardsContent;
        console.log("✅ Flashcards generadas correctamente");
      } catch (error) {
        console.error("❌ Error generando flashcards:", error);
        throw new Error("Error al generar las flashcards con IA");
      }
    }

    // Save content
    onProgress("Guardando contenido...", 90);
    try {
      await saveGeneratedContent(assistantId, themeId, themeName, themeNumber, generatedContent);
      console.log("✅ Todo el contenido guardado exitosamente");

      // Show detailed success message
      const savedItems = [];
      if (contentTypes.temario) savedItems.push("Temario");
      if (contentTypes.tests) savedItems.push("Tests");
      if (contentTypes.flashcards) savedItems.push("Flashcards");

      onProgress(`¡${savedItems.join(', ')} generado y guardado exitosamente!`, 100);
    } catch (saveError) {
      console.error("❌ Error guardando contenido:", saveError);
      throw new Error("Error al guardar el contenido generado");
    }

  } catch (error) {
    console.error("Error in generateAIContent:", error);
    throw error;
  }
}

async function generateTemario(assistantName: string, themeNumber: string, themeName: string): Promise<string> {
  const prompt = `Genera un temario completo y detallado para ${assistantName}, específicamente para el ${themeName}.

FORMATO REQUERIDO: HTML puro (sin etiquetas html, head o body, solo el contenido del body)

REQUISITOS ESPECÍFICOS:
- Mínimo 10 páginas de contenido sustancioso
- Usar etiquetas HTML para estructurar: <h2>, <h3>, <h4>, <p>, <ul>, <ol>, <li>
- Explicaciones extremadamente detalladas y completas
- Ejemplos prácticos y casos reales
- Referencias normativas específicas
- Usar clases CSS para elementos especiales:
  * <div class="summary"> para resúmenes
  * <div class="key-points"> para puntos clave
  * <div class="legal-ref"> para referencias legales
  * <div class="page-break"> para separar páginas

ESTRUCTURA HTML REQUERIDA:
<h2>1. Introducción al Tema</h2>
<p>[Explicación detallada...]</p>

<h2>2. Marco Normativo y Legal</h2>
<div class="legal-ref">
<h3>Normativa Aplicable</h3>
<ul>
<li>[Norma 1]</li>
<li>[Norma 2]</li>
</ul>
</div>

<h2>3. Desarrollo Detallado</h2>
<h3>3.1 Conceptos Fundamentales</h3>
<p>[Explicación...]</p>

<h3>3.2 Procedimientos</h3>
<ol>
<li>[Paso 1]</li>
<li>[Paso 2]</li>
</ol>

<div class="page-break"></div>

<h2>4. Casos Prácticos</h2>
<p>[Ejemplos reales...]</p>

<div class="summary">
<h3>Resumen de la Sección</h3>
<ul>
<li>[Punto clave 1]</li>
<li>[Punto clave 2]</li>
</ul>
</div>

<div class="page-break"></div>

<h2>5. CLAVES PARA MEMORIZAR</h2>
<div class="key-points">
<h3>Datos Esenciales</h3>
<ul>
<li><strong>Fechas importantes:</strong> [fechas]</li>
<li><strong>Números clave:</strong> [números]</li>
<li><strong>Conceptos fundamentales:</strong> [conceptos]</li>
<li><strong>Normativa básica:</strong> [normativa]</li>
</ul>
</div>

Genera contenido de calidad de oposiciones con esta estructura HTML exacta.`;

  const response = await callOpenAI(prompt);
  return response;
}

async function generateTests(assistantName: string, themeNumber: string, themeName: string) {
  const prompt = `Genera exactamente 20 preguntas tipo test para ${assistantName}, específicamente para el ${themeName}.

FORMATO REQUERIDO PARA CADA PREGUNTA:
- Pregunta clara y específica
- 4 opciones de respuesta (A, B, C, D)
- Solo una respuesta correcta
- Explicación detallada de por qué es correcta la respuesta y por qué las otras son incorrectas

REQUISITOS:
- Las preguntas deben ser realistas y del nivel de oposiciones oficiales
- Variar la dificultad: 5 fáciles, 10 intermedias, 5 difíciles
- Incluir preguntas sobre normativa, procedimientos y casos prácticos
- Evitar preguntas ambiguas o con múltiples respuestas posibles
- Referencias normativas cuando sea apropiado

FORMATO JSON REQUERIDO:
{
  "questions": [
    {
      "question": "Texto de la pregunta",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": 0,
      "explanation": "Explicación detallada",
      "difficulty": "easy"
    }
  ]
}

Genera exactamente 20 preguntas siguiendo este formato.`;

  const response = await callOpenAI(prompt);

  try {
    const parsed = JSON.parse(response);
    return parsed.questions.map((q: any, index: number) => ({
      id: `test-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium"
    }));
  } catch (error) {
    console.error("Error parsing tests JSON:", error);
    throw new Error("Error al procesar las preguntas generadas");
  }
}

async function generateFlashcards(assistantName: string, themeNumber: string, themeName: string) {
  const prompt = `Genera exactamente 15 flashcards para ${assistantName}, específicamente para el ${themeName}.

REQUISITOS PARA CADA FLASHCARD:
- Lado frontal (front): Pregunta, concepto o término clave
- Lado trasero (back): Respuesta completa, definición o explicación detallada
- Variar dificultad: 5 fáciles, 7 intermedias, 3 difíciles
- Enfocarse en conceptos clave, definiciones, procedimientos y datos importantes
- Incluir fechas relevantes, números importantes y normativa clave

FORMATO JSON REQUERIDO:
{
  "flashcards": [
    {
      "front": "Pregunta o concepto",
      "back": "Respuesta detallada o explicación completa",
      "difficulty": "easy"
    }
  ]
}

Genera exactamente 15 flashcards siguiendo este formato, asegurándote de que sean útiles para memorización y estudio.`;

  const response = await callOpenAI(prompt);

  try {
    const parsed = JSON.parse(response);
    return parsed.flashcards.map((f: any, index: number) => ({
      id: `flashcard-${Date.now()}-${index}`,
      front: f.front,
      back: f.back,
      difficulty: f.difficulty || "medium"
    }));
  } catch (error) {
    console.error("Error parsing flashcards JSON:", error);
    throw new Error("Error al procesar las flashcards generadas");
  }
}

async function callOpenAI(prompt: string): Promise<string> {
  const response = await fetch("/api/openai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
      assistantType: "AI Content Generator",
      contextPrompt: `Eres un generador de contenido educativo especializado en oposiciones españolas.
      Genera contenido de alta calidad, preciso y útil para estudiantes que se preparan para oposiciones.
      Usa un lenguaje profesional, incluye referencias normativas cuando sea apropiado, y asegúrate de que
      el contenido sea completo y detallado.`,
      history: []
    }),
  });

  if (!response.ok) {
    throw new Error(`Error en la API de OpenAI: ${response.status}`);
  }

  const data = await response.json();
  return data.message;
}

async function saveGeneratedContent(
  assistantId: string,
  themeId: string,
  themeName: string,
  themeNumber: string,
  content: AIGeneratedContent
): Promise<void> {
  try {
    // Create HTML content for PDF display
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${themeName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1d4ed8; margin-top: 30px; }
        h3 { color: #3730a3; margin-top: 20px; }
        .summary { background: #f0f9ff; padding: 20px; border-left: 5px solid #2563eb; margin: 20px 0; }
        .key-points { background: #fef3c7; padding: 20px; border-left: 5px solid #f59e0b; margin: 20px 0; }
        .legal-ref { background: #f3f4f6; padding: 15px; margin: 15px 0; border-radius: 5px; }
        ul, ol { margin: 15px 0; padding-left: 30px; }
        li { margin: 5px 0; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <h1>${themeName}</h1>
    ${content.temario || ''}
</body>
</html>`;

    // Save Temario as PDF/curriculum theme
    if (content.temario) {
      // First, check if theme already exists
      const existingThemes = await getCurriculumThemes(assistantId);
      const existingTheme = existingThemes.find(t => t.id === themeId);

      if (existingTheme) {
        // Update existing theme
        await updateCurriculumTheme(themeId, {
          title: themeName,
          description: `Temario completo generado con IA para ${themeName}`,
          content: htmlContent,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new theme
        await createCurriculumTheme({
          assistantId,
          number: parseInt(themeNumber),
          title: themeName,
          description: `Temario completo generado con IA para ${themeName}`,
          content: htmlContent,
          order: parseInt(themeNumber),
          isActive: true,
        });
      }
    }

    // Save Tests (append to existing)
    if (content.tests) {
      await saveThemeTests(assistantId, themeId, content.tests, true);
    }

    // Save Flashcards (append to existing)
    if (content.flashcards) {
      await saveThemeFlashcards(assistantId, themeId, content.flashcards, true);
    }

    console.log("✅ Content saved to Firebase successfully");

  } catch (error) {
    console.error("Error saving generated content:", error);
    throw new Error("Error al guardar el contenido generado");
  }
}
