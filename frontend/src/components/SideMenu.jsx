import { useState } from "react";
import {
  Plus,
  Lock,
  Users,
  CloudUpload,
  Settings,
  HelpCircle,
  Gem,
} from "lucide-react";
import Upload from "./Upload";

const navItems = [
  { icon: <Lock size={18} />, label: "Personal Vault", active: true },
  { icon: <Users size={18} />, label: "Team Shared" },
  { icon: <CloudUpload size={18} />, label: "Backups" },
];

const bottomItems = [
  { icon: <HelpCircle size={18} />, label: "Support" },
];

const menuItemClass = (active) =>
  `flex h-11 items-center gap-2.5 rounded-md px-3 text-sm font-normal transition ${active ? "bg-green text-white hover:bg-green-dark" : "text-slate-800 hover:bg-slate-200"
  }`;

export default function SideMenu({ onCreateFolder, onOpenSettings }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <aside className="flex min-h-screen w-60 flex-col justify-between border-r border-slate-300 bg-slate-100 px-3 py-4 text-slate-900">
        <div>
          <div className="mb-8">
            <h1 className="text-[21px] font-semibold leading-none text-black">
              SecureVault
            </h1>
            <p className="mt-1.5 text-[11px] font-medium tracking-[0.08em] text-green">
              E2EE ACTIVE
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-neutral-600"
          >
            <Plus size={18} strokeWidth={2.2} />
            Upload File
          </button>

          <button
            onClick={onCreateFolder}
            className="mb-9 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold text-white transition hover:bg-neutral-600"
          >
            <Plus size={18} strokeWidth={2.2} />
            Create Folder
          </button>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ icon, label, active }) => (
              <a key={label} href="#" className={menuItemClass(active)}>
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div>
          <div className="mb-5 h-px bg-slate-300" />
          <a onClick={onOpenSettings} href="#" className={menuItemClass(false)}>
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <div className="flex flex-col gap-2">
            {bottomItems.map(({ icon, label }) => (
              <a key={label} href="#" className={menuItemClass(false)}>
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-2 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-teal-300">
              <Gem size={14} />
            </div>
            <div>
              <p className="text-sm font-medium leading-none text-black">user</p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.08em] text-teal-800">
                PRO TIER
              </p>
            </div>
          </div>
        </div>
      </aside>

      {uploadOpen && <Upload onClose={() => setUploadOpen(false)} />}
    </>
  );
}