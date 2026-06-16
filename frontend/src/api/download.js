import { deriveKEK } from "../crypto/key";
import { authHeader } from "./auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : "/api";

export async function downloadAndDecrypt(id, password, fileMeta) {
  const res = await fetch(`${BASE_URL}/download/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Download fallito");
  const encryptedBuffer = await res.arrayBuffer();

  const encryptedDekB64 = sessionStorage.getItem("encryptedDek");
  const dekSaltB64      = sessionStorage.getItem("dekSalt");
  const dekIvB64        = sessionStorage.getItem("dekIv");

  if (!encryptedDekB64 || !dekSaltB64 || !dekIvB64) {
    throw new Error("Dati DEK non trovati. Effettua il login.");
  }

  const encryptedDekBytes = Uint8Array.from(atob(encryptedDekB64), c => c.charCodeAt(0));
  const dekSalt           = Uint8Array.from(atob(dekSaltB64),      c => c.charCodeAt(0));
  const dekIv             = Uint8Array.from(atob(dekIvB64),        c => c.charCodeAt(0));

  const kek       = await deriveKEK(password, dekSalt);
  const dekBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: dekIv },
    kek,
    encryptedDekBytes
  );

  const dek = await crypto.subtle.importKey(
    "raw",
    dekBuffer,
    "AES-GCM",
    false,
    ["decrypt"]
  );

  const fileIv = Uint8Array.from(atob(fileMeta.iv), c => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fileIv },
    dek,
    encryptedBuffer
  );

  return new Blob([decrypted]);
}