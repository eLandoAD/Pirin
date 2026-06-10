import { deriveKEK } from "./key";

export async function createUserKeys(password) {

    const dek = crypto.getRandomValues(
        new Uint8Array(32)
    );

    const salt = crypto.getRandomValues(
        new Uint8Array(16)
    );

    const iv = crypto.getRandomValues(
        new Uint8Array(12)
    );

    const kek = await deriveKEK(password, salt);

    const encryptedDek = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv
        },
        kek,
        dek
    );

    return {
        encryptedDek: btoa(
            String.fromCharCode(
                ...new Uint8Array(encryptedDek)
            )
        ),
        dekSalt: btoa(
            String.fromCharCode(...salt)
        ),
        dekIv: btoa(
            String.fromCharCode(...iv)
        )
    };
}