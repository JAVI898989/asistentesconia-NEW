import { Request, Response } from 'express';

interface TestGenerationRequest {
  contentMarkdown: string;
  title: string;
  sections: string[];
  count: number;
  testsPerSection: number;
  requirements: {
    exactOptions: number;
    forbiddenPatterns: string[];
    difficultyDistribution: { [key: number]: number };
    balancedCoverage: boolean;
  };
}

interface TestQuestion {
  stem: string;
  options: string[];
  answer: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  section: string;
  difficulty: 1 | 2 | 3;
}

export async function generateTests(req: Request, res: Response) {
  try {
    const {
      contentMarkdown,
      title,
      sections,
      count,
      testsPerSection,
      requirements
    }: TestGenerationRequest = req.body;

    if (!contentMarkdown || !title || count <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: contentMarkdown, title, and valid count'
      });
    }

    console.log(`🧪 Generating ${count} tests for: ${title}`);

    // Prepare the AI prompt for test generation
    const prompt = `
Genera exactamente ${count} preguntas tipo test de opción múltiple basadas en el siguiente contenido sobre "${title}".

CONTENIDO:
${contentMarkdown}

REQUISITOS OBLIGATORIOS:
1. Exactamente ${requirements.exactOptions} opciones por pregunta (A, B, C, D)
2. NO usar frases como: ${requirements.forbiddenPatterns.join(', ')}
3. Distribución de dificultad: Nivel 1 (${Math.round(requirements.difficultyDistribution[1] * 100)}%), Nivel 2 (${Math.round(requirements.difficultyDistribution[2] * 100)}%), Nivel 3 (${Math.round(requirements.difficultyDistribution[3] * 100)}%)
4. Cobertura equilibrada de secciones: ${sections.join(', ')}
5. Cada pregunta debe incluir una explicación (rationale) citando la parte específica del tema

FORMATO DE RESPUESTA (JSON):
{
  "tests": [
    {
      "stem": "Pregunta clara y específica",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "answer": "A",
      "rationale": "Explicación breve citando el apartado del tema",
      "section": "Nombre de la sección",
      "difficulty": 1
    }
  ]
}

Genera exactamente ${count} preguntas variadas y de calidad.
`;

    // Make AI API call
    const aiResponse = await fetch(`${process.env.AI_API_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en la creación de preguntas tipo test para oposiciones de Guardia Civil. Generas preguntas de alta calidad con opciones únicas y explicaciones precisas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status} ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI API');
    }

    // Parse JSON response
    let testsData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      testsData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    if (!testsData.tests || !Array.isArray(testsData.tests)) {
      throw new Error('Invalid response format from AI');
    }

    // Validate and clean the tests
    const validTests: TestQuestion[] = [];
    for (const test of testsData.tests) {
      // Basic validation
      if (!test.stem || !Array.isArray(test.options) || test.options.length !== 4 ||
          !['A', 'B', 'C', 'D'].includes(test.answer) || !test.rationale ||
          !test.section || ![1, 2, 3].includes(test.difficulty)) {
        console.warn('Skipping invalid test:', test);
        continue;
      }

      // Check for forbidden patterns
      const hasForbiddenPattern = test.options.some(option =>
        requirements.forbiddenPatterns.some(pattern =>
          option.toLowerCase().includes(pattern.toLowerCase())
        )
      );

      if (hasForbiddenPattern) {
        console.warn('Skipping test with forbidden pattern:', test.stem.substring(0, 50));
        continue;
      }

      validTests.push({
        stem: test.stem.trim(),
        options: test.options.map(o => o.trim()),
        answer: test.answer,
        rationale: test.rationale.trim(),
        section: test.section.trim(),
        difficulty: test.difficulty
      });
    }

    console.log(`✅ Generated ${validTests.length} valid tests out of ${testsData.tests.length} attempts`);

    return res.json({
      success: true,
      tests: validTests,
      metadata: {
        requested: count,
        generated: validTests.length,
        title,
        sections: sections.length
      }
    });

  } catch (error) {
    console.error('Error generating tests:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during test generation'
    });
  }
}
