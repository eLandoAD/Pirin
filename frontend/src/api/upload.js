import { deriveKEK } from "../crypto/key";
import { authHeader } from "./auth";

const BASE_URL = "/api";

export async function uploadFile(file, password) {
  const encryptedDekB64 = localStorage.getItem("encryptedDek");
  const dekSaltB64      = localStorage.getItem("dekSalt");
  const dekIvB64        = localStorage.getItem("dekIv");

  if (!encryptedDekB64 || !dekSaltB64 || !dekIvB64) {
    throw new Error("Dati DEK non trovati. Effettua il login.");
  }

  const encryptedDekBytes = Uint8Array.from(atob(encryptedDekB64), c => c.charCodeAt(0));
  const dekSalt           = Uint8Array.from(atob(dekSaltB64),      c => c.charCodeAt(0));
  const dekIv             = Uint8Array.from(atob(dekIvB64),        c => c.charCodeAt(0));

  const kek = await deriveKEK(password, dekSalt);

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
    ["encrypt"]
  );

  const fileIv = crypto.getRandomValues(new Uint8Array(12));

  const fileBuffer    = await file.arrayBuffer();
  const encryptedFile = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: fileIv },
    dek,
    fileBuffer
  );

  const fileIvB64 = btoa(String.fromCharCode(...fileIv));

  const formData = new FormData();
  formData.append("file", new Blob([encryptedFile]), file.name);
  formData.append("iv",   fileIvB64);
  formData.append("salt", dekSaltB64);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: { ...authHeader() },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload fallito");
  return res.json();
}