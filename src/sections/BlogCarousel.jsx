import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
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

function BlogCarousel() {
  const [posts, setPosts] = useState(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!db) {
      setPosts([]);
      return;
    }

    const postsQuery = query(
      collection(db, "blogs"),
      orderBy("publishedAt", "desc"),
      limit(12)
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.error("Failed to load blog carousel:", err);
        setPosts([]);
      }
    );

    return unsubscribe;
  }, []);

  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  // Nothing to show yet (Firebase not configured, or no posts published) —
  // don't show an empty section on the homepage.
  if (posts !== null && posts.length === 0) return null;

  return (
    <section className="blog-carousel" id="blog">
      <div className="blog-carousel-heading">
        <div>
          <p className="section-label">FROM THE BLOG</p>

          <h2>
            Stories worth
            <br />
            <span>sharing.</span>
          </h2>
        </div>

        <div className="blog-carousel-actions">
          <Link className="blog-carousel-viewall" to="/blog">
            View all posts →
          </Link>

          {posts && posts.length > 1 && (
            <div className="blog-carousel-arrows">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {posts === null && <p className="blog-status">Loading posts…</p>}

      {posts && posts.length > 0 && (
        <div className="blog-carousel-track" ref={trackRef}>
          {posts.map((post) => (
            <Link
              className="blog-carousel-card"
              to={`/blog/${post.id}`}
              key={post.id}
            >
              <div className="blog-carousel-card-image">
                {post.photos?.[0] ? (
                  <img src={post.photos[0]} alt="" loading="lazy" />
                ) : (
                  <div className="blog-card-image-placeholder" />
                )}
              </div>

              <div className="blog-carousel-card-body">
                <span className="blog-card-tag">
                  {blogCategoryLabel(post.category)}
                </span>

                <h3>{post.title}</h3>

                <span className="blog-carousel-card-date">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default BlogCarousel;
