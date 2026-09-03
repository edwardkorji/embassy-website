import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BLOG_CATEGORIES, blogCategoryLabel } from "../lib/blogCategories";

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Blog() {
  const [posts, setPosts] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const visiblePosts = useMemo(() => {
    if (!posts) return [];
    if (!selectedCategory) return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (!db) {
      setPosts([]);
      return;
    }

    const postsQuery = query(collection(db, "blogs"), orderBy("publishedAt", "desc"));

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (err) => {
        console.error("Failed to load blog posts:", err);
        setPosts([]);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <main>
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <p className="section-label">BLOG</p>

          <h2>
            Stories from
            <br />
            <span>the Embassy.</span>
          </h2>

          <p className="blog-intro">
            Updates, behind-the-scenes moments and reflections from the
            Embassy of Sierra Leone in Addis Ababa.
          </p>
        </div>
      </section>

      <section className="blog-list">
        {posts === null && <p className="blog-status">Loading posts…</p>}

        {posts !== null && posts.length === 0 && (
          <p className="blog-status">No posts yet — check back soon.</p>
        )}

        {posts && posts.length > 0 && (
          <>
            <div className="blog-filter">
              <p className="blog-filter-label">Filter by category</p>

              <div className="blog-filter-pills">
                <button
                  type="button"
                  className={`blog-filter-pill${
                    selectedCategory === "" ? " active" : ""
                  }`}
                  onClick={() => handleCategoryChange("")}
                >
                  All posts
                </button>

                {BLOG_CATEGORIES.map((category) => (
                  <button
                    type="button"
                    key={category.key}
                    className={`blog-filter-pill${
                      selectedCategory === category.key ? " active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category.key)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {visiblePosts.length === 0 && (
              <p className="blog-status">No posts in this category yet.</p>
            )}

            <div className="blog-grid">
              {visiblePosts.map((post) => (
                <Link className="blog-card" to={`/blog/${post.id}`} key={post.id}>
                  <div className="blog-card-image">
                    {post.photos?.[0] ? (
                      <img src={post.photos[0]} alt="" loading="lazy" />
                    ) : (
                      <div className="blog-card-image-placeholder" />
                    )}
                  </div>

                  <div className="blog-card-body">
                    <span className="blog-card-tag">
                      {blogCategoryLabel(post.category)}
                    </span>

                    <h3>{post.title}</h3>

                    {post.summary && (
                      <p className="blog-card-summary">{post.summary}</p>
                    )}

                    <div className="blog-card-meta">
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Blog;
