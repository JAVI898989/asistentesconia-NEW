import { Request, Response } from 'express';

interface FlashcardGenerationRequest {
  contentMarkdown: string;
  title: string;
  sections: string[];
  count: number;
  requirements: {
    oneLinePerSide: boolean;
    concreteDefinitions: boolean;
    sectionTags: boolean;
    noMarkdown: boolean;
    utf8Spanish: boolean;
  };
}

interface Flashcard {
  front: string;
  back: string;
  tags: string[];
}

export async function generateFlashcards(req: Request, res: Response) {
  try {
    const {
      contentMarkdown,
      title,
      sections,
      count,
      requirements
    }: FlashcardGenerationRequest = req.body;

    if (!contentMarkdown || !title || count <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: contentMarkdown, title, and valid count'
      });
    }

    console.log(`💳 Generating ${count} flashcards for: ${title}`);

    // Prepare the AI prompt for flashcard generation
    const prompt = `
Genera exactamente ${count} flashcards (tarjetas de estudio) basadas en el siguiente contenido sobre "${title}".

CONTENIDO:
${contentMarkdown}

REQUISITOS OBLIGATORIOS:
1. Una línea por cara (front/back) - SIN saltos de línea
2. Definiciones concretas extraídas directamente del contenido
3. Incluir tags por sección: ${sections.join(', ')}
4. Sin formato Markdown - texto plano únicamente
5. Español UTF-8 correcto

TIPOS DE FLASHCARDS A CREAR:
- Definiciones de conceptos clave
- Preguntas sobre procedimientos
- Fechas y datos importantes
- Normativa y artículos relevantes
- Casos prácticos resumidos

FORMATO DE RESPUESTA (JSON):
{
  "flashcards": [
    {
      "front": "¿Qué es...? o Concepto clave",
      "back": "Definición clara y concisa",
      "tags": ["sección1", "concepto"]
    }
  ]
}

Asegúrate de que cada flashcard sea única y cubra diferentes aspectos del contenido. Genera exactamente ${count} flashcards.
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
            content: 'Eres un experto en la creación de materiales de estudio para oposiciones de Guardia Civil. Creas flashcards concisas, precisas y educativas que ayudan a memorizar conceptos clave.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 3000
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
    let flashcardsData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }
      
      flashcardsData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    if (!flashcardsData.flashcards || !Array.isArray(flashcardsData.flashcards)) {
      throw new Error('Invalid response format from AI');
    }

    // Validate and clean the flashcards
    const validFlashcards: Flashcard[] = [];
    for (const card of flashcardsData.flashcards) {
      // Basic validation
      if (!card.front || !card.back || !Array.isArray(card.tags)) {
        console.warn('Skipping invalid flashcard:', card);
        continue;
      }

      // Check for single line requirement
      if (card.front.includes('\n') || card.back.includes('\n')) {
        console.warn('Skipping multi-line flashcard:', card.front.substring(0, 30));
        continue;
      }

      // Ensure minimum content length
      if (card.front.length < 5 || card.back.length < 5) {
        console.warn('Skipping too short flashcard:', card.front);
        continue;
      }

      // Clean and format
      validFlashcards.push({
        front: card.front.trim().replace(/[#*_`]/g, ''), // Remove markdown
        back: card.back.trim().replace(/[#*_`]/g, ''), // Remove markdown
        tags: card.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0)
      });
    }

    // Ensure we have tags if sections are provided and cards don't have them
    const processedFlashcards = validFlashcards.map(card => {
      if (card.tags.length === 0 && sections.length > 0) {
        // Assign a default section tag
        card.tags = [sections[0].toLowerCase().replace(/\s+/g, '-')];
      }
      return card;
    });

    console.log(`✅ Generated ${processedFlashcards.length} valid flashcards out of ${flashcardsData.flashcards.length} attempts`);

    return res.json({
      success: true,
      flashcards: processedFlashcards,
      metadata: {
        requested: count,
        generated: processedFlashcards.length,
        title,
        sections: sections.length
      }
    });

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during flashcard generation'
    });
  }
}
