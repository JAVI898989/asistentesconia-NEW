import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { ProfessionalCourse } from "@/lib/firebaseData";
import { useAutoSync } from "@/hooks/useAutoSync";

interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface ChatEspecializadoProps {
  course: ProfessionalCourse;
  hasAccess: boolean;
}

export default function ChatEspecializado({
  course,
  hasAccess,
}: ChatEspecializadoProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-sync chat messages to Firebase
  const { save: saveChat } = useAutoSync(
    {
      courseId: course.id,
      messages,
      lastActivity: new Date().toISOString(),
    },
    {
      collection: "chatSessions",
      documentId: `${course.id}_chat`,
      debounceMs: 3000,
    },
  );

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "system",
      content: `¡Bienvenido al chat especializado en ${course.name}!

Soy tu asistente de IA especializado en este curso. Puedo ayudarte con:

🎯 Dudas sobre el temario
📚 Explicaciones detalladas de conceptos
💡 Consejos prácticos y ejemplos
🔍 Resolución de problemas específicos
📝 Preparación para tests y exámenes

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  }, [course.name]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !hasAccess || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("🚀 Sending message to chat API:", input);

      // Call OpenAI API with course context
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          assistantType: course.category.toLowerCase().replace(/\s+/g, "-"),
          contextPrompt: `Eres un asistente especializado en ${course.name}. ${course.description}. Tu nivel de dificultad es ${course.difficulty}. Ayuda al estudiante con preguntas relacionadas con este curso.`,
          history: messages
            .filter((m) => m.type !== "system")
            .slice(-10) // Last 10 messages for context
            .map((m) => ({
              id: m.id,
              content: m.content,
              role: m.type === "user" ? "user" : "assistant",
              timestamp: m.timestamp,
            })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Received response from chat API:", data);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.message || "Lo siento, no pude procesar tu consulta.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback response
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Lo siento, hay un problema temporal con el servicio. Por favor, intenta nuevamente en unos momentos.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    `¿Cuáles son los conceptos básicos de ${course.name}?`,
    `¿Qué habilidades necesito para dominar este curso?`,
    `¿Puedes darme ejemplos prácticos del tema actual?`,
    `¿Cómo puedo prepararme mejor para los tests?`,
  ];

  if (!hasAccess) {
    return (
      <Alert className="border-orange-500/50 bg-orange-500/10">
        <MessageCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-orange-300">
              Chat especializado no disponible
            </p>
            <p className="text-orange-200">
              Necesitas acceso al curso para chatear con el asistente de IA
              especializado en {course.name}.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-blue-400" />
            Chat Especializado - {course.name}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Container */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Chat */}
        <div className="lg:col-span-3">
          <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type !== "user" && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "system"
                            ? "bg-purple-500/20"
                            : "bg-blue-500/20"
                        }`}
                      >
                        {message.type === "system" ? (
                          <Lightbulb className="w-4 h-4 text-purple-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.type === "system"
                            ? "bg-purple-500/20 text-purple-100 border border-purple-500/30"
                            : "bg-slate-700 text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-slate-300">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta sobre el curso..."
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar with suggestions */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Preguntas sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left h-auto p-2 text-xs bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 mt-4">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-400" />
                Consejos de uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs text-slate-400">
                <p>• Sé específico en tus preguntas</p>
                <p>• Menciona el tema que estás estudiando</p>
                <p>• Pide ejemplos prácticos</p>
                <p>• Usa "explícame" para conceptos complejos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
