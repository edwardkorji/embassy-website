import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { db } from "../../lib/firebase";
import { deleteStorageUrls } from "../../lib/storageUtils";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageUploader from "../../components/ImageUploader";

const TYPE_LABELS = {
  report: "Monthly Report",
  article: "Academic Article",
};

function fileTypeFromUrl(url) {
  if (!url) return "pdf";
  const withoutQuery = url.split("?")[0];
  const ext = withoutQuery.split(".").pop().toLowerCase();
  return ["pdf", "doc", "docx"].includes(ext) ? (ext === "doc" ? "docx" : ext) : "pdf";
}

function PublicationForm({ publication, onDone }) {
  const isEdit = Boolean(publication);
  const [draftId] = useState(() => publication?.id || crypto.randomUUID());
  const [title, setTitle] = useState(publication?.title || "");
  const [type, setType] = useState(publication?.type || "report");
  const [author, setAuthor] = useState(publication?.author || "");
  const [summary, setSummary] = useState(publication?.summary || "");
  const [fileUrl, setFileUrl] = useState(publication?.fileUrl || "");
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
      setError("Please wait for the file to finish uploading.");
      return;
    }
    if (!fileUrl) {
      setError("Please attach a file.");
      return;
    }

    setSaving(true);
    setError("");

    const data = {
      title: title.trim(),
      type,
      author: author.trim(),
      summary: summary.trim(),
      fileUrl,
      fileType: fileTypeFromUrl(fileUrl),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "publications", publication.id), data);
      } else {
        await addDoc(collection(db, "publications"), {
          ...data,
          publishedAt: serverTimestamp(),
        });
      }
      onDone();
    } catch (err) {
      console.error("Failed to save publication:", err);
      setError("Couldn't save this publication — please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="dash-card">
      <h2>{isEdit ? "Edit publication" : "New publication"}</h2>

      {error && <div className="dash-banner dash-banner-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <FormField label="Title" htmlFor="pub-title">
          <input id="pub-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </FormField>

        <div className="dash-form-row">
          <FormField label="Type" htmlFor="pub-type">
            <select id="pub-type" value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Author" htmlFor="pub-author" hint="Optional">
            <input id="pub-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </FormField>
        </div>

        <FormField label="Summary" htmlFor="pub-summary" hint="Optional">
          <input id="pub-summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </FormField>

        <FormField label="File">
          <ImageUploader
            multiple={false}
            kind="document"
            pathPrefix={`publications/${draftId}`}
            initialUrls={publication?.fileUrl ? [publication.fileUrl] : []}
            onChange={(urls) => setFileUrl(urls[0] || "")}
            onBusyChange={setUploaderBusy}
          />
        </FormField>

        <div className="dash-form-actions">
          <Button type="button" variant="secondary" onClick={onDone} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={uploaderBusy}>
            {isEdit ? "Save changes" : "Publish"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function DashboardPublications() {
  const [publications, setPublications] = useState(null);
  const [formTarget, setFormTarget] = useState(null);
  const [formToken, setFormToken] = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "publications"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPublications(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const openNew = () => {
    setFormTarget({ publication: null });
    setFormToken((t) => t + 1);
  };

  const openEdit = (publication) => {
    setFormTarget({ publication });
    setFormToken((t) => t + 1);
  };

  const closeForm = () => setFormTarget(null);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteStorageUrls([confirmTarget.fileUrl]);
      await deleteDoc(doc(db, "publications", confirmTarget.id));
      setConfirmTarget(null);
    } catch (err) {
      console.error("Failed to delete publication:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (formTarget) {
    return (
      <PublicationForm key={formToken} publication={formTarget.publication} onDone={closeForm} />
    );
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1>Publications</h1>
          <p>Monthly reports and academic articles.</p>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Plus size={18} /> New publication
        </Button>
      </div>

      {publications === null && <p className="dash-empty">Loading…</p>}
      {publications && publications.length === 0 && (
        <p className="dash-empty">No publications yet — add your first one.</p>
      )}

      <div className="dash-list">
        {publications?.map((pub) => (
          <div className="dash-list-item" key={pub.id}>
            <div className="dash-list-item-thumb dash-list-item-thumb--placeholder">
              <FileText size={20} />
            </div>

            <div className="dash-list-item-body">
              <div className="dash-list-item-title">{pub.title}</div>
              <div className="dash-list-item-meta">
                <span>{TYPE_LABELS[pub.type] || "Publication"}</span>
                {pub.author && <span>{pub.author}</span>}
              </div>
            </div>

            <div className="dash-list-item-actions">
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => openEdit(pub)}
                aria-label={`Edit ${pub.title}`}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setConfirmTarget(pub)}
                aria-label={`Delete ${pub.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmTarget && (
        <ConfirmDialog
          title="Delete this publication?"
          message={`"${confirmTarget.title}" will be permanently removed from the website.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}

export default DashboardPublications;
