// Placeholder categories for the blog. When the team decides on the real
// categories, update the labels (and keys, if needed) here — then update the
// `category` field on any existing blog docs in the Firestore console to
// match the new keys.
export const BLOG_CATEGORIES = [
  { key: "embassy-news", label: "Embassy News" },
  { key: "culture-community", label: "Culture & Community" },
  { key: "diplomacy", label: "Diplomacy" },
];

export function blogCategoryLabel(key) {
  return BLOG_CATEGORIES.find((category) => category.key === key)?.label || "Blog";
}
