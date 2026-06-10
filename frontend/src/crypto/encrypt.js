import { deriveKey } from "./key";

export async function encryptFile(file, password) {

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password, salt);
  const fileBuffer = await file.arrayBuffer();
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    fileBuffer
  );
  return {
    encrypted,
    salt,
    iv,
  };
}
export async function encryptFileWithDek(file, dek) {
  const key = await crypto.subtle.importKey(
    "raw",
    dek,
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const fileBuffer = await file.arrayBuffer();

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    fileBuffer
  );
  return {
    encrypted,
    iv,
  };
}