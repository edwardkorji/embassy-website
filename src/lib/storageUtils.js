import { ref, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

// Best-effort: a file may already be gone, or point somewhere Storage
// doesn't recognize — either way, don't block the caller's own delete.
export async function deleteStorageUrls(urls = []) {
  await Promise.all(
    urls.filter(Boolean).map(async (url) => {
      try {
        await deleteObject(ref(storage, url));
      } catch {
        // ignore
      }
    })
  );
}
