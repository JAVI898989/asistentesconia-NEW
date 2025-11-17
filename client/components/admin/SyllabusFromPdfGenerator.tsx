import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Pause, Play, Upload, XCircle } from "lucide-react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSyllabus, generateSyllabusContent } from "@/lib/syllabusService";

interface Props {
  assistantId: string;
  assistantName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskState {
  running: boolean;
  paused: boolean;
  current: number;
  total: number;
  currentTitle: string;
  log: string[];
  error: string | null;
  uploadedPdfUrl: string | null;
  uploadedPath: string | null;
}

export default function SyllabusFromPdfGenerator({ assistantId, assistantName, isOpen, onClose }: Props) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [titleOrList, setTitleOrList] = useState("");
  const [valid, setValid] = useState(false);
  const [task, setTask] = useState<TaskState>({
    running: false,
    paused: false,
    current: 0,
    total: 0,
    currentTitle: "",
    log: [],
    error: null,
    uploadedPdfUrl: null,
    uploadedPath: null,
  });
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number>(0);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  useEffect(() => {
    setValid(!!pdfFile && titleOrList.trim().length > 0);
  }, [pdfFile, titleOrList]);

  const topics = useMemo(() => {
    const lines = titleOrList
      .split(/\r?\n/) // split by lines
      .map(l => l.trim())
      .filter(Boolean);

    // If only one line, treat as a single topic title
    if (lines.length <= 1) {
      return lines.length === 1 ? [{ order: 1, title: lines[0] }] : [];
    }

    // Parse lines like "Tema 1: Título" or "1. Título" or plain titles
    let order = 1;
    return lines.map((line) => {
      const m = line.match(/^(?:tema\s+)?(\d+)[\.:\-\s]+(.+)$/i);
      if (m) {
        const n = parseInt(m[1], 10);
        return { order: isNaN(n) ? order++ : n, title: m[2].trim() };
      }
      return { order: order++, title: line };
    });
  }, [titleOrList]);

  const resetAll = () => {
    setPdfFile(null);
    setTitleOrList("");
    setTask({ running: false, paused: false, current: 0, total: 0, currentTitle: "", log: [], error: null, uploadedPdfUrl: null, uploadedPath: null });
    abortRef.current.aborted = false;
  };

  const appendLog = (msg: string) => {
    setTask(prev => ({ ...prev, log: [...prev.log, msg] }));
  };

  const uploadReferencePdf = async (file: File): Promise<{ url: string | null; path: string | null; failed?: boolean; reason?: string }> => {
    const storage = getStorage();
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `assistants/${assistantId}/temario/${safeName}`;
    const storageRef = ref(storage, path);
    const metadata = { contentType: "application/pdf", customMetadata: { assistantId, uploadedAt: new Date().toISOString(), originalName: file.name } } as const;

    const uploadWithRetry = async (): Promise<string> => {
      const MAX_RETRIES = 3;
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          setPdfUploadProgress(0);
          appendLog(`⬆️ Subiendo PDF (intento ${attempt + 1}/${MAX_RETRIES})...`);
          const task = uploadBytesResumable(storageRef, file, metadata);
          const url = await new Promise<string>((resolve, reject) => {
            const timeoutMs = (120 + attempt * 60) * 1000; // 120s, 180s, 240s
            const timeoutId = setTimeout(() => reject(new Error('Upload timeout')), timeoutMs);

            task.on('state_changed', (snap) => {
              if (snap.totalBytes > 0) {
                const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setPdfUploadProgress(pct);
              }
            }, (err) => {
              clearTimeout(timeoutId);
              reject(err);
            }, async () => {
              clearTimeout(timeoutId);
              try {
                const downloadUrl = await getDownloadURL(task.snapshot.ref);
                resolve(downloadUrl);
              } catch (e) {
                reject(e);
              }
            });
          });
          return url;
        } catch (err: any) {
          const last = attempt === MAX_RETRIES - 1;
          const code = err?.code || err?.message || String(err);
          appendLog(`⚠️ Reintento subida PDF (${attempt + 1}/${MAX_RETRIES}) - ${code}`);
          if (last) throw err;
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
        }
      }
      throw new Error('Unknown upload error');
    };

    try {
      const url = await uploadWithRetry();
      await addDoc(collection(db, "assistants", assistantId, "references"), {
        type: "pdf",
        url,
        storagePath: path,
        fileName: file.name,
        size: file.size,
        uploadedAt: serverTimestamp(),
        uploadedAtMs: Date.now(),
        assistantId,
        assistantName,
        uploadFailed: false,
      });
      return { url, path };
    } catch (error: any) {
      // Soft-fail: record metadata and allow generation to continue
      await addDoc(collection(db, "assistants", assistantId, "references"), {
        type: "pdf",
        url: null,
        storagePath: null,
        fileName: file.name,
        size: file.size,
        uploadedAt: serverTimestamp(),
        uploadedAtMs: Date.now(),
        assistantId,
        assistantName,
        uploadFailed: true,
        lastError: error?.message || String(error),
      });
      return { url: null, path: null, failed: true, reason: error?.message || String(error) };
    }
  };

  const startGeneration = async () => {
    if (!pdfFile || topics.length === 0) return;

    setTask(prev => ({ ...prev, running: true, paused: false, error: null, current: 0, total: topics.length }));
    appendLog(`⬆️ Subiendo PDF de referencia...`);

    const aggregatedTemas: { order: number; title: string; contenido: string }[] = [];
    const contents: string[] = [];

    try {
      const uploaded = await uploadReferencePdf(pdfFile);
      setTask(prev => ({ ...prev, uploadedPdfUrl: uploaded.url || null, uploadedPath: uploaded.path || null }));
      if (uploaded.failed) {
        appendLog(`❌ Error subiendo PDF: ${uploaded.reason}`);
        appendLog(`➡️ Continuando la generación del temario sin PDF (podrás reintentar la subida después).`);
        // Do not mark as fatal error; continue
      } else {
        appendLog(`✅ PDF subido correctamente`);
      }
    } catch (e: any) {
      // Should not happen now, but keep a safety net
      appendLog(`❌ Error crítico subiendo PDF: ${e?.message || e}`);
      appendLog(`➡️ Continuando la generación del temario sin PDF.`);
    }

    // Sequentially generate each topic content
    for (let i = 0; i < topics.length; i++) {
      if (abortRef.current.aborted) break;

      // Pause handling
      // eslint-disable-next-line no-await-in-loop
      while (task.paused) {
        // Small wait to avoid blocking UI
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 300));
        if (!isOpen) return; // dialog closed
      }

      const { order, title } = topics[i];
      setTask(prev => ({ ...prev, current: i + 1, currentTitle: title }));
      appendLog(`🧠 Generando contenido: ${title}`);

      try {
        // Use the existing backend OpenAI route via service wrapper
        const content = await generateSyllabusContent({
          assistantId,
          title,
          contextBase: `Genera contenido completo basado en el temario "${title}" para el asistente ${assistantName}. El contenido debe ser académico y extenso. Usa el PDF de referencia subido como inspiración para el estilo y estructura general, sin copiarlo literalmente.`,
          order,
        });

        // Save syllabus document (collection assistant_syllabus)
        // eslint-disable-next-line no-await-in-loop
        await createSyllabus({
          assistantId,
          title,
          contentMarkdown: content,
          order,
          titulo: title,
          contenido: content,
          resumen: "",
          claves: [],
          orden: order,
        });

        // Aggregate for main temario document
        aggregatedTemas.push({ order, title, contenido: content });
        contents.push(`## ${title}\n\n${content}`);

        appendLog(`✅ Tema creado: ${title}`);
      } catch (e: any) {
        appendLog(`❌ Error en tema "${title}": ${e?.message || e}`);
        setTask(prev => ({ ...prev, error: e?.message || String(e) }));
        // Continue with next topics
      }

      // Small delay to keep UI responsive
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r => setTimeout(r, 200));
    }

    // After all topics, save aggregated temario to assistants/{assistantId}/temario/main
    try {
      const combined = contents.join("\n\n");
      const mainRef = doc(db, "assistants", assistantId, "temario", "main");
      await setDoc(mainRef, {
        contenido: combined,
        temas: aggregatedTemas,
        createdAt: serverTimestamp(),
      }, { merge: true });
      appendLog("✅ Temario generado y guardado correctamente");

      // Notify other tabs/views to refresh temario
      try {
        const channel = new BroadcastChannel('temario_updates');
        channel.postMessage({ type: 'TEMARIO_UPDATED', assistantId });
        channel.close();
      } catch {}
    } catch (e: any) {
      appendLog(`⚠️ No se pudo guardar el temario principal: ${e?.message || e}`);
    }

    appendLog("🎉 Generación completada");
  };

  const handlePauseResume = () => {
    setTask(prev => ({ ...prev, paused: !prev.paused }));
  };

  const handleClose = () => {
    abortRef.current.aborted = true;
    onClose();
    setTimeout(resetAll, 200);
  };

  const disableStart = !valid || task.running;
  const progressPct = task.total > 0 ? Math.round((task.current / task.total) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Generar Temario desde PDF - {assistantName}
          </DialogTitle>
          <DialogDescription>
            Sube un PDF de ejemplo y proporciona el título general o una lista de temas. Se generará el temario completo automáticamente y se guardará en este asistente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Archivo PDF de referencia</Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPdfFile(file);
              }}
            />
            {pdfFile && (
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-600" /> {pdfFile.name} • {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Título del temario o lista de temas (uno por línea)</Label>
            <Textarea
              placeholder="Ejemplos:\nTemario Auxiliar Administrativo\nTema 1: Organización del Estado\nTema 2: Procedimiento Administrativo\nTema 3: Archivo y Documentación\n..."
              value={titleOrList}
              onChange={(e) => setTitleOrList(e.target.value)}
              className="min-h-[140px]"
            />
          </div>

          {pdfUploadProgress > 0 && pdfUploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subiendo PDF...</span>
                <span>{pdfUploadProgress}%</span>
              </div>
              <Progress value={pdfUploadProgress} />
            </div>
          )}

          {task.running && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progreso: {task.current}/{task.total}</span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} />
              <div className="text-sm text-slate-600">{task.currentTitle ? `Trabajando en: ${task.currentTitle}` : "Preparando..."}</div>
              <div className="flex gap-2">
                <Button onClick={handlePauseResume} variant="outline">
                  {task.paused ? (<><Play className="w-4 h-4 mr-1" /> Reanudar</>) : (<><Pause className="w-4 h-4 mr-1" /> Pausar</>)}
                </Button>
              </div>
            </div>
          )}

          {task.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" /> {task.error}
              </AlertDescription>
            </Alert>
          )}

          {task.log.length > 0 && (
            <div className="bg-slate-50 border rounded p-2 max-h-48 overflow-y-auto text-xs font-mono">
              {task.log.slice(-20).map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>Cerrar</Button>
          <Button onClick={startGeneration} disabled={disableStart} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-2" /> Confirmar y Generar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
