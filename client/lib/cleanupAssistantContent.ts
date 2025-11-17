import { collection, getDocs, deleteDoc, doc, where, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Deeply deletes all syllabus, tests and flashcards for an assistant.
 * - Removes standardized assistant_syllabus and assistant_syllabus_updates (filtered by assistantId)
 * - Removes legacy structure under assistants/{assistantId}/syllabus and its subcollections tests/flashcards
 * - Removes legacy flat tests/flashcards under assistants/{assistantId}/{tests|flashcards}
 */
export const deepCleanAssistantContent = async (assistantId: string): Promise<void> => {
  // 0) Clean potential top-level collections filtered by assistantId
  const safeDeleteWhere = async (colName: string) => {
    try {
      const col = collection(db, colName);
      const snap = await getDocs(query(col, where("assistantId", "==", assistantId)));
      await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    } catch {}
  };
  await Promise.all([
    safeDeleteWhere("syllabus"),
    safeDeleteWhere("tests"),
    safeDeleteWhere("flashcards"),
    safeDeleteWhere("assistant_syllabus"),
    safeDeleteWhere("assistant_syllabus_updates"),
  ]);

  // 1) Delete standardized assistant_syllabus for this assistant (explicit)
  try {
    const stdCol = collection(db, "assistant_syllabus");
    const stdSnap = await getDocs(query(stdCol, where("assistantId", "==", assistantId)));
    await Promise.all(stdSnap.docs.map(d => deleteDoc(d.ref)));
  } catch {}

  // 2) Delete syllabus topics and their subcollections (tests, flashcards)
  try {
    const syllabusCol = collection(db, "assistants", assistantId, "syllabus");
    const syllabusSnap = await getDocs(syllabusCol);
    for (const topicDoc of syllabusSnap.docs) {
      const slug = topicDoc.id;
      // delete tests
      try {
        const testsCol = collection(db, "assistants", assistantId, "syllabus", slug, "tests");
        const testsSnap = await getDocs(testsCol);
        await Promise.all(testsSnap.docs.map(d => deleteDoc(d.ref)));
      } catch {}
      // delete flashcards
      try {
        const cardsCol = collection(db, "assistants", assistantId, "syllabus", slug, "flashcards");
        const cardsSnap = await getDocs(cardsCol);
        await Promise.all(cardsSnap.docs.map(d => deleteDoc(d.ref)));
      } catch {}
      // delete topic
      try { await deleteDoc(topicDoc.ref); } catch {}
    }
  } catch {}

  // 3) Legacy top-level tests/flashcards collections, if any
  try {
    const testsTop = collection(db, "assistants", assistantId, "tests");
    const tSnap = await getDocs(testsTop);
    await Promise.all(tSnap.docs.map(d => deleteDoc(d.ref)));
  } catch {}
  try {
    const cardsTop = collection(db, "assistants", assistantId, "flashcards");
    const cSnap = await getDocs(cardsTop);
    await Promise.all(cSnap.docs.map(d => deleteDoc(d.ref)));
  } catch {}
};

export default deepCleanAssistantContent;
