import { authHeader } from "./auth";

const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api` 
  : "/api";

export async function fetchFolders() {
  const res = await fetch(`${BASE_URL}/folders`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Errore nel recupero delle cartelle");
  return res.json();
}

export async function createFolderApi(name, parentId) {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error("Errore nella creazione della cartella");
  return res.json();
}

export async function renameFolderApi(id, name) {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Errore nella rinomina");
  return res.json();
}

export async function deleteFolderApi(id) {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Errore nell'eliminazione");
}