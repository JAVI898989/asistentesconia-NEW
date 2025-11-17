import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  RefreshCw,
  Search,
  Filter,
  BookOpen,
} from "lucide-react";
import {
  useGuardiaCivilSyllabus,
  useGuardiaCivilFlashcards,
  useGuardiaCivilAllFlashcards
} from "@/hooks/useGuardiaCivilSyllabus";
import { type Flashcard } from "@/lib/guardiaCivilPerfectGenerator";
import BlurredPreview from "@/components/BlurredPreview";

interface FlashcardsGCProps {
  assistantId: string;
  hasAccess: boolean;
  onProgressUpdate?: (topicSlug: string, completed: number) => void;
}

interface StudySession {
  topicSlug: string;
  topicTitle: string;
  cards: Flashcard[];
  currentIndex: number;
  isFlipped: boolean;
  correctCards: Set<string>;
  incorrectCards: Set<string>;
  studiedCards: Set<string>;
  isShuffled: boolean;
  isAllTopics: boolean;
}

export default function FlashcardsGC({
  assistantId,
  hasAccess,
  onProgressUpdate,
}: FlashcardsGCProps) {
  const { syllabi, loading: syllabusLoading } = useGuardiaCivilSyllabus(assistantId);
  const { allFlashcards, loading: allFlashcardsLoading } = useGuardiaCivilAllFlashcards(assistantId);

  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>("all");
  const [studySession, setStudySession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");

  // Get flashcards for selected topic
  const { flashcards: topicFlashcards, loading: topicFlashcardsLoading } = useGuardiaCivilFlashcards(
    assistantId,
    selectedTopicSlug === "all" ? null : selectedTopicSlug
  );

  const startStudySession = async (topicSlug: string = "all") => {
    if (!hasAccess) return;

    setLoading(true);
    try {
      let cards: Flashcard[] = [];
      let topicTitle = "";

      if (topicSlug === "all") {
        // All topics - get all flashcards
        cards = allFlashcards;
        topicTitle = "Estudio Global - Todas las Flashcards";
      } else {
        // Single topic
        cards = topicFlashcards;
        const topic = syllabi.find(s => s.slug === topicSlug);
        topicTitle = topic?.title || "Tema no encontrado";
      }

      // Apply search filter if exists
      if (searchTerm) {
        cards = cards.filter(card =>
          card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.back.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply tag filter if exists
      if (filterTag !== "all") {
        cards = cards.filter(card =>
          card.tags.includes(filterTag)
        );
      }

      if (cards.length === 0) {
        console.warn("No flashcards available for study session");
        return;
      }

      setStudySession({
        topicSlug,
        topicTitle,
        cards,
        currentIndex: 0,
        isFlipped: false,
        correctCards: new Set(),
        incorrectCards: new Set(),
        studiedCards: new Set(),
        isShuffled: false,
        isAllTopics: topicSlug === "all"
      });

    } catch (error) {
      console.error("Error starting flashcards session:", error);
    }
    setLoading(false);
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

    // Update progress for single topic
    if (!studySession.isAllTopics) {
      onProgressUpdate?.(studySession.topicSlug, newStudied.size);
    }

    // Auto advance to next card
    setTimeout(() => {
      nextCard();
    }, 500);
  };

  const nextCard = () => {
    if (!studySession) return;

    const nextIndex = (studySession.currentIndex + 1) % studySession.cards.length;
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

    const shuffledCards = [...studySession.cards].sort(() => Math.random() - 0.5);
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
  };

  const getProgressPercentage = () => {
    if (!studySession || studySession.cards.length === 0) return 0;
    return Math.round((studySession.studiedCards.size / studySession.cards.length) * 100);
  };

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    allFlashcards.forEach(card => {
      card.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allFlashcards]);

  if (!hasAccess) {
    return (
      <BlurredPreview
        isLocked={true}
        title="Flashcards Restringidas"
        description="Las flashcards de Guardia Civil están disponibles solo para usuarios con acceso al curso"
      >
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <CardTitle className="text-slate-300">
                Flashcards de Guardia Civil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">
                Accede a flashcards profesionales con mínimo 45 tarjetas por tema
                y sistema de estudio adaptativo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>45+ tarjetas por tema</span>
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
      </BlurredPreview>
    );
  }

  if (syllabusLoading || allFlashcardsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-purple-400" />
            <p className="text-slate-400">Cargando flashcards de Guardia Civil...</p>
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
                {studySession.topicTitle}
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-400">
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
                <span className="text-purple-400">{progress}%</span>
              </div>
              <Progress value={isNaN(progress) ? 0 : progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Flashcard */}
        <Card className="bg-slate-800/50 border-slate-700 min-h-96">
          <CardContent className="pt-6">
            {/* Tags */}
            <div className="text-center mb-4">
              <div className="flex flex-wrap gap-1 justify-center">
                {currentCard.tags.map((tag, index) => (
                  <Badge key={index} className="bg-slate-600/50 text-slate-300 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
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
                <div className="text-purple-400">
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
                Has estudiado todas las flashcards de esta sesión.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetSession} variant="outline">
                  Volver a temas
                </Button>
                <Button
                  onClick={() => startStudySession(studySession.topicSlug)}
                  className="bg-purple-600 hover:bg-purple-700"
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

  // Topic/flashcard selection
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Flashcards de Guardia Civil
          </CardTitle>
          <p className="text-slate-400">
            Estudia y memoriza conceptos clave con flashcards generadas automáticamente.
            Cada tema incluye mínimo 45 tarjetas con quality gates.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Topic Selection */}
            <div>
              <label className="block text-white font-medium mb-2">
                Seleccionar tema:
              </label>
              <Select value={selectedTopicSlug} onValueChange={setSelectedTopicSlug}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecciona un tema" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">
                    🗂️ Todas las Flashcards ({allFlashcards.length} tarjetas)
                  </SelectItem>
                  {syllabi.map((topic) => (
                    <SelectItem key={topic.slug} value={topic.slug} className="text-white">
                      {topic.order}. {topic.title} ({topic.flashcardsCount || 0} tarjetas)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-white font-medium mb-2">
                Buscar contenido:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar en flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-white font-medium mb-2">
                Filtrar por etiqueta:
              </label>
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Todas las etiquetas" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all" className="text-white">
                    Todas las etiquetas
                  </SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag} className="text-white">
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => startStudySession(selectedTopicSlug)}
              disabled={loading || topicFlashcardsLoading}
              className="bg-purple-600 hover:bg-purple-700 w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {loading ? "Preparando..." : "Comenzar Estudio"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Estadísticas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {syllabi?.filter(s => s.status === 'published').length || 0}
              </div>
              <div className="text-sm text-slate-400">Temas disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {syllabi?.reduce((sum, s) => sum + (s.flashcardsCount || 0), 0) || 0}
              </div>
              <div className="text-sm text-slate-400">Flashcards totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {allFlashcards?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Disponibles ahora</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                45+
              </div>
              <div className="text-sm text-slate-400">Mínimo por tema</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Topics */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Temas Disponibles</h3>
        <div className="grid gap-4">
        {syllabi.map((topic) => {
            const completed = 0; // Would track progress if implemented
            const total = topic.flashcardsCount || 0;

            return (
              <Card
                key={topic.slug}
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{topic.title}</h4>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {total} tarjetas
                        </Badge>
                        {topic.status === 'published' && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3">{topic.summary}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
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
                        onClick={() => {
                          setSelectedTopicSlug(topic.slug);
                          startStudySession(topic.slug);
                        }}
                        disabled={loading || topic.status !== 'published'}
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
    </div>
  );
}
