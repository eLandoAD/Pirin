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

- Java 25
- Node.js >= 18
- MySQL running on `localhost:3306`
- A GitHub Codespace **or** local environment

---

## 1. Database Setup

Create the database before starting the backend:

```sql
CREATE DATABASE secure_files;
```

The schema is generated automatically by Hibernate (`ddl-auto=update`) on first run.

---

## 2. Backend Setup

Navigate to the backend folder:

```bash
cd Pirin
```

Configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/secure_files
spring.datasource.username=root
spring.datasource.password=root

jwt.secret=your-secret-key-at-least-32-characters-long
jwt.expiration-ms=86400000

storage.path=uploads
app.frontend-url=http://localhost:5173
```

> **GitHub Codespaces**: set `app.frontend-url` to your Codespace frontend URL (e.g. `https://<name>-5173.app.github.dev`) and make sure port 8080 is set to **Public** in the Ports tab.

Run the backend:

```bash
./gradlew bootRun
```

The server starts on `http://localhost:8080`.

---

## 3. Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the backend URL in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // or your Codespace backend URL
      changeOrigin: true,
    },
  },
},
```

Run the frontend:

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

---

## 4. Project Structure

```
Pirin/
├── backend/
│   └── src/main/java/com/pirin/
│       ├── controller/       # REST endpoints
│       ├── dto/              # Request/Response objects
│       ├── entity/           # JPA entities (User, FileRecord, FolderRecord, ...)
│       ├── repository/       # Spring Data repositories
│       ├── security/         # JWT filter, Security config
│       └── service/          # Business logic (Auth, JWT, FileStorage)
│
└── frontend/
    └── src/
        ├── api/              # Fetch calls to backend (auth, files, folders, upload, download)
        ├── components/       # React components (Folders, Upload, NavBar, ...)
        ├── crypto/           # Web Crypto API (key derivation, encrypt, decrypt)
        └── hooks/            # useFolders hook
```

---

## 5. Features

- **Sign up / Login / Logout** with JWT authentication
- **Email verification** — link printed to console in development
- **Password reset** — link printed to console in development
- **End-to-end encrypted file upload** — files encrypted in the browser with AES-GCM before leaving the device
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

### Partial
- Email sending: flow exists, links printed to console — SMTP not configured with real credentials
- Password reset: backend flow complete, frontend page missing
- Upload progress feedback: not implemented

### With more time
- Real SMTP integration (e.g. SendGrid, Mailtrap)
- Upload progress bar
- File preview (images, text) decrypted in-browser
- File sharing between users
- Storage quota per user
- Search across file and folder names
