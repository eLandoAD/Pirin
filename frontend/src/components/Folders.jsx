import { useState, useEffect } from "react";
import { Folder, ChevronRight, Trash2, Pencil, File, Download, LayoutGrid, List } from "lucide-react";
import { useFolders } from "../hooks/useFolders";
import { fetchFiles, renameFileApi, deleteFileApi } from "../api/files";
import { downloadAndDecrypt } from "../api/download";

function Folders({ showModal, onCloseModal, fileRefreshKey, user }) {
  const {
    currentFolders,
    breadcrumb,
    createFolder,
    renameFolder,
    deleteFolder,
    openFolder,
    navigateTo,
    loading,
    error,
  } = useFolders();

  const [viewMode, setViewMode]               = useState("list");
  const [newFolderName, setNewFolderName]   = useState("");
  const [renamingId, setRenamingId]         = useState(null);
  const [renameValue, setRenameValue]       = useState("");
  const [files, setFiles]                   = useState([]);
  const [filesLoading, setFilesLoading]     = useState(false);
  const [filesError, setFilesError]         = useState("");
  const [renamingFileId, setRenamingFileId] = useState(null);
  const [renameFileValue, setRenameFileValue] = useState("");

  useEffect(() => {
    if (user) {
      loadFiles();
    } else {
      setFiles([]);
    }
  }, [fileRefreshKey, user]);

  async function loadFiles() {
    setFilesLoading(true);
    setFilesError("");
    try {
      const data = await fetchFiles();
      setFiles(data);
    } catch (e) {
      setFilesError("Errore nel caricamento dei file.");
    } finally {
      setFilesLoading(false);
    }
  }

  async function handleDownload(file) {
    const password = prompt("Inserisci la tua password per decifrare il file:");
    if (!password) return;
    try {
      const blob = await downloadAndDecrypt(file.id, password, { iv: file.iv });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Errore nel download: " + e.message);
    }
  }

  async function handleDeleteFile(id) {
    try {
      await deleteFileApi(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      alert("Errore nell'eliminazione: " + e.message);
    }
  }

  async function commitRenameFile(id) {
    try {
      await renameFileApi(id, renameFileValue);
      setFiles((prev) => prev.map((f) => f.id === id ? { ...f, filename: renameFileValue } : f));
    } catch (e) {
      alert("Errore nella rinomina: " + e.message);
    } finally {
      setRenamingFileId(null);
    }
  }

  function handleCreateFolder() {
    createFolder(newFolderName);
    setNewFolderName("");
    onCloseModal();
  }

  function handleClose() {
    setNewFolderName("");
    onCloseModal();
  }

  function startRename(folder) {
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  }

  function commitRename(id) {
    renameFolder(id, renameValue);
    setRenamingId(null);
  }

  return (
    <div className="rounded-lg border-2 border-slate-300 bg-primary-white p-4 w-full">
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
        <nav className="flex items-center gap-1 text-sm text-slate-500">
          <button onClick={() => navigateTo(null)} className="hover:text-slate-800">
            Root
          </button>
          {breadcrumb.map((folder) => (
            <span key={folder.id} className="flex items-center gap-1">
              <ChevronRight size={14} />
              <button onClick={() => navigateTo(folder.id)} className="hover:text-slate-800">
                {folder.name}
              </button>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md">
          <button 
            onClick={() => setViewMode("list")} 
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="Visualizza come lista"
          >
            <List size={16} />
          </button>
          <button 
            onClick={() => setViewMode("grid")} 
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="Visualizza come griglia"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Folders</h3>
        {currentFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <Folder size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">No folders here yet</p>
            <p className="text-xs mt-1">Click "Create Folder" to get started</p>
          </div>
        ) : (
          <ul className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" : "flex flex-col gap-2"}>
            {currentFolders.map((folder) => (
              <li key={folder.id} className={`group flex justify-between rounded-md px-3 py-2 hover:bg-slate-50 border border-transparent ${viewMode === "grid" ? "flex-col items-start gap-3 border-slate-200" : "items-center"}`}>
                {renamingId === folder.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitRename(folder.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    onBlur={() => commitRename(folder.id)}
                    className="rounded border border-slate-300 px-2 py-0.5 text-sm w-full"
                  />
                ) : (
                  <button onClick={() => openFolder(folder.id)} className={`flex gap-2 text-sm font-medium text-slate-800 text-left truncate w-full ${viewMode === "grid" ? "flex-col items-start" : "items-center"}`}>
                    <Folder size={viewMode === "grid" ? 24 : 16} className="text-green shrink-0" />
                    <span className="truncate w-full">{folder.name}</span>
                  </button>
                )}
                <div className={`flex items-center gap-2 ${viewMode === "grid" ? "w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity" : ""}`}>
                  <button onClick={() => startRename(folder)} className="text-slate-400 hover:text-slate-700" title="Rename">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteFolder(folder.id)} className="text-slate-400 hover:text-red-500" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Files</h3>

        {filesLoading && <p className="text-sm text-slate-400">Caricamento file...</p>}
        {filesError  && <p className="text-sm text-red-500">{filesError}</p>}

        {!filesLoading && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <File size={36} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">No files outside folders</p>
          </div>
        ) : (
          <ul className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" : "flex flex-col gap-2"}>
            {files.map((file) => (
              <li key={file.id} className={`group flex justify-between rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 border border-transparent ${viewMode === "grid" ? "flex-col items-start gap-3 border-slate-200" : "items-center"}`}>
                <div className={`flex gap-2 min-w-0 w-full ${viewMode === "grid" ? "flex-col items-start" : "items-center"}`}>
                  <File size={viewMode === "grid" ? 24 : 16} className="text-slate-500 shrink-0" />
                  {renamingFileId === file.id ? (
                    <input
                      autoFocus
                      value={renameFileValue}
                      onChange={(e) => setRenameFileValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRenameFile(file.id);
                        if (e.key === "Escape") setRenamingFileId(null);
                      }}
                      onBlur={() => commitRenameFile(file.id)}
                      className="rounded border border-slate-300 px-2 py-0.5 text-sm w-full"
                    />
                  ) : (
                    <span className="truncate w-full font-medium">{file.filename}</span>
                  )}
                </div>
                <div className={`flex items-center gap-2 ${viewMode === "grid" ? "w-full justify-end opacity-0 group-hover:opacity-100 transition-opacity" : ""}`}>
                  <button onClick={() => handleDownload(file)} className="text-slate-400 hover:text-green" title="Download">
                    <Download size={14} />
                  </button>
                  <button onClick={() => { setRenamingFileId(file.id); setRenameFileValue(file.filename); }} className="text-slate-400 hover:text-slate-700" title="Rename">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDeleteFile(file.id)} className="text-slate-400 hover:text-red-500" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40" onClick={handleClose}>
          <div className="rounded-lg bg-white p-6 shadow-xl w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-base font-semibold">New Folder</h3>
            <input
              autoFocus
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleClose} className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button onClick={handleCreateFolder} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Folders;