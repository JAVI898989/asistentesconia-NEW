import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateProfessionalTemarioHtml } from "@/lib/professionalTemarioGenerator";
import { saveTemarioTopic, updateTemarioMetadata } from "@/lib/temarioFirestore";
import { generateTestsFromHtml, saveTests, generateFlashcardsFromHtml, saveFlashcards, generateGamesFromHtml, saveGames } from "@/lib/temarioPipeline";
import { broadcastTemarioUpdate } from "@/lib/extensiveTemarioGenerator";
import { cn } from "@/lib/utils";
import { CheckCircle2, PauseCircle, PlayCircle, RefreshCw, XCircle, AlertTriangle, Key } from "lucide-react";
import { useUserApiKey } from "@/hooks/useUserApiKey";

interface AssistantInfo {
  id: string;
  name: string;
  slug?: string;
}

type TopicState = "pending" | "generating" | "success" | "error";

interface TopicStatus {
  state: TopicState;
  message?: string;
  topicId?: string;
  version?: number;
  wordCount?: number;
}

interface TemarioGeneratorTabProps {
  assistant: AssistantInfo;
}

const DEFAULT_TOPICS = `Tema 1 - La Constitución Española de 1978
Tema 2 - Derechos fundamentales y libertades públicas
Tema 3 - La organización territorial del Estado
Tema 4 - La Unión Europea y su impacto en ${"${asistente}"}
Tema 5 - Estatuto del personal de ${"${asistente}"}
Tema 6 - Procedimientos administrativos esenciales
Tema 7 - Régimen disciplinario y responsabilidad profesional
Tema 8 - Coordinación interinstitucional y cooperación europea
Tema 9 - Gestión operativa y planificación estratégica
Tema 10 - Innovación, tecnología y análisis de datos aplicados`;

const REQUIRED_CLASSES = [
  "temario-header",
  "temario-objetivos",
  "temario-section",
  "temario-ejemplos",
  "temario-datos-clave",
  "temario-resumen",
  "temario-aplicacion",
  "temario-esquemas",
];

export function TemarioGeneratorTab({ assistant }: TemarioGeneratorTabProps) {
  const { apiKey, hasKey, isLoading: isLoadingKey } = useUserApiKey();
  const [topicsText, setTopicsText] = useState<string>(() => DEFAULT_TOPICS.replaceAll("${asistente}", assistant.name));
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, TopicStatus>>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number | null>(null);

  const indicesQueueRef = useRef<number[]>([]);
  const isPausedRef = useRef(false);

  const topics = useMemo(() =>
    topicsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
    [topicsText]
  );

  useEffect(() => {
    setStatuses((prev) => {
      const next: Record<string, TopicStatus> = {};
      topics.forEach((topic) => {
        next[topic] = prev[topic] || { state: "pending" };
      });
      return next;
    });
    if (topics.length > 0) {
      setSelectedTopic(topics[0]);
    } else {
      setSelectedTopic(null);
    }
  }, [topics]);

  const appendLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString("es-ES");
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`].slice(-200));
  }, []);

  const waitWhilePaused = useCallback(async () => {
    while (isPausedRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }, []);

  const validateTemario = useCallback((html: string, wordCount: number) => {
    const missingBlocks = REQUIRED_CLASSES.filter((className) => !new RegExp(`class=\\\"[^\\\"]*${className}`).test(html));
    if (missingBlocks.length > 0) {
      throw new Error(`Faltan bloques obligatorios: ${missingBlocks.join(", ")}`);
    }
    if (wordCount < 2500) {
      throw new Error(`Contenido insuficiente (${wordCount} palabras). Se requieren al menos 2500.`);
    }
  }, []);

  const updateTopicStatus = useCallback((topic: string, updates: Partial<TopicStatus>) => {
    setStatuses((prev) => ({
      ...prev,
      [topic]: {
        ...(prev[topic] || { state: "pending" }),
        ...updates,
      },
    }));
  }, []);

  const runGeneration = useCallback(async (indices: number[]) => {
    if (indices.length === 0) return;
    indicesQueueRef.current = indices;
    setIsGenerating(true);
    setIsPaused(false);
    isPausedRef.current = false;
    setProgress(0);

    let processed = 0;

    for (let queueIndex = 0; queueIndex < indicesQueueRef.current.length; queueIndex++) {
      await waitWhilePaused();

      const topicIndex = indicesQueueRef.current[queueIndex];
      setCurrentTopicIndex(topicIndex);
      const topicTitle = topics[topicIndex];
      if (!topicTitle) continue;

      appendLog(`📘 Generando temario: ${topicTitle}`);
      updateTopicStatus(topicTitle, { state: "generating", message: undefined });

      try {
        const { html, wordCount } = await generateProfessionalTemarioHtml(assistant.name, topicTitle, { minWords: 2600 }, apiKey || undefined);
        validateTemario(html, wordCount);

        const { topicId, version } = await saveTemarioTopic({
          assistantId: assistant.id,
          topicTitle,
          html,
          wordCount,
        });
        appendLog(`💾 Temario guardado como ${topicId} (v${version}) con ${wordCount} palabras.`);

        const questions = generateTestsFromHtml(topicTitle, html);
        if (questions.length < 20) {
          throw new Error(`Se generaron solo ${questions.length} preguntas de test.`);
        }
        appendLog(`🧪 Generando tests (${questions.length} preguntas base)...`);
        const testsCreated = await saveTests({
          assistantId: assistant.id,
          themeId: topicId,
          themeName: topicTitle,
          questions,
        });
        if (testsCreated !== 5) {
          throw new Error(`Se generaron ${testsCreated} tests (se requieren 5).`);
        }

        const cards = generateFlashcardsFromHtml(topicTitle, html);
        if (cards.length < 10) {
          throw new Error(`Se generaron solo ${cards.length} flashcards.`);
        }
        appendLog(`🃏 Generando ${cards.length} flashcards...`);
        const flashcardsCreated = await saveFlashcards({
          assistantId: assistant.id,
          themeId: topicId,
          themeName: topicTitle,
          cards,
        });
        if (flashcardsCreated !== 15) {
          throw new Error(`Se generaron ${flashcardsCreated} flashcards (se requieren 15).`);
        }

        appendLog("🎮 Generando juegos educativos con GPT-5 Mini...");
        const games = await generateGamesFromHtml(topicTitle, html, assistant.name, apiKey || undefined);
        const gamesCreated = await saveGames({
          assistantId: assistant.id,
          themeId: topicId,
          themeName: topicTitle,
          games,
        });
        appendLog(`✅ ${gamesCreated} tipos de juegos generados correctamente.`);

        await updateTemarioMetadata({
          assistantId: assistant.id,
          topicId,
          data: {
            status: "published",
            testsCount: testsCreated,
            flashcardsCount: flashcardsCreated,
            gamesCount: gamesCreated,
          },
        });

        broadcastTemarioUpdate(assistant.id, assistant.slug || assistant.id, topicTitle);

        updateTopicStatus(topicTitle, {
          state: "success",
          topicId,
          version,
          wordCount,
          message: `Material guardado (v${version}): ${wordCount} palabras · ${testsCreated} tests · ${flashcardsCreated} flashcards · ${gamesCreated} juegos`,
        });
        appendLog(`✅ ${topicTitle} listo. Se almacenaron temario, ${testsCreated} tests, ${flashcardsCreated} flashcards y juegos.`);
      } catch (error: any) {
        updateTopicStatus(topicTitle, {
          state: "error",
          message: error?.message || "Error desconocido",
        });
        appendLog(`❌ ${topicTitle} falló: ${error?.message || error}`);
      }

      processed += 1;
      setProgress((processed / indicesQueueRef.current.length) * 100);
    }

    setCurrentTopicIndex(null);
    setIsGenerating(false);
    setIsPaused(false);
    isPausedRef.current = false;
    appendLog(`🏁 Generación finalizada (${processed}/${indices.length}).`);
  }, [appendLog, assistant.id, assistant.name, assistant.slug, topics, updateTopicStatus, validateTemario, waitWhilePaused]);

  const handleGenerateAll = useCallback(() => {
    if (topics.length === 0) return;
    const indices = topics.map((_, idx) => idx);
    runGeneration(indices);
  }, [runGeneration, topics]);

  const handleGenerateSingle = useCallback(() => {
    if (!selectedTopic) return;
    const index = topics.indexOf(selectedTopic);
    if (index === -1) return;
    runGeneration([index]);
  }, [runGeneration, selectedTopic, topics]);

  const handlePause = useCallback(() => {
    if (!isGenerating) return;
    setIsPaused(true);
    isPausedRef.current = true;
    appendLog("⏸️ Generación pausada");
  }, [appendLog, isGenerating]);

  const handleResume = useCallback(() => {
    if (!isGenerating) return;
    setIsPaused(false);
    isPausedRef.current = false;
    appendLog("▶️ Reanudando generación");
  }, [appendLog, isGenerating]);

  const handleResetStatuses = useCallback(() => {
    setStatuses((prev) => {
      const next: Record<string, TopicStatus> = {};
      Object.keys(prev).forEach((topic) => {
        next[topic] = { state: "pending" };
      });
      return next;
    });
    setProgress(0);
    setLogs([]);
    appendLog("♻️ Estados reiniciados");
  }, [appendLog]);

  const pendingTopics = useMemo(() => Object.entries(statuses).filter(([_, status]) => status.state === "pending"), [statuses]);
  const hasPending = pendingTopics.length > 0;

  return (
    <div className="space-y-6">
      {/* API Key Status Alert */}
      {!hasKey && !isLoadingKey && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-500">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>⚠️ API Key no configurada</strong>
            <p className="mt-1">
              Necesitas configurar tu API key de OpenAI para generar contenido.
              Ve a la pestaña "Configuración" para añadir tu clave.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {hasKey && (
        <Alert className="bg-green-900/20 border-green-500">
          <Key className="w-4 h-4 text-green-400" />
          <AlertDescription className="text-green-200">
            <strong>✅ API Key configurada</strong> - Todos los consumos se cargarán a tu cuenta de OpenAI.
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-slate-700 bg-slate-800/70">
        <CardHeader>
          <CardTitle className="text-white text-lg">Configuración de temas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topics" className="text-slate-300">Lista de temas (uno por línea)</Label>
              <Textarea
                id="topics"
                value={topicsText}
                onChange={(event) => setTopicsText(event.target.value)}
                className="min-h-[260px] bg-slate-900 border-slate-700 text-slate-100"
                disabled={isGenerating}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTopicsText(DEFAULT_TOPICS.replaceAll("${asistente}", assistant.name))}
                  disabled={isGenerating}
                  className="border-indigo-400 text-indigo-300"
                >
                  Cargar ejemplo Guardia Civil
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTopicsText("")}
                  disabled={isGenerating}
                  className="border-slate-500 text-slate-300"
                >
                  Limpiar lista
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Tema seleccionado</Label>
                <Select value={selectedTopic ?? ""} onValueChange={(value) => setSelectedTopic(value)} disabled={topics.length === 0 || isGenerating}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerateAll}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={topics.length === 0 || isGenerating || !hasKey}
                  title={!hasKey ? "Configura tu API key primero" : ""}
                >
                  Generar todos los temas
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGenerateSingle}
                  disabled={!selectedTopic || isGenerating || !hasKey}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  title={!hasKey ? "Configura tu API key primero" : ""}
                >
                  Generar tema seleccionado
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {isGenerating ? (
                  isPaused ? (
                    <Button variant="outline" onClick={handleResume} className="text-emerald-300 border-emerald-400">
                      <PlayCircle className="w-4 h-4 mr-2" /> Reanudar
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handlePause} className="text-amber-300 border-amber-400">
                      <PauseCircle className="w-4 h-4 mr-2" /> Pausar
                    </Button>
                  )
                ) : (
                  <Button variant="outline" onClick={handleResetStatuses} className="text-slate-300 border-slate-500">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reiniciar estados
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Progreso</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center justify-between">
              Estado de temas
              <Badge variant="outline" className="border-slate-500 text-slate-300">
                {topics.length} temas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[360px]">
              <div className="divide-y divide-slate-700/70">
                {topics.map((topic, index) => {
                  const status = statuses[topic]?.state ?? "pending";
                  const message = statuses[topic]?.message;
                  const isActive = index === currentTopicIndex;
                  return (
                    <div
                      key={topic}
                      className={cn(
                        "px-4 py-3 flex flex-col gap-1 text-sm",
                        status === "success" && "bg-emerald-500/10",
                        status === "error" && "bg-red-500/10",
                        isActive && "border-l-4 border-emerald-400"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-100 font-medium">{topic}</span>
                        <div className="flex items-center gap-2">
                          {status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {status === "generating" && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />}
                          {status === "error" && <XCircle className="w-4 h-4 text-red-400" />}
                          {status === "pending" && hasPending && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => runGeneration([index])}
                              disabled={isGenerating}
                              className="text-indigo-300 hover:text-indigo-100"
                            >
                              Generar
                            </Button>
                          )}
                          {status !== "generating" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => runGeneration([index])}
                              disabled={isGenerating}
                              className="text-slate-300 hover:text-slate-100"
                            >
                              Regenerar
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {message ||
                          (status === "pending"
                            ? "Pendiente de generar"
                            : status === "generating"
                              ? "Generando contenido académico..."
                              : status === "success"
                                ? "Generado correctamente"
                                : "Error al generar")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/70">
          <CardHeader>
            <CardTitle className="text-white text-lg">Log de generación</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[360px] text-xs font-mono text-slate-300 bg-slate-900/60 rounded-md border border-slate-700 p-3">
              {logs.length === 0 ? (
                <p className="text-slate-500">Aún no hay eventos registrados.</p>
              ) : (
                <ul className="space-y-1">
                  {logs.map((entry, index) => (
                    <li key={`${entry}-${index}`}>{entry}</li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
