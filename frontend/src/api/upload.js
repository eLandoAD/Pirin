import { deriveKey } from "./key";
import { encryptFileWithDek } from "./encrypt";

export async function uploadFile(file, password) {
  // 1. genera salt per derivare KEK
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // 2. deriva KEK dalla password
  const kek = await deriveKey(password, salt);

  // 3. genera DEK (chiave random per cifrare file)
  const dek = crypto.getRandomValues(new Uint8Array(32));

  // 4. cifra il file con DEK
  const { encrypted, iv } = await encryptFileWithDek(file, dek);

  // 5. cifro il DEK con KEK (IMPORTANTISSIMO)
  const encryptedDek = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: salt.subarray(0, 12) },
    kek,
    dek
  );

  // 6. invio al server
  const formData = new FormData();
  formData.append("file", new Blob([encrypted]));
  formData.append("iv", new Blob([iv]));
  formData.append("salt", new Blob([salt]));
  formData.append("encryptedDek", new Blob([encryptedDek]));

  return fetch("/upload", {
    method: "POST",
    body: formData,
    body: formData,
  });

  const data = await res.json();
  return data;
}