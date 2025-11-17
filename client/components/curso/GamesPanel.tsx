import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Shuffle, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Lightbulb,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface MatchingPair {
  concept: string;
  definition: string;
}

interface TriviaQuestion {
  category: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

interface GameData {
  quickQuiz?: {
    title: string;
    questions: QuickQuizQuestion[];
  };
  matching?: {
    title: string;
    pairs: MatchingPair[];
  };
  trivia?: {
    title: string;
    questions: TriviaQuestion[];
  };
  wordSearch?: {
    grid: string[][];
    words: string[];
    solution: Array<{ word: string; positions: Array<{ row: number; col: number }> }>;
  };
}

interface Props {
  assistantId: string;
  themeId?: string | null;
}

export default function GamesPanel({ assistantId, themeId }: Props) {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [activeGame, setActiveGame] = useState<"quiz" | "matching" | "trivia" | "wordsearch">("quiz");
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  // Matching state
  const [selectedConcept, setSelectedConcept] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [shuffledDefinitions, setShuffledDefinitions] = useState<number[]>([]);

  // Trivia state
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [showTriviaAnswer, setShowTriviaAnswer] = useState(false);
  const [triviaScore, setTriviaScore] = useState(0);

  useEffect(() => {
    if (!assistantId || !themeId) {
      setGameData(null);
      return;
    }

    const gameRef = doc(db, "assistants", assistantId, "syllabus", themeId, "games", "bundle");
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as GameData;
        setGameData(data);
        
        // Initialize matching game shuffle
        if (data.matching?.pairs) {
          const indices = data.matching.pairs.map((_, i) => i);
          setShuffledDefinitions(indices.sort(() => Math.random() - 0.5));
        }
        
        // Initialize answered questions array
        if (data.quickQuiz?.questions) {
          setAnsweredQuestions(new Array(data.quickQuiz.questions.length).fill(false));
        }
      } else {
        setGameData(null);
      }
    });

