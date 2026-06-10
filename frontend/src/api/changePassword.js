import { deriveKey } from "./key";

export async function changePassword({
  encryptedDek,
  salt,
  oldPassword,
  newPassword
}) {

  // 1. KEK vecchia password
  const oldKey = await deriveKey(oldPassword, salt);

  // 2. decrypt DEK
  const dekBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: salt.slice(0, 12)
    },
    oldKey,
    encryptedDek
  );

  // 3. KEK nuova password
  const newKey = await deriveKey(newPassword, salt);

  // 4. re-encrypt DEK
  const newEncryptedDek = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: salt.slice(0, 12)
    },
    newKey,
    dekBuffer
  );

  return newEncryptedDek;
}