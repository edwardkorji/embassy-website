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
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, User } from "lucide-react";
import { db } from "../../lib/firebase";
import { deleteStorageUrls } from "../../lib/storageUtils";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImageUploader from "../../components/ImageUploader";

function TeamMemberForm({ member, nextOrder, onDone }) {
  const isEdit = Boolean(member);
  const [draftId] = useState(() => member?.id || crypto.randomUUID());
  const [name, setName] = useState(member?.name || "");
  const [role, setRole] = useState(member?.role || "");
  const [linkedin, setLinkedin] = useState(member?.linkedin || "");
  const [image, setImage] = useState(member?.image || "");
  const [uploaderBusy, setUploaderBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError("Name and title are required.");
      return;
    }
    if (uploaderBusy) {
      setError("Please wait for the photo to finish uploading.");
      return;
    }

    setSaving(true);
    setError("");

    const data = {
      name: name.trim(),
      role: role.trim(),
      linkedin: linkedin.trim() || "#",
      image,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "team", member.id), data);
      } else {
        await addDoc(collection(db, "team"), {
          ...data,
          order: nextOrder,
          createdAt: serverTimestamp(),
        });
      }
      onDone();
    } catch (err) {
      console.error("Failed to save team member:", err);
      setError("Couldn't save this person — please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="dash-card">
      <h2>{isEdit ? "Edit team member" : "Add team member"}</h2>

      {error && <div className="dash-banner dash-banner-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="dash-form-row">
          <FormField label="Name" htmlFor="member-name">
            <input id="member-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </FormField>

          <FormField label="Title" htmlFor="member-role">
            <input id="member-role" value={role} onChange={(e) => setRole(e.target.value)} required />
          </FormField>
        </div>

        <FormField label="LinkedIn URL" htmlFor="member-linkedin" hint="Optional">
          <input
            id="member-linkedin"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </FormField>

        <FormField label="Photo">
          <ImageUploader
            multiple={false}
            kind="image"
            pathPrefix={`team/${draftId}`}
            initialUrls={member?.image ? [member.image] : []}
            onChange={(urls) => setImage(urls[0] || "")}
            onBusyChange={setUploaderBusy}
          />
        </FormField>

        <div className="dash-form-actions">
          <Button type="button" variant="secondary" onClick={onDone} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving} disabled={uploaderBusy}>
            {isEdit ? "Save changes" : "Add to team"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function DashboardTeam() {
  const [members, setMembers] = useState(null);
  const [formTarget, setFormTarget] = useState(null);
  const [formToken, setFormToken] = useState(0);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "team"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const openNew = () => {
    setFormTarget({ member: null });
    setFormToken((t) => t + 1);
  };

  const openEdit = (member) => {
    setFormTarget({ member });
    setFormToken((t) => t + 1);
  };

  const closeForm = () => setFormTarget(null);

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteStorageUrls([confirmTarget.image]);
      await deleteDoc(doc(db, "team", confirmTarget.id));
      setConfirmTarget(null);
    } catch (err) {
      console.error("Failed to delete team member:", err);
    } finally {
      setDeleting(false);
    }
  };

  const move = async (index, direction) => {
    const targetIndex = index + direction;
    if (!members || targetIndex < 0 || targetIndex >= members.length) return;

    const a = members[index];
    const b = members[targetIndex];
    const batch = writeBatch(db);
    batch.update(doc(db, "team", a.id), { order: b.order });
    batch.update(doc(db, "team", b.id), { order: a.order });
    await batch.commit();
  };

  if (formTarget) {
    const nextOrder = members && members.length > 0
      ? Math.max(...members.map((m) => m.order ?? 0)) + 1
      : 0;
    return (
      <TeamMemberForm
        key={formToken}
        member={formTarget.member}
        nextOrder={nextOrder}
        onDone={closeForm}
      />
    );
  }

  return (
    <div>
      <div className="dash-page-header">
        <div>
          <h1>Team</h1>
          <p>Who shows up on the public "Meet the team" section, and in what order.</p>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Plus size={18} /> Add person
        </Button>
      </div>

      {members === null && <p className="dash-empty">Loading…</p>}
      {members && members.length === 0 && (
        <p className="dash-empty">No team members yet — add your first one.</p>
      )}

      <div className="dash-list">
        {members?.map((member, index) => (
          <div className="dash-list-item" key={member.id}>
            {member.image ? (
              <img className="dash-list-item-thumb" src={member.image} alt="" />
            ) : (
              <div className="dash-list-item-thumb dash-list-item-thumb--placeholder">
                <User size={20} />
              </div>
            )}

            <div className="dash-list-item-body">
              <div className="dash-list-item-title">{member.name}</div>
              <div className="dash-list-item-meta">
                <span>{member.role}</span>
              </div>
            </div>

            <div className="dash-list-item-actions">
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => move(index, 1)}
                disabled={index === members.length - 1}
                aria-label="Move down"
              >
                <ChevronDown size={16} />
              </button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => openEdit(member)}>
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setConfirmTarget(member)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmTarget && (
        <ConfirmDialog
          title="Remove this person?"
          message={`"${confirmTarget.name}" will be removed from the public team section.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}

export default DashboardTeam;