    return () => unsubscribe();
  }, [assistantId, themeId]);

  const handleQuizAnswer = (answerIndex: number) => {
    if (showExplanation || !gameData?.quickQuiz) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const currentQuestion = gameData.quickQuiz.questions[currentQuestionIndex];
    const newAnswered = [...answeredQuestions];
    
    if (!newAnswered[currentQuestionIndex]) {
      newAnswered[currentQuestionIndex] = true;
      setAnsweredQuestions(newAnswered);
      
      if (answerIndex === currentQuestion.correctIndex) {
        setQuizScore(quizScore + 1);
      }
    }
  };

  const nextQuestion = () => {
    if (!gameData?.quickQuiz) return;
    
    if (currentQuestionIndex < gameData.quickQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setAnsweredQuestions(new Array(gameData?.quickQuiz?.questions.length || 0).fill(false));
  };

  const handleMatchingClick = (type: "concept" | "definition", index: number) => {
    if (!gameData?.matching) return;
    
    if (type === "concept") {
      setSelectedConcept(index);
    } else if (selectedConcept !== null) {
      // Check if match is correct
      const correctIndex = shuffledDefinitions[index];
      if (selectedConcept === correctIndex) {
        setMatchedPairs(new Set([...matchedPairs, selectedConcept]));
      }
      setSelectedConcept(null);
    }
  };

  const resetMatching = () => {
    setMatchedPairs(new Set());
    setSelectedConcept(null);
    if (gameData?.matching?.pairs) {
      const indices = gameData.matching.pairs.map((_, i) => i);
      setShuffledDefinitions(indices.sort(() => Math.random() - 0.5));
    }
  };

  if (!themeId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Selecciona un tema para ver los juegos disponibles</p>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">
          <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No hay juegos disponibles para este tema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeGame === "quiz" ? "default" : "outline"}
          onClick={() => setActiveGame("quiz")}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Quiz Rápido
        </Button>
        <Button
          variant={activeGame === "matching" ? "default" : "outline"}
          onClick={() => setActiveGame("matching")}
          className="flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Emparejar
        </Button>
        <Button
          variant={activeGame === "trivia" ? "default" : "outline"}
          onClick={() => setActiveGame("trivia")}
          className="flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Trivial
        </Button>
        <Button
          variant={activeGame === "wordsearch" ? "default" : "outline"}
          onClick={() => setActiveGame("wordsearch")}
          className="flex items-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" />
          Sopa de Letras
        </Button>
      </div>

      {/* Quiz Game */}
      {activeGame === "quiz" && gameData.quickQuiz && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                {gameData.quickQuiz.title}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {quizScore}/{answeredQuestions.filter(a => a).length}
                </Badge>
                <Button size="sm" variant="ghost" onClick={resetQuiz}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress 
              value={(currentQuestionIndex / gameData.quickQuiz.questions.length) * 100} 
              className="h-2"
            />
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Badge className="mt-1">
                  {currentQuestionIndex + 1}/{gameData.quickQuiz.questions.length}
                </Badge>
                <p className="text-lg font-medium">
                  {gameData.quickQuiz.questions[currentQuestionIndex]?.question}
                </p>
              </div>

              <div className="grid gap-2">
                {gameData.quickQuiz.questions[currentQuestionIndex]?.options.map((option, index) => {
                  const isCorrect = index === gameData.quickQuiz!.questions[currentQuestionIndex].correctIndex;
                  const isSelected = selectedAnswer === index;
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "justify-start text-left h-auto py-3 px-4 whitespace-normal",
                        showExplanation && isCorrect && "bg-green-50 border-green-500 text-green-900",
                        showExplanation && isSelected && !isCorrect && "bg-red-50 border-red-500 text-red-900",
                        !showExplanation && "hover:bg-blue-50"
                      )}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={showExplanation}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {showExplanation && isCorrect && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                        {showExplanation && isSelected && !isCorrect && <XCircle className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1">{option}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {showExplanation && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-900">
                    {gameData.quickQuiz.questions[currentQuestionIndex]?.explanation}
                  </AlertDescription>
                </Alert>
              )}

              {showExplanation && currentQuestionIndex < gameData.quickQuiz.questions.length - 1 && (
                <Button onClick={nextQuestion} className="w-full">
                  Siguiente Pregunta
                </Button>
              )}

              {currentQuestionIndex === gameData.quickQuiz.questions.length - 1 && showExplanation && (
                <Alert>
                  <Trophy className="w-4 h-4" />
                  <AlertDescription>
                    <strong>¡Quiz completado!</strong> Puntuación final: {quizScore}/{gameData.quickQuiz.questions.length}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matching Game */}
      {activeGame === "matching" && gameData.matching && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-purple-500" />
                {gameData.matching.title}
              </CardTitle>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {matchedPairs.size}/{gameData.matching.pairs.length}
                </Badge>
                <Button size="sm" variant="ghost" onClick={resetMatching}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={(matchedPairs.size / gameData.matching.pairs.length) * 100}
              className="h-2 mb-6"
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Concepts Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Conceptos</h3>
                {gameData.matching.pairs.map((pair, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-4 text-left whitespace-normal",
                      selectedConcept === index && "bg-blue-100 border-blue-500",
                      matchedPairs.has(index) && "bg-green-50 border-green-500 opacity-60"
                    )}
                    onClick={() => handleMatchingClick("concept", index)}
                    disabled={matchedPairs.has(index)}
                  >
                    {matchedPairs.has(index) && <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />}
                    {pair.concept}
                  </Button>
                ))}
              </div>

              {/* Definitions Column */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Definiciones</h3>
                {shuffledDefinitions.map((originalIndex, shuffledIndex) => (
                  <Button
                    key={shuffledIndex}
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-auto py-3 px-4 text-left whitespace-normal",
                      matchedPairs.has(originalIndex) && "bg-green-50 border-green-500 opacity-60"
                    )}
                    onClick={() => handleMatchingClick("definition", shuffledIndex)}
                    disabled={matchedPairs.has(originalIndex) || selectedConcept === null}
                  >
                    {matchedPairs.has(originalIndex) && <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />}
                    {gameData.matching!.pairs[originalIndex].definition}
                  </Button>
                ))}
              </div>
            </div>

            {matchedPairs.size === gameData.matching.pairs.length && (
              <Alert className="mt-6 bg-green-50 border-green-200">
                <Trophy className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  <strong>¡Excelente!</strong> Has emparejado todos los conceptos correctamente.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Trivia Game */}
      {activeGame === "trivia" && gameData.trivia && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              {gameData.trivia.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge>{gameData.trivia.questions[currentTriviaIndex]?.category}</Badge>
                <Badge variant="outline">
                  {currentTriviaIndex + 1}/{gameData.trivia.questions.length}
                </Badge>
              </div>

              <p className="text-lg font-medium">
                {gameData.trivia.questions[currentTriviaIndex]?.question}
              </p>

              {!showTriviaAnswer ? (
                <Button onClick={() => setShowTriviaAnswer(true)} className="w-full">
                  Mostrar Respuesta
                </Button>
              ) : (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-900 font-medium">
                    {gameData.trivia.questions[currentTriviaIndex]?.answer}
                  </AlertDescription>
                </Alert>
              )}

              {showTriviaAnswer && currentTriviaIndex < gameData.trivia.questions.length - 1 && (
                <Button
                  onClick={() => {
                    setCurrentTriviaIndex(currentTriviaIndex + 1);
                    setShowTriviaAnswer(false);
                  }}
                  className="w-full"
                >
                  Siguiente Pregunta
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Word Search Game */}
      {activeGame === "wordsearch" && gameData.wordSearch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-500" />
              Sopa de Letras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Palabras a encontrar:</h3>
              <div className="flex flex-wrap gap-2">
                {gameData.wordSearch.words.map((word, index) => (
                  <Badge key={index} variant="outline">{word}</Badge>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block bg-slate-50 p-4 rounded-lg font-mono text-xs">
                {gameData.wordSearch.grid.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className="w-6 h-6 flex items-center justify-center border border-slate-300 bg-white hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
