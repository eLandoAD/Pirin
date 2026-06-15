import { Folder, Settings } from "lucide-react";

const bottomNavItems = [
  { icon: <Folder size={20} />, label: "FILES", active: true },
  { icon: <Settings size={20} />, label: "SETTINGS" },
];

export default function BottomNavigation({ onOpenSettings }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-center border-t border-slate-300 bg-secondary-white px-4 lg:hidden">
      {bottomNavItems.map(({ icon, label, active }) => (
        /* Il contenitore esterno garantisce che entrambi i blocchi abbiano lo stesso identico spazio al centro */
        <div key={label} className="flex flex-1 items-center justify-center h-full max-w-[120px]">
          <button
            onClick={label === "SETTINGS" ? onOpenSettings : undefined}
            className={[
              "flex flex-col items-center justify-center gap-1 w-full text-[10px] font-bold tracking-wider transition",
              active 
                ? "text-green bg-green-dark/30 rounded-xl h-[80%] px-4" 
                : "text-slate-500 hover:text-white h-full"
            ].join(" ")}
          >
            {icon}
            <span>{label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}