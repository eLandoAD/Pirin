import { useState, useEffect, useRef } from "react";
import { Plus, Settings, FolderPlus, UploadCloud } from "lucide-react";
import Upload from "./Upload";

export default function SideMenu({ onCreateFolder, onOpenSettings, onUploadSuccess, currentFolderId }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Chiude il menu a comparsa del FAB se clicchi fuori
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* Blocco Inferiore */}
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
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-60 h-screen sticky top-0 flex-col border-r border-slate-300 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {inner(false)}
      </aside>

      {/* Floating Action Button (FAB) - Solo per Mobile e Tablet */}
      <div className="fixed bottom-24 right-6 z-40 lg:hidden" ref={menuRef}>
        {mobileMenuOpen && (
          <div className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 rounded-xl bg-white p-2 shadow-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 min-w-[160px] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button
              onClick={() => { setUploadOpen(true); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 w-full"
            >
              <UploadCloud size={16} />
              Upload File
            </button>
            <button
              onClick={() => { onCreateFolder(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 w-full"
            >
              <FolderPlus size={16} />
              Create Folder
            </button>
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg transition-transform active:scale-95 ${mobileMenuOpen ? "rotate-45 bg-neutral-800 dark:bg-slate-800" : ""}`}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

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