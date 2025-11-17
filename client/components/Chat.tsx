import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, gql, fetchChatHistory, saveChatHistory } from "@/lib/simpleAuth";
import { useUserApiKey } from "@/hooks/useUserApiKey";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatProps {
  assistantId: string;
  isAccessible?: boolean;
  userRole?: string;
}

// Helper function to get assistant display name from ID
const getAssistantNameFromId = (assistantId: string): string => {
  const nameMap: Record<string, string> = {
    "guardia-civil": "Guardia Civil",
    "policia-nacional": "Policía Nacional",
    "auxiliar-administrativo-estado": "Auxiliar Administrativo del Estado",
    "auxiliar-veterinaria": "Auxiliar de Veterinaria",
    "programador-desde-cero": "Programación desde Cero",
    "peluqueria-profesional": "Peluquería Profesional",
    "veterinaria": "Veterinaria",
    "psicologo": "Psicología",
    "nutricion-deporte": "Nutrición y Deporte",
    "enfermeria": "Enfermería",
    "administracion": "Administración",
    "legal": "Legal",
    "burocracia": "Burocracia",
    "laboral": "Derecho Laboral"
  };

  return nameMap[assistantId] || assistantId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Enhanced context definitions for strict assistant restrictions
const getContextPrompt = (assistantId: string): string => {
  const assistantName = getAssistantNameFromId(assistantId);

  const contexts: Record<string, string> = {
    "guardia-civil":
      `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN GUARDIA CIVIL DE ESPAÑA.

SOLO PUEDES RESPONDER SOBRE:
- Temario oficial de oposiciones de Guardia Civil
- Procedimientos y normativa de la Guardia Civil
- Historia y funciones de la Guardia Civil
- Preparación física para las pruebas
- Tests psicotécnicos específicos
- Casos prácticos de Guardia Civil
- Derechos y deberes ciudadanos relacionados

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA (Policía Nacional, programación, medicina, cocina, deportes, etc.), DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en la preparación de la Guardia Civil. Por favor, selecciona el asistente correspondiente para otras oposiciones."`,

    "policia-nacional":
      `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN POLICÍA NACIONAL DE ESPAÑA.

SOLO PUEDES RESPONDER SOBRE:
- Temario oficial de oposiciones de Policía Nacional
- Procedimientos policiales y normativa
- Historia y funciones de la Policía Nacional
- Preparación física para las pruebas
- Tests psicotécnicos específicos
- Casos prácticos de Policía Nacional
- Seguridad ciudadana y orden público

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA (Guardia Civil, programación, medicina, etc.), DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en la preparación de la Policía Nacional. Por favor, selecciona el asistente correspondiente para otras oposiciones."`,

    "auxiliar-administrativo-estado":
      `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN AUXILIAR ADMINISTRATIVO DEL ESTADO.

SOLO PUEDES RESPONDER SOBRE:
- Constitución Española
- Organización del Estado español
- Empleados públicos y función pública
- Procedimiento administrativo
- Ofimática y herramientas administrativas
- Gestión documental y archivo

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA, DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en la preparación de Auxiliar Administrativo del Estado. Por favor, selecciona el asistente correspondiente para otras oposiciones."`,

    "auxiliar-veterinaria":
      `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN AUXILIAR DE VETERINARIA.

SOLO PUEDES RESPONDER SOBRE:
- Anatomía y fisiología animal
- Primeros auxilios veterinarios
- Asistencia en clínicas veterinarias
- Farmacología veterinaria
- Cuidado y manejo de animales
- Procedimientos clínicos veterinarios

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA, DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en veterinaria. Solo puedo ayudarte con anatomía animal, cuidado veterinario y temas relacionados con animales. ¿Tienes alguna pregunta sobre veterinaria?"`,

    "programador-desde-cero":
      `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN PROGRAMACIÓN WEB DESDE CERO.

SOLO PUEDES RESPONDER SOBRE:
- JavaScript, HTML, CSS
- React y desarrollo frontend
- Algoritmos básicos de programación
- Desarrollo web
- Herramientas de desarrollo
- Buenas prácticas de código

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA, DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en programación web. Solo puedo ayudarte con JavaScript, HTML, CSS, React y desarrollo web. ¿Tienes alguna pregunta sobre programación?"`,

    "laboral-basico":
      `**SISTEMA — ASISTENTE LABORAL (ESPAÑA) "BÁSICO"**

**ROL:** Eres un experto en derecho laboral español y relaciones laborales. Respondes con precisión, actualizado a la fecha de la consulta (zona horaria Europe/Madrid), y nunca rechazas preguntas de tu ámbito ("laboral"). Si falta algún dato imprescindible, haces una pregunta aclaratoria y, si es posible, continúas con supuestos razonables explícitos.

**COBERTURA LABORAL (no exhaustivo):**
- SMI y tablas salariales
- Convenios colectivos
- Tipos de contratos laborales
- Jornada laboral y horas extra
- Vacaciones y permisos
- ERTE/ERE y suspensión de contratos
- Despido (improcedente/objetivo/disciplinario)
- Finiquito e indemnizaciones
- Cotizaciones y Seguridad Social
- Prestación por desempleo y subsidios
- Incapacidades laborales
- Empleadas del hogar
- Teletrabajo y trabajo a distancia
- Prevención de riesgos laborales
- Inspección de trabajo

**🔎 ACTUALIZACIÓN Y FUENTES:**
Si tu entorno dispone de navegación/consulta web, úsala SIEMPRE para datos sensibles al tiempo (SMI, bases de cotización, IPREM, topes, convenios vigentes, bonificaciones).

Prioriza fuentes oficiales: BOE, Ministerio de Trabajo y Economía Social, SEPE, Seguridad Social, INE.

Incluye 1-3 citas con enlace al final cuando uses datos actualizables.

Si no tienes navegación disponible, indícalo y ofrece la última cifra conocida con fecha y advierte que podría haber cambio; sugiere verificar datos oficiales.

**🧩 FORMATO DE RESPUESTA OBLIGATORIO:**

1. **Resumen:** Una frase con lo esencial
2. **Detalle:** Paso a paso, claro, en español, sin jerga innecesaria
3. **Cálculo/tabla:** Si aplica (ej.: SMI 12 vs 14 pagas, bruto/mes, bruto/año, diario)
4. **Qué depende de:** Convenio, antigüedad, tipo de contrato, etc.
5. **Fuentes:** Solo si se usaron datos actualizables
6. **Aviso:** "Orientación general, no asesoramiento jurídico individual"

**ESTILO:** Didáctico, conciso y preciso; usa tildes y eñes correctamente.

**✅ REGLAS ESTRICTAS:**
- NO digas "no puedo responder" si es materia laboral
- SIEMPRE indica fecha exacta que usas (ej.: "Datos a 13/08/2025")
- Si hay novedad en trámite (proyecto/Real Decreto pendiente), diferéncialo de lo ya vigente
- Para SMI y bases: ofrece 12 y 14 pagas, mensual, anual y diario
- Si hay diferencias por convenio, dilo y sugiere comprobar el convenio aplicable

**🧪 EJEMPLO DE RESPUESTA CORRECTA:**
Usuario: "¿Cuánto es el salario mínimo?"

**Resumen:** El SMI vigente a [FECHA] es X€/mes en 14 pagas.

**Detalle:**
• 14 pagas: X€/mes → Y€/año
• 12 pagas: Z€/mes (prorrateo)
• Diario: D€/día
• Empleadas de hogar: H€/hora (si aplica)

**Qué puede variar:** Convenio aplicable, complementos, jornada parcial.

**Fuentes:** BOE (Real Decreto SMI 2024), Ministerio de Trabajo.

**Aviso:** Orientación general; no sustituye asesoramiento jurídico.

**🛠️ SI FALLA ALGO:**
Si la consulta requiere datos específicos que no puedes verificar, indícalo, ofrece la última cifra conocida con fecha y sugiere aportar el convenio o fecha exacta.

**🧱 LÍMITES:**
- No reveles datos personales
- No inventes referencias legales: si no puedes verificarlas, márcalas como "Verificar fuente"
- Para cálculos complejos (indemnización, prestaciones), muestra la fórmula y un ejemplo numérico

RESPONDE EXCLUSIVAMENTE SOBRE DERECHO LABORAL ESPAÑOL. Si te preguntan sobre otros temas, responde: "Soy un asistente especializado en derecho laboral español. ¿Tienes alguna consulta sobre contratos, salarios, despidos, prestaciones o cualquier tema laboral?"`,
  };

  return contexts[assistantId] ||
    `ERES UN ASISTENTE ESPECIALIZADO EXCLUSIVAMENTE EN ${assistantName.toUpperCase()}.

SOLO PUEDES RESPONDER SOBRE TEMAS RELACIONADOS CON ${assistantName}.

SI TE PREGUNTAN SOBRE CUALQUIER OTRO TEMA, DEBES RESPONDER EXACTAMENTE:

"Este asistente ha sido entrenado exclusivamente para ayudarte en la preparación de ${assistantName}. Por favor, selecciona el asistente correspondiente para otras oposiciones."`;
};

export default function Chat({
  assistantId,
  isAccessible = true,
  userRole = "student",
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { apiKey } = useUserApiKey();

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user && assistantId) {
        loadChatHistory();
      }
    });
    return () => unsubscribe();
  }, [assistantId]);

  // Load chat history from Nhost
  const loadChatHistory = async () => {
    if (!currentUser || !assistantId) return;

    try {
      const messages = await fetchChatHistory(currentUser.id, assistantId);
      if (Array.isArray(messages)) {
        const loadedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save chat history to Nhost
  const saveChatHistoryToDb = async (updatedMessages: Message[]) => {
    if (!currentUser || !assistantId) return;

    try {
      await saveChatHistory(
        currentUser.id,
        assistantId,
        updatedMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }))
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save to Nhost whenever messages change
  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      saveChatHistoryToDb(messages);
    }
  }, [messages, currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Check if user has access to chat
    if (!isAccessible) {
      const accessMessage: Message = {
        id: Date.now().toString(),
        content:
          "Para acceder al chat necesitas suscribirte o pagar el acceso a este asistente/curso. Contacta con el administrador para más información.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, accessMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Add context prompt for this specific assistant
      const contextPrompt = getContextPrompt(assistantId);
      const assistantName = getAssistantNameFromId(assistantId);

      // Debug logging
      console.log("🤖 Chat Debug:", {
        assistantId,
        assistantName,
        contextPrompt: contextPrompt.substring(0, 150) + "...",
        message: input.trim(),
      });

      console.log("📡 Making API request to /api/openai/chat");

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

      // Try primary relative URL first, then absolute origin URL as fallback (helps when proxy isn't configured)
      const tryUrls = ["/api/openai/chat", `${window.location.origin}/api/openai/chat`];
      // First, check if backend is reachable by pinging /api/ping on those origins
      const pingUrls = tryUrls.map(u => u.replace('/chat', '/ping'));
      let backendReachable = false;
      let lastPingError: any = null;

      for (const pingUrl of pingUrls) {
        try {
          const pingResp = await fetch(pingUrl, { method: 'GET' });
          if (pingResp.ok) {
            backendReachable = true;
            break;
          }
          const txt = await pingResp.text().catch(() => '<no body>');
          console.warn(`Ping to ${pingUrl} returned ${pingResp.status}: ${txt}`);
        } catch (err: any) {
          lastPingError = err;
          console.warn(`Ping to ${pingUrl} failed:`, err);
        }
      }

      if (!backendReachable) {
        // Don't attempt heavy calls if backend isn't reachable
        const msg = lastPingError ? `Backend ping failed: ${lastPingError.message || String(lastPingError)}` : 'Backend /api endpoints not reachable';
        throw new Error(`API backend unreachable: ${msg}`);
      }

      let response: Response | null = null;
      let lastFetchError: any = null;
      let lastResponseBody: string | null = null;

      for (const url of tryUrls) {
        try {
          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: input.trim(),
              assistantType: assistantId,
              assistantName,
              contextPrompt,
              modelPreference: "gpt-4-nano",
              history: messages.slice(-12),
              userApiKey: apiKey || undefined,
            }),
            signal: controller.signal
          });

          if (response.status === 404) {
            // Read body once (no clone) and log, then try next URL
            try {
              lastResponseBody = await response.text();
            } catch (readErr) {
              console.warn(`Could not read body for 404 response from ${url}:`, readErr);
              lastResponseBody = '<no body>';
            }
            console.warn(`API returned 404 for ${url}: ${lastResponseBody}`);
            response = null;
            continue;
          }

          // got a response that's not a 404
          break;
        } catch (err: any) {
          lastFetchError = err;
          console.warn(`Fetch to ${url} failed:`, err);
          // If aborted due to timeout, stop trying
          if (err?.name === 'AbortError') break;
          // otherwise try next URL
        }
      }

      clearTimeout(timeoutId);

      if (!response) {
        const detail = lastFetchError?.message || lastResponseBody || 'unknown';
        console.error("❌ No response from API. Detail:", detail);
        throw new Error(`API endpoint not responding: ${detail}`);
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          let errorData = null;
          // Prefer lastResponseBody if we captured it earlier (avoid re-reading body)
          if (lastResponseBody !== null) {
            errorData = lastResponseBody;
          } else {
            try {
              errorData = await response.text();
            } catch (readErr) {
              console.error('Could not read error response body:', readErr);
              errorData = `<unreadable error body: ${readErr?.message || String(readErr)}>`;
            }
          }

          console.error("API Error Response:", errorData);
          if (errorData && errorData !== '<no body>' && errorData !== '') {
            errorMessage += ` - ${errorData}`;
          }
        } catch (e) {
          console.error("Could not read error response:", e);
        }

        if (response.status === 404) {
          throw new Error("API endpoint /api/openai/chat not found on server");
        } else if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): ${errorMessage}`);
        } else {
          throw new Error(`API request failed (${response.status}): ${errorMessage}`);
        }
      }

      console.log("✅ API response successful, parsing JSON...");
      let data;
      let responseText = '';
      try {
        responseText = await response.text();
        if (!responseText) {
          console.error("❌ Empty response body from API");
          throw new Error("Server returned empty response");
        }
        data = JSON.parse(responseText);
        console.log("📦 Parsed response data:", data);
      } catch (jsonError) {
        console.error("❌ Failed to parse JSON response:", { error: jsonError, responseText });
        throw new Error(`Invalid response format from server: ${jsonError instanceof Error ? jsonError.message : 'JSON parse failed'}`);
      }

      if (!data || !data.message) {
        console.error("❌ Invalid response structure:", data);
        throw new Error("Server returned unexpected response format");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      let errorContent =
        "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.";

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorContent = "La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.";
        } else if (error.message.includes("fetch") || error.message.includes("NetworkError")) {
          errorContent = "Error de conexión. Verifica tu conexión a internet y vuelve a intentarlo.";
        } else if (error.message.includes("API endpoint not found")) {
          errorContent = "El servicio de chat no está disponible temporalmente. Por favor, inténtalo más tarde.";
        } else if (error.message.includes("Server error")) {
          errorContent = "Error del servidor. Por favor, inténtalo más tarde.";
        } else if (error.message.includes("Invalid response")) {
          errorContent = "Error de formato en la respuesta del servidor. Por favor, inténtalo más tarde.";
        }
      } else if (error instanceof TypeError && error.message.includes("fetch")) {
        errorContent = "Error de conexión. Verifica tu conexión a internet y vuelve a intentarlo.";
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="mx-auto h-12 w-12 mb-4 text-blue-500" />
            {isAccessible ? (
              <div className="space-y-3">
                <p className="text-lg font-semibold text-blue-600">
                  ¡Hola! Soy tu asistente especializado en {getAssistantNameFromId(assistantId)}
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-blue-800 font-medium text-sm">
                      Conectado a GPT-4-nano
                    </p>
                  </div>
                  <p className="text-blue-700 text-sm">
                    Solo puedo responder preguntas sobre{" "}
                    <strong>{getAssistantNameFromId(assistantId)}</strong>. Si preguntas sobre otros
                    temas, te recordaré mi especialización.
                  </p>
                </div>
                <p className="text-gray-600">
                  ¿En qué puedo ayudarte sobre {getAssistantNameFromId(assistantId)}?
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-orange-600 font-medium">
                  Chat disponible solo para usuarios registrados
                </p>
                <p className="text-sm">
                  Suscríbete para acceder al chat especializado en{" "}
                  {getAssistantNameFromId(assistantId)}
                </p>
              </div>
            )}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  : "bg-muted text-foreground",
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isAccessible
                  ? `Pregunta sobre ${getAssistantNameFromId(assistantId)}...`
                  : "Suscríbete para acceder al chat"
              }
              disabled={loading || !isAccessible}
              className="pr-32"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-2 text-gray-500 hover:text-gray-700"
              disabled={true}
              title="Funcionalidad de audio próximamente"
            >
              <Mic className="h-4 w-4 mr-1" />
              <span className="text-xs">🎤 Próximamente</span>
            </Button>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading || !isAccessible}
            size="icon"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Send className="h-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
