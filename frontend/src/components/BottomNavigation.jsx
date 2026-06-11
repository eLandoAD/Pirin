import { Folder, Share2, CloudUpload, Settings } from "lucide-react";

const bottomNavItems = [
  { icon: <Folder size={20} />, label: "FILES", active: true },
  { icon: <Share2 size={20} />, label: "SHARED" },
  { icon: <CloudUpload size={20} />, label: "BACKUPS"},
  { icon: <Settings size={20} />, label: "SETTINGS" },
];

export default function BottomNavigation({ onOpenSettings }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-300 bg-secondary-white px-2 lg:hidden">
      {bottomNavItems.map(({ icon, label, active }) => (
        <button
          key={label}
          onClick={label === "SETTINGS" ? onOpenSettings : undefined}
          className={[
            "flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] font-bold tracking-wider transition",
            active ? "text-green bg-green-dark/30 rounded-xl max-w-18.75 h-[85%]" : "text-slate-500 hover:text-white"
          ].join(" ")}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}