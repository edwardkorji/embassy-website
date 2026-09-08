import { useEffect, useRef, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { Camera, Image as ImageIcon, FileText, X, RefreshCw } from "lucide-react";
import { storage } from "../lib/firebase";

const HEIC_MESSAGE =
  "That's an iPhone HEIC photo, which doesn't display reliably on the web. Switch your camera to Settings → Camera → Formats → \"Most Compatible\", or share/save the photo first (that usually converts it to JPEG).";

function isHeic(file) {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.heic$|\.heif$/i.test(file.name)
  );
}

function sanitizeName(name) {
  return name
    .replace(/\.[^./]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "file";
}

async function compressImage(file, maxEdge = 1920, quality = 0.82) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    return blob || file;
  } catch (err) {
    console.error("Image compression failed, uploading original:", err);
    return file;
  }
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `up-${Date.now()}-${idCounter}`;
}

// Module-level (not called during render) so it composes a fresh,
// collision-proof filename each time it's invoked from an upload handler.
function buildStoragePath(pathPrefix, kind, originalName) {
  const ext =
    kind === "image" ? ".jpg" : originalName.slice(originalName.lastIndexOf("."));
  return `${pathPrefix}/${Date.now()}-${sanitizeName(originalName || "file")}${ext}`;
}

/**
 * Reusable upload widget. Always exposes the current list of *successfully
 * uploaded* URLs via onChange — multiple=false callers should read urls[0].
 */
function ImageUploader({
  multiple = false,
  kind = "image", // "image" | "document"
  pathPrefix,
  initialUrls = [],
  onChange,
  onBusyChange,
  maxSizeMB = kind === "document" ? 25 : 15,
  ariaLabel = kind === "document" ? "File" : "Photos",
}) {
  const [items, setItems] = useState(() =>
    initialUrls.filter(Boolean).map((url) => ({
      id: nextId(),
      status: "done",
      url,
      name: url.split("/").pop(),
    }))
  );

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const emitChange = (nextItems) => {
    onChange?.(nextItems.filter((i) => i.status === "done").map((i) => i.url));
  };

  useEffect(() => {
    const busy = items.some((i) => i.status === "uploading");
    onBusyChange?.(busy);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateItem = (id, patch) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, ...patch } : i));
      if (patch.status === "done" || patch.status === "removed") emitChange(next);
      return patch.status === "removed" ? next.filter((i) => i.id !== id) : next;
    });
  };

  const startUpload = (item, file) => {
    const path = buildStoragePath(pathPrefix, kind, file.name || "file");
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: kind === "image" ? "image/jpeg" : file.type,
    });

    task.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        updateItem(item.id, { progress });
      },
      (err) => {
        console.error("Upload failed:", err);
        updateItem(item.id, { status: "error", error: "Upload failed — check your connection." });
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        updateItem(item.id, { status: "done", url, progress: 100 });
      }
    );
  };

  const processAndUpload = async (item, rawFile) => {
    if (kind === "image" && isHeic(rawFile)) {
      updateItem(item.id, { status: "error", error: HEIC_MESSAGE });
      return;
    }

    if (rawFile.size > 30 * 1024 * 1024) {
      updateItem(item.id, { status: "error", error: "File is too large (over 30MB)." });
      return;
    }

    const uploadFile = kind === "image" ? await compressImage(rawFile) : rawFile;

    if (uploadFile.size > maxSizeMB * 1024 * 1024) {
      updateItem(item.id, {
        status: "error",
        error: `File is too large — please keep it under ${maxSizeMB}MB.`,
      });
      return;
    }

    startUpload(item, uploadFile);
  };

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const incoming = files.map((file) => ({
      id: nextId(),
      status: "uploading",
      progress: 0,
      name: file.name,
      previewUrl: kind === "image" ? URL.createObjectURL(file) : null,
      file,
    }));

    setItems((prev) => (multiple ? [...prev, ...incoming] : incoming));
    incoming.forEach((item) => processAndUpload(item, item.file));
  };

  const handleRemove = async (item) => {
    if (item.status === "done" && item.url) {
      try {
        await deleteObject(ref(storage, item.url));
      } catch {
        // best-effort — file may already be gone, or came from elsewhere
      }
    }
    updateItem(item.id, { status: "removed" });
  };

  const handleRetry = (item) => {
    updateItem(item.id, { status: "uploading", progress: 0, error: null });
    processAndUpload(item, item.file);
  };

  const acceptAttr = kind === "image" ? "image/*" : ".pdf,.doc,.docx";

  return (
    <div className="uploader">
      <div className="uploader-controls">
        {kind === "image" && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={18} /> Take photo
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => galleryInputRef.current?.click()}
        >
          {kind === "image" ? <ImageIcon size={18} /> : <FileText size={18} />}
          {kind === "image" ? "Choose from gallery" : "Choose file"}
        </button>
      </div>

      {kind === "image" && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          aria-label={`${ariaLabel} — take photo`}
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      )}

      <input
        ref={galleryInputRef}
        type="file"
        accept={acceptAttr}
        multiple={multiple && kind === "image"}
        aria-label={ariaLabel}
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="uploader-hint">
        {kind === "image"
          ? "JPEG/PNG photos are resized automatically. HEIC photos from iPhone aren't supported."
          : `PDF or Word document, up to ${maxSizeMB}MB.`}
      </p>

      {items.length > 0 && kind === "image" && (
        <div className="uploader-preview-grid">
          {items.map((item) => (
            <div className="uploader-preview" key={item.id}>
              <img src={item.previewUrl || item.url} alt="" />

              {item.status === "uploading" && (
                <div className="uploader-preview-progress">
                  <div
                    className="uploader-preview-progress-bar"
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              )}

              {item.status === "error" && (
                <div className="uploader-preview-error">
                  <span>{item.error}</span>
                  <button type="button" onClick={() => handleRetry(item)}>
                    <RefreshCw size={12} /> Retry
                  </button>
                </div>
              )}

              <button
                type="button"
                className="uploader-preview-remove"
                onClick={() => handleRemove(item)}
                aria-label="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && kind === "document" && (
        <div className="dash-list" style={{ marginTop: 16 }}>
          {items.map((item) => (
            <div className="dash-list-item" key={item.id}>
              <FileText size={20} />
              <div className="dash-list-item-body">
                <div className="dash-list-item-title">{item.name}</div>
                {item.status === "uploading" && (
                  <div className="dash-list-item-meta">Uploading… {item.progress || 0}%</div>
                )}
                {item.status === "error" && (
                  <div className="dash-list-item-meta" style={{ color: "#c0392b" }}>
                    {item.error}
                  </div>
                )}
              </div>
              <div className="dash-list-item-actions">
                {item.status === "error" && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    onClick={() => handleRetry(item)}
                    aria-label={`Retry uploading ${item.name}`}
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  onClick={() => handleRemove(item)}
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
