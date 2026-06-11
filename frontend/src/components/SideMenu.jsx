import { useState } from "react";
import {
  Plus, Lock, Share2, CloudUpload,
  Settings, HelpCircle, Gem,
} from "lucide-react";
import Upload from "./Upload";

const navItems = [
  { icon: <Lock size={18} />, label: "Personal Vault", active: true },
  { icon: <Share2 size={18} />, label: "Shared" },
  { icon: <CloudUpload size={18} />, label: "Backups" },
];

const bottomItems = [
  { icon: <Settings size={18} />, label: "Settings" },
  { icon: <HelpCircle size={18} />, label: "Support" },
];

function SideMenuItem({ icon, label, active = false, collapsed }) {
  return (
    <a
      href="#"
      title={collapsed ? label : undefined}
      className={[
        "flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-normal transition",
        collapsed ? "justify-center px-0" : "",
        active ? "bg-green text-white hover:bg-green-dark" : "text-slate-800 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </a>
  );
}

export default function SideMenu({ onCreateFolder, onOpenSettings, onUploadSuccess }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  const inner = (collapsed = false) => (
    <div className="flex min-h-screen flex-col justify-between px-3 py-4 text-slate-900 dark:text-slate-100">
      <div>
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-[21px] font-semibold leading-none text-black dark:text-white">SecureVault</h1>
              <p className="mt-1.5 text-[11px] font-medium tracking-[0.08em] text-teal-800 dark:text-teal-400">E2EE ACTIVE</p>
            </div>
          )}
        </div>

        {/* Bottone Upload */}
        <button
          onClick={() => setUploadOpen(true)}
          className={[
            "mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-neutral-600 dark:bg-slate-800 dark:hover:bg-slate-700",
            collapsed ? "px-0" : "",
          ].join(" ")}
          title={collapsed ? "Upload File" : undefined}
        >
          <Plus size={18} strokeWidth={2.2} />
          {!collapsed && "Upload File"}
        </button>

        {/* Bottone Nuova Cartella */}
        <button
          onClick={onCreateFolder}
          className={[
            "mb-9 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-neutral-600 dark:bg-slate-800 dark:hover:bg-slate-700",
            collapsed ? "px-0" : "",
          ].join(" ")}
          title={collapsed ? "Create Folder" : undefined}
        >
          <Plus size={18} strokeWidth={2.2} />
          {!collapsed && "Create Folder"}
        </button>

        {/* Navigazione Principale */}
        <nav className="flex flex-col gap-2">
          {navItems.map(({ icon, label, active }) => (
            <SideMenuItem key={label} icon={icon} label={label} active={active} collapsed={collapsed} />
          ))}
        </nav>
      </div>

      {/* Navigazione Inferiore e Profilo */}
      <div>
        <div className="mb-5 h-px bg-slate-300 dark:bg-slate-800" />
        <div className="flex flex-col gap-2">
          {bottomItems.map(({ icon, label }) => (
            <div
              key={label}
              onClick={label === "Settings" ? onOpenSettings : undefined}
              className={label === "Settings" ? "cursor-pointer" : ""}
            >
              <SideMenuItem icon={icon} label={label} collapsed={collapsed} />
            </div>
          ))}
        </div>

        {/* Box Utente */}
        <div className={["mt-7 flex items-center gap-2", collapsed ? "justify-center px-0" : "px-3"].join(" ")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-teal-300 border border-slate-800">
            <Gem size={14} />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium leading-none text-black dark:text-white">user</p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.08em] text-teal-800 dark:text-teal-400">PRO TIER</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop — Rimane fissa a sinistra, scompare su mobile (lg:flex) */}
      <aside className="hidden lg:flex w-60 h-screen sticky top-0 flex-col border-r border-slate-300 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
        {inner(false)}
      </aside>

      {uploadOpen && <Upload onClose={() => setUploadOpen(false)} onUploadSuccess={onUploadSuccess} />}
    </>
  );
}