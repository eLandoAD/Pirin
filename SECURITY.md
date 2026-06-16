# SECURITY.md — SecureVault Key Management Design

## Overview

SecureVault implements true client-side end-to-end encryption (E2EE). The server stores only ciphertext and has no ability to decrypt any user file. Even an attacker with full access to the database and filesystem would see only encrypted blobs.

---

## Encryption Stack

| Layer | Algorithm | Purpose |
|---|---|---|
| File encryption | AES-256-GCM | Encrypts file contents |
| Key derivation | PBKDF2 / SHA-256 | Derives KEK from password |
| Key encryption | AES-256-GCM | Encrypts the DEK with the KEK |

All cryptographic operations use the **Web Crypto API** — a browser-native, audited implementation. We do not roll our own crypto.

---

## Key Hierarchy

We use a two-layer key scheme: a **KEK** (Key Encryption Key) and a **DEK** (Data Encryption Key).

```
User password
      │
      ▼  PBKDF2 (150,000 iterations, SHA-256, random 16-byte salt)
      KEK  ──────────────────────────────────────────────────┐
                                                             │ AES-256-GCM encrypt
      Random 32-byte DEK  ◄────────────────────────────────┘
             │
             │  AES-256-GCM encrypt (per-file random IV)
             ▼
      Encrypted file blob  ──► stored on server
```

### What the server stores

| Item | Stored on server | Plaintext? |
|---|---|---|
| `encryptedDek` | ✅ | ❌ — encrypted with KEK |
| `dekSalt` | ✅ | ✅ — not secret, needed to re-derive KEK |
| `dekIv` | ✅ | ✅ — not secret, needed to decrypt DEK |
| `KEK` | ❌ | — never leaves the browser |
| `DEK` (plaintext) | ❌ | — never leaves the browser |
| File contents (plaintext) | ❌ | — never stored |
| Password | ❌ | — never transmitted |

---

## Registration Flow

1. User enters username, email, password.
2. Browser generates a **random 32-byte DEK**.
3. Browser generates a **random 16-byte salt** and **12-byte IV**.
4. Browser derives the **KEK** from the password using PBKDF2 (150,000 iterations, SHA-256).
5. Browser encrypts the DEK with the KEK using AES-256-GCM.
6. Browser sends to server: `encryptedDek`, `dekSalt`, `dekIv`, hashed password (BCrypt), username, email.
7. Server stores only the encrypted DEK — it never sees the plaintext DEK or the KEK.

---

## Login Flow

1. User enters email and password.
2. Server verifies the BCrypt password hash and returns a JWT + `encryptedDek` + `dekSalt` + `dekIv`.
3. Browser re-derives the KEK from the password and `dekSalt`.
4. Browser decrypts the DEK using the KEK and `dekIv`.
5. The plaintext DEK is kept **in memory only** for the session — never written to localStorage or disk.

---

## File Upload Flow

1. Browser retrieves the plaintext DEK from memory.
2. Browser generates a **random 12-byte IV** for this file.
3. Browser encrypts the file with AES-256-GCM using the DEK and the per-file IV.
4. Browser sends to server: encrypted blob + `iv` + `salt` (the DEK salt, for metadata).
5. Server stores the encrypted blob on disk. It cannot decrypt it.

---

## File Download Flow

1. Browser requests the encrypted blob from the server.
2. Browser retrieves the plaintext DEK from memory.
3. Browser decrypts the blob using AES-256-GCM with the stored `iv`.
4. Decrypted file is offered for download — never stored server-side.

---

## Password Reset — The Trap and Our Solution

Naively changing the password would change the KEK, making the encrypted DEK unreadable and all files permanently lost. We handle this correctly:

1. User provides old password and new password.
2. Browser derives the old KEK from the old password.
3. Browser decrypts the DEK using the old KEK.
4. Browser derives a new KEK from the new password (new random salt + IV).
5. Browser re-encrypts the DEK with the new KEK.
6. Browser sends to server: new BCrypt hash + new `encryptedDek` + new `dekSalt` + new `dekIv`.

**Only the small DEK is re-encrypted — never the files themselves.** This is O(1) regardless of how many files the user has.

---

## Security Properties

- **Server blindness** — the server stores only ciphertext. It cannot read any file.
- **Per-file IVs** — each file has a unique random IV, preventing ciphertext comparison attacks.
- **Slow key derivation** — PBKDF2 with 150,000 iterations makes brute-force attacks on the password expensive.
- **No key material in localStorage** — the plaintext DEK and KEK exist only in memory during the session.
- **BCrypt for auth** — the password is hashed with BCrypt server-side for authentication, completely separate from the encryption key derivation.
- **JWT sessions** — stateless authentication with short-lived tokens (24h expiry).

---

## Known Limitations

- **Single device** — the DEK is derived at login and lives in memory. A second device can log in and re-derive the DEK from the password, so multi-device access works as long as the user remembers their password.
- **Password loss** — if the user forgets their password, all files are permanently unrecoverable. This is a deliberate consequence of real E2EE.
- **Email verification** — verification links are sent via SMTP using the configured mail settings. A real SMTP server must be configured for production.
