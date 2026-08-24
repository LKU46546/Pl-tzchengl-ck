// ────────────────────────────────────────────────────────────────
//  Plätzchenglück – App-Logik
//  • zeigt die Start-Rezepte + die aus Supabase geladenen Rezepte
//  • öffnet ein Rezept im Overlay
//  • schickt neue Rezepte ans Supabase-Formular
// ────────────────────────────────────────────────────────────────

const grid = document.getElementById("recipe-grid");
const loadingNote = document.getElementById("loading-note");
const modal = document.getElementById("recipe-modal");
const modalBody = document.getElementById("modal-body");

// alle aktuell angezeigten Rezepte (Start + Supabase)
let allRecipes = [];

// ---- kleine Helfer -------------------------------------------------

// verhindert HTML-Injektion beim Anzeigen von Nutzertext
function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// wandelt Freitext (eine Zeile = ein Eintrag) in ein Array
function toLines(value) {
  if (Array.isArray(value)) return value.filter((l) => l && l.trim());
  return String(value || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// vereinheitlicht ein Rezept aus Supabase in unser Anzeigeformat
function normalize(r) {
  return {
    id: r.id,
    symbol: r.symbol || "🍪",
    title: r.title || "Ohne Titel",
    author: r.author || "Unbekannt",
    time: r.time || "",
    ingredients: toLines(r.ingredients),
    steps: toLines(r.steps),
    tip: r.tip || "",
    image: r.image_url || "",
  };
}

// ---- Rendern -------------------------------------------------------

function renderCards() {
  grid.innerHTML = "";
  allRecipes.forEach((r, i) => {
    const card = document.createElement("button");
    card.className = "recipe-card" + (r.image ? " has-photo" : "");
    card.type = "button";
    const visual = r.image
      ? `<span class="card-photo" style="background-image:url('${encodeURI(r.image)}')">
           <span class="card-photo-symbol">${esc(r.symbol)}</span>
         </span>`
      : `<span class="card-symbol">${esc(r.symbol)}</span>`;
    card.innerHTML = `
      ${visual}
      <span class="card-title">${esc(r.title)}</span>
      <span class="card-meta">
        <span class="card-author">von ${esc(r.author)}</span>
        ${r.time ? " · " + esc(r.time) : ""}
      </span>`;
    card.addEventListener("click", () => openRecipe(i));
    grid.appendChild(card);
  });
}

function openRecipe(index) {
  const r = allRecipes[index];
  if (!r) return;
  const ing = r.ingredients.map((x) => `<li>${esc(x)}</li>`).join("");
  const steps = r.steps.map((x) => `<li>${esc(x)}</li>`).join("");
  const hero = r.image
    ? `<img class="modal-photo" src="${encodeURI(r.image)}" alt="${esc(r.title)}" />`
    : "";
  modalBody.innerHTML = `
    <div class="modal-body">
      ${hero}
      <div class="modal-symbol">${esc(r.symbol)}</div>
      <h3>${esc(r.title)}</h3>
      <p class="modal-meta"><span class="by">von ${esc(r.author)}</span>${
        r.time ? " · " + esc(r.time) : ""
      }</p>
      <h4>Zutaten</h4>
      <ul>${ing}</ul>
      <h4>Zubereitung</h4>
      <ol>${steps}</ol>
      ${
        r.tip
          ? `<div class="modal-tip"><strong>Tipp:</strong> ${esc(r.tip)}</div>`
          : ""
      }
    </div>`;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// ---- Laden ---------------------------------------------------------

async function loadRecipes() {
  // Start immer mit den 3 fest eingebauten Rezepten
  allRecipes = [...STARTER_RECIPES];
  renderCards();

  if (!SUPABASE_READY) {
    loadingNote.textContent =
      "Weitere Rezepte der Teilnehmenden erscheinen hier, sobald Supabase eingerichtet ist.";
    return;
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/recipes?select=*&order=created_at.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    const rows = await res.json();
    const extra = rows.map(normalize);
    allRecipes = [...STARTER_RECIPES, ...extra];
    renderCards();
    loadingNote.textContent = extra.length
      ? `${allRecipes.length} Rezepte im Buch – und es werden mehr! 🎄`
      : "Sei die/der Erste und leg unten dein Rezept ins Buch!";
  } catch (err) {
    console.error(err);
    loadingNote.textContent =
      "Die zusätzlichen Rezepte konnten gerade nicht geladen werden – die Start-Rezepte siehst du trotzdem.";
  }
}

// ---- Formular ------------------------------------------------------

const form = document.getElementById("recipe-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const photoInput = document.getElementById("photo-input");
const photoPreview = document.getElementById("photo-preview");

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB
const STORAGE_BUCKET = "recipe-photos";

// kleine Vorschau, sobald ein Foto gewählt wird
photoInput.addEventListener("change", () => {
  const file = photoInput.files && photoInput.files[0];
  if (file) {
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
  } else {
    photoPreview.hidden = true;
  }
});

// lädt ein Foto in Supabase Storage und gibt die öffentliche URL zurück
async function uploadPhoto(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: file,
    }
  );
  if (!res.ok) throw new Error("Foto-Upload HTTP " + res.status);
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";
  status.textContent = "";

  if (!SUPABASE_READY) {
    status.className = "form-status err";
    status.textContent =
      "Das Einreichen ist noch nicht freigeschaltet (Supabase fehlt). Melde dich bei Livia. 🎄";
    return;
  }

  const data = new FormData(form);
  const payload = {
    title: (data.get("title") || "").trim(),
    author: (data.get("author") || "").trim(),
    symbol: data.get("symbol") || "🍪",
    time: (data.get("time") || "").trim(),
    ingredients: (data.get("ingredients") || "").trim(),
    steps: (data.get("steps") || "").trim(),
    tip: (data.get("tip") || "").trim(),
    image_url: "",
  };

  // Foto prüfen (optional)
  const file = photoInput.files && photoInput.files[0];
  if (file && file.size > MAX_PHOTO_BYTES) {
    status.className = "form-status err";
    status.textContent = "Das Foto ist größer als 5 MB. Bitte ein kleineres wählen.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Wird gespeichert …";

  try {
    if (file) {
      submitBtn.textContent = "Foto wird hochgeladen …";
      payload.image_url = await uploadPhoto(file);
      submitBtn.textContent = "Wird gespeichert …";
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);

    status.className = "form-status ok";
    status.textContent = "Juhu! Dein Rezept ist im Buch. 🎄 Danke fürs Mitmachen!";
    form.reset();
    photoPreview.hidden = true;
    await loadRecipes();
    document.getElementById("rezepte").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error(err);
    status.className = "form-status err";
    status.textContent =
      "Ups, das hat nicht geklappt. Bitte später nochmal versuchen.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Rezept ins Buch legen 🎄";
  }
});

// ---- Los geht's ----------------------------------------------------
loadRecipes();
