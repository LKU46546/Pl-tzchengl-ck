// ────────────────────────────────────────────────────────────────
//  Die 3 Start-Rezepte
//  Diese sind fest eingebaut und immer sichtbar.
//  Weitere Rezepte der Teilnehmenden kommen live aus Supabase dazu.
//
//  Feld-Erklärung:
//    symbol      – ein weihnachtliches Emoji pro Rezept
//    title       – Name des Plätzchens
//    author      – wer es beigesteuert hat
//    time        – ungefähre Zeit
//    ingredients – eine Zutat pro Zeile
//    steps       – ein Schritt pro Zeile
//    tip         – optionaler Tipp (kann "" sein)
// ────────────────────────────────────────────────────────────────

const STARTER_RECIPES = [
  {
    id: "start-spitzbuben",
    symbol: "⭐",
    title: "Spitzbuben",
    author: "Livia",
    time: "45 Min + Kühlzeit",
    ingredients: [
      "250 g Mehl",
      "125 g kalte Butter",
      "80 g Zucker",
      "1 Päckchen Vanillezucker",
      "1 Ei",
      "1 Prise Salz",
      "ca. 150 g rote Konfitüre (z. B. Johannisbeere oder Himbeere)",
      "Puderzucker zum Bestäuben",
    ],
    steps: [
      "Mehl, Zucker, Vanillezucker und Salz mischen. Butter in Stücken und das Ei dazugeben und rasch zu einem glatten Teig verkneten.",
      "Teig zu einer Scheibe formen, in Folie wickeln und mind. 1 Stunde kühl stellen.",
      "Teig ca. 3 mm dünn ausrollen und Kreise ausstechen. Bei der Hälfte ein kleines Loch (Fenster) ausstechen.",
      "Bei 180 °C Ober-/Unterhitze ca. 8–10 Min. hellgelb backen. Auskühlen lassen.",
      "Die vollen Böden mit Konfitüre bestreichen, die Deckel mit Loch mit Puderzucker bestäuben und aufsetzen.",
    ],
    tip: "Die Konfitüre kurz aufkochen, dann glänzt das Fensterchen schön.",
  },
  {
    id: "start-vanillekipferl",
    symbol: "🌙",
    title: "Schnelle Vanillekipferl",
    author: "Livia",
    time: "30 Min",
    ingredients: [
      "200 g Mehl",
      "150 g kalte Butter",
      "100 g gemahlene Mandeln (oder Haselnüsse)",
      "70 g Zucker",
      "1 Päckchen Vanillezucker",
      "1 Prise Salz",
      "Zum Wälzen: 50 g Puderzucker + 1 Päckchen Vanillezucker",
    ],
    steps: [
      "Alle Zutaten für den Teig rasch zu einem glatten Mürbeteig verkneten – nicht lange kneten, dann bleibt er mürbe.",
      "Vom Teig kleine Stücke abnehmen, zu Röllchen formen und zu Hörnchen (Kipferl) biegen.",
      "Auf ein mit Backpapier belegtes Blech setzen.",
      "Bei 180 °C Ober-/Unterhitze ca. 10–12 Min. backen, bis die Spitzen leicht golden sind.",
      "Puderzucker und Vanillezucker mischen. Die noch warmen Kipferl vorsichtig darin wälzen.",
    ],
    tip: "Noch warm wälzen – dann haftet der Vanillezucker am besten. Aber vorsichtig, sie sind zerbrechlich!",
  },
  {
    id: "start-ausstecherle",
    symbol: "🎄",
    title: "Ausstecherle",
    author: "Livia",
    time: "40 Min + Kühlzeit",
    ingredients: [
      "300 g Mehl",
      "200 g kalte Butter",
      "100 g Zucker",
      "1 Päckchen Vanillezucker",
      "1 Ei",
      "1 Prise Salz",
      "Zum Verzieren: Puderzucker, Zuckerguss, Streusel nach Wunsch",
    ],
    steps: [
      "Mehl, Zucker, Vanillezucker und Salz mischen. Butter und Ei dazugeben und zügig zu einem Mürbeteig verkneten.",
      "Teig in Folie wickeln und mind. 1 Stunde (gern über Nacht) kühl stellen.",
      "Teig ca. 3–4 mm dick ausrollen und mit Förmchen Sterne, Tannenbäume, Herzen usw. ausstechen.",
      "Bei 180 °C Ober-/Unterhitze ca. 8–10 Min. backen, bis die Ränder leicht golden sind.",
      "Vollständig auskühlen lassen, dann nach Lust und Laune mit Zuckerguss und Streuseln verzieren.",
    ],
    tip: "Den Teig zwischen zwei Lagen Backpapier ausrollen – dann klebt nichts und du brauchst kaum extra Mehl.",
  },
];
