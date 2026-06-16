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
- `npm` available for frontend dependencies
- A GitHub Codespace **or** local environment

---

## 1. Database Setup

Create the database before starting the backend:

```sql
CREATE DATABASE secure_files;
```

The schema is generated automatically by Hibernate on first run via `spring.jpa.hibernate.ddl-auto=update`.

---

## 2. Backend Setup

Navigate to the backend folder:

```bash
cd Pirin/backend
```

Configure `src/main/resources/application.properties` before starting the server. Example values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/secure_files
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=your-secret-key-at-least-32-characters-long
jwt.expiration-ms=86400000

storage.path=uploads
app.frontend-url=http://localhost:5173
```

> **Important:** update `jwt.secret` before using this app in a real environment.

The repository includes a development SMTP setup in `application.properties`. If SMTP is configured correctly, verification and reset emails are sent to the user's real email address.

Run the backend:

```bash
./gradlew bootRun
```

The server starts on `http://localhost:8080`.

If you need to build the backend first:

```bash
./gradlew clean build
```

---

## 3. Frontend Setup

Navigate to the frontend folder:

```bash
cd Pirin/frontend
```

Install dependencies:

```bash
npm install
```

The frontend proxy configuration is located in `vite.config.js`.
By default, it points to the development backend URL used in Codespaces:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://crispy-potato-qv76gg55rgxxc99r5-8080.app.github.dev',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

If you run locally, change the proxy target to `http://localhost:8080`.

Run the frontend:

```bash
npm run dev
```

The app is available at `http://localhost:5173`.

For production preview:

```bash
npm run build
npm run preview
```

---

## 4. Project Structure

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
