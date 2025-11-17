import { RequestHandler } from "express";

// DEPRECATED: Server-side API key (only used as fallback for old code)
// Users should provide their own API key in requests
const FALLBACK_OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatRequest {
  message: string;
  assistantType: string;
  assistantName?: string;
  contextPrompt?: string;
  modelPreference?: string;
  history: ChatMessage[];
  userApiKey?: string; // User's personal OpenAI API key
}

export const handleChatMessage: RequestHandler = async (req, res) => {
  try {
    const {
      message,
      assistantType,
      assistantName,
      contextPrompt,
      modelPreference,
      history,
      userApiKey
    }: ChatRequest = req.body;

    // Determine which API key to use
    const apiKeyToUse = userApiKey || FALLBACK_OPENAI_API_KEY;

    if (!apiKeyToUse || !apiKeyToUse.startsWith('sk-')) {
      return res.status(400).json({
        error: "API key no configurada. Por favor configura tu API key de OpenAI en el panel de administración."
      });
    }

    const cleanMessage = (message || '').toString().trim();
    const cleanHistory = Array.isArray(history)
      ? history.filter(m => m && typeof m.content === 'string' && m.content.trim().length > 0)
      : [];

    if (!cleanMessage || !assistantType) {
      return res
        .status(400)
        .json({ error: "Message and assistant type are required" });
    }

    // Use contextPrompt from frontend if provided, otherwise fallback to getSystemPrompt
    const systemPrompt = contextPrompt || getSystemPrompt(assistantType);

    console.log("🤖 Server chat request:", {
      assistantType,
      assistantName: assistantName || "Unknown",
      modelPreference: modelPreference || "gpt-3.5-turbo",
      messageLength: message.length,
      historyLength: (history || []).length,
      systemPromptPreview: systemPrompt.substring(0, 100) + "..."
    });

    // Determine model to use based on preference
    let modelToUse = "gpt-3.5-turbo"; // Default fallback
    let maxTokens = 4096;

    if (modelPreference === "gpt-4-nano" || modelPreference === "gpt-5-mini") {
      // Map GPT-5 mini preference to current best economical GPT-4 variant
      modelToUse = "gpt-4o-mini";
      maxTokens = 16384;
      console.log("🚀 Using GPT-4o-mini (preference:", modelPreference, ")");
    } else if (modelPreference === "gpt-4") {
      modelToUse = "gpt-4o-mini";
      maxTokens = 16384;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...cleanHistory.map((msg) => ({
        role: msg.role,
        content: msg.content.trim(),
      })),
      { role: "user", content: cleanMessage },
    ];

    console.log(`📡 Calling OpenAI with model: ${modelToUse}`);

    // Retry logic for transient OpenAI errors and fallback models
    const MAX_ATTEMPTS_PER_MODEL = 2;
    let lastError: any = null;
    let data: any = null;

    // Build model fallback list: prefer modelToUse then sensible fallbacks
    const fallbackModels = [modelToUse, 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'].filter(Boolean);

    for (const modelCandidate of fallbackModels) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
        const controller = new AbortController();
        const timeoutMs = 120000; // 2 minutes
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
          console.log(`📡 Calling OpenAI model=${modelCandidate} attempt=${attempt} with ${userApiKey ? 'user' : 'fallback'} API key`);
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKeyToUse}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: modelCandidate,
              messages: messages,
              max_tokens: maxTokens,
              temperature: 0.7,
              presence_penalty: 0.1, // Encourage diverse responses
              frequency_penalty: 0.1, // Reduce repetition
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          const respText = await response.text();

          if (!response.ok) {
            let errorData;
            try { errorData = JSON.parse(respText); } catch { errorData = { raw: respText }; }

            console.error("❌ OpenAI API error:", {
              status: response.status,
              statusText: response.statusText,
              model: modelCandidate,
              assistantType,
              attempt,
              error: errorData,
            });

            // Handle non-retryable statuses immediately
            if (response.status === 429) {
              throw new Error("Rate limit exceeded. Please try again in a moment.");
            } else if (response.status === 400) {
              throw new Error("Invalid request. Please try again.");
            } else if (response.status === 401) {
              throw new Error("Authentication failed. Please contact support.");
            } else if (response.status >= 500) {
              lastError = new Error(`OpenAI service error ${response.status}: ${JSON.stringify(errorData)}`);
              if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                const backoff = 1000 * Math.pow(2, attempt);
                console.log(`🔄 Retry attempt ${attempt} after ${backoff}ms`);
                await new Promise(r => setTimeout(r, backoff));
                continue;
              } else {
                console.log(`⚠��� Model ${modelCandidate} failed after ${attempt} attempts, trying next model if available`);
                break; // move to next model
              }
            }

            throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || errorData.error || response.statusText}`);
          }

          // Parse successful response
          try {
            data = JSON.parse(respText);
          } catch (parseErr) {
            console.error('❌ Could not parse OpenAI response text:', { text: respText, parseErr });
            throw new Error('Invalid response from OpenAI');
          }

          // Validate content
          if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('❌ OpenAI returned unexpected structure:', data);
            throw new Error('OpenAI returned unexpected structure');
          }

          console.log(`✅ OpenAI model=${modelCandidate} succeeded`);
          break; // got data

        } catch (err: any) {
          clearTimeout(timeoutId);
          lastError = err;
          // If aborted due to timeout or transient error, retry
          if (err?.name === 'AbortError' || err?.message?.includes('timeout') || err?.message?.includes('network')) {
            console.warn(`⚠️ OpenAI request model=${modelCandidate} attempt=${attempt} failed with transient error:`, err.message || err);
            if (attempt < MAX_ATTEMPTS_PER_MODEL) {
              const backoff = 1000 * Math.pow(2, attempt);
              await new Promise(r => setTimeout(r, backoff));
              continue;
            }
            // else break to try next model
            break;
          }

          console.error(`❌ OpenAI request model=${modelCandidate} attempt=${attempt} failed:`, err);
          // If it's a hard error, try next model
          break;
        }
      }

      if (data) break; // success
    }

    if (!data) {
      console.error('❌ All OpenAI attempts/models failed:', lastError);

      // As a last-resort fallback, generate a simple structured outline locally so the admin can continue
      const generateFallbackOutline = (userMessage: string): string => {
        try {
          // Extract a short title from the message or use a generic one
          const firstLine = (userMessage || '').split('\n').find(Boolean) || userMessage || 'Temario provisional';
          const title = firstLine.replace(/^Tema\s*\d+[:\-.\s]*/i, '').trim().slice(0, 80);

          // Create 8-12 bullet topics heuristically from the message using sentence splits
          const sentences = userMessage.split(/[\.\n\?\!]/).map(s => s.trim()).filter(Boolean);
          const candidates: string[] = [];

          // Prefer explicit lines starting with 'Tema' or numeric markers
          for (const s of sentences) {
            const m = s.match(/(?:Tema\s*\d+[:\-\s]*)?(.{10,120})/i);
            if (m) candidates.push(m[1].trim());
            if (candidates.length >= 12) break;
          }

          // If insufficient, split the title into clauses
          if (candidates.length < 8 && title) {
            const parts = title.split(/[\-,:;\/\\]/).map(p => p.trim()).filter(Boolean);
            for (const p of parts) {
              if (!candidates.includes(p) && p.length > 8) candidates.push(p);
              if (candidates.length >= 12) break;
            }
          }

          // Fill with generic topics if still short
          const generic = [
            'Introducción y objetivos',
            'Marco legal y normativo',
            'Conceptos fundamentales',
            'Procedimientos y trámites',
            'Casos prácticos y ejemplos',
            'Técnicas y herramientas',
            'Evaluación y pruebas',
            'Bibliografía y recursos'
          ];

          for (const g of generic) {
            if (candidates.length >= 10) break;
            if (!candidates.includes(g)) candidates.push(g);
          }

          // Build markdown-like content
          let out = `# ${title}\n\n`;
          candidates.slice(0, 12).forEach((c, i) => {
            out += `## Tema ${i + 1}: ${c}\n\n`;
            out += `Resumen: Breve descripción del tema y puntos clave.\n\n`;
          });

          out += `\n*Nota: Este temario es un esquema provisional generado automáticamente porque el servicio de IA falló. Puedes reintentar la generación completa desde el panel.*`;
          return out;
        } catch (err) {
          return 'Temario provisional: 1. Introducción\n2. Tema 2\n3. Tema 3';
        }
      };

      const fallback = generateFallbackOutline(cleanMessage);
      console.warn('⚠️ Returning fallback outline to client so generation can continue');

      return res.json({ message: fallback, model: 'fallback', usage: null, fallback: true });
    }

    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("❌ No response content from OpenAI:", data);
      throw new Error("No response from OpenAI");
    }

    console.log("�� OpenAI response successful:", {
      model: modelToUse,
      assistantType,
      responseLength: assistantMessage.length,
      tokensUsed: data.usage?.total_tokens || "unknown"
    });

    res.json({
      message: assistantMessage,
      model: modelToUse,
      usage: data.usage
    });
  } catch (error: any) {
    console.error("Error processing chat message:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Provide more specific error messages
    let errorMessage = "Error processing your message. Please try again.";

    if (error.message.includes('fetch')) {
      errorMessage = "Network error connecting to OpenAI. Please check your connection and try again.";
    } else if (error.message.includes('OpenAI API error')) {
      errorMessage = `OpenAI API error: ${error.message}`;
    } else if (error.message.includes('timeout')) {
      errorMessage = "Request timeout. Please try again.";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message
    });
  }
};

function getSystemPrompt(assistantType: string): string {
  const prompts: Record<string, string> = {
    "Guardia Civil": `Eres un asistente especializado en la Guardia Civil española. Tu función es ayudar a los usuarios con consultas sobre:

- Normativas y procedimientos de la Guardia Civil
- Trámites y gestiones administrativas
- Derechos y deberes ciudadanos en relación con la Guardia Civil
- Información sobre procesos legales y administrativos
- Orientación sobre denuncias, multas y procedimientos

Debes responder de manera profesional, precisa y útil. Si no tienes información específica sobre algo, indica que el usuario debe contactar directamente con la Guardia Civil para obtener información oficial actualizada.

Siempre mantén un tono respetuoso y profesional. No proporciones asesoramiento legal específico, sino información general orientativa.`,

    default: `Eres un asistente útil y profesional. Responde de manera clara, precisa y amigable a las consultas de los usuarios.`,
  };

  return prompts[assistantType] || prompts.default;
}
