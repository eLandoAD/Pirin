# SecureVault — Encrypted File Storage

A web application for storing files with end-to-end encryption (E2EE).  
Files are encrypted **in the browser** before upload and decrypted **in the browser** after download. The server stores only ciphertext and can never read your files.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 25 + Spring Boot 4 |
| Frontend | React 19 + Vite + Tailwind CSS |
| Database | MySQL |
| Encryption | Web Crypto API (AES-GCM 256, PBKDF2) |

---

## Prerequisites

- Docker
- Docker Compose
- A GitHub Codespace **or** local environment with Docker available

---

## Docker Startup

From the repository root, start the full stack with:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d
```

This will start:

- the MySQL database on port `3306`
- the backend API on port `8080`
- the frontend on port `5173`

If you need to rebuild the images after changing the code, run:

```bash
docker compose -f .devcontainer/docker-compose.yml up -d --build
```

---

## 1. Project Structure

```
Pirin/
├── backend/
│   ├── build.gradle
│   ├── gradlew
│   ├── settings.gradle
│   ├── src/main/java/com/pirin/
│   │   ├── controller/       # REST endpoints
│   │   ├── dto/              # Request/Response objects
│   │   ├── entity/           # JPA entities (User, FileRecord, FolderRecord, ...)
│   │   ├── repository/       # Spring Data repositories
│   │   ├── security/         # JWT filter, Security config
│   │   └── service/          # Business logic (Auth, JWT, FileStorage)
│   └── src/main/resources/  # application.properties, mail config, storage path
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/              # Fetch calls to backend (auth, files, folders, upload, download)
        ├── components/       # React components (Folders, Upload, NavBar, ...)
        ├── crypto/           # Web Crypto API helpers (key derivation, encrypt, decrypt)
        ├── hooks/            # useFolders hook
        └── pages/            # top-level views like landing/login/dashboard
```

---

## 5. Features

- **Sign up / Login / Logout** with JWT authentication
- **Email verification** — link printed to console in development
- **Password reset** — link printed to console in development
- **End-to-end encrypted file upload** — files encrypted in the browser with AES-GCM before upload
- **Encrypted file download** — decrypted in the browser after download
- **Rename / Delete files**
- **Folder management** — create, rename, delete (with cascade), nested folders
- **Move files between folders** — Drive-style picker
- **Breadcrumb navigation**
- **Dark / Light mode**

---

## 6. Encryption Overview

See [`SECURITY.md`](./SECURITY.md) for the full key-management design.

In short:

1. At sign-up the browser derives a **KEK** from the password using PBKDF2 (150 000 iterations, SHA-256)
2. A random **DEK** (32 bytes) is generated and encrypted with the KEK
3. Only the encrypted DEK is stored on the server — the server never sees the plaintext DEK or the password
4. At upload: browser derives KEK → decrypts DEK → encrypts file with AES-GCM → sends ciphertext
5. At download: browser derives KEK → decrypts DEK → decrypts file with AES-GCM

---

## 7. What's Done / Partial / TODO

### Done
- Authentication (sign-up, email verification flow, login, logout, JWT)
- Password change with DEK re-encryption
- E2EE file upload and download (AES-GCM 256)
- File operations: rename, delete, move between folders
- Folder operations: create, rename, delete (cascade), nested, breadcrumb
- Dark / Light mode
- `SECURITY.md`
- Email sending flow implemented; delivery depends on correct SMTP configuration
- Password reset: backend and frontend flow implemented, including reset page and token handling
- Upload progress feedback

### With more time
- Better email delivery integration (e.g. SendGrid, Mailtrap)
- Upload progress bar
- File preview (images, text) decrypted in-browser
- File sharing between users
- Storage quota per user
- Search across file and folder names
