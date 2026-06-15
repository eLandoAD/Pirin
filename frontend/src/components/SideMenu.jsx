import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import Upload from "./Upload";

export default function SideMenu({ onCreateFolder, onOpenSettings, onUploadSuccess, currentFolderId }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  const inner = (collapsed = false) => (
    <div className="flex h-screen flex-col justify-between px-3 py-4 text-slate-900 dark:text-slate-100">
      {/* Blocco Superiore */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-[21px] font-semibold leading-none text-black dark:text-white">SecureVault</h1>
              <p className="mt-1.5 text-[11px] font-medium tracking-[0.08em] text-green-dark dark:text-green">E2EE ACTIVE</p>
            </div>
          )}
        </div>

        <button onClick={() => setUploadOpen(true)}
          className={["mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-green text-white hover:bg-green-dark transition text-sm font-semibold", collapsed ? "px-0" : ""].join(" ")}
          title={collapsed ? "Upload File" : undefined}>
          <Plus size={18} strokeWidth={2.2} />
          {!collapsed && "Upload File"}
        </button>

        <button onClick={onCreateFolder}
          className={["mb-9 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-green text-white hover:bg-green-dark transition text-sm font-semibold", collapsed ? "px-0" : ""].join(" ")}
          title={collapsed ? "Create Folder" : undefined}>
          <Plus size={18} strokeWidth={2.2} />
          {!collapsed && "Create Folder"}
        </button>
      </div>

      {/* Blocco Inferiore (Spinto in fondo grazie a justify-between e h-screen) */}
      <nav className="flex flex-col gap-2 mb-2">
        <button onClick={onOpenSettings}
          className={["flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-semibold transition uppercase tracking-wide bg-black text-white hover:bg-neutral-600 dark:bg-slate-800 dark:hover:bg-slate-700 w-full", collapsed ? "justify-center px-0" : ""].join(" ")}
          title={collapsed ? "Settings" : undefined}>
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 h-screen sticky top-0 flex-col border-r border-slate-300 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {inner(false)}
      </aside>
      {uploadOpen && (
        <Upload
          onClose={() => setUploadOpen(false)}
          onUploadSuccess={onUploadSuccess}
          currentFolderId={currentFolderId}
        />
      )}
    </>
  );
}