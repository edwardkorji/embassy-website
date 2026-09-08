import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { db } from "../../lib/firebase";
import { BLOG_CATEGORIES, blogCategoryLabel } from "../../lib/blogCategories";
import { generateUniqueSlug } from "../../lib/slug";
import { deleteStorageUrls } from "../../lib/storageUtils";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageUploader from "../../components/ImageUploader";

function BlogPostForm({ post, onDone }) {
  const isEdit = Boolean(post);
  const [draftId] = useState(() => post?.id || crypto.randomUUID());
  const [title, setTitle] = useState(post?.title || "");
  const [category, setCategory] = useState(post?.category || BLOG_CATEGORIES[0]?.key || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [summary, setSummary] = useState(post?.summary || "");
  const [body, setBody] = useState(post?.body || "");
  const [photos, setPhotos] = useState(post?.photos || []);
  const [uploaderBusy, setUploaderBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (uploaderBusy) {
      setError("Please wait for photo uploads to finish.");
      return;
    }

    setSaving(true);
    setError("");

    const data = {
      title: title.trim(),
      category,
      author: author.trim(),
      summary: summary.trim(),
      body,
      photos,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "blogs", post.id), data);
      } else {
        const slug = await generateUniqueSlug("blogs", title.trim());
        await setDoc(doc(db, "blogs", slug), { ...data, publishedAt: serverTimestamp() });
      }
      onDone();
    } catch (err) {
      console.error("Failed to save blog post:", err);
      setError("Couldn't save this post — please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="dash-card">
      <h2>{isEdit ? "Edit post" : "New post"}</h2>

      {error && <div className="dash-banner dash-banner-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <FormField label="Title" htmlFor="post-title">
          <input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormField>

        <div className="dash-form-row">
          <FormField label="Category" htmlFor="post-category">
            <select
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Author" htmlFor="post-author" hint="Optional">
            <input id="post-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </FormField>
        </div>

        <FormField label="Summary" htmlFor="post-summary" hint="Shown on the blog list card.">
          <input id="post-summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </FormField>

        <FormField label="Body" htmlFor="post-body" hint="Leave a blank line between paragraphs.">
          <textarea
            id="post-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
          />
        </FormField>

        <FormField label="Photos">
          <ImageUploader
            multiple
            kind="image"
            pathPrefix={`blogs/${draftId}`}
            initialUrls={post?.photos || []}
            onChange={setPhotos}
            onBusyChange={setUploaderBusy}
          />
        </FormField>

        <div className="dash-form-actions">
          <Button type="button" variant="secondary" onClick={onDone} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={uploaderBusy}>
            {isEdit ? "Save changes" : "Publish post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function DashboardBlog() {
  const [posts, setPosts] = useState(null);
  const [formTarget, setFormTarget] = useState(null);
  const [formToken, setFormToken] = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const openNew = () => {
    setFormTarget({ post: null });
    setFormToken((t) => t + 1);
  };

  const openEdit = (post) => {
    setFormTarget({ post });
    setFormToken((t) => t + 1);
  };

  const closeForm = () => setFormTarget(null);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteStorageUrls(confirmTarget.photos);
      await deleteDoc(doc(db, "blogs", confirmTarget.id));
      setConfirmTarget(null);
    } catch (err) {
      console.error("Failed to delete blog post:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (formTarget) {
    return <BlogPostForm key={formToken} post={formTarget.post} onDone={closeForm} />;
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1>Blog posts</h1>
          <p>Stories and updates shown on the public blog.</p>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Plus size={18} /> New post
        </Button>
      </div>

      {posts === null && <p className="dash-empty">Loading…</p>}
      {posts && posts.length === 0 && (
        <p className="dash-empty">No posts yet — create your first one.</p>
      )}

      <div className="dash-list">
        {posts?.map((post) => (
          <div className="dash-list-item" key={post.id}>
            {post.photos?.[0] ? (
              <img className="dash-list-item-thumb" src={post.photos[0]} alt="" />
            ) : (
              <div className="dash-list-item-thumb dash-list-item-thumb--placeholder">
                <Newspaper size={20} />
              </div>
            )}

            <div className="dash-list-item-body">
              <div className="dash-list-item-title">{post.title}</div>
              <div className="dash-list-item-meta">
                <span>{blogCategoryLabel(post.category)}</span>
                {post.author && <span>{post.author}</span>}
              </div>
            </div>

            <div className="dash-list-item-actions">
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => openEdit(post)}
                aria-label={`Edit ${post.title}`}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setConfirmTarget(post)}
                aria-label={`Delete ${post.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmTarget && (
        <ConfirmDialog
          title="Delete this post?"
          message={`"${confirmTarget.title}" will be permanently removed from the website.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}

export default DashboardBlog;
