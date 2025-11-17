import OpenAI from 'openai';

const FALLBACK_API_KEY = process.env.OPENAI_API_KEY;

export interface FlashcardGenerationRequest {
  contentMarkdown: string;
  title: string;
  sections: string[];
  count: number;
  userApiKey?: string; // User's personal OpenAI API key
  requirements: {
    oneLinePerSide: boolean;
    concreteDefinitions: boolean;
    sectionTags: boolean;
    noMarkdown: boolean;
    spanishUtf8: boolean;
    qualityGates: boolean;
  };
}

export interface Flashcard {
  front: string;
  back: string;
  tags: string[];
}

export async function generateFlashcardsAdvanced(request: FlashcardGenerationRequest): Promise<{ success: boolean; flashcards: Flashcard[]; errors?: string[] }> {
  try {
    const apiKeyToUse = request.userApiKey || FALLBACK_API_KEY;

    if (!apiKeyToUse || !apiKeyToUse.startsWith('sk-')) {
      return {
        success: false,
        flashcards: [],
        errors: ['API key no configurada. Configura tu API key de OpenAI en el panel de administración.']
      };
    }

    const openai = new OpenAI({
      apiKey: apiKeyToUse,
    });

    console.log(`Generating ${request.count} flashcards for: ${request.title} with ${request.userApiKey ? 'user' : 'fallback'} API key`);

    const systemPrompt = `Eres un experto en la creación de flashcards para estudio de oposiciones de Guardia Civil.

INSTRUCCIONES CRÍTICAS:
- Genera exactamente ${request.count} flashcards de alta calidad
- UNA LÍNEA por cara (front y back)
- Definiciones concretas y específicas del contenido
- Sin markdown, solo texto plano
- Etiquetas por sección del temario
- Texto en español UTF-8 correcto
- Enfoque en conceptos clave, definiciones, datos importantes

FORMATO DE RESPUESTA (JSON):
{
  "flashcards": [
    {
      "front": "Concepto o pregunta específica",
      "back": "Definición o respuesta concreta",
      "tags": ["Sección", "Categoría"]
    }
  ]
}

TIPOS DE FLASHCARDS A CREAR:
1. Definiciones clave (¿Qué es...?)
2. Datos específicos (fechas, números, porcentajes)
3. Procedimientos (¿Cómo se...?)
4. Clasificaciones (tipos de...)
5. Normativas importantes
6. Responsabilidades y competencias

CRITERIOS DE CALIDAD:
- Una línea por cara máximo
- Información específica del contenido
- Sin ambigüedades
- Fácil de memorizar
- Etiquetas relevantes`;

    const userPrompt = `CONTENIDO DEL TEMA: "${request.title}"

${request.contentMarkdown}

SECCIONES IDENTIFICADAS: ${request.sections.join(', ')}

Genera ${request.count} flashcards de alta calidad basadas en este contenido, siguiendo las instrucciones del sistema.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response using a robust extractor
    function extractJsonFromText(text: string) {
      // Try fenced code blocks first
      const codeFenceMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      if (codeFenceMatch) {
        return codeFenceMatch[1];
      }

      // Fallback: find first { and last } and take the substring
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        return text.substring(firstBrace, lastBrace + 1);
      }

      // Nothing found
      return null;
    }

    let parsedResponse;
    try {
      const jsonText = extractJsonFromText(responseText);
      if (!jsonText) {
        console.error('OpenAI response (no JSON found):', responseText.substring(0, 1000));
        throw new Error('No JSON found in OpenAI response');
      }

      // Attempt to parse; sometimes models use single quotes — try to normalize safely
      try {
        parsedResponse = JSON.parse(jsonText);
      } catch (primaryParseError) {
        // Try to replace single quotes with double quotes for simple cases
        const alt = jsonText.replace(/(['\"])\s*:\s*'([^']*?)'/g, '"$1": "$2"');
        try {
          parsedResponse = JSON.parse(alt);
        } catch (secondaryParseError) {
          console.error('Primary parse error:', primaryParseError);
          console.error('Secondary parse error after simple normalization:', secondaryParseError);
          console.error('Problematic JSON text (truncated):', jsonText.substring(0, 2000));
          throw new Error('Unable to parse JSON from OpenAI response');
        }
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    if (!parsedResponse.flashcards || !Array.isArray(parsedResponse.flashcards)) {
      console.error('Parsed response missing flashcards array:', parsedResponse);
      throw new Error('Invalid response format: missing flashcards array');
    }

    // Normalize flashcards
    function normalizeCard(raw: any): Flashcard | null {
      if (!raw) return null;
      const front = typeof raw.front === 'string' ? raw.front.trim() : '';
      const back = typeof raw.back === 'string' ? raw.back.trim() : '';
      let tags = raw.tags;
      if (typeof tags === 'string') {
        tags = tags.split(/,|;|\|/).map((t: string) => t.trim()).filter(Boolean);
      }
      if (!Array.isArray(tags)) tags = ['General'];

      return { front, back, tags } as Flashcard;
    }

    const normalizedCards = (parsedResponse.flashcards || []).map(normalizeCard).filter(Boolean) as Flashcard[];

    // Validate and clean flashcards
    const validFlashcards = normalizedCards
      .filter((card: any) => validateFlashcard(card))
      .slice(0, request.count); // Ensure exact count

    if (validFlashcards.length === 0) {
      console.error('No valid flashcards after validation. Parsed response sample:', JSON.stringify(normalizedCards?.slice(0,3)));
      throw new Error('No valid flashcards generated');
    }

    console.log(`Generated ${validFlashcards.length} valid flashcards`);
    return { success: true, flashcards: validFlashcards };

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return { 
      success: false, 
      flashcards: [], 
      errors: [error.message] 
    };
  }
}

function validateFlashcard(card: any): boolean {
  if (!card.front || typeof card.front !== 'string' || card.front.length < 5) {
    return false;
  }

  if (!card.back || typeof card.back !== 'string' || card.back.length < 5) {
    return false;
  }

  // Check for one line per side
  if (card.front.split('\n').length > 1 || card.back.split('\n').length > 1) {
    return false;
  }

  if (!card.tags || !Array.isArray(card.tags) || card.tags.length === 0) {
    return false;
  }

  // Check for reasonable length (not too long for memorization)
  if (card.front.length > 200 || card.back.length > 300) {
    return false;
  }

  return true;
}
