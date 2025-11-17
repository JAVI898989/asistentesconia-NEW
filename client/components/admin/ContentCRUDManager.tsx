import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  CreditCard, 
  Gamepad2,
  AlertCircle
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Props {
  assistantId: string;
  themeId: string;
  themeName: string;
}

interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function ContentCRUDManager({ assistantId, themeId, themeName }: Props) {
  const [activeTab, setActiveTab] = useState<"tests" | "flashcards" | "games">("tests");
  const [tests, setTests] = useState<TestQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialog, setEditDialog] = useState<{ type: string; data: any } | null>(null);

  // Load data
  useEffect(() => {
    loadTests();
    loadFlashcards();
  }, [assistantId, themeId]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const testsCollection = collection(db, "assistants", assistantId, "syllabus", themeId, "tests");
      const snapshot = await getDocs(testsCollection);
      
      const allQuestions: TestQuestion[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.questions && Array.isArray(data.questions)) {
          allQuestions.push(...data.questions);
        }
      });
      
      setTests(allQuestions);
    } catch (error) {
      console.error("Error loading tests:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFlashcards = async () => {
    setIsLoading(true);
    try {
      const flashcardsCollection = collection(db, "assistants", assistantId, "syllabus", themeId, "flashcards");
      const snapshot = await getDocs(flashcardsCollection);
      
      const allCards: Flashcard[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Flashcard));
      
      setFlashcards(allCards);
    } catch (error) {
      console.error("Error loading flashcards:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las flashcards",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTest = () => {
    setEditDialog({
      type: "test",
      data: {
        id: `test-${Date.now()}`,
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: ""
      }
    });
  };

  const handleEditTest = (test: TestQuestion) => {
    setEditDialog({
      type: "test",
      data: { ...test }
    });
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("¿Estás seguro de eliminar este test?")) return;
    
    try {
      // Re-save all tests except the deleted one
      const updatedTests = tests.filter(t => t.id !== testId);
      await saveAllTests(updatedTests);
      setTests(updatedTests);
      
      toast({
        title: "Test eliminado",
        description: "El test se eliminó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el test",
        variant: "destructive"
      });
    }
  };

  const handleSaveTest = async (test: TestQuestion) => {
    try {
      const existingIndex = tests.findIndex(t => t.id === test.id);
      let updatedTests: TestQuestion[];
      
      if (existingIndex >= 0) {
        updatedTests = [...tests];
        updatedTests[existingIndex] = test;
      } else {
        updatedTests = [...tests, test];
      }
      
      await saveAllTests(updatedTests);
      setTests(updatedTests);
      setEditDialog(null);
      
      toast({
        title: "Test guardado",
        description: "El test se guardó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el test",
        variant: "destructive"
      });
    }
  };

  const saveAllTests = async (allTests: TestQuestion[]) => {
    // Group tests into batches of 20 (5 tests × 20 questions each)
    const testsCollection = collection(db, "assistants", assistantId, "syllabus", themeId, "tests");
    
    // Clear existing tests
    const existing = await getDocs(testsCollection);
    await Promise.all(existing.docs.map(doc => deleteDoc(doc.ref)));
    
    // Save new tests
    const now = Date.now();
    const user = auth.currentUser;
    const testsPerBatch = 20;
    const numBatches = Math.ceil(allTests.length / testsPerBatch);
    
    for (let i = 0; i < numBatches; i++) {
      const batch = allTests.slice(i * testsPerBatch, (i + 1) * testsPerBatch);
      const testRef = doc(testsCollection, `test-${i + 1}`);
      
      await setDoc(testRef, {
        assistantId,
        themeId,
        themeName,
        testNumber: i + 1,
        questions: batch,
        createdAt: serverTimestamp(),
        createdAtMs: now + i,
        createdBy: user?.uid || null,
        type: "ai_test_v1"
      });
    }
  };

  const handleAddFlashcard = () => {
    setEditDialog({
      type: "flashcard",
      data: {
        id: `card-${Date.now()}`,
        front: "",
        back: ""
      }
    });
  };

  const handleEditFlashcard = (card: Flashcard) => {
    setEditDialog({
      type: "flashcard",
      data: { ...card }
    });
  };

  const handleDeleteFlashcard = async (cardId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta flashcard?")) return;
    
    try {
      const cardRef = doc(db, "assistants", assistantId, "syllabus", themeId, "flashcards", cardId);
      await deleteDoc(cardRef);
      
      setFlashcards(flashcards.filter(c => c.id !== cardId));
      
      toast({
        title: "Flashcard eliminada",
        description: "La flashcard se eliminó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la flashcard",
        variant: "destructive"
      });
    }
  };

  const handleSaveFlashcard = async (card: Flashcard) => {
    try {
      const now = Date.now();
      const user = auth.currentUser;
      const cardRef = doc(db, "assistants", assistantId, "syllabus", themeId, "flashcards", card.id);
      
      await setDoc(cardRef, {
        assistantId,
        themeId,
        themeName,
        front: card.front,
        back: card.back,
        createdAt: serverTimestamp(),
        createdAtMs: now,
        createdBy: user?.uid || null,
        type: "ai_flashcard_v1"
      });
      
      const existingIndex = flashcards.findIndex(c => c.id === card.id);
      if (existingIndex >= 0) {
        const updated = [...flashcards];
        updated[existingIndex] = card;
        setFlashcards(updated);
      } else {
        setFlashcards([...flashcards, card]);
      }
      
      setEditDialog(null);
      
      toast({
        title: "Flashcard guardada",
        description: "La flashcard se guardó correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la flashcard",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gestión de Contenido: {themeName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tests ({tests.length})
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Flashcards ({flashcards.length})
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Juegos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Total: {tests.length} preguntas
              </p>
              <Button onClick={handleAddTest} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Test
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {tests.map((test, index) => (
                  <Card key={test.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <Badge className="mb-2">#{index + 1}</Badge>
                        <p className="font-medium mb-2">{test.question}</p>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          {test.options.map((opt, i) => (
                            <div
                              key={i}
                              className={i === test.correctIndex ? "text-green-600 font-medium" : ""}
                            >
                              {i === test.correctIndex && "✓ "}{opt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTest(test)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTest(test.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Total: {flashcards.length} tarjetas
              </p>
              <Button onClick={handleAddFlashcard} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Añadir Flashcard
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              <div className="grid md:grid-cols-2 gap-4">
                {flashcards.map((card) => (
                  <Card key={card.id} className="p-4">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Pregunta</Label>
                        <p className="font-medium">{card.front}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Respuesta</Label>
                        <p className="text-sm">{card.back}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditFlashcard(card)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFlashcard(card.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="games">
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                La gestión de juegos estará disponible próximamente. Los juegos se generan automáticamente con el temario.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editDialog && (
          <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editDialog.type === "test" ? "Editar Test" : "Editar Flashcard"}
                </DialogTitle>
              </DialogHeader>

              {editDialog.type === "test" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Pregunta</Label>
                    <Textarea
                      value={editDialog.data.question}
                      onChange={(e) =>
                        setEditDialog({
                          ...editDialog,
                          data: { ...editDialog.data, question: e.target.value }
                        })
                      }
                      rows={3}
                    />
                  </div>

                  {editDialog.data.options.map((opt: string, i: number) => (
                    <div key={i}>
                      <Label className="flex items-center gap-2">
                        Opción {i + 1}
                        {i === editDialog.data.correctIndex && (
                          <Badge variant="outline" className="text-green-600">Correcta</Badge>
                        )}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...editDialog.data.options];
                            newOptions[i] = e.target.value;
                            setEditDialog({
                              ...editDialog,
                              data: { ...editDialog.data, options: newOptions }
                            });
                          }}
                        />
                        <Button
                          size="sm"
                          variant={i === editDialog.data.correctIndex ? "default" : "outline"}
                          onClick={() =>
                            setEditDialog({
                              ...editDialog,
                              data: { ...editDialog.data, correctIndex: i }
                            })
                          }
                        >
                          ✓
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div>
                    <Label>Explicación</Label>
                    <Textarea
                      value={editDialog.data.explanation || ""}
                      onChange={(e) =>
                        setEditDialog({
                          ...editDialog,
                          data: { ...editDialog.data, explanation: e.target.value }
                        })
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Pregunta (Front)</Label>
                    <Textarea
                      value={editDialog.data.front}
                      onChange={(e) =>
                        setEditDialog({
                          ...editDialog,
                          data: { ...editDialog.data, front: e.target.value }
                        })
                      }
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Respuesta (Back)</Label>
                    <Textarea
                      value={editDialog.data.back}
                      onChange={(e) =>
                        setEditDialog({
                          ...editDialog,
                          data: { ...editDialog.data, back: e.target.value }
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialog(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (editDialog.type === "test") {
                      handleSaveTest(editDialog.data);
                    } else {
                      handleSaveFlashcard(editDialog.data);
                    }
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
