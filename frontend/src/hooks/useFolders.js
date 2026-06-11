import { useState, useCallback, useEffect } from "react";
import {
  fetchFolders,
  createFolderApi,
  renameFolderApi,
  deleteFolderApi,
} from "../api/folders";

export function useFolders() {

  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica le cartelle dal backend al mount
  useEffect(() => {
    fetchFolders()
      .then((data) => {
        setFolders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getChildren = useCallback(
    (parentId) => folders.filter((f) => f.parentId === parentId),
    [folders]
  );

  const getBreadcrumb = useCallback(() => {
    const crumbs = [];
    let id = currentFolderId;
    while (id !== null) {
      const folder = folders.find((f) => f.id === id);
      if (!folder) break;
      crumbs.unshift(folder);
      id = folder.parentId;
    }
    return crumbs;
  }, [folders, currentFolderId]);

  const createFolder = useCallback(
    async (name) => {
      if (!name.trim()) return;
      try {
        const newFolder = await createFolderApi(name.trim(), currentFolderId);
        setFolders((prev) => [...prev, newFolder]);
        return newFolder;
      } catch (err) {
        setError(err.message);
      }
    },
    [currentFolderId]
  );

  const renameFolder = useCallback(async (id, newName) => {
    if (!newName.trim()) return;
    try {
      const updated = await renameFolderApi(id, newName.trim());
      setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteFolder = useCallback(async (id) => {
    try {
      await deleteFolderApi(id);
      setFolders((prev) => {
        const toDelete = new Set();
        const collect = (folderId) => {
          toDelete.add(folderId);
          prev.filter((f) => f.parentId === folderId).forEach((f) => collect(f.id));
        };
        collect(id);
        return prev.filter((f) => !toDelete.has(f.id));
      });
      setCurrentFolderId((cur) => (cur === id ? null : cur));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const openFolder = useCallback((id) => setCurrentFolderId(id), []);
  const navigateTo = useCallback((id) => setCurrentFolderId(id), []);

  return {
    folders,
    currentFolderId,
    currentFolders: getChildren(currentFolderId),
    breadcrumb: getBreadcrumb(),
    loading,
    error,
    createFolder,
    renameFolder,
    deleteFolder,
    openFolder,
    navigateTo,
  };
}