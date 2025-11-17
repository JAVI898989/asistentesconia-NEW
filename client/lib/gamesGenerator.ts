import { safeFetch } from "./fullStoryBypass";

export interface QuickQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchingPair {
  concept: string;
  definition: string;
}

export interface TriviaQuestion {
  category: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface WordSearchGame {
  grid: string[][];
  words: string[];
  solution: { word: string; positions: Array<{ row: number; col: number }> }[];
}

export interface GameBundle {
  quickQuiz: {
    title: string;
    questions: QuickQuizQuestion[];
  };
  matching: {
    title: string;
    pairs: MatchingPair[];
  };
  trivia: {
    title: string;
    questions: TriviaQuestion[];
  };
  wordSearch: WordSearchGame;
}

export async function generateGamesFromContent(
  contentMarkdown: string,
  topicTitle: string,
  assistantName: string,
  userApiKey?: string
): Promise<GameBundle> {
  const prompt = buildGamesPrompt(contentMarkdown, topicTitle, assistantName);

  try {
    const response = await safeFetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        assistantType: "Games Generator",
        assistantName,
        modelPreference: "gpt-5-mini",
        history: [],
        userApiKey: userApiKey || undefined,
      }),
      timeout: 45000,
    } as any);

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    const data = await response.json();
    const gamesJson = extractJsonFromResponse(data.message);
    
    if (!gamesJson) {
      throw new Error("No se pudo extraer JSON de la respuesta");
    }

    return validateAndNormalizeGames(gamesJson);
  } catch (error) {
    console.error("Error generando juegos:", error);
    return generateFallbackGames(topicTitle);
  }
}

function buildGamesPrompt(contentMarkdown: string, topicTitle: string, assistantName: string): string {
  return `Genera un paquete completo de juegos educativos basados en el siguiente contenido para oposiciones de ${assistantName}.

CONTENIDO DEL TEMA: "${topicTitle}"

${contentMarkdown.substring(0, 8000)}

GENERA UN JSON CON ESTA ESTRUCTURA EXACTA:

{
  "quickQuiz": {
    "title": "Quiz Rápido: ${topicTitle}",
    "questions": [
      {
        "question": "Pregunta concreta del tema",
        "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
        "correctIndex": 0,
        "explanation": "Explicación de por qué es correcta"
      }
    ]
  },
  "matching": {
    "title": "Emparejar Conceptos",
    "pairs": [
      {
        "concept": "Concepto clave",
        "definition": "Definición o descripción"
      }
    ]
  },
  "trivia": {
    "title": "Trivial de Conocimientos",
    "questions": [
      {
        "category": "Categoría del tema",
        "question": "Pregunta de trivia",
        "answer": "Respuesta corta",
        "difficulty": "easy"
      }
    ]
  },
  "wordSearch": {
    "grid": [["A","B","C"],["D","E","F"]],
    "words": ["PALABRA1", "PALABRA2"],
    "solution": [
      {
        "word": "PALABRA1",
        "positions": [{"row": 0, "col": 0}, {"row": 0, "col": 1}]
      }
    ]
  }
}

REQUISITOS:
- quickQuiz: 10 preguntas con 4 opciones cada una
- matching: 12 pares concepto-definición
- trivia: 15 preguntas de dificultad variada
- wordSearch: grid de 15x15 con 10 palabras clave del tema
- Todas las palabras en MAYÚSCULAS para la sopa de letras
- Grid con letras aleatorias rellenando espacios vacíos
- Contenido 100% basado en el tema proporcionado
- Español correcto y preciso

Devuelve SOLO el JSON válido, sin markdown ni texto adicional.`;
}

function extractJsonFromResponse(text: string): any {
  try {
    // Try to find JSON in markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to find JSON between braces
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonText = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonText);
    }

    // Try to parse the whole response
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing games JSON:", error);
    return null;
  }
}

function validateAndNormalizeGames(games: any): GameBundle {
  return {
    quickQuiz: {
      title: games.quickQuiz?.title || "Quiz Rápido",
      questions: (games.quickQuiz?.questions || []).slice(0, 10).map((q: any) => ({
        question: q.question || "",
        options: (q.options || []).slice(0, 4),
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        explanation: q.explanation || ""
      }))
    },
    matching: {
      title: games.matching?.title || "Emparejar Conceptos",
      pairs: (games.matching?.pairs || []).slice(0, 12).map((p: any) => ({
        concept: p.concept || "",
        definition: p.definition || ""
      }))
    },
    trivia: {
      title: games.trivia?.title || "Trivial",
      questions: (games.trivia?.questions || []).slice(0, 15).map((q: any) => ({
        category: q.category || "General",
        question: q.question || "",
        answer: q.answer || "",
        difficulty: ["easy", "medium", "hard"].includes(q.difficulty) ? q.difficulty : "medium"
      }))
    },
    wordSearch: games.wordSearch || generateEmptyWordSearch()
  };
}

function generateEmptyWordSearch(): WordSearchGame {
  const grid = Array(15).fill(0).map(() => 
    Array(15).fill(0).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );
  
  return {
    grid,
    words: [],
    solution: []
  };
}

function generateFallbackGames(topicTitle: string): GameBundle {
  return {
    quickQuiz: {
      title: `Quiz Rápido: ${topicTitle}`,
      questions: [
        {
          question: `¿Cuál es el concepto principal de ${topicTitle}?`,
          options: ["Opción A", "Opción B", "Opción C", "Opción D"],
          correctIndex: 0,
          explanation: "Revisar el contenido del tema para más detalles"
        }
      ]
    },
    matching: {
      title: "Emparejar Conceptos",
      pairs: [
        {
          concept: "Concepto 1",
          definition: "Definición 1"
        }
      ]
    },
    trivia: {
      title: "Trivial de Conocimientos",
      questions: [
        {
          category: "General",
          question: `Pregunta sobre ${topicTitle}`,
          answer: "Respuesta",
          difficulty: "medium" as const
        }
      ]
    },
    wordSearch: generateEmptyWordSearch()
  };
}
