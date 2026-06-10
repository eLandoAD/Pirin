# Frontend - Setup and Run

This file explains how to install and run the frontend project (Vite + React).

Prerequisites
- Node.js (recommended >= 18)
- npm (or `pnpm` / `yarn`)

Development install and run

Run the following commands inside the `frontend` folder:

```bash
npm install
npm run dev
```

The Vite dev server will start (default at `http://localhost:5173`). Open that URL in your browser.

Build and local preview

```bash
npm run build
npm run preview
```

This creates a production build in the `dist` folder and serves the static files locally for preview.

Backend connection

The frontend performs fetch requests to the backend. By default the API URLs (see `frontend/src/api/upload.js` and `frontend/src/api/download.js`) are configured to:

```
http://localhost:8080
```

Make sure the Spring Boot backend is running on `localhost:8080`, or update the API URLs in the frontend code accordingly.

Quick example to test the upload endpoint without the frontend:

```bash
curl -v -F "file=@/path/to/file" -F "password=test" http://localhost:8080/upload
```

Notes
- If you use Tailwind, follow the official integration steps (config, plugins). The project may already include configuration.
- To make the backend URL configurable, consider using `VITE_API_BASE_URL` in a `.env.local` file and reference `import.meta.env.VITE_API_BASE_URL` in your fetch calls.

If you want, I can update the code to use an environment variable instead of hardcoded URLs.