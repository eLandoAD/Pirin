import { useState } from "react";
import { Folder, ChevronRight } from "lucide-react";

export default function FolderPicker({ folders, onSelect, onCancel, filename }) {
  const [browserId, setBrowserId] = useState(null);

  const children = folders.filter((f) => (f.parentId ?? null) === browserId);

  const pickerBreadcrumb = [];
  let cur = browserId;
  while (cur !== null) {
    const f = folders.find((x) => x.id === cur);
    if (!f) break;
    pickerBreadcrumb.unshift(f);
    cur = f.parentId ?? null;
  }

  function hasChildren(folderId) {
    return folders.some((f) => (f.parentId ?? null) === folderId);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onCancel}
    >
      <div
        className="rounded-lg bg-white shadow-xl w-80 border border-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-300">
          <h3 className="text-base font-semibold text-slate-800">
            Move "{filename}"
          </h3>
          <nav className="mt-2 flex flex-wrap items-center gap-1 text-xs text-slate-500">
            <button onClick={() => setBrowserId(null)} className="hover:text-slate-800">
              Root
            </button>
            {pickerBreadcrumb.map((f) => (
              <span key={f.id} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <button onClick={() => setBrowserId(f.id)} className="hover:text-slate-800">
                  {f.name}
                </button>
              </span>
            ))}
          </nav>
        </div>

        {/* Lista */}
        <ul className="max-h-56 overflow-y-auto px-2 py-2">
          {children.length === 0 && (
            <li className="px-3 py-4 text-center text-xs text-slate-500">
              No subfolders
            </li>
          )}
          {children.map((folder) => (
            <li
              key={folder.id}
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50"
            >
              {/* Nome cartella — cliccando la freccia si entra dentro */}
              <div className="flex items-center gap-2 text-sm text-slate-700 min-w-0">
                <Folder size={15} className="text-green-dark shrink-0" />
                <span className="truncate">{folder.name}</span>
                {hasChildren(folder.id) && (
                  <button
                    onClick={() => setBrowserId(folder.id)}
                    className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-800 hover:bg-slate-500"
                    title="Open"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {/* Select sempre alla stessa posizione a destra */}
              <button
                onClick={() => onSelect(folder.id)}
                className="shrink-0 ml-3 rounded px-2 py-0.5 text-xs font-medium bg-black text-white hover:bg-slate-700"
              >
                Select
              </button>
            </li>
          ))}
        </ul>

        {/* Footer — solo Cancel e "Move to Root" se si è in root */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-300">
          {browserId === null ? (
            <button
              onClick={() => onSelect(null)}
              className="rounded-md bg-green px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-dark"
            >
              Move to Root
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
