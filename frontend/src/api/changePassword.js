import { deriveKEK } from "../crypto/key";
import { authHeader } from "./auth";

const BASE_URL = "/api";

export async function changePassword({ oldPassword, newPassword }) {
  const encryptedDekB64 = sessionStorage.getItem("encryptedDek");
  const dekSaltB64      = sessionStorage.getItem("dekSalt");
  const dekIvB64        = sessionStorage.getItem("dekIv");

  if (!encryptedDekB64 || !dekSaltB64 || !dekIvB64) {
    throw new Error("Dati DEK non trovati. Effettua il login.");
  }

  const encryptedDekBytes = Uint8Array.from(atob(encryptedDekB64), c => c.charCodeAt(0));
  const dekSalt           = Uint8Array.from(atob(dekSaltB64),      c => c.charCodeAt(0));
  const dekIv             = Uint8Array.from(atob(dekIvB64),        c => c.charCodeAt(0));

  const oldKek    = await deriveKEK(oldPassword, dekSalt);
  const dekBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: dekIv },        
    encryptedDekBytes
  );

  const newKek   = await deriveKEK(newPassword, dekSalt);
  const newDekIv = crypto.getRandomValues(new Uint8Array(12));

  const newEncryptedDekBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: newDekIv },
    newKek,
    dekBuffer
  );

  const newEncryptedDekB64 = btoa(String.fromCharCode(...new Uint8Array(newEncryptedDekBuffer)));
  const newDekIvB64        = btoa(String.fromCharCode(...newDekIv));

  const res = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({
      oldPassword,
      newPassword,
      newEncryptedDek: newEncryptedDekB64,
      newDekIv:        newDekIvB64,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Cambio password fallito");
  }

  localStorage.setItem("encryptedDek", newEncryptedDekB64);
  localStorage.setItem("dekIv",        newDekIvB64);

  return true;
}