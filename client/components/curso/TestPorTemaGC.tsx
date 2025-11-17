import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileQuestion,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Target,
  RotateCcw,
  Play,
  Award,
  Lock,
  BookOpen,
  Star,
  AlertTriangle,
  RefreshCw,
  Shuffle,
} from "lucide-react";
import {
  useGuardiaCivilSyllabus,
  useGuardiaCivilTests,
  useGuardiaCivilAllTests
} from "@/hooks/useGuardiaCivilSyllabus";
import { type TestQuestion } from "@/lib/guardiaCivilPerfectGenerator";
import BlurredPreview from "@/components/BlurredPreview";

interface TestPorTemaGCProps {
  assistantId: string;
  hasAccess: boolean;
  onScoreUpdate?: (topicSlug: string, score: number) => void;
}

interface TestSession {
  topicSlug: string;
  topicTitle: string;
  questions: TestQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  isCompleted: boolean;
  score: number;
  isAllTopics: boolean;
}

export default function TestPorTemaGC({
  assistantId,
  hasAccess,
  onScoreUpdate,
}: TestPorTemaGCProps) {
  const { syllabi, loading: syllabusLoading } = useGuardiaCivilSyllabus(assistantId);
  const { allTests, loading: allTestsLoading } = useGuardiaCivilAllTests(assistantId);

  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>("all");
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Get tests for selected topic
  const { tests: topicTests, loading: topicTestsLoading } = useGuardiaCivilTests(
    assistantId,
    selectedTopicSlug === "all" ? null : selectedTopicSlug
  );

  // Timer effect
  useEffect(() => {
    if (testSession && !testSession.isCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testSession && !testSession.isCompleted) {
      handleFinishTest();
    }
  }, [timeLeft, testSession]);

  const startTest = async (topicSlug: string = "all") => {
    if (!hasAccess) return;

    setLoading(true);
    try {
      let questions: TestQuestion[] = [];
      let topicTitle = "";

      if (topicSlug === "all") {
        // All topics test - mix questions from all topics
        questions = allTests.map(test => ({
          id: test.id,
          stem: `[${test.topicTitle}] ${test.stem}`,
          options: test.options,
          answer: test.answer,
          rationale: test.rationale,
          difficulty: test.difficulty
        }));

        // Shuffle and take 20 questions
        questions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
        topicTitle = "Examen Global - Todos los Temas";
      } else {
        // Single topic test
        questions = topicTests;
        const topic = syllabi.find(s => s.slug === topicSlug);
        topicTitle = topic?.title || "Tema no encontrado";

        // Shuffle and take up to 20 questions
        questions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
      }

      if (questions.length === 0) {
        console.warn("No questions available for test");
        return;
      }

      setTestSession({
        topicSlug,
        topicTitle,
        questions,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: 30 * 60, // 30 minutes
        isCompleted: false,
        score: 0,
        isAllTopics: topicSlug === "all"
      });

      setTimeLeft(30 * 60);
      setShowResults(false);

    } catch (error) {
      console.error("Error starting test:", error);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (!testSession) return;

    setTestSession((prev) => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: answer,
      },
    }));
  };

  const goToQuestion = (index: number) => {
    if (!testSession) return;

    setTestSession((prev) => ({
      ...prev!,
      currentQuestionIndex: index,
    }));
  };

  const handleFinishTest = async () => {
    if (!testSession) return;

    // Calculate score
    let correctAnswers = 0;
    testSession.questions.forEach((question) => {
      const userAnswer = testSession.answers[question.id];
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    });

    const score = testSession.questions.length > 0
      ? Math.round((correctAnswers / testSession.questions.length) * 10)
      : 0;

    setTestSession((prev) => ({
      ...prev!,
      isCompleted: true,
      score,
    }));

    // Update score if single topic
    if (!testSession.isAllTopics) {
      onScoreUpdate?.(testSession.topicSlug, score);
    }

    setShowResults(true);
  };

  const resetTest = () => {
    setTestSession(null);
    setShowResults(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 6)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  if (!hasAccess) {
    return (
      <BlurredPreview
        isLocked={true}
        title="Tests Restringidos"
        description="Los tests de Guardia Civil están disponibles solo para usuarios con acceso al curso"
      >
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-slate-400" />
              </div>
              <CardTitle className="text-slate-300">Tests de Guardia Civil</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-400 mb-4">
                Accede a tests profesionales con exactamente 20 preguntas por tema
                y explicaciones detalladas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  <span>20 preguntas por tema</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>30 minutos por test</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Corrección automática</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Explicaciones detalladas</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </BlurredPreview>
    );
  }

  if (syllabusLoading || allTestsLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-400" />
            <p className="text-slate-400">Cargando tests de Guardia Civil...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test in progress
  if (testSession && !showResults) {
    const currentQuestion = testSession.questions[testSession.currentQuestionIndex];
    const progress = testSession.questions.length > 0
      ? ((testSession.currentQuestionIndex + 1) / testSession.questions.length) * 100
      : 0;
    const answeredQuestions = Object.keys(testSession.answers).length;

    return (
      <div className="space-y-6">
        {/* Test Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                {testSession.topicTitle}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {testSession.currentQuestionIndex + 1}/{testSession.questions.length}
                </Badge>
                <Badge
                  className={
                    timeLeft < 300
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-600 text-slate-300"
                  }
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </div>
            <Progress value={isNaN(progress) ? 0 : progress} className="h-2" />
          </CardHeader>
        </Card>

        {/* Current Question */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {currentQuestion.stem}
            </CardTitle>
            {currentQuestion.difficulty && (
              <Badge className="w-fit bg-purple-500/20 text-purple-400">
                {currentQuestion.difficulty === "easy"
                  ? "Fácil"
                  : currentQuestion.difficulty === "medium"
                    ? "Medio"
                    : "Difícil"}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={testSession.answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <RadioGroupItem
                      value={optionLetter}
                      id={`option-${index}`}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-slate-300 cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Navegación ({answeredQuestions}/{testSession.questions.length} respondidas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2 mb-4">
              {testSession.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    testSession.currentQuestionIndex === index
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    testSession.answers[testSession.questions[index].id]
                      ? "bg-green-600 hover:bg-green-700 border-green-500"
                      : "border-slate-600"
                  }`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() =>
                  goToQuestion(Math.max(0, testSession.currentQuestionIndex - 1))
                }
                disabled={testSession.currentQuestionIndex === 0}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() =>
                  goToQuestion(
                    Math.min(
                      testSession.questions.length - 1,
                      testSession.currentQuestionIndex + 1,
                    ),
                  )
                }
                disabled={
                  testSession.currentQuestionIndex === testSession.questions.length - 1
                }
                variant="outline"
              >
                Siguiente
              </Button>
              <Button
                onClick={handleFinishTest}
                className="ml-auto bg-green-600 hover:bg-green-700"
                disabled={answeredQuestions === 0}
              >
                Finalizar Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test results
  if (showResults && testSession) {
    const correctAnswers = testSession.questions.filter(
      (q) => testSession.answers[q.id] === q.answer,
    ).length;
    const isPassed = testSession.score >= 8;

    return (
      <div className="space-y-6">
        <Card
          className={`border-2 ${isPassed ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}
        >
          <CardHeader className="text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isPassed ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              {isPassed ? (
                <Trophy className="w-8 h-8 text-green-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-400" />
              )}
            </div>
            <CardTitle className="text-white text-2xl">
              {isPassed ? "¡Excelente!" : "Sigue practicando"}
            </CardTitle>
            <div className={`text-3xl font-bold ${getScoreColor(testSession.score)}`}>
              {testSession.score}/10
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {correctAnswers}
                </div>
                <div className="text-sm text-slate-400">Correctas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {testSession.questions.length - correctAnswers}
                </div>
                <div className="text-sm text-slate-400">Incorrectas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {testSession.questions.length > 0
                    ? Math.round((correctAnswers / testSession.questions.length) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-slate-400">Acierto</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${isPassed ? "text-green-400" : "text-red-400"}`}
                >
                  {isPassed ? "APTO" : "NO APTO"}
                </div>
                <div className="text-sm text-slate-400">Resultado</div>
              </div>
            </div>

            {/* Review wrong answers */}
            {testSession.questions.some(q => testSession.answers[q.id] !== q.answer) && (
              <div className="mb-6 text-left">
                <h3 className="text-white font-semibold mb-3">Revisar respuestas incorrectas:</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testSession.questions
                    .filter(q => testSession.answers[q.id] !== q.answer)
                    .slice(0, 5) // Show max 5 for brevity
                    .map((question, index) => (
                      <div key={question.id} className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                        <p className="text-white text-sm font-medium mb-2">
                          {question.stem}
                        </p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div className="text-red-400">
                            Tu respuesta: {testSession.answers[question.id] || 'No respondida'}
                          </div>
                          <div className="text-green-400">
                            Respuesta correcta: {question.answer}
                          </div>
                          {question.rationale && (
                            <div className="text-slate-400 mt-1">
                              {question.rationale}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={resetTest} variant="outline">
                Volver a tests
              </Button>
              <Button
                onClick={() => startTest(testSession.topicSlug)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Repetir test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Topic selection
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            Tests de Guardia Civil
          </CardTitle>
          <p className="text-slate-400">
            Tests profesionales con exactamente 20 preguntas por tema,
            generados automáticamente con quality gates.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
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
                    📝 Examen Global - Todos los Temas ({allTests.length} preguntas)
                  </SelectItem>
                  {syllabi.map((topic) => (
                    <SelectItem key={topic.slug} value={topic.slug} className="text-white">
                      {topic.order}. {topic.title} ({topic.testsCount} tests)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => startTest(selectedTopicSlug)}
                disabled={loading || topicTestsLoading}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? "Preparando..." : "Comenzar Test"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Estadísticas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {syllabi?.filter(s => s.status === 'published').length || 0}
              </div>
              <div className="text-sm text-slate-400">Temas disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {syllabi?.reduce((sum, s) => sum + (s.testsCount || 0), 0) || 0}
              </div>
              <div className="text-sm text-slate-400">Tests totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {allTests?.length || 0}
              </div>
              <div className="text-sm text-slate-400">Preguntas disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                20
              </div>
              <div className="text-sm text-slate-400">Preguntas por test</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
