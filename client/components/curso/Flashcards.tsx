import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  RotateCcw,
  Shuffle,
  CheckCircle,
  XCircle,
  Lock,
  ArrowLeft,
  ArrowRight,
  Brain,
  Target,
  Trophy,
} from "lucide-react";
import {
  ProfessionalCourse,
  CourseTheme,
  FlashCard,
  getThemeFlashcards,
} from "@/lib/firebaseData";

interface FlashcardsProps {
  course: ProfessionalCourse;
  themes: CourseTheme[];
  hasAccess: boolean;
  onProgressUpdate: (themeId: string, completed: number) => void;
}

interface StudySession {
  themeId: string;
  cards: FlashCard[];
  currentIndex: number;
  isFlipped: boolean;
  correctCards: Set<string>;
  incorrectCards: Set<string>;
  studiedCards: Set<string>;
  isShuffled: boolean;
}

export default function Flashcards({
  course,
  themes,
  hasAccess,
  onProgressUpdate,
}: FlashcardsProps) {
  const [selectedTheme, setSelectedTheme] = useState<CourseTheme | null>(null);
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(false);

  const startStudySession = async (theme: CourseTheme) => {
    if (!hasAccess) return;

    setLoading(true);
    try {
      let cards = await getThemeFlashcards(theme.id);

      // If no cards from API, generate demo cards
      if (cards.length === 0) {
        cards = generateDemoFlashcardsForTheme(theme);
      }

      setStudySession({
        themeId: theme.id,
        cards,
        currentIndex: 0,
        isFlipped: false,
        correctCards: new Set(),
        incorrectCards: new Set(),
        studiedCards: new Set(),
        isShuffled: false,
      });

      setSelectedTheme(theme);
    } catch (error) {
      console.error("Error starting flashcards session:", error);
    }
    setLoading(false);
  };

  const generateDemoFlashcardsForTheme = (theme: CourseTheme): FlashCard[] => {
    const cards: FlashCard[] = [];

    const concepts = [
      "Fundamentos básicos",
      "Conceptos clave",
      "Metodología principal",
      "Técnicas esenciales",
      "Principios fundamentales",
      "Aplicaciones prácticas",
      "Herramientas específicas",
      "Mejores prácticas",
      "Casos de uso comunes",
      "Procedimientos estándar",
      "Criterios de calidad",
      "Indicadores de éxito",
      "Factores críticos",
      "Elementos distintivos",
      "Características principales",
      "Aspectos relevantes",
      "Componentes esenciales",
      "Variables importantes",
      "Parámetros clave",
      "Resultados esperados",
    ];

    concepts.forEach((concept, index) => {
      cards.push({
        id: `${theme.id}-card-${index + 1}`,
        themeId: theme.id,
        front: `¿Qué son ${concept.toLowerCase()} en ${theme.title}?`,
        back: `${concept} en ${theme.title} se refieren a los elementos fundamentales que definen y caracterizan este área de conocimiento, incluyendo sus aplicaciones prácticas, metodologías específicas y criterios de implementación en entornos profesionales reales.`,
        difficulty: index < 7 ? "easy" : index < 14 ? "medium" : "hard",
        tags: ["concepto", "fundamentos", theme.title.toLowerCase()],
      });
    });

    return cards;
  };

  const flipCard = () => {
    if (!studySession) return;

    setStudySession((prev) => ({
      ...prev!,
      isFlipped: !prev!.isFlipped,
    }));
  };

  const markCard = (isCorrect: boolean) => {
    if (!studySession) return;

    const currentCard = studySession.cards[studySession.currentIndex];
    const newStudied = new Set(studySession.studiedCards).add(currentCard.id);

    setStudySession((prev) => ({
      ...prev!,
      correctCards: isCorrect
        ? new Set(prev!.correctCards).add(currentCard.id)
        : prev!.correctCards,
      incorrectCards: !isCorrect
        ? new Set(prev!.incorrectCards).add(currentCard.id)
        : prev!.incorrectCards,
      studiedCards: newStudied,
      isFlipped: false,
    }));

    // Update progress
    onProgressUpdate(studySession.themeId, newStudied.size);

    // Auto advance to next card
    setTimeout(() => {
      nextCard();
    }, 500);
  };

  const nextCard = () => {
    if (!studySession) return;

    const nextIndex =
      (studySession.currentIndex + 1) % studySession.cards.length;
    setStudySession((prev) => ({
      ...prev!,
      currentIndex: nextIndex,
      isFlipped: false,
    }));
  };

  const previousCard = () => {
    if (!studySession) return;

    const prevIndex =
      studySession.currentIndex === 0
        ? studySession.cards.length - 1
        : studySession.currentIndex - 1;

    setStudySession((prev) => ({
      ...prev!,
      currentIndex: prevIndex,
      isFlipped: false,
    }));
  };

  const shuffleCards = () => {
    if (!studySession) return;

    const shuffledCards = [...studySession.cards].sort(
      () => Math.random() - 0.5,
    );
    setStudySession((prev) => ({
      ...prev!,
      cards: shuffledCards,
      currentIndex: 0,
      isFlipped: false,
      isShuffled: true,
    }));
  };

  const resetSession = () => {
    setStudySession(null);
    setSelectedTheme(null);
  };

  const getProgressPercentage = () => {
    if (!studySession) return 0;
    return Math.round(
      (studySession.studiedCards.size / studySession.cards.length) * 100,
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <CardTitle className="text-slate-300">
              Flashcards Restringidas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-400 mb-4">
              Las flashcards están disponibles solo para usuarios con acceso al
              curso.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>15+ tarjetas por tema</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span>Estudio interactivo</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Seguimiento de progreso</span>
              </div>
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4" />
                <span>Modo aleatorio</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Study session active
  if (studySession) {
    const currentCard = studySession.cards[studySession.currentIndex];
    const progress = getProgressPercentage();

    return (
      <div className="space-y-6">
        {/* Session Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {selectedTheme?.title}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {studySession.currentIndex + 1}/{studySession.cards.length}
                </Badge>
                <Button onClick={shuffleCards} size="sm" variant="outline">
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button onClick={resetSession} size="sm" variant="outline">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progreso</span>
                <span className="text-blue-400">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Flashcard */}
        <Card className="bg-slate-800/50 border-slate-700 min-h-96">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <Badge className={getDifficultyColor(currentCard.difficulty)}>
                {currentCard.difficulty === "easy"
                  ? "Fácil"
                  : currentCard.difficulty === "medium"
                    ? "Medio"
                    : "Difícil"}
              </Badge>
            </div>

            <div
              className="min-h-64 flex items-center justify-center cursor-pointer group"
              onClick={flipCard}
            >
              <div className="text-center p-8 max-w-2xl">
                {!studySession.isFlipped ? (
                  <div>
                    <div className="text-2xl font-semibold text-white mb-4">
                      {currentCard.front}
                    </div>
                    <p className="text-slate-400 text-sm">
                      Haz clic para ver la respuesta
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg text-slate-300 leading-relaxed">
                      {currentCard.back}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button onClick={previousCard} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {studySession.isFlipped && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => markCard(false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Difícil
                  </Button>
                  <Button
                    onClick={() => markCard(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Fácil
                  </Button>
                </div>
              )}

              <Button onClick={nextCard} variant="outline">
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="mt-4 text-center">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-green-400">
                  ✓ Fáciles: {studySession.correctCards.size}
                </div>
                <div className="text-blue-400">
                  📚 Estudiadas: {studySession.studiedCards.size}
                </div>
                <div className="text-red-400">
                  ✗ Difíciles: {studySession.incorrectCards.size}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Complete */}
        {progress === 100 && (
          <Card className="border-2 border-green-500 bg-green-500/10">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-white text-2xl">
                ¡Sesión Completada!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">
                Has estudiado todas las flashcards de este tema.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetSession} variant="outline">
                  Volver a temas
                </Button>
                <Button
                  onClick={() => startStudySession(selectedTheme!)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Estudiar de nuevo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Theme selection
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Flashcards por Tema
          </CardTitle>
          <p className="text-slate-400">
            Estudia y memoriza conceptos clave con nuestras tarjetas de estudio
            interactivas.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {themes.map((theme) => {
          const completed = theme.flashcardsCompleted || 0;
          const total = 20; // Default number of flashcards per theme

          return (
            <Card
              key={theme.id}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">
                        {theme.title}
                      </h3>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {completed}/{total}
                      </Badge>
                      {completed === total && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      {theme.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Progreso de estudio</span>
                        <span>{Math.round((completed / total) * 100)}%</span>
                      </div>
                      <Progress
                        value={(completed / total) * 100}
                        className="h-1"
                      />
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {total} tarjetas
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Estudio activo
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Memorización
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      onClick={() => startStudySession(theme)}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {completed > 0 ? "Continuar" : "Comenzar"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
