import { useState } from "react";
import { Folder, ChevronRight, Trash2, Pencil, File } from "lucide-react";
import { useFolders } from "../hooks/useFolders";

function Folders({ showModal, onCloseModal }) {
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

  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Dati finti solo per grafica, poi arriveranno dal database
  const filesWithoutFolder = [
    { id: 1, name: "documento.pdf" },
    { id: 2, name: "immagine.png" },
    { id: 3, name: "contratto.docx" },
  ];

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
    <div className="rounded-lg border-2 border-slate-300 bg-white p-4 w-full">
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <nav className="mb-4 flex items-center gap-1 text-sm text-slate-500">
        <button onClick={() => navigateTo(null)} className="hover:text-slate-800">
          Root
        </button>

        {breadcrumb.map((folder) => (
          <span key={folder.id} className="flex items-center gap-1">
            <ChevronRight size={14} />
            <button
              onClick={() => navigateTo(folder.id)}
              className="hover:text-slate-800"
            >
              {folder.name}
            </button>
          </span>
        ))}
      </nav>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Folders
        </h3>

        {currentFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <Folder size={40} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">No folders here yet</p>
            <p className="text-xs mt-1">Click "Create Folder" to get started</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {currentFolders.map((folder) => (
              <li
                key={folder.id}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50"
              >
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
                    className="rounded border border-slate-300 px-2 py-0.5 text-sm"
                  />
                ) : (
                  <button
                    onClick={() => openFolder(folder.id)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-800"
                  >
                    <Folder size={16} className="text-teal-600" />
                    {folder.name}
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startRename(folder)}
                    className="text-slate-400 hover:text-slate-700"
                    title="Rename"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => deleteFolder(folder.id)}
                    className="text-slate-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 border-t border-slate-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Files
        </h3>

        {filesWithoutFolder.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-200 py-8 text-slate-400">
            <File size={36} strokeWidth={1.2} className="mb-3" />
            <p className="text-sm font-medium">No files outside folders</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {filesWithoutFolder.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <File size={16} className="text-slate-500" />
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40"
          onClick={handleClose}
        >
          <div
            className="rounded-lg bg-white p-6 shadow-xl w-80"
            onClick={(e) => e.stopPropagation()}
          >
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
              <button
                onClick={handleClose}
                className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateFolder}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
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