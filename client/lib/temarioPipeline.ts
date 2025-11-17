import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface GeneratedTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export async function saveSyllabusEntry(params: { assistantId: string; assistantName: string; themeId: string; themeName: string; contentHtml: string; totalPages?: number; }): Promise<string | null> {
  const now = Date.now();
  const user = auth.currentUser;
  const docData = {
    assistantId: params.assistantId,
    assistantName: params.assistantName,
    themeId: params.themeId,
    themeName: params.themeName,
    title: params.themeName,
    content: params.contentHtml,
    totalPages: params.totalPages ?? null,
    createdAt: serverTimestamp(),
    createdAtMs: now,
    createdBy: user?.uid || null,
    createdByEmail: user?.email || null,
    published: true,
    type: "ai_syllabus_v1",
  } as any;
  const ref = await addDoc(collection(db, "syllabus"), docData);
  return ref.id;
}

export function generateTestsFromHtml(themeName: string, html: string, seed = 1): GeneratedTestQuestion[] {
  const clean = (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawSentences = clean
    .split(/[\.\!\?]\s+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 40 && sentence.length <= 240);

  const rng = mulberry32(seed);
  const questions: GeneratedTestQuestion[] = [];
  const seenSentences = new Set<string>();

  const makeDistractor = (base: string, variant: number) => {
    let distractor = base;
    distractor = distractor.replace(/\d+/g, (match) => String(Number(match) + variant));
    if (variant % 2 === 0) {
      distractor = distractor.replace(/\b(si|sí)\b/gi, "no");
    } else {
      distractor = distractor.replace(/\bdebe\b/gi, "podría");
    }
    if (distractor === base) {
      distractor = `${base}.`; // ensure slight variation
    }
    return distractor.replace(/\s+/g, " ").trim();
  };

  let index = 0;
  for (const sentence of rawSentences) {
    const normalized = sentence.toLowerCase();
    if (seenSentences.has(normalized)) {
      continue;
    }
    seenSentences.add(normalized);

    const correct = sentence;
    const optionPool = [correct, makeDistractor(sentence, 1), makeDistractor(sentence, 2), makeDistractor(sentence, 3)];
    const uniqueOptions = Array.from(new Set(optionPool.map((text) => text.trim())));

    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`${correct} (${uniqueOptions.length})`);
    }

    const shuffled = shuffle(uniqueOptions, rng);
    const correctIndex = shuffled.findIndex((candidate) => candidate === correct);

    if (correctIndex === -1) {
      shuffled[0] = correct;
    }

    questions.push({
      id: `${themeName.toLowerCase().replace(/\s+/g, "-")}-q-${index + 1}-${Math.floor(rng() * 1e6)}`,
      question: `Según el tema «${themeName}», ¿cuál de las siguientes afirmaciones es correcta?`,
      options: shuffled.slice(0, 4),
      correctIndex: shuffled.slice(0, 4).findIndex((candidate) => candidate === correct),
      explanation: "Respuesta basada en el contenido generado del temario.",
      difficulty: index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard",
    });

    index += 1;
    if (questions.length >= 160) {
      break;
    }
  }

  return questions;
}

export async function saveTests(params: { assistantId: string; themeId: string; themeName: string; questions: GeneratedTestQuestion[]; }): Promise<number> {
  const uniqueQuestions = uniqueByQuestionText(params.questions);
  if (uniqueQuestions.length < 100) {
    throw new Error(`Se necesitan al menos 100 preguntas únicas para los tests, se obtuvieron ${uniqueQuestions.length}.`);
  }

  const rng = mulberry32(Date.now());
  const shuffledQuestions = shuffle(uniqueQuestions, rng);

  const testsCollection = collection(db, "assistants", params.assistantId, "syllabus", params.themeId, "tests");
  const existingTests = await getDocs(testsCollection);
  await Promise.all(existingTests.docs.map((docSnap) => deleteDoc(docSnap.ref)));

  const now = Date.now();
  const user = auth.currentUser;

  for (let testNumber = 0; testNumber < 5; testNumber++) {
    const start = testNumber * 20;
    const chunk = shuffledQuestions.slice(start, start + 20);
    if (chunk.length < 20) {
      throw new Error(`No hay suficientes preguntas únicas para el test ${testNumber + 1}.`);
    }

    const testRef = doc(testsCollection, `test-${testNumber + 1}`);
    await setDoc(testRef, {
      assistantId: params.assistantId,
      themeId: params.themeId,
      themeName: params.themeName,
      testNumber: testNumber + 1,
      questions: chunk,
      createdAt: serverTimestamp(),
      createdAtMs: now + testNumber,
      createdBy: user?.uid || null,
      type: "ai_test_v1",
    });
  }

  return 5;
}

