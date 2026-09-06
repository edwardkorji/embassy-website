import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Matches Unicode combining diacritical marks (U+0300-U+036F) left behind
// by NFKD normalization, e.g. turning "é" into "e" + a combining accent.
const COMBINING_MARKS = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(title) {
  const base = (title || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  // Non-Latin titles (e.g. Amharic) can slugify to an empty string.
  return base || `post-${Date.now().toString(36)}`;
}

export async function generateUniqueSlug(collectionName, title) {
  const base = slugify(title);
  let candidate = base;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const snap = await getDoc(doc(db, collectionName, candidate));
    if (!snap.exists()) return candidate;
    candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}
