const BASE_URL = "https://crispy-potato-qv76gg55rgxxc99r5-8080.app.github.dev/api";

export async function fetchFolders() {
  const res = await fetch(`${BASE_URL}/folders`);
  if (!res.ok) throw new Error("Errore nel recupero delle cartelle");
  return res.json(); // restituisce array di { id, name, parentId }
}

// Crea una nuova cartella
// parentId è null se siamo nel root
export async function createFolderApi(name, parentId) {
  const res = await fetch(`${BASE_URL}/folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error("Errore nella creazione della cartella");
  return res.json(); // restituisce la cartella creata con il suo id
}

// Rinomina una cartella esistente
export async function renameFolderApi(id, name) {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Errore nella rinomina della cartella");
  return res.json();
}

// Elimina una cartella
export async function deleteFolderApi(id) {
  const res = await fetch(`${BASE_URL}/folders/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Errore nell'eliminazione della cartella");
}
