import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import {
  ProfessionalCourse,
  CourseTheme,
  TestQuestion,
  getThemeQuestions,
  saveTestResult,
} from "@/lib/firebaseData";
import { auth } from "@/lib/firebase";

interface TestPorTemaProps {
  course: ProfessionalCourse;
  themes: CourseTheme[];
  hasAccess: boolean;
  onScoreUpdate: (themeId: string, score: number) => void;
}

interface TestSession {
  themeId: string;
  questions: TestQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  isCompleted: boolean;
  score: number;
}

export default function TestPorTema({
  course,
  themes,
  hasAccess,
  onScoreUpdate,
}: TestPorTemaProps) {
  const [selectedTheme, setSelectedTheme] = useState<CourseTheme | null>(null);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer effect
  useEffect(() => {
    if (testSession && !testSession.isCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testSession && !testSession.isCompleted) {
      // Time's up - auto submit
      handleFinishTest();
    }
  }, [timeLeft, testSession]);

  const startTest = async (theme: CourseTheme) => {
    if (!hasAccess) return;

    setLoading(true);
    try {
      const questions = await getThemeQuestions(theme.id);

      if (questions.length === 0) {
        // Use demo questions if no real ones available
        const demoQuestions = generateDemoQuestionsForTheme(theme);
        setTestSession({
          themeId: theme.id,
          questions: demoQuestions,
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 30 * 60, // 30 minutes
          isCompleted: false,
          score: 0,
        });
      } else {
        // Randomly select 20 questions
        const selectedQuestions = questions
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setTestSession({
          themeId: theme.id,
          questions: selectedQuestions,
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 30 * 60, // 30 minutes
          isCompleted: false,
          score: 0,
        });
      }

      setTimeLeft(30 * 60);
      setSelectedTheme(theme);
    } catch (error) {
      console.error("Error starting test:", error);
    }
    setLoading(false);
  };

  const generateDemoQuestionsForTheme = (
    theme: CourseTheme,
  ): TestQuestion[] => {
    const questions: TestQuestion[] = [];

    for (let i = 1; i <= 25; i++) {
      questions.push({
        id: `${theme.id}-q${i}`,
        themeId: theme.id,
        question: `${theme.title} - Pregunta ${i}: ¿Cuál de las siguientes opciones describe mejor los conceptos fundamentales de este tema?`,
        options: [
          `Opción A: Conceptos básicos y aplicaciones prácticas`,
          `Opción B: Teoría avanzada y metodologías especializadas`,
          `Opción C: Técnicas innovadoras y tendencias actuales`,
          `Opción D: Fundamentos teóricos y casos de estudio`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `Esta respuesta es correcta porque refleja los principios fundamentales establecidos en ${theme.title}, proporcionando una base sólida para la comprensión del tema.`,
        difficulty: i <= 8 ? "easy" : i <= 16 ? "medium" : "hard",
        points: 1,
      });
    }

    return questions.slice(0, 20); // Return 20 questions
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (!testSession) return;

    setTestSession((prev) => ({
      ...prev!,
      answers: {
        ...prev!.answers,
        [questionId]: answerIndex,
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
    if (!testSession || !auth.currentUser) return;

    // Calculate score
    let correctAnswers = 0;
    testSession.questions.forEach((question) => {
      const userAnswer = testSession.answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round(
      (correctAnswers / testSession.questions.length) * 10,
    );

    // Save result
    try {
      await saveTestResult(
        auth.currentUser.uid,
        course.id,
        testSession.themeId,
        score,
        testSession.answers,
      );

      onScoreUpdate(testSession.themeId, score);
    } catch (error) {
      console.error("Error saving test result:", error);
    }

    setTestSession((prev) => ({
      ...prev!,
      isCompleted: true,
      score,
    }));

    setShowResults(true);
  };

  const resetTest = () => {
    setTestSession(null);
    setShowResults(false);
    setSelectedTheme(null);
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
      <div className="space-y-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
            <CardTitle className="text-slate-300">Tests Restringidos</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-400 mb-4">
              Los tests por tema están disponibles solo para usuarios con acceso
              al curso.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <FileQuestion className="w-4 h-4" />
                <span>20+ preguntas por tema</span>
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
                <span>Puntuación 0-10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Test in progress
  if (testSession && !showResults) {
    const currentQuestion =
      testSession.questions[testSession.currentQuestionIndex];
    const progress =
      ((testSession.currentQuestionIndex + 1) / testSession.questions.length) *
      100;
    const answeredQuestions = Object.keys(testSession.answers).length;

    return (
      <div className="space-y-6">
        {/* Test Header */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5" />
                Test: {selectedTheme?.title}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {testSession.currentQuestionIndex + 1}/
                  {testSession.questions.length}
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
            <Progress value={progress} className="h-2" />
          </CardHeader>
        </Card>

        {/* Current Question */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              {currentQuestion.question}
            </CardTitle>
            <Badge className="w-fit bg-purple-500/20 text-purple-400">
              {currentQuestion.difficulty === "easy"
                ? "Fácil"
                : currentQuestion.difficulty === "medium"
                  ? "Medio"
                  : "Difícil"}
            </Badge>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={testSession.answers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) =>
                handleAnswerSelect(currentQuestion.id, parseInt(value))
              }
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-slate-300 cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">
              Navegación de preguntas ({answeredQuestions}/
              {testSession.questions.length} respondidas)
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
                    testSession.answers[testSession.questions[index].id] !==
                    undefined
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
                  goToQuestion(
                    Math.max(0, testSession.currentQuestionIndex - 1),
                  )
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
                  testSession.currentQuestionIndex ===
                  testSession.questions.length - 1
                }
                variant="outline"
              >
                Siguiente
              </Button>
              <Button
                onClick={handleFinishTest}
                className="ml-auto bg-green-600 hover:bg-green-700"
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
      (q) => testSession.answers[q.id] === q.correctAnswer,
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
              {isPassed ? "¡Felicidades!" : "Intenta de nuevo"}
            </CardTitle>
            <div
              className={`text-3xl font-bold ${getScoreColor(testSession.score)}`}
            >
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
                  {Math.round(
                    (correctAnswers / testSession.questions.length) * 100,
                  )}
                  %
                </div>
                <div className="text-sm text-slate-400">Acierto</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${isPassed ? "text-green-400" : "text-red-400"}`}
                >
                  {isPassed ? "APROBADO" : "SUSPENSO"}
                </div>
                <div className="text-sm text-slate-400">Resultado</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={resetTest} variant="outline">
                Volver a tests
              </Button>
              <Button
                onClick={() => startTest(selectedTheme!)}
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

  // Theme selection
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            Tests por Tema
          </CardTitle>
          <p className="text-slate-400">
            Pon a prueba tus conocimientos con tests especializados de cada tema
            del curso.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {themes.map((theme) => {
          const hasScore = theme.testScore !== undefined;
          const isPassed = theme.testScore && theme.testScore >= 8;

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
                      {hasScore && (
                        <Badge className={getScoreBadgeColor(theme.testScore!)}>
                          {theme.testScore}/10
                        </Badge>
                      )}
                      {isPassed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-3">
                      {theme.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileQuestion className="w-3 h-3" />
                        20+ preguntas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        30 minutos
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Nota mínima: 8/10
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      onClick={() => startTest(theme)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {hasScore ? "Repetir" : "Comenzar"}
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
