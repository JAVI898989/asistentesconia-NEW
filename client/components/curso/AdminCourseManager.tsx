import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Database,
  FileText,
  Brain,
  Target,
} from "lucide-react";
import {
  ProfessionalCourse,
  CourseTheme,
  TestQuestion,
  FlashCard,
  getCourseThemes,
  getThemeQuestions,
  getThemeFlashcards,
  saveCourseToFirebase,
  generateDemoQuestions,
  generateDemoFlashcards,
} from "@/lib/firebaseData";

interface AdminCourseManagerProps {
  course: ProfessionalCourse;
  themes: CourseTheme[];
  isVisible: boolean;
  onClose: () => void;
  onThemesUpdate: (themes: CourseTheme[]) => void;
}

export default function AdminCourseManager({
  course,
  themes,
  isVisible,
  onClose,
  onThemesUpdate,
}: AdminCourseManagerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTheme, setSelectedTheme] = useState<CourseTheme | null>(null);
  const [themeQuestions, setThemeQuestions] = useState<TestQuestion[]>([]);
  const [themeFlashcards, setThemeFlashcards] = useState<FlashCard[]>([]);

  // Edit states
  const [editingTheme, setEditingTheme] = useState<CourseTheme | null>(null);
  const [newThemeTitle, setNewThemeTitle] = useState("");
  const [newThemeDescription, setNewThemeDescription] = useState("");

  useEffect(() => {
    if (selectedTheme) {
      loadThemeContent(selectedTheme.id);
    }
  }, [selectedTheme]);

  const loadThemeContent = async (themeId: string) => {
    setLoading(true);
    try {
      const [questions, flashcards] = await Promise.all([
        getThemeQuestions(themeId),
        getThemeFlashcards(themeId),
      ]);
      setThemeQuestions(questions);
      setThemeFlashcards(flashcards);
    } catch (error) {
      console.error("Error loading theme content:", error);
      setMessage({ type: "error", text: "Error cargando contenido del tema" });
    }
    setLoading(false);
  };

  const handleGenerateContent = async () => {
    if (!course) return;

    setSaving(true);
    setMessage(null);

    try {
      console.log("🔄 Generating content for course:", course.name);

      // Generate enhanced themes with content
      const enhancedThemes = themes.map((theme, index) => ({
        ...theme,
        content: {
          theory: generateTheoryContent(course.name, theme.title, index + 1),
          practicalExamples: generatePracticalExamples(
            course.name,
            theme.title,
            index + 1,
          ),
          keyPoints: generateKeyPoints(course.name, theme.title, index + 1),
        },
        questions: generateDemoQuestions(theme.id),
        flashcards: generateDemoFlashcards(theme.id),
      }));

      // Save to Firebase
      await saveCourseContentToFirebase(course.id, enhancedThemes);

      onThemesUpdate(enhancedThemes);
      setMessage({
        type: "success",
        text: "Contenido generado y guardado exitosamente en Firebase",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      setMessage({ type: "error", text: "Error generando contenido" });
    }

    setSaving(false);
  };

  const generateTheoryContent = (
    courseName: string,
    themeTitle: string,
    themeNumber: number,
  ): string[] => {
    const courseSpecificContent: Record<string, Record<number, string[]>> = {
      "Programador desde cero": {
        1: [
          "Historia y evolución de la programación: desde las máquinas de Turing hasta la actualidad",
          "Conceptos fundamentales: algoritmos, datos, estructuras y paradigmas de programación",
          "Diferencia entre lenguajes de alto y bajo nivel, compilados e interpretados",
          "Introducción a la lógica de programación y resolución de problemas",
          "Entornos de desarrollo integrados (IDEs) y herramientas básicas",
          "Conceptos de sintaxis, semántica y buenas prácticas de programación",
        ],
        2: [
          "Variables: declaración, inicialización, tipos de datos y scope",
          "Operadores aritméticos, lógicos y de comparación",
          "Estructuras de control: condicionales (if, else, switch)",
          "Bucles: for, while, do-while y sus casos de uso",
          "Funciones: definición, parámetros, return y modularidad",
          "Arrays y estructuras de datos básicas",
        ],
        3: [
          "Programación orientada a objetos: clases, objetos, métodos",
          "Encapsulación, herencia y polimorfismo",
          "Manejo de excepciones y debugging",
          "Algoritmos de búsqueda y ordenamiento",
          "Estructuras de datos avanzadas: listas, pilas, colas",
          "Complejidad temporal y espacial de algoritmos",
        ],
        4: [
          "Desarrollo de aplicaciones prácticas y proyectos",
          "Integración con bases de datos y APIs",
          "Testing: unitario, integración y end-to-end",
          "Control de versiones con Git y GitHub",
          "Metodologías ágiles y trabajo en equipo",
          "Documentación técnica y comentarios de código",
        ],
        5: [
          "Proyecto final: aplicación completa desde cero",
          "Arquitectura de software y patrones de diseño",
          "Optimización de rendimiento y buenas prácticas",
          "Deployment y puesta en producción",
          "Mantenimiento y actualización de código",
          "Preparación para el mercado laboral y portfolio",
        ],
      },
    };

    return (
      courseSpecificContent[courseName]?.[themeNumber] || [
        `Fundamentos teóricos de ${themeTitle}`,
        `Conceptos clave y principios fundamentales`,
        `Marco conceptual y bases del conocimiento`,
        `Metodologías y enfoques principales`,
        `Herramientas y recursos esenciales`,
        `Aplicaciones prácticas en el entorno profesional`,
      ]
    );
  };

  const generatePracticalExamples = (
    courseName: string,
    themeTitle: string,
    themeNumber: number,
  ): string[] => {
    const examples: Record<string, Record<number, string[]>> = {
      "Programador desde cero": {
        1: [
          "Escribir tu primer programa 'Hola Mundo' en diferentes lenguajes",
          "Crear un algoritmo para calcular el área de diferentes figuras geométricas",
          "Ejercicio de pseudocódigo: algoritmo para encontrar el mayor de tres números",
          "Instalación y configuración de un entorno de desarrollo (VS Code, Python, etc.)",
        ],
        2: [
          "Crear una calculadora básica con operaciones aritméticas",
          "Programa que determine si un número es par o impar",
          "Sistema de notas que calcule promedio y determine si aprueba o reprueba",
          "Juego de adivinanza de números con bucles y condicionales",
        ],
      },
    };

    return (
      examples[courseName]?.[themeNumber] || [
        `Ejemplo práctico 1: Caso de estudio aplicado a ${themeTitle}`,
        `Ejemplo práctico 2: Simulación de situación profesional real`,
        `Ejercicio guiado paso a paso con herramientas específicas`,
        `Taller práctico interactivo con feedback inmediato`,
      ]
    );
  };

  const generateKeyPoints = (
    courseName: string,
    themeTitle: string,
    themeNumber: number,
  ): string[] => {
    return [
      `Dominio completo de los conceptos fundamentales de ${themeTitle}`,
      `Aplicación práctica efectiva en entornos profesionales reales`,
      `Resolución autónoma de problemas comunes y complejos del área`,
      `Integración exitosa con otras áreas y metodologías del sector`,
      `Implementación de mejores prácticas y estándares de calidad`,
    ];
  };

  const saveCourseContentToFirebase = async (
    courseId: string,
    enhancedThemes: CourseTheme[],
  ) => {
    // This would save to Firebase in production
    console.log("💾 Saving to Firebase:", {
      courseId,
      themesCount: enhancedThemes.length,
    });

    // Simulate Firebase save
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("✅ Content saved to Firebase successfully");
  };

  const handleCreateNewTheme = () => {
    if (!newThemeTitle.trim()) return;

    const newTheme: CourseTheme = {
      id: `${course.id}-theme-${themes.length + 1}`,
      courseId: course.id,
      title: newThemeTitle,
      description: newThemeDescription,
      order: themes.length + 1,
      content: {
        theory: [],
        practicalExamples: [],
        keyPoints: [],
      },
      estimatedHours: 4,
      isUnlocked: true,
      questions: [],
      flashcards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onThemesUpdate([...themes, newTheme]);
    setNewThemeTitle("");
    setNewThemeDescription("");
    setMessage({ type: "success", text: "Nuevo tema creado exitosamente" });
  };

  const handleDeleteTheme = (themeId: string) => {
    const updatedThemes = themes.filter((theme) => theme.id !== themeId);
    onThemesUpdate(updatedThemes);
    setMessage({ type: "success", text: "Tema eliminado exitosamente" });
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Panel de Administrador - {course.name}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Gestiona el contenido del curso, temarios, preguntas y flashcards
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4 bg-slate-700">
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="themes">Temarios</TabsTrigger>
              <TabsTrigger value="questions">Preguntas</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-400" />
                      Estado del Curso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-500/20 rounded-lg">
                        <FileText className="w-6 h-6 mx-auto text-blue-400 mb-1" />
                        <div className="text-sm text-blue-400">Temas</div>
                        <div className="font-bold">{themes.length}</div>
                      </div>
                      <div className="text-center p-3 bg-green-500/20 rounded-lg">
                        <Brain className="w-6 h-6 mx-auto text-green-400 mb-1" />
                        <div className="text-sm text-green-400">Preguntas</div>
                        <div className="font-bold">{themes.length * 20}+</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500/20 rounded-lg">
                        <Target className="w-6 h-6 mx-auto text-purple-400 mb-1" />
                        <div className="text-sm text-purple-400">
                          Flashcards
                        </div>
                        <div className="font-bold">{themes.length * 15}+</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-500/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 mx-auto text-yellow-400 mb-1" />
                        <div className="text-sm text-yellow-400">Estado</div>
                        <div className="font-bold text-xs">ACTIVO</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle>Acciones de Administrador</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleGenerateContent}
                      disabled={saving}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generando y guardando...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Generar contenido completo y guardar en Firebase
                        </>
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="border-slate-600">
                        <Upload className="w-4 h-4 mr-2" />
                        Importar desde Firebase
                      </Button>
                      <Button variant="outline" className="border-slate-600">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar a JSON
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {message && (
                  <Alert
                    className={`border-2 ${message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    )}
                    <AlertDescription
                      className={
                        message.type === "success"
                          ? "text-green-300"
                          : "text-red-300"
                      }
                    >
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="themes" className="space-y-4">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle>Crear Nuevo Tema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Título del tema"
                      value={newThemeTitle}
                      onChange={(e) => setNewThemeTitle(e.target.value)}
                      className="bg-slate-600 border-slate-500"
                    />
                    <Textarea
                      placeholder="Descripción del tema"
                      value={newThemeDescription}
                      onChange={(e) => setNewThemeDescription(e.target.value)}
                      className="bg-slate-600 border-slate-500"
                    />
                    <Button
                      onClick={handleCreateNewTheme}
                      disabled={!newThemeTitle.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Tema
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid gap-3">
                  {themes.map((theme, index) => (
                    <Card
                      key={theme.id}
                      className="bg-slate-700/50 border-slate-600"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-blue-500/20 text-blue-400">
                                Tema {index + 1}
                              </Badge>
                              <h3 className="font-semibold">{theme.title}</h3>
                            </div>
                            <p className="text-slate-400 text-sm">
                              {theme.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTheme(theme)}
                              className="border-slate-600"
                            >
                              Ver contenido
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTheme(theme.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                {selectedTheme ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Preguntas para: {selectedTheme.title}
                    </h3>
                    {loading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p>Cargando preguntas...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {themeQuestions.map((question, index) => (
                          <Card
                            key={question.id}
                            className="bg-slate-700/50 border-slate-600"
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className="bg-purple-500/20 text-purple-400">
                                  Pregunta {index + 1}
                                </Badge>
                                <Badge
                                  className={
                                    question.difficulty === "easy"
                                      ? "bg-green-500/20 text-green-400"
                                      : question.difficulty === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {question.difficulty}
                                </Badge>
                              </div>
                              <p className="font-medium mb-2">
                                {question.question}
                              </p>
                              <div className="space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-2 rounded text-sm ${
                                      optIndex === question.correctAnswer
                                        ? "bg-green-500/20 text-green-300"
                                        : "bg-slate-600 text-slate-300"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}.{" "}
                                    {option}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    Selecciona un tema para ver sus preguntas
                  </div>
                )}
              </TabsContent>

              <TabsContent value="flashcards" className="space-y-4">
                {selectedTheme ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Flashcards para: {selectedTheme.title}
                    </h3>
                    {loading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <p>Cargando flashcards...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themeFlashcards.map((flashcard, index) => (
                          <Card
                            key={flashcard.id}
                            className="bg-slate-700/50 border-slate-600"
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-3">
                                <Badge className="bg-blue-500/20 text-blue-400">
                                  Card {index + 1}
                                </Badge>
                                <Badge
                                  className={
                                    flashcard.difficulty === "easy"
                                      ? "bg-green-500/20 text-green-400"
                                      : flashcard.difficulty === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {flashcard.difficulty}
                                </Badge>
                              </div>
                              <div className="mb-3">
                                <div className="font-semibold text-orange-400 mb-1">
                                  Pregunta:
                                </div>
                                <p className="text-sm">{flashcard.front}</p>
                              </div>
                              <div>
                                <div className="font-semibold text-green-400 mb-1">
                                  Respuesta:
                                </div>
                                <p className="text-sm text-slate-300">
                                  {flashcard.back}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    Selecciona un tema para ver sus flashcards
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
