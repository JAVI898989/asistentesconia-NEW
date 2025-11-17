import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingUp, 
  FileText, 
  Gavel, 
  Car, 
  Home, 
  GraduationCap,
  Bot,
  Clock,
  CheckCircle
} from "lucide-react";
import TemporalChat from "@/components/TemporalChat";

const assistantScopes = [
  {
    id: "fiscal",
    name: "Asistente Fiscal",
    scope: "fiscal y tributario",
    icon: TrendingUp,
    color: "bg-green-500",
    examples: [
      "¿Cuáles eran los tramos del IRPF en 2023?",
      "¿Cuánto es el SMI actual?",
      "Bases de cotización para enero 2024"
    ]
  },
  {
    id: "laboral",
    name: "Asistente Laboral",
    scope: "derecho laboral y Seguridad Social",
    icon: FileText,
    color: "bg-blue-500",
    examples: [
      "¿Cuál era el SMI en 2022?",
      "Prestación por desempleo actual",
      "Convenio vigente en marzo 2024"
    ]
  },
  {
    id: "juridico",
    name: "Asistente Jurídico",
    scope: "derecho y normativa legal",
    icon: Gavel,
    color: "bg-purple-500",
    examples: [
      "¿Qué normativa estaba vigente en 2023?",
      "Cambios legales actuales",
      "Jurisprudencia del año pasado"
    ]
  },
  {
    id: "trafico",
    name: "Asistente de Tráfico",
    scope: "normativa de tráfico y seguridad vial",
    icon: Car,
    color: "bg-red-500",
    examples: [
      "¿Cuáles eran las multas en 2023?",
      "Puntos del carnet actual",
      "Nueva normativa DGT 2024"
    ]
  },
  {
    id: "vivienda", 
    name: "Asistente de Vivienda",
    scope: "normativa inmobiliaria y vivienda",
    icon: Home,
    color: "bg-orange-500",
    examples: [
      "¿Cuál era la ley de alquileres en 2023?",
      "Ayudas actuales para vivienda",
      "ITP vigente por CCAA"
    ]
  },
  {
    id: "oposiciones",
    name: "Asistente de Oposiciones",
    scope: "oposiciones y administración pública",
    icon: GraduationCap,
    color: "bg-indigo-500",
    examples: [
      "¿Qué temario era válido en 2023?",
      "Convocatorias actuales",
      "Bases reguladoras vigentes"
    ]
  }
];

export default function TemporalAITest() {
  const [selectedAssistant, setSelectedAssistant] = useState(assistantScopes[0]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🕒 Sistema de IA con Respuestas Temporales
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Prueba el sistema avanzado de IA que responde según el contexto temporal correcto.
            Especifica fechas en tus consultas para obtener datos históricos, actuales o proyecciones futuras.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Contexto Temporal</h3>
              <p className="text-sm text-gray-600">Detecta fechas automáticamente</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Datos Verificados</h3>
              <p className="text-sm text-gray-600">Fuentes oficiales y BOE</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Histórico vs Actual</h3>
              <p className="text-sm text-gray-600">Diferencia datos por fecha</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Bot className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Validación IA</h3>
              <p className="text-sm text-gray-600">Formato estándar europeo</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat IA Temporal</TabsTrigger>
            <TabsTrigger value="examples">Ejemplos y Casos de Uso</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Assistant Selector */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Asistentes Disponibles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {assistantScopes.map((assistant) => {
                    const Icon = assistant.icon;
                    return (
                      <Button
                        key={assistant.id}
                        variant={selectedAssistant.id === assistant.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedAssistant(assistant)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="truncate">{assistant.name}</span>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <TemporalChat
                  assistantId={selectedAssistant.id}
                  assistantName={selectedAssistant.name}
                  assistantScope={selectedAssistant.scope}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assistantScopes.map((assistant) => {
                const Icon = assistant.icon;
                return (
                  <Card key={assistant.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${assistant.color} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {assistant.name}
                      </CardTitle>
                      <Badge variant="outline">{assistant.scope}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Consultas de ejemplo:</h4>
                        <div className="space-y-2">
                          {assistant.examples.map((example, index) => (
                            <div
                              key={index}
                              className="p-2 bg-gray-50 rounded text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setSelectedAssistant(assistant);
                                // Switch to chat tab
                                const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                                chatTab?.click();
                              }}
                            >
                              "{example}"
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedAssistant(assistant);
                          const chatTab = document.querySelector('[value="chat"]') as HTMLElement;
                          chatTab?.click();
                        }}
                      >
                        Probar Asistente
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* How it Works */}
            <Card>
              <CardHeader>
                <CardTitle>🛠️ Cómo Funciona el Sistema Temporal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ Detección Automática de Fechas</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• "en 2023" → busca datos de 2023</li>
                      <li>• "actual" → usa fecha de hoy</li>
                      <li>• "el año pasado" → calcula automáticamente</li>
                      <li>• "enero 2024" → mes específico</li>
                      <li>• "a 15/03/2023" → fecha exacta</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2">📊 Formato de Respuesta Estándar</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Resumen con fecha utilizada</li>
                      <li>• Detalle paso a paso</li>
                      <li>• Tablas y cálculos (si aplica)</li>
                      <li>• Variables que influyen</li>
                      <li>• Fuentes oficiales verificadas</li>
                      <li>• Aviso legal obligatorio</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Calendar className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Zona horaria:</strong> Europe/Madrid | 
                    <strong> Fuentes:</strong> BOE, ministerios oficiales, organismos públicos | 
                    <strong> Validación:</strong> Formato y estructura de respuestas verificada automáticamente
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
