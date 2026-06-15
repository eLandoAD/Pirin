import FilePreview from "./FilePreview";
import { useState, useEffect } from "react";
import {
  Folder,
  ChevronRight,
  Trash2,
  Pencil,
  File,
  Download,
  FolderInput,
  Eye
} from "lucide-react";
import { fetchFiles, renameFileApi, deleteFileApi, moveFileApi } from "../api/files";
import { downloadAndDecrypt } from "../api/download";
import FolderPicker from "./FolderPicker";

function Folders({ showModal, onCloseModal, fileRefreshKey, user, searchQuery = "" }) {
  const {
    folders, currentFolders, breadcrumb,
    createFolder, renameFolder, deleteFolder,
    openFolder, navigateTo, loading, error,
  } = useFolders();

  const [newFolderName, setNewFolderName]     = useState("");
  const [renamingId, setRenamingId]           = useState(null);
  const [renameValue, setRenameValue]         = useState("");
  const [files, setFiles]                     = useState([]);
  const [filesLoading, setFilesLoading]       = useState(false);
  const [filesError, setFilesError]           = useState("");
  const [renamingFileId, setRenamingFileId]   = useState(null);
  const [renameFileValue, setRenameFileValue] = useState("");
  const [movingFile, setMovingFile]           = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState("");

  useEffect(() => { loadFiles(); }, []);


  function getMimeType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();

  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",

    pdf: "application/pdf",

    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",

    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",

    txt: "text/plain"
  };

  return map[ext] || "application/octet-stream";
}
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
      a.href = url; a.download = file.filename; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Errore nel download: " + e.message);
    }
  }

  async function handlePreview(file) {
  const password = prompt(
    "Inserisci la password per decifrare il file:"
  );

  if (!password) return;

  try {
    const blob = await downloadAndDecrypt(
      file.id,
      password,
      {
        iv: file.iv
      }
    );

    const mimeType = getMimeType(file.filename);

    const typedBlob = new Blob(
      [await blob.arrayBuffer()],
      { type: mimeType }
    );

    const url = URL.createObjectURL(typedBlob);

    setPreviewFile(file);
    setPreviewType(mimeType);
    setPreviewUrl(url);
  } catch (e) {
    alert("Errore preview: " + e.message);
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

  async function handleMoveFile(folderId) {
    if (!movingFile) return;
    try {
      await moveFileApi(movingFile.id, folderId);
      setFiles((prev) => prev.map((f) =>
        f.id === movingFile.id ? { ...f, folderId: folderId ?? null } : f
      ));
    } catch (e) {
      alert("Errore nello spostamento: " + e.message);
    } finally {
      setMovingFile(null);
    }
  }

  function handleCreateFolder() {
    createFolder(newFolderName);
    setNewFolderName("");
    onCloseModal();
  }

  const currentFolderId = breadcrumb.length > 0 ? breadcrumb[breadcrumb.length - 1].id : null;

  // Filtra file e cartelle in base alla searchQuery
  const visibleFiles = files
    .filter((f) => (f.folderId ?? null) === currentFolderId)
    .filter((f) => f.filename.toLowerCase().includes(searchQuery.toLowerCase()));

  const visibleFolders = currentFolders
    .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="rounded-lg border-2 border-slate-300 bg-primary-white p-4 w-full">
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error   && <p className="text-sm text-red-500">{error}</p>}

      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1 text-sm text-slate-500">
        <button onClick={() => navigateTo(null)} className="hover:text-slate-800">Root</button>
        {breadcrumb.map((folder) => (
          <span key={folder.id} className="flex items-center gap-1">
            <ChevronRight size={14} />
            <button onClick={() => navigateTo(folder.id)} className="hover:text-slate-800">{folder.name}</button>
          </span>
        ))}
      </nav>

      {/* Cartelle */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Folders</h3>
        {visibleFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <Folder size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">
              {searchQuery ? "No folders match your search" : "No folders here yet"}
            </p>
            {!searchQuery && <p className="text-xs mt-1">Click "Create Folder" to get started</p>}
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleFolders.map((folder) => (
              <li key={folder.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50">
                {renamingId === folder.id ? (
                  <input autoFocus value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { renameFolder(folder.id, renameValue); setRenamingId(null); } if (e.key === "Escape") setRenamingId(null); }}
                    onBlur={() => { renameFolder(folder.id, renameValue); setRenamingId(null); }}
                    className="rounded border border-slate-300 px-2 py-0.5 text-sm" />
                ) : (
                  <button onClick={() => openFolder(folder.id)} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Folder size={16} className="text-teal-600" />{folder.name}
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => { setRenamingId(folder.id); setRenameValue(folder.name); }} className="text-slate-400 hover:text-slate-700" title="Rename"><Pencil size={14} /></button>
                  <button onClick={() => deleteFolder(folder.id)} className="text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={14} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* File */}
      <section className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Files</h3>
        {filesLoading && <p className="text-sm text-slate-400">Caricamento file...</p>}
        {filesError   && <p className="text-sm text-red-500">{filesError}</p>}
        {!filesLoading && visibleFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <File size={36} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">
              {searchQuery ? "No files match your search" : "No files here"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {visibleFiles.map((file) => (
              <li key={file.id} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <div className="flex items-center gap-2 min-w-0">
                  <File size={16} className="text-slate-500 shrink-0" />
                  {renamingFileId === file.id ? (
                    <input autoFocus value={renameFileValue}
                      onChange={(e) => setRenameFileValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") commitRenameFile(file.id); if (e.key === "Escape") setRenamingFileId(null); }}
                      onBlur={() => commitRenameFile(file.id)}
                      className="rounded border border-slate-300 px-2 py-0.5 text-sm" />
                  ) : (
                    <span className="truncate">{file.filename}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <button
                    onClick={() => handlePreview(file)}
                    className="text-slate-400 hover:text-blue-500"
                    title="Preview"
                  >
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleDownload(file)} className="text-slate-400 hover:text-teal-600" title="Download"><Download size={14} /></button>
                  <button onClick={() => { setRenamingFileId(file.id); setRenameFileValue(file.filename); }} className="text-slate-400 hover:text-slate-700" title="Rename"><Pencil size={14} /></button>
                  <button onClick={() => setMovingFile(file)} className="text-slate-400 hover:text-blue-500" title="Sposta"><FolderInput size={14} /></button>
                  <button onClick={() => handleDeleteFile(file.id)} className="text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={14} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal crea cartella */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40" onClick={() => { setNewFolderName(""); onCloseModal(); }}>
          <div className="rounded-lg bg-white p-6 shadow-xl w-80" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-base font-semibold">New Folder</h3>
            <input autoFocus type="text" placeholder="Folder name" value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setNewFolderName(""); onCloseModal(); }} className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
              <button onClick={handleCreateFolder} className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* FolderPicker */}
      {movingFile && (
        <FolderPicker
          folders={folders}
          filename={movingFile.filename}
          onSelect={handleMoveFile}
          onCancel={() => setMovingFile(null)}
        />
      )}

      {previewFile && (
      <FilePreview
        fileName={previewFile.filename}
        previewUrl={previewUrl}
        mimeType={previewType}
        onClose={() => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }

          setPreviewFile(null);
          setPreviewUrl(null);
          setPreviewType("");
        }}
      />
    )}
    </div>
  );
}

export default Folders;