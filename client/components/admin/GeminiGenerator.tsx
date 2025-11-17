import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2 } from 'lucide-react';

interface GeminiGeneratorProps {
  assistant: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function GeminiGenerator({
  assistant,
  isOpen,
  onClose,
}: GeminiGeneratorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [topics, setTopics] = useState('');
  const [generateTests, setGenerateTests] = useState(false);
  const [generateFlashcards, setGenerateFlashcards] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = () => {
    // TODO: Implement the generation logic
    console.log({
      assistantId: assistant.id,
      file,
      topics,
      generateTests,
      generateFlashcards,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🧩 Generar Temario IA con Gemini 2.5 para {assistant.name}</DialogTitle>
          <DialogDescription>
            Sube un archivo de ejemplo (PDF o PPTX) o escribe los temas manualmente para generar el temario, tests y flashcards.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file">Archivo de ejemplo (PDF/PPTX)</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.pptx" />
          </div>
          <div className="text-center my-2">O</div>
          <div>
            <Label htmlFor="topics">Temas (uno por línea)</Label>
            <textarea
              id="topics"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full p-2 border rounded"
              rows={5}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="generate-tests" checked={generateTests} onCheckedChange={(checked) => setGenerateTests(!!checked)} />
            <Label htmlFor="generate-tests">Generar Tests</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="generate-flashcards" checked={generateFlashcards} onCheckedChange={(checked) => setGenerateFlashcards(!!checked)} />
            <Label htmlFor="generate-flashcards">Generar Flashcards</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
