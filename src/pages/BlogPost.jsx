import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import PhotoSlider from "../components/PhotoSlider";
import { blogCategoryLabel } from "../lib/blogCategories";

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BlogPost() {
  const { slug } = useParams();
  // undefined = still loading, null = no such post
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    if (!db || !slug) {
      setPost(null);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "blogs", slug),
      (snap) => setPost(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => {
        console.error("Failed to load blog post:", err);
        setPost(null);
      }
    );

    return unsubscribe;
  }, [slug]);

  if (post === undefined) {
    return (
      <main>
        <section className="blog-post">
          <p className="blog-status">Loading post…</p>
        </section>
      </main>
    );
  }

  if (post === null) {
    return (
      <main>
        <section className="blog-post">
          <p className="blog-status">This post couldn't be found.</p>
          <Link className="blog-post-back" to="/blog">
            ← Back to blog
          </Link>
        </section>
      </main>
    );
  }

  const paragraphs = (post.body || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <main>
      <article className="blog-post">
        <header className="blog-post-header">
          <Link className="blog-post-back" to="/blog">
            ← Back to blog
          </Link>

          <span className="blog-card-tag">{blogCategoryLabel(post.category)}</span>

          <h1>{post.title}</h1>

          <div className="blog-post-meta">
            {post.author && <span>{post.author}</span>}
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </header>

        <PhotoSlider photos={post.photos} alt={post.title} />

        <div className="blog-post-body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
          ) : (
            <p className="blog-status">
              This post's content is being written — check back soon.
            </p>
          )}
        </div>
      </article>
    </main>
  );
}

export default BlogPost;
