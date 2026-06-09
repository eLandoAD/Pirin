import { useState, useCallback } from "react";

// Contatore globale per generare ID unici alle cartelle.
// Quando il backend e' integrato va cancellato perche' ID dovrebbero arrivare da server
let nextId = 1;
const makeId = () => `folder-${nextId++}`;

export function useFolders() {

  // --- STATO ---

  // Lista PIATTA di tutte le cartelle. Ogni cartella ha questa forma:
  // { id: string, name: string, parentId: string | null }
  // parentId === null significa che la cartella è nel root.
  // Usiamo una lista piatta (non un albero annidato) perché è più
  // semplice da aggiornare con useState.
  const [folders, setFolders] = useState([]);

  // ID della cartella attualmente aperta. null = siamo nel root.
  const [currentFolderId, setCurrentFolderId] = useState(null);

  // --- LETTURA ---

  // Filtra la lista piatta e restituisce solo le cartelle
  // che sono figlie DIRETTE di parentId.
  // Es: se parentId è null, restituisce le cartelle del root.
  const getChildren = useCallback(
    (parentId) => folders.filter((f) => f.parentId === parentId),
    [folders]
  );

  // Costruisce il percorso (breadcrumb) dalla cartella corrente fino al root.
  // Parte dall'ID corrente, trova la cartella, poi risale al suo parent,
  // e così via finché non arriva al root (parentId === null).
  // unshift() aggiunge in testa, quindi il risultato è ordinato root → corrente.
  // Es: [{ name: "Documenti" }, { name: "Lavoro" }, { name: "2024" }]
  const getBreadcrumb = useCallback(() => {
    const crumbs = [];
    let id = currentFolderId;
    while (id !== null) {
      const folder = folders.find((f) => f.id === id);
      if (!folder) break;         // sicurezza: id non trovato
      crumbs.unshift(folder);     // aggiunge in testa
      id = folder.parentId;       // sale di un livello
    }
    return crumbs;
  }, [folders, currentFolderId]);

  // --- MUTAZIONI ---

  // Crea una nuova cartella nella posizione corrente.
  // trim() rimuove spazi inutili, e blocca nomi vuoti.
  // parentId è currentFolderId: la cartella viene creata dove siamo ora.
  // TODO backend: POST /folders con { name, parentId }
  const createFolder = useCallback(
    (name) => {
      if (!name.trim()) return;
      const newFolder = {
        id: makeId(),
        name: name.trim(),
        parentId: currentFolderId,
      };
      setFolders((prev) => [...prev, newFolder]); // aggiunge senza mutare lo stato
      return newFolder;
    },
    [currentFolderId]
  );

  // Rinomina una cartella cercandola per ID e sostituendo solo il campo name.
  // map() restituisce un nuovo array: non muta mai quello originale (regola React).
  // TODO backend: PUT /folders/:id con { name }
  const renameFolder = useCallback((id, newName) => {
    if (!newName.trim()) return;
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName.trim() } : f))
    );
  }, []);

  // Elimina una cartella E tutte le sue discendenti (figlie, nipoti, ecc.).
  // collect() è una funzione ricorsiva che raccoglie tutti gli ID da eliminare:
  //   1. aggiunge l'ID corrente al Set
  //   2. trova tutte le figlie dirette e si richiama su ognuna
  // Alla fine filter() tiene solo le cartelle il cui ID NON è nel Set.
  // Se stavamo navigando dentro la cartella eliminata, torna al root.
  // TODO backend: DELETE /folders/:id (il backend elimina le figlie a cascata)
  const deleteFolder = useCallback((id) => {
    setFolders((prev) => {
      const toDelete = new Set();
      const collect = (folderId) => {
        toDelete.add(folderId);
        prev
          .filter((f) => f.parentId === folderId)
          .forEach((f) => collect(f.id));
      };
      collect(id);
      return prev.filter((f) => !toDelete.has(f.id));
    });
    setCurrentFolderId((cur) => (cur === id ? null : cur));
  }, []);

  // Entra dentro una cartella impostando il suo ID come corrente.
  const openFolder = useCallback((id) => setCurrentFolderId(id), []);

  // Naviga a una cartella specifica — usata dal breadcrumb per
  // tornare indietro di più livelli in un click.
  // navigateTo(null) torna al root.
  const navigateTo = useCallback((id) => setCurrentFolderId(id), []);

  // --- VALORI ESPOSTI ---

  return {
    folders,                              // lista completa (raramente serve direttamente)
    currentFolderId,                      // ID della cartella aperta
    currentFolders: getChildren(currentFolderId), // cartelle visibili ora
    breadcrumb: getBreadcrumb(),          // percorso per il breadcrumb UI
    createFolder,
    renameFolder,
    deleteFolder,
    openFolder,
    navigateTo,
  };
}
