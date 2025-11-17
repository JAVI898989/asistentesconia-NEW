import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = (typeof window !== "undefined" ? (window as any).env?.NEXT_PUBLIC_SUPABASE_URL : undefined) || import.meta.env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL;
  const anon = (typeof window !== "undefined" ? (window as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) || import.meta.env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  supabase = createClient(url as string, anon as string, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return supabase;
}

export function isSupabaseEnabled(): boolean {
  const s = getSupabase();
  return !!s;
}
