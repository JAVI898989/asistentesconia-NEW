import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props { assistantId: string; themeId?: string | null; }

export default function FlashcardsSimple({ assistantId, themeId }: Props) {
  const [cards, setCards] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!assistantId || !themeId) {
      setCards([]);
      return;
    }

    const cardsRef = collection(db, "assistants", assistantId, "syllabus", themeId, "flashcards");
    const cardsQuery = query(cardsRef, orderBy("block", "asc"), orderBy("index", "asc"));
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const rows = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setCards(rows);
      setIdx(0);
      setFlipped(false);
    });

    return () => unsubscribe();
  }, [assistantId, themeId]);

  if (!themeId) return <div />;

  const cur = cards[idx];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Flashcards ({cards.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {cur ? (
            <div className="space-y-3">
              <div className="text-sm text-slate-500">Bloque {cur.block} · #{cur.index}</div>
              <div className="p-6 rounded border bg-slate-50 cursor-pointer" onClick={()=>setFlipped(!flipped)}>
                {!flipped ? <div className="text-lg font-semibold">{cur.front}</div> : <div className="text-slate-700">{cur.back}</div>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={()=>{ setIdx((p)=> (p-1+cards.length)%cards.length); setFlipped(false); }}>Anterior</Button>
                <Button variant="outline" onClick={()=>{ setIdx((p)=> (p+1)%cards.length); setFlipped(false); }}>Siguiente</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">No hay flashcards para este tema aún</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