export function generateFlashcardsFromHtml(themeName: string, html: string): { front: string; back: string }[] {
  const text = (html || "")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const candidates = text
    .split(/(?:•|\.|;|\?|!)/)
    .map((fragment) => fragment.replace(/\s+/g, " ").trim())
    .filter((fragment) => fragment.length >= 40 && fragment.length <= 220);

  const uniqueCandidates: string[] = [];
  const seen = new Set<string>();
  for (const fragment of candidates) {
    const normalized = fragment.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    uniqueCandidates.push(fragment);
    if (uniqueCandidates.length >= 45) {
      break;
    }
  }

  if (uniqueCandidates.length < 15) {
    return uniqueCandidates.map((point) => ({
      front: `¿Qué significa "${truncate(point, 60)}"?`,
      back: point,
    }));
  }

  const selected = uniqueCandidates.slice(0, 15);
  return selected.map((point, index) => ({
    front: `Flashcard ${index + 1}: ${truncate(point, 60)}?`,
    back: point,
  }));
}

export async function saveFlashcards(params: { assistantId: string; themeId: string; themeName: string; cards: { front: string; back: string }[]; }): Promise<number> {
  if (params.cards.length < 15) {
    throw new Error(`Se necesitan 15 flashcards únicas, se obtuvieron ${params.cards.length}.`);
  }

  const uniqueCards = uniqueByFlashcard(params.cards).slice(0, 15);
  if (uniqueCards.length < 15) {
    throw new Error(`Solo se generaron ${uniqueCards.length} flashcards únicas.`);
  }

  const flashcardsCollection = collection(db, "assistants", params.assistantId, "syllabus", params.themeId, "flashcards");
  const existing = await getDocs(flashcardsCollection);
  await Promise.all(existing.docs.map((docSnap) => deleteDoc(docSnap.ref)));

  const now = Date.now();
  const user = auth.currentUser;

  for (let blockIndex = 0; blockIndex < 5; blockIndex++) {
    for (let cardIndex = 0; cardIndex < 3; cardIndex++) {
      const overallIndex = blockIndex * 3 + cardIndex;
      const card = uniqueCards[overallIndex];
      const cardRef = doc(flashcardsCollection, `card-${blockIndex + 1}-${cardIndex + 1}`);
      await setDoc(cardRef, {
        assistantId: params.assistantId,
        themeId: params.themeId,
        themeName: params.themeName,
        front: card.front,
        back: card.back,
        block: blockIndex + 1,
        index: cardIndex + 1,
        createdAt: serverTimestamp(),
        createdAtMs: now + overallIndex,
        createdBy: user?.uid || null,
        type: "ai_flashcard_v1",
      });
    }
  }

  return uniqueCards.length;
}

export async function generateGamesFromHtml(
  themeName: string,
  html: string,
  assistantName: string
): Promise<{ quickQuiz: any; matching: any; trivia: any; wordSearch: any }> {
  // Try to use the new AI-powered games generator
  try {
    const { generateGamesFromContent } = await import("./gamesGenerator");

    // Convert HTML to markdown for better AI processing
    const markdown = (html || "")
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const gameBundle = await generateGamesFromContent(markdown, themeName, assistantName);
    return gameBundle;
  } catch (error) {
    console.error("Error generating games with AI, using fallback:", error);
    // Fallback to simple games generation
    return generateFallbackGames(themeName, html);
  }
}

function generateFallbackGames(themeName: string, html: string): { quickQuiz: any; matching: any; trivia: any; wordSearch: any } {
  const questions = generateTestsFromHtml(themeName, html, 7).slice(0, 10).map(q => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation || "Basado en el contenido del tema"
  }));
  const keywords = extractKeywords(html).slice(0, 10).map(w => w.toUpperCase());
  const wordSearch = simpleWordSearch(keywords);

  return {
    quickQuiz: {
      title: `Quiz Rápido: ${themeName}`,
      questions
    },
    matching: {
      title: "Emparejar Conceptos",
      pairs: keywords.slice(0, 6).map(word => ({
        concept: word,
        definition: `Definición de ${word}`
      }))
    },
    trivia: {
      title: "Trivial de Conocimientos",
      questions: keywords.slice(0, 10).map(word => ({
        category: "General",
        question: `¿Qué es ${word}?`,
        answer: `${word} es un concepto clave del tema ${themeName}`,
        difficulty: "medium" as const
      }))
    },
    wordSearch
  };
}

