// src/lib/storage.js
//
// Handles uploading competition datasets to Firebase Storage and
// returns a public download URL that gets saved onto the event's
// `datasetUrl` field via src/lib/events.js.

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a dataset file for a given event slug.
 * @param {string} slug - event document id, used to namespace storage path
 * @param {File} file - the File object from an <input type="file">
 * @param {(percent: number) => void} onProgress - optional progress callback (0-100)
 * @returns {Promise<string>} the public download URL
 */
export function uploadDataset(slug, file, onProgress) {
  return new Promise((resolve, reject) => {
    const path = `datasets/${slug}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(percent));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/** Deletes a previously uploaded dataset given its full storage download URL. */
export async function deleteDatasetByUrl(downloadUrl) {
  // Firebase download URLs encode the storage path; easiest safe route
  // is to re-derive a ref from the URL via the SDK's ref() overload.
  const fileRef = ref(storage, downloadUrl);
  await deleteObject(fileRef);
}
