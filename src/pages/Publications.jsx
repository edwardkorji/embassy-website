import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

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
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div className="viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-modal-header">
          <h3>{publication.title}</h3>
          <button
            type="button"
            className="viewer-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <iframe
          className="viewer-frame"
          src={viewerUrl(publication)}
          title={publication.title}
        />
      </div>
    </div>
  );
}

function Publications() {
  const [publications, setPublications] = useState(null);
  const [activePublication, setActivePublication] = useState(null);

  useEffect(() => {
    if (!db) {
      setPublications([]);
      return;
    }

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
        <p className="section-label">PUBLICATIONS</p>

        <h2>
          Reports
          <br />
          <span>and academic work.</span>
        </h2>

        <p className="publications-intro">
          Monthly activity reports from the Embassy, alongside academic
          articles and papers shared by our staff.
        </p>
      </section>

      <section className="publications-list">
        {publications === null && (
          <p className="publications-status">Loading publications…</p>
        )}

        {publications !== null && publications.length === 0 && (
          <p className="publications-status">
            No publications yet — check back soon.
          </p>
        )}

        {publications && publications.length > 0 && (
          <div className="publications-grid">
            {publications.map((pub) => (
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
