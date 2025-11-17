import OpenAI from 'openai';

const FALLBACK_API_KEY = process.env.OPENAI_API_KEY;

export interface TestGenerationRequest {
  contentMarkdown: string;
  title: string;
  sections: string[];
  count: number;
  userApiKey?: string; // User's personal OpenAI API key
  requirements: {
    exactOptions: number;
    forbiddenPatterns: string[];
    difficultyDistribution: { [key: number]: number };
    balancedCoverage: boolean;
    spanishUtf8: boolean;
    qualityGates: boolean;
  };
}

export interface TestQuestion {
  stem: string;
  options: string[];
  answer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  section: string;
  difficulty: 1 | 2 | 3;
}

export async function generateTestsAdvanced(request: TestGenerationRequest): Promise<{ success: boolean; tests: TestQuestion[]; errors?: string[] }> {
  try {
    const apiKeyToUse = request.userApiKey || FALLBACK_API_KEY;

    if (!apiKeyToUse || !apiKeyToUse.startsWith('sk-')) {
      return {
        success: false,
        tests: [],
        errors: ['API key no configurada. Configura tu API key de OpenAI en el panel de administración.']
      };
    }

    const openai = new OpenAI({
      apiKey: apiKeyToUse,
    });

    console.log(`Generating ${request.count} tests for: ${request.title} with ${request.userApiKey ? 'user' : 'fallback'} API key`);

    const systemPrompt = `Eres un experto en la creación de preguntas de test para oposiciones de Guardia Civil. 

INSTRUCCIONES CRÍTICAS:
- Genera exactamente ${request.count} preguntas de test de alta calidad
- Cada pregunta debe tener exactamente 4 opciones (A, B, C, D)
- PROHIBIDO usar: "Todas las anteriores", "Ninguna de las anteriores", "Todas", "Ninguna"
- Las opciones deben ser únicas y diferenciadas
- Incluye rationale citando el apartado específico del contenido
- Distribución de dificultad: Fácil (30%), Medio (50%), Difícil (20%)
- Cobertura equilibrada entre secciones del temario
- Texto en español UTF-8 correcto

FORMATO DE RESPUESTA (JSON):
{
  "tests": [
    {
      "stem": "Pregunta clara y específica",
      "options": ["A) Opción A", "B) Opción B", "C) Opción C", "D) Opción D"],
      "answer": "A",
      "rationale": "Respuesta correcta según [sección específica]",
      "section": "Nombre de la sección",
      "difficulty": 1
    }
  ]
}

CRITERIOS DE CALIDAD:
- Preguntas específicas, no genéricas
- Opciones plausibles pero solo una correcta
- Rationale que cite apartados específicos
- Sin ambigüedades ni trampas
- Enfoque en conceptos clave y aplicación práctica`;

    const userPrompt = `CONTENIDO DEL TEMA: "${request.title}"

${request.contentMarkdown}

SECCIONES IDENTIFICADAS: ${request.sections.join(', ')}

Genera ${request.count} preguntas de test de alta calidad basadas en este contenido, siguiendo las instrucciones del sistema.`;

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
        const alt = jsonText.replace(/(['"])\s*:\s*'([^']*?)'/g, '"$1": "$2"');
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

    if (!parsedResponse.tests || !Array.isArray(parsedResponse.tests)) {
      console.error('Parsed response missing tests array:', parsedResponse);
      throw new Error('Invalid response format: missing tests array');
    }

    // Normalize tests to a predictable shape
    function normalizeTest(raw: any): TestQuestion | null {
      if (!raw) return null;
      const stem = typeof raw.stem === 'string' ? raw.stem.trim() : '';
      let options = raw.options;
      if (typeof options === 'string') {
        // Split by newlines or by common separators
        options = options.split(/\n|\r|;|\|/).map((s: string) => s.trim()).filter(Boolean);
      }
      if (Array.isArray(options)) {
        options = options.map((o: any) => (typeof o === 'string' ? o.trim() : String(o)));
      } else {
        options = [];
      }

      // If options include prefixes like 'A) ...', strip the leading labels for storage but keep original text
      const cleanOptions = options.slice(0,4).map((opt: string) => opt.replace(/^[A-D]\)\s*/i, '').trim());

      // Normalize answer
      let answer = raw.answer;
      if (typeof answer === 'string') {
        const m = answer.match(/[A-D]/i);
        answer = m ? m[0].toUpperCase() : undefined;
      }

      const rationale = typeof raw.rationale === 'string' ? raw.rationale.trim() : '';
      const section = typeof raw.section === 'string' ? raw.section.trim() : 'General';
      const difficulty = [1,2,3].includes(raw.difficulty) ? raw.difficulty : 2;

      return {
        stem,
        options: cleanOptions,
        answer: (typeof answer === 'string' ? answer : 'A') as any,
        rationale,
        section,
        difficulty
      } as TestQuestion;
    }

    const normalizedTests = (parsedResponse.tests || []).map(normalizeTest).filter(Boolean) as TestQuestion[];

    // Validate and clean tests
    const validTests = normalizedTests
      .filter((test: any) => validateTest(test))
      .slice(0, request.count); // Ensure exact count

    if (validTests.length === 0) {
      console.error('No valid tests after validation. Parsed response sample:', JSON.stringify(normalizedTests?.slice(0,3)));
      throw new Error('No valid tests generated');
    }

    console.log(`Generated ${validTests.length} valid tests`);
    return { success: true, tests: validTests };

  } catch (error) {
    console.error('Error generating tests:', error);
    return { 
      success: false, 
      tests: [], 
      errors: [error.message] 
    };
  }
}

function validateTest(test: any): boolean {
  if (!test.stem || typeof test.stem !== 'string' || test.stem.length < 20) {
    return false;
  }

  if (!test.options || !Array.isArray(test.options) || test.options.length !== 4) {
    return false;
  }

  if (!['A', 'B', 'C', 'D'].includes(test.answer)) {
    return false;
  }

  if (!test.rationale || typeof test.rationale !== 'string' || test.rationale.length < 10) {
    return false;
  }

  if (!test.section || typeof test.section !== 'string') {
    return false;
  }

  if (![1, 2, 3].includes(test.difficulty)) {
    return false;
  }

  // Check for forbidden patterns
  const forbiddenPatterns = ['todas las anteriores', 'ninguna de las anteriores', 'todas', 'ninguna'];
  for (const option of test.options) {
    for (const pattern of forbiddenPatterns) {
      if (option.toLowerCase().includes(pattern)) {
        return false;
      }
    }
  }

  return true;
}
