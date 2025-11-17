import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Rocket, Target, TrendingUp, Trophy } from "lucide-react";
import { useAssistantProgress } from "@/hooks/useAssistantProgress";
import type { AssistantSyllabusTopic } from "@/hooks/useAssistantSyllabus";

interface ProgresoMotivacionProps {
  assistantId: string;
  userId?: string | null;
  selectedTopicId?: string | null;
  topics: AssistantSyllabusTopic[];
}

export default function ProgresoMotivacion({
  assistantId,
  userId,
  selectedTopicId,
  topics = [],
}: ProgresoMotivacionProps) {
  const { progress, loading } = useAssistantProgress(assistantId, userId ?? null);

  const stats = useMemo(() => {
    if (!progress) {
      return {
        totalVisits: 0,
        totalTests: 0,
        totalFlashcards: 0,
        totalGames: 0,
        overallScore: 0,
        topicDetail: null as null | { title: string; visits: number; tests: number; flashcards: number; games: number },
      };
    }

    const totalVisits = progress.totalTopicVisits ?? 0;
    const totalTests = progress.totalTestsTaken ?? 0;
    const totalFlashcards = progress.totalFlashcardsReviewed ?? 0;
    const totalGames = progress.totalGamesPlayed ?? 0;

    const overallScore = Math.min(
      100,
      totalVisits * 2 + totalTests * 10 + totalFlashcards * 0.5 + totalGames * 6
    );

    const topicId = selectedTopicId || progress.lastTopicId || progress.lastTestTopicId || undefined;
    let topicDetail = null as null | { title: string; visits: number; tests: number; flashcards: number; games: number };
    if (topicId) {
      const topicStats = progress.topicStats?.[topicId];
      if (topicStats) {
        const topicTitle = topicStats.title || topics.find((topic) => topic.topicId === topicId)?.title || "Tema seleccionado";
        topicDetail = {
          title: topicTitle,
          visits: topicStats.visits ?? 0,
          tests: topicStats.testsTaken ?? 0,
          flashcards: topicStats.flashcardsReviewed ?? 0,
          games: topicStats.gamesPlayed ?? 0,
        };
      }
    }

    return { totalVisits, totalTests, totalFlashcards, totalGames, overallScore, topicDetail };
  }, [progress, selectedTopicId, topics]);

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-500" />
            Progreso personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Inicia sesión para guardar tu progreso y ver estadísticas personalizadas de tu aprendizaje.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading || !progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-500" />
            Progreso personalizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Cargando tus estadísticas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Tu progreso global
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-emerald-300">{Math.round(stats.overallScore)}%</div>
            <Progress value={stats.overallScore} className="h-2 mt-2" />
            <p className="text-sm text-slate-400 mt-2">
              Seguimiento basado en el número de visitas, tests, flashcards y juegos completados.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-slate-800 border border-slate-700">
              <Badge variant="outline" className="bg-slate-900 border-slate-600 text-slate-200 mb-1">
                Temario
              </Badge>
              <div className="text-2xl font-semibold text-white">{stats.totalVisits}</div>
              <p className="text-xs text-slate-400">Secciones visitadas</p>
            </div>
            <div className="p-3 rounded bg-slate-800 border border-slate-700">
              <Badge variant="outline" className="bg-slate-900 border-slate-600 text-slate-200 mb-1">
                Tests
              </Badge>
              <div className="text-2xl font-semibold text-white">{stats.totalTests}</div>
              <p className="text-xs text-slate-400">Tests completados</p>
            </div>
            <div className="p-3 rounded bg-slate-800 border border-slate-700">
              <Badge variant="outline" className="bg-slate-900 border-slate-600 text-slate-200 mb-1">
                Flashcards
              </Badge>
              <div className="text-2xl font-semibold text-white">{stats.totalFlashcards}</div>
              <p className="text-xs text-slate-400">Tarjetas repasadas</p>
            </div>
            <div className="p-3 rounded bg-slate-800 border border-slate-700">
              <Badge variant="outline" className="bg-slate-900 border-slate-600 text-slate-200 mb-1">
                Juegos
              </Badge>
              <div className="text-2xl font-semibold text-white">{stats.totalGames}</div>
              <p className="text-xs text-slate-400">Actividades completadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats.topicDetail && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Target className="w-5 h-5 text-indigo-500" />
              Progreso en «{stats.topicDetail.title}»
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
              <div className="text-xs uppercase tracking-wider">Visitas</div>
              <div className="text-xl font-semibold">{stats.topicDetail.visits}</div>
            </div>
            <div className="p-3 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
              <div className="text-xs uppercase tracking-wider">Tests</div>
              <div className="text-xl font-semibold">{stats.topicDetail.tests}</div>
            </div>
            <div className="p-3 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
              <div className="text-xs uppercase tracking-wider">Flashcards</div>
              <div className="text-xl font-semibold">{stats.topicDetail.flashcards}</div>
            </div>
            <div className="p-3 rounded bg-indigo-50 border border-indigo-200 text-indigo-900">
              <div className="text-xs uppercase tracking-wider">Juegos</div>
              <div className="text-xl font-semibold">{stats.topicDetail.games}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Flame className="w-5 h-5 text-orange-500" />
            Sugerencias para avanzar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>
            <strong>1.</strong> Revisa un nuevo apartado del temario y realiza un test de refuerzo.
          </p>
          <p>
            <strong>2.</strong> Practica con flashcards durante 10 minutos para consolidar conceptos clave.
          </p>
          <p>
            <strong>3.</strong> Completa un juego educativo para reforzar de forma entretenida tus conocimientos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
