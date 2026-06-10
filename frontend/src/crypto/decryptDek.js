import { deriveKEK } from "./key";

export async function decryptDek(
    password,
    encryptedDek,
    salt,
    iv
){

   const kek = await deriveKEK(password,salt);

   const dek = await crypto.subtle.decrypt(
       {
           name:"AES-GCM",
           iv
       },
       kek,
       encryptedDek
   );

   return dek;
}