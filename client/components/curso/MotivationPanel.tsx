import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Heart, Sparkles, Sunrise, ThumbsUp, Trophy } from "lucide-react";
import { useAssistantProgress } from "@/hooks/useAssistantProgress";

interface MotivationPanelProps {
  assistantId: string;
  userId?: string | null;
}

const DEFAULT_MESSAGES = [
  "Cada día es una oportunidad para avanzar un poco más. ¡Confía en ti!",
  "Los grandes logros se construyen con constancia. ¡Sigue adelante!",
  "Tu esfuerzo de hoy es el éxito de mañana. ¡No te detengas!",
  "Ya estás más cerca de tu objetivo que cuando empezaste. ¡Ánimo!",
  "Convertirte en la mejor versión de ti depende de lo que hagas hoy. ¡A por ello!",
];

export default function MotivationPanel({ assistantId, userId }: MotivationPanelProps) {
  const { progress, loading } = useAssistantProgress(assistantId, userId ?? null);
  const [quote, setQuote] = useState<string>(DEFAULT_MESSAGES[0]);

  useEffect(() => {
    if (!progress) {
      return;
    }
    const totalInteractions =
      (progress?.totalTopicVisits ?? 0) +
      (progress?.totalTestsTaken ?? 0) * 3 +
      (progress?.totalFlashcardsReviewed ?? 0) * 0.5 +
      (progress?.totalGamesPlayed ?? 0) * 2;

    const bucket = Math.min(DEFAULT_MESSAGES.length - 1, Math.floor(totalInteractions / 10));
    setQuote(DEFAULT_MESSAGES[bucket]);
  }, [progress]);

  const achievements = useMemo(() => {
    if (!progress) {
      return [];
    }

    const themeChampions = Object.entries(progress.topicStats || {})
      .map(([topicId, stats]) => ({
        topicId,
        title: stats.title ?? `Tema ${topicId}`,
        score:
          (stats.visits ?? 0) * 2 +
          (stats.testsTaken ?? 0) * 5 +
          (stats.flashcardsReviewed ?? 0) * 0.5 +
          (stats.gamesPlayed ?? 0) * 3,
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const badges = [] as { id: string; label: string; description: string; icon: React.ComponentType<any> }[];

    if ((progress.totalTopicVisits ?? 0) >= 10) {
      badges.push({
        id: "topic-explorer",
        label: "Explorador del Temario",
        description: "Has revisado 10 secciones o más",
        icon: Flame,
      });
    }

    if ((progress.totalTestsTaken ?? 0) >= 5) {
      badges.push({
        id: "test-hero",
        label: "Héroe de los Tests",
        description: "Has completado al menos 5 tests",
        icon: Trophy,
      });
    }

    if ((progress.totalFlashcardsReviewed ?? 0) >= 30) {
      badges.push({
        id: "flashcard-fan",
        label: "Amante de las Flashcards",
        description: "Has estudiado 30 flashcards o más",
        icon: Sparkles,
      });
    }

    if ((progress.totalGamesPlayed ?? 0) >= 3) {
      badges.push({
        id: "game-master",
        label: "Maestro de Juegos",
        description: "Has practicado con varios juegos interactivos",
        icon: Sunrise,
      });
    }

    return { themeChampions, badges };
  }, [progress]);

  if (!userId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Motivación diaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            Inicia sesión para guardar tu progreso y recibir mensajes motivadores personalizados.
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
            <Heart className="w-5 h-5 text-rose-500" />
            Motivación diaria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Cargando tu motivación personalizada...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-rose-500 to-purple-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Heart className="w-6 h-6" />
            Un mensaje para ti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">{quote}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Tus logros recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(progress.totalTopicVisits ?? 0) +
          (progress.totalTestsTaken ?? 0) +
          (progress.totalFlashcardsReviewed ?? 0) +
          (progress.totalGamesPlayed ?? 0) === 0 ? (
            <p className="text-sm text-slate-500">
              Aún no hay registros para mostrar. ¡Empieza a estudiar y desbloquea logros motivadores!
            </p>
          ) : (
            <div className="grid gap-3">
              {(progress.totalTopicVisits ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <ThumbsUp className="w-5 h-5 text-blue-500" />
                  <div className="text-sm text-slate-700">
                    Has revisado <strong>{progress.totalTopicVisits}</strong> secciones del temario recientemente.
                  </div>
                </div>
              )}
              {(progress.totalTestsTaken ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <div className="text-sm text-slate-700">
                    Completaste <strong>{progress.totalTestsTaken}</strong> tests para seguir mejorando.
                  </div>
                </div>
              )}
              {(progress.totalFlashcardsReviewed ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <div className="text-sm text-slate-700">
                    Repasaste <strong>{progress.totalFlashcardsReviewed}</strong> flashcards.
                  </div>
                </div>
              )}
              {(progress.totalGamesPlayed ?? 0) > 0 && (
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-red-500" />
                  <div className="text-sm text-slate-700">
                    Practicaste con <strong>{progress.totalGamesPlayed}</strong> juegos.
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {achievements.themeChampions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              Tus temas destacados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.themeChampions.map((champion) => (
              <div key={champion.topicId} className="flex items-center gap-3 p-3 rounded border border-emerald-200 bg-emerald-50">
                <Badge variant="outline" className="border-emerald-400 text-emerald-600">
                  {champion.score.toFixed(0)} pts
                </Badge>
                <div className="text-sm text-emerald-800">
                  <strong>{champion.title}</strong>: gran ritmo de estudio
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {achievements.badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Insignias desbloqueadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="flex items-center gap-3 p-3 border border-violet-200 rounded-lg bg-violet-50">
                    <div className="p-2 rounded-full bg-white text-violet-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-violet-700">{badge.label}</div>
                      <div className="text-sm text-violet-600">{badge.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
