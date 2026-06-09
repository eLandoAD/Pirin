import { deriveKey } from "../crypto/key";

export async function downloadAndDecrypt(id, password, fileMeta) {

  const res = await fetch(`http://localhost:8080/download/${id}`);
  const encrypted = await res.arrayBuffer();

  const salt = Uint8Array.from(atob(fileMeta.salt), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(fileMeta.iv), c => c.charCodeAt(0));

  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );

  return new Blob([decrypted]);
}