import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Bot, User, Calendar, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  generateTemporalPrompt, 
  validateTemporalResponse, 
  formatSpanishDate,
  getOfficialSources,
  type TemporalContext 
} from "@/lib/temporalResponseSystem";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  temporalContext?: TemporalContext;
  validationResult?: {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  };
}

interface TemporalChatProps {
  assistantId: string;
  assistantName: string;
  assistantScope: string; // e.g., "fiscal", "laboral", "tráfico"
  className?: string;
}

export default function TemporalChat({
  assistantId,
  assistantName,
  assistantScope,
  className
}: TemporalChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `¡Hola! Soy tu asistente especializado en **${assistantScope}** con sistema de respuestas temporales.\n\n**Puedes preguntarme:**\n- "¿Cuál era el IRPF en 2023?"\n- "¿Cuánto es el SMI actual?"\n- "Normativa vigente en enero 2024"\n\n🕒 **Respondo según el contexto temporal que especifiques**, con datos actualizados y fuentes oficiales.\n\n*Zona horaria: Europe/Madrid*`,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Generar contexto temporal
      const { contextPrompt, temporalContext } = generateTemporalPrompt(input, assistantScope);

      // Llamar a la API de chat con contexto temporal
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          assistantType: `${assistantName} (Temporal)`,
          contextPrompt: contextPrompt,
          history: messages.slice(-5).map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const data = await response.json();
      
      // Validar la respuesta temporal
      const validationResult = validateTemporalResponse(data.message, temporalContext);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
        temporalContext,
        validationResult,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "❌ Error al procesar tu consulta. Por favor, inténtalo de nuevo.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
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

  const getTemporalContextBadge = (context?: TemporalContext) => {
    if (!context) return null;

    const { isHistorical, isFuture, isCurrentData, targetDate } = context;
    
    if (isCurrentData) {
      return (
        <Badge variant="default" className="bg-green-500">
          <Clock className="w-3 h-3 mr-1" />
          Datos Actuales
        </Badge>
      );
    }
    
    if (isHistorical) {
      return (
        <Badge variant="secondary" className="bg-blue-500">
          <Calendar className="w-3 h-3 mr-1" />
          Histórico ({formatSpanishDate(targetDate)})
        </Badge>
      );
    }
    
    if (isFuture) {
      return (
        <Badge variant="outline" className="border-orange-500 text-orange-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Futuro ({formatSpanishDate(targetDate)})
        </Badge>
      );
    }

    return null;
  };

  const getValidationBadge = (validation?: { isValid: boolean; issues: string[] }) => {
    if (!validation || !showValidation) return null;

    if (validation.isValid) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          Formato Correcto
        </Badge>
      );
    }

    return (
      <Badge variant="destructive">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {validation.issues.length} Problema{validation.issues.length > 1 ? 's' : ''}
      </Badge>
    );
  };

  return (
    <Card className={cn("h-[600px] flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            {assistantName} - Sistema Temporal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{assistantScope}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowValidation(!showValidation)}
              title="Mostrar/ocultar validación de respuestas"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Alert className="mt-2">
          <Calendar className="w-4 h-4" />
          <AlertDescription>
            <strong>Sistema Temporal Activo:</strong> Especifica fechas en tus consultas 
            ("en 2023", "actual", "enero 2024") para obtener datos del período correcto.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                message.role === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="space-y-2">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-full",
                    message.role === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm break-words">
                    {message.content}
                  </div>
                </div>
                
                {/* Temporal Context and Validation Badges */}
                {message.role === "assistant" && (message.temporalContext || message.validationResult) && (
                  <div className="flex flex-wrap gap-2">
                    {getTemporalContextBadge(message.temporalContext)}
                    {getValidationBadge(message.validationResult)}
                  </div>
                )}
                
                {/* Validation Issues (if any) */}
                {showValidation && message.validationResult && !message.validationResult.isValid && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <strong>Issues detectados:</strong>
                        {message.validationResult.issues.map((issue, index) => (
                          <div key={index} className="text-xs">• {issue}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Madrid'
                  })}
                </div>
              </div>
              
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  <span className="text-sm text-gray-600 ml-2">Analizando contexto temporal...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: ¿Cuál era el SMI en 2023? ¿Normativa actual de tráfico?"
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || loading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            💡 Ejemplos: "SMI en 2024", "IRPF vigente", "normativa enero 2023"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
