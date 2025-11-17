import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props { assistantId: string; themeId?: string | null; }

export default function TestsPanel({ assistantId, themeId }: Props) {
  const [tests, setTests] = useState<any[]>([]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!assistantId || !themeId) {
      setTests([]);
      return;
    }

    const testsRef = collection(db, "assistants", assistantId, "syllabus", themeId, "tests");
    const testsQuery = query(testsRef, orderBy("testNumber", "asc"));
    const unsubscribe = onSnapshot(testsQuery, (snapshot) => {
      const rows = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      setTests(rows);
    });

    return () => unsubscribe();
  }, [assistantId, themeId]);

  useEffect(() => {
    if (tests.length > 0) {
      setActive(0);
    } else {
      setActive(null);
    }
  }, [tests]);

  const activeTest = useMemo(()=> (active!=null ? tests[active] : null), [tests, active]);

  if (!themeId) return <div />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tests disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tests.map((t, idx) => (
              <Button key={t.id} variant={active===idx?"default":"outline"} size="sm" onClick={()=>setActive(idx)}>
                Test {t.testNumber}
              </Button>
            ))}
            {tests.length===0 && <div className="text-sm text-slate-500">No hay tests para este tema aún</div>}
          </div>
        </CardContent>
      </Card>

      {activeTest && (
        <Card>
          <CardHeader>
            <CardTitle>Test {activeTest.testNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal pl-5">
              {(activeTest.questions||[]).map((q:any, i:number)=>(
                <li key={q.id||i} className="space-y-2">
                  <div className="font-medium">{q.question}</div>
                  <div className="grid gap-2">
                    {q.options.map((opt:string, j:number)=> (
                      <div key={j} className={`px-3 py-2 rounded border ${j===q.correctIndex?"border-green-400 bg-green-50":"border-slate-200"}`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
