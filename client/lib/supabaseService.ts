import { getSupabase, isSupabaseEnabled } from "./supabaseClient";

export interface SupabaseSyllabusInput {
  assistantId: string;
  assistantName: string;
  themeId: string;
  themeName: string;
  contentHtml: string;
  totalPages?: number;
  createdBy?: string | null;
  createdByEmail?: string | null;
}

export async function insertSyllabusToSupabase(input: SupabaseSyllabusInput): Promise<{ ok: boolean; error?: string }>{
  if (!isSupabaseEnabled()) return { ok: false, error: "supabase_disabled" };
  const sb = getSupabase();
  try {
    const payload = {
      assistant_id: input.assistantId,
      assistant_name: input.assistantName,
      theme_id: input.themeId,
      theme_name: input.themeName,
      title: input.themeName,
      content_html: input.contentHtml,
      total_pages: input.totalPages ?? null,
      published: true,
      created_by: input.createdBy ?? null,
      created_by_email: input.createdByEmail ?? null,
      created_at: new Date().toISOString(),
    } as any;
    const { error } = await sb!.from("assistant_syllabus").insert(payload);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export interface SupabaseTestInput {
  assistantId: string;
  themeId: string;
  themeName: string;
  tests: Array<{ testNumber: number; questions: any[] }>; // 5 tests x 20 questions
}

export async function insertTestsToSupabase(input: SupabaseTestInput): Promise<{ ok: boolean; error?: string }>{
  if (!isSupabaseEnabled()) return { ok: false, error: "supabase_disabled" };
  const sb = getSupabase();
  try {
    const rows = input.tests.map(t => ({
      assistant_id: input.assistantId,
      theme_id: input.themeId,
      theme_name: input.themeName,
      test_number: t.testNumber,
      questions: t.questions,
      created_at: new Date().toISOString(),
    }));
    const { error } = await sb!.from("assistant_tests").insert(rows);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export interface SupabaseFlashcardsInput {
  assistantId: string;
  themeId: string;
  themeName: string;
  flashcards: Array<{ id?: string; front: string; back: string; tags?: string[] }>; // 15 cards
}

export async function insertFlashcardsToSupabase(input: SupabaseFlashcardsInput): Promise<{ ok: boolean; error?: string }>{
  if (!isSupabaseEnabled()) return { ok: false, error: "supabase_disabled" };
  const sb = getSupabase();
  try {
    const blocks = Array.from({ length: 5 }, (_, i) => i + 1);
    const rows = blocks.flatMap(blockNo => input.flashcards.map((c, idx) => ({
      assistant_id: input.assistantId,
      theme_id: input.themeId,
      theme_name: input.themeName,
      block: blockNo,
      card_index: idx + 1,
      front: c.front,
      back: c.back,
      tags: c.tags ?? [],
      created_at: new Date().toISOString(),
    })));
    const { error } = await sb!.from("assistant_flashcards").insert(rows);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export interface SupabaseGamesInput {
  assistantId: string;
  themeId: string;
  themeName: string;
  quickQuiz: { questions: any[] };
  crossword: { grid: string[]; clues: { across: string[]; down: string[] } };
  wordSearch: { grid: string[]; words: string[] };
}

export async function insertGamesToSupabase(input: SupabaseGamesInput): Promise<{ ok: boolean; error?: string }>{
  if (!isSupabaseEnabled()) return { ok: false, error: "supabase_disabled" };
  const sb = getSupabase();
  try {
    const { error } = await sb!.from("assistant_games").insert({
      assistant_id: input.assistantId,
      theme_id: input.themeId,
      theme_name: input.themeName,
      quick_quiz: input.quickQuiz,
      crossword: input.crossword,
      word_search: input.wordSearch,
      created_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export { isSupabaseEnabled };