export async function saveGames(params: {
  assistantId: string;
  themeId: string;
  themeName: string;
  games: { quickQuiz: any; matching?: any; trivia?: any; crossword?: any; wordSearch: any }
}): Promise<number> {
  const gamesCollection = collection(db, "assistants", params.assistantId, "syllabus", params.themeId, "games");
  const existing = await getDocs(gamesCollection);
  await Promise.all(existing.docs.map((docSnap) => deleteDoc(docSnap.ref)));

  const now = Date.now();
  const user = auth.currentUser;
  const gameRef = doc(gamesCollection, "bundle");
  await setDoc(gameRef, {
    assistantId: params.assistantId,
    themeId: params.themeId,
    themeName: params.themeName,
    quickQuiz: params.games.quickQuiz || null,
    matching: params.games.matching || null,
    trivia: params.games.trivia || null,
    crossword: params.games.crossword || null,
    wordSearch: params.games.wordSearch || null,
    createdAt: serverTimestamp(),
    createdAtMs: now,
    createdBy: user?.uid || null,
    type: "ai_games_v2",
  });

  const totalGames = [
    params.games.quickQuiz,
    params.games.matching,
    params.games.trivia,
    params.games.crossword,
    params.games.wordSearch
  ].filter(Boolean).length;
  return totalGames;
}

function extractKeywords(html: string): string[] {
  const text = (html || "").replace(/<[^>]+>/g, " ").toLowerCase();
  const words = text.match(/[a-záéíóúñü]{4,}/gi) || [];
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([w])=>w).filter(w => !stopwords.has(w)).slice(0, 50);
}

function simpleCrossword(words: string[]) {
  const grid = Array.from({ length: 12 }, () => Array.from({ length: 12 }, () => " "));
  const clues = { across: [] as string[], down: [] as string[] };
  let row = 0;
  for (const w of words) {
    const r = row % 12;
    for (let i = 0; i < Math.min(12, w.length); i++) grid[r][i] = w[i];
    clues.across.push(`${w.length} letras: ${w}`);
    row += 2;
  }
  return { grid: grid.map(r => r.join("")), clues };
}

function simpleWordSearch(words: string[]) {
  const size = 12;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => randomLetter()));
  const place = (w: string, row: number, col: number) => {
    for (let i = 0; i < w.length && col + i < size; i++) grid[row][col + i] = w[i];
  };
  let r = 0;
  for (const word of words) { place(word, r % size, 0); r += 2; }
  return { grid: grid.map(r => r.join("")), words };
}

function randomLetter() {
  const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  return letters.charAt(Math.floor(Math.random() * letters.length));
}

function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mulberry32(a: number) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function uniqueByQuestionText(arr: GeneratedTestQuestion[]): GeneratedTestQuestion[] {
  const seen = new Set<string>();
  const result: GeneratedTestQuestion[] = [];
  for (const question of arr) {
    const key = question.question.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(question);
  }
  return result;
}

function uniqueByFlashcard(cards: { front: string; back: string }[]): { front: string; back: string }[] {
  const seen = new Set<string>();
  const result: { front: string; back: string }[] = [];
  for (const card of cards) {
    const key = `${card.front.toLowerCase().trim()}|${card.back.toLowerCase().trim()}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(card);
  }
  return result;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

const stopwords = new Set([
  "de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no","una","su","al","lo","como","más","pero","sus","le","ya","o","este","sí","porque","esta","entre","cuando","muy","sin","sobre","también","me","hasta","hay","donde","quien","desde","todo","nos","durante","todos","uno","les","ni","contra","otros","ese","eso","ante","ellos","e","esto","mí","antes","algunos","qué","unos","yo","otro","otras","otra","él","tanto","esa","estos","mucho","quienes","nada","muchos","cual","poco","ella","estar","estas","algunas","algo","nosotros","mi","mis","tú","te","ti","tu","tus","ellas","nosotras","vosostros","vosostras","os","mío","mía","míos","mías","tuyo","tuya","tuyos","tuyas","suyo","suya","suyos","suyas","nuestro","nuestra","nuestros","nuestras","vuestro","vuestra","vuestros","vuestras","esos","esas","estoy","estás","está","estamos","estáis","están","esté","estés","estemos","estéis","estén","estaré","estarás","estará","estaremos","estaréis","estarán","estaría","estarías","estaríamos","estaríais","estarían","estaba","estabas","estábamos","estabais","estaban","estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron","estuviera","estuvieras","estuviéramos","estuvierais","estuvieran","estuviese","estuvieses","estuviésemos","estuvieseis","estuviesen","estando","estado","estada","estados","estadas","estad"
]);
