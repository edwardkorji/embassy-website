import { useEffect, useRef, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const TAG_LABELS = {
  bilateral: "Sierra Leone × Ethiopia",
  "sierra-leone": "Sierra Leone",
  ethiopia: "Ethiopia",
};

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PAGE_SIZE = 6;
const PAGE_STEP = 3;

function News() {
  const [articles, setArticles] = useState(null); // null = still loading
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sectionRef = useRef(null);

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    sectionRef.current?.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    if (!db) {
      // Firebase isn't configured yet (see .env.example) — nothing to load.
      setArticles([]);
      return;
    }

    const newsQuery = query(
      collection(db, "news"),
      orderBy("publishedAt", "desc"),
      limit(24)
    );

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        setArticles(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (err) => {
        console.error("Failed to load news feed:", err);
        setArticles([]);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <section className="news" id="news" ref={sectionRef}>
      <div className="news-heading">
        <p className="section-label">LATEST</p>

        <h2>
          News from
          <br />
          <span>the Embassy.</span>
        </h2>
      </div>

      {articles === null && (
        <p className="news-status">Gathering the latest stories…</p>
      )}

      {articles !== null && articles.length === 0 && (
        <p className="news-status">
          News is being gathered from Sierra Leone and Ethiopia — check back
          soon.
        </p>
      )}

      {articles && articles.length > 0 && (
        <>
          <div className="news-feed">
            {articles.slice(0, visibleCount).map((article, index) => (
              <a
                className={`news-card${
                  index === 0 ? " news-card--featured" : ""
                }`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                key={article.id}
              >
                {article.image && (
                  <div className="news-card-image">
                    <img src={article.image} alt="" loading="lazy" />
                  </div>
                )}

                <div className="news-card-body">
                  <span
                    className={`news-card-tag news-card-tag--${article.tag}`}
                  >
                    {TAG_LABELS[article.tag] || "News"}
                  </span>

                  <h3>{article.title}</h3>

                  <div className="news-card-meta">
                    <span>{article.source}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {(visibleCount < articles.length || visibleCount > PAGE_SIZE) && (
            <div className="news-load-actions">
              {visibleCount < articles.length && (
                <button
                  type="button"
                  className="news-show-more"
                  onClick={() =>
                    setVisibleCount((count) => count + PAGE_STEP)
                  }
                >
                  Show more
                </button>
              )}

              {visibleCount > PAGE_SIZE && (
                <button
                  type="button"
                  className="news-show-less"
                  onClick={handleShowLess}
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default News;
