// ────────────────────────────────────────────────────────────────
//  Supabase-Konfiguration
//  Trage hier die beiden Schlüssel aus deinem Supabase-Projekt ein.
//  (Supabase → Project Settings → Data API / API Keys)
//
//  Solange hier die Platzhalter stehen, funktioniert die Seite trotzdem:
//  Es werden dann nur die 3 Start-Rezepte gezeigt und das
//  Einreiche-Formular weist freundlich darauf hin, dass es noch
//  nicht scharf geschaltet ist.
// ────────────────────────────────────────────────────────────────

const SUPABASE_URL = "DEINE_SUPABASE_URL";      // z.B. https://abcxyz.supabase.co
const SUPABASE_ANON_KEY = "DEIN_ANON_KEY";      // der öffentliche "anon"/"publishable" Key

// Nicht ändern:
const SUPABASE_READY =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("DEINE_") &&
  !SUPABASE_ANON_KEY.includes("DEIN_");
