import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Download, ExternalLink, X } from "lucide-react";
import { db } from "../lib/firebase";
import { useModalA11y } from "../lib/useModalA11y";

const TYPE_LABELS = {
  report: "Monthly Report",
  article: "Academic Article",
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

function viewerUrl(publication) {
  if (publication.fileType === "pdf") return publication.fileUrl;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(
    publication.fileUrl
  )}&embedded=true`;
}

function ViewerModal({ publication, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const modalRef = useRef(null);
  const titleId = useId();
  useModalA11y(modalRef, { onClose });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div
        className="viewer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="viewer-modal-header">
          <h3 id={titleId}>{publication.title}</h3>

          <div className="viewer-modal-actions">
            <a
              className="viewer-action"
              href={publication.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new tab"
            >
              <ExternalLink size={17} />
            </a>

            <a
              className="viewer-action"
              href={publication.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download"
            >
              <Download size={17} />
            </a>

            <button
              type="button"
              className="viewer-action viewer-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="viewer-frame-wrap">
          {!loaded && (
            <div className="viewer-frame-loading">
              <div className="viewer-frame-spinner" aria-label="Loading document" />
            </div>
          )}

          <iframe
            className="viewer-frame"
            src={viewerUrl(publication)}
            title={publication.title}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}

function Publications() {
  // Firebase not configured (see .env.example) — nothing to load, so start
  // in the "empty" state directly instead of setting it from inside the
  // effect below.
  const [publications, setPublications] = useState(db ? null : []);
  const [activePublication, setActivePublication] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const categories = useMemo(() => {
    if (!publications) return [];
    return [...new Set(publications.map((pub) => pub.type).filter(Boolean))].sort(
      (a, b) => a.localeCompare(b)
    );
  }, [publications]);

  const visiblePublications = useMemo(() => {
    if (!publications) return [];
    if (!selectedCategory) return publications;
    return publications.filter((pub) => pub.type === selectedCategory);
  }, [publications, selectedCategory]);

  // Real, live counts from Firestore — not fixed numbers, so these stay
  // accurate as more publications get added.
  const heroStats = useMemo(() => {
    if (!publications || publications.length === 0) return [];
    const reportCount = publications.filter((p) => p.type === "report").length;
    const articleCount = publications.filter((p) => p.type === "article").length;
    const authorCount = new Set(publications.map((p) => p.author).filter(Boolean)).size;
    return [
      { value: publications.length, label: "Reports" },
      { value: reportCount, label: "Monthly Reports" },
      { value: articleCount, label: "Academic Articles" },
      { value: authorCount, label: "Contributing Staff" },
    ];
  }, [publications]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (!db) return;

    const publicationsQuery = query(
      collection(db, "publications"),
      orderBy("publishedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      publicationsQuery,
      (snapshot) => {
        setPublications(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (err) => {
        console.error("Failed to load publications:", err);
        setPublications([]);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <main>
      <section className="publications-hero">
        <div className="publications-hero-inner">
          <p className="section-label">REPORTS</p>

          <h2>
            Reports
            <br />
            <span>and academic work.</span>
          </h2>

          <p className="publications-intro">
            Monthly activity reports from the Embassy, alongside academic
            articles and papers shared by our staff.
          </p>

          {heroStats.length > 0 && (
            <div className="publications-floaters" aria-hidden="true">
              {heroStats.map((stat) => (
                <div className="publications-floater" key={stat.label}>
                  <span className="publications-floater-value">
                    {stat.value}
                  </span>
                  <span className="publications-floater-label">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="publications-list">
        {publications === null && (
          <p className="publications-status">Loading publications…</p>
        )}

        {publications !== null && publications.length === 0 && (
          <p className="publications-status">
            No reports yet — check back soon.
          </p>
        )}

        {publications && publications.length > 0 && (
          <>
            <div className="publications-filter">
              <p className="publications-filter-label">Filter by category</p>

              <div className="publications-filter-pills">
                <button
                  type="button"
                  className={`publications-filter-pill${
                    selectedCategory === "" ? " active" : ""
                  }`}
                  onClick={() => handleCategoryChange("")}
                >
                  All categories
                </button>

                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={`publications-filter-pill${
                      selectedCategory === category ? " active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {TYPE_LABELS[category] || category}
                  </button>
                ))}
              </div>
            </div>

            {visiblePublications.length === 0 && (
              <p className="publications-status">
                No reports in this category yet.
              </p>
            )}

            <div className="publications-grid">
              {visiblePublications.map((pub) => (
              <div className="publication-card" key={pub.id}>
                <span
                  className={`publication-tag publication-tag--${pub.type}`}
                >
                  {TYPE_LABELS[pub.type] || "Publication"}
                </span>

                <h3>{pub.title}</h3>

                <div className="publication-meta">
                  {pub.author && <span>{pub.author}</span>}
                  <span>{formatDate(pub.publishedAt)}</span>
                </div>

                {pub.summary && (
                  <p className="publication-summary">{pub.summary}</p>
                )}

                <div className="publication-actions">
                  <button
                    type="button"
                    className="publication-view"
                    onClick={() => setActivePublication(pub)}
                  >
                    View in full
                  </button>

                  <a
                    className="publication-download"
                    href={pub.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
              ))}
            </div>
          </>
        )}
      </section>

      {activePublication && (
        <ViewerModal
          publication={activePublication}
          onClose={() => setActivePublication(null)}
        />
      )}
    </main>
  );
}

export default Publications;
