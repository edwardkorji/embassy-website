const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { setGlobalOptions } = require("firebase-functions/v2");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");

initializeApp();
setGlobalOptions({ region: "us-central1" });

const db = getFirestore();

const CURRENTS_API_KEY = defineSecret("CURRENTS_API_KEY");
const NEWSDATA_API_KEY = defineSecret("NEWSDATA_API_KEY");
const GNEWS_API_KEY = defineSecret("GNEWS_API_KEY");

// No manual curation: every query below is run automatically, on schedule,
// and the "tag" is only used to explain *why* a story matched, not to
// hand-pick what gets shown.
const QUERIES = [
  { q: "Sierra Leone Ethiopia", tag: "bilateral" },
  { q: "Sierra Leone", tag: "sierra-leone" },
  { q: "Ethiopia diplomacy", tag: "ethiopia" },
];

const MAX_AGE_DAYS = 30;

function hashUrl(url) {
  return crypto.createHash("sha1").update(url).digest("hex");
}

function safeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function fetchCurrents(apiKey, query) {
  if (!apiKey) return [];
  const url =
    "https://api.currentsapi.services/v1/search" +
    `?language=en&keywords=${encodeURIComponent(query.q)}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Currents API responded ${res.status}`);
    const data = await res.json();

    return (data.news || []).map((article) => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      image: article.image && article.image !== "None" ? article.image : null,
      source: article.author || "Currents",
      publishedAt: safeDate(article.published),
      tag: query.tag,
      provider: "currents",
    }));
  } catch (err) {
    console.error("Currents API fetch failed:", err.message);
    return [];
  }
}

async function fetchNewsData(apiKey, query) {
  if (!apiKey) return [];
  const url =
    "https://newsdata.io/api/1/latest" +
    `?apikey=${apiKey}&language=en&q=${encodeURIComponent(query.q)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NewsData API responded ${res.status}`);
    const data = await res.json();

    return (data.results || []).map((article) => ({
      title: article.title,
      description: article.description || "",
      url: article.link,
      image: article.image_url || null,
      source: article.source_id || "NewsData",
      publishedAt: safeDate(article.pubDate),
      tag: query.tag,
      provider: "newsdata",
    }));
  } catch (err) {
    console.error("NewsData API fetch failed:", err.message);
    return [];
  }
}

async function fetchGNews(apiKey, query) {
  if (!apiKey) return [];
  const url =
    "https://gnews.io/api/v4/search" +
    `?q=${encodeURIComponent(query.q)}&lang=en&max=10&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GNews API responded ${res.status}`);
    const data = await res.json();

    return (data.articles || []).map((article) => ({
      title: article.title,
      description: article.description || "",
      url: article.url,
      image: article.image || null,
      source: article.source?.name || "GNews",
      publishedAt: safeDate(article.publishedAt),
      tag: query.tag,
      provider: "gnews",
    }));
  } catch (err) {
    console.error("GNews API fetch failed:", err.message);
    return [];
  }
}

// Cron for 02:00 / 08:00 / 14:00 / 20:00, Addis Ababa time (the embassy's
// local time zone).
exports.fetchDiplomacyNews = onSchedule(
  {
    schedule: "0 2,8,14,20 * * *",
    timeZone: "Africa/Addis_Ababa",
    secrets: [CURRENTS_API_KEY, NEWSDATA_API_KEY, GNEWS_API_KEY],
  },
  async () => {
    const currentsKey = CURRENTS_API_KEY.value();
    const newsdataKey = NEWSDATA_API_KEY.value();
    const gnewsKey = GNEWS_API_KEY.value();

    const fetched = [];
    for (const query of QUERIES) {
      const [currents, newsdata, gnews] = await Promise.all([
        fetchCurrents(currentsKey, query),
        fetchNewsData(newsdataKey, query),
        fetchGNews(gnewsKey, query),
      ]);
      fetched.push(...currents, ...newsdata, ...gnews);
    }

    const seen = new Set();
    const batch = db.batch();
    let written = 0;

    for (const article of fetched) {
      if (!article.url || !article.title) continue;

      const dedupeKey = article.url.split("?")[0];
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const ref = db.collection("news").doc(hashUrl(dedupeKey));
      batch.set(
        ref,
        { ...article, fetchedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      written += 1;
    }

    const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
    const staleSnap = await db
      .collection("news")
      .where("publishedAt", "<", cutoff)
      .get();
    staleSnap.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();

    await db.collection("meta").doc("newsSync").set({
      lastRunAt: FieldValue.serverTimestamp(),
      articlesFetched: fetched.length,
      articlesWritten: written,
      articlesPruned: staleSnap.size,
    });

    console.log(
      `News sync complete: ${written} written, ${staleSnap.size} pruned, ` +
        `${fetched.length} fetched across ${QUERIES.length} queries.`
    );
  }
);
