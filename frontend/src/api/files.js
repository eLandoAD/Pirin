import { authHeader } from "./auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : "/api";

export async function fetchFiles() {
  const res = await fetch(`${BASE_URL}/files`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Errore nel recupero dei file");
  return res.json();
}

export async function renameFileApi(id, filename) {
  const res = await fetch(`${BASE_URL}/files/${id}/rename`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) throw new Error("Errore nella rinomina");
}

export async function deleteFileApi(id) {
  const res = await fetch(`${BASE_URL}/files/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Errore nell'eliminazione");
}

export async function moveFileApi(id, folderId) {
  const res = await fetch(`${BASE_URL}/files/${id}/move`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ folderId: folderId ? String(folderId) : null }),
  });
  if (!res.ok) throw new Error("Errore nello spostamento");
}
