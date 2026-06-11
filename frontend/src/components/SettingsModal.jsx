import { Sun, Moon } from "lucide-react";

export default function SettingsModal({ darkMode, onToggle, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      {/* Box centrato — AGGIORNA QUESTA RIGA QUI SOTTO */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 p-8 shadow-xl border dark:border-slate-800"
      >
        {/* Pulsante chiudi */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>

        {/* Titolo */}
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Settings</h2>

        {/* Sezione Theme */}
        <p className="mb-3 text-sm font-medium text-slate-500">Theme</p>
        <div className="flex gap-3">

          {/* Pulsante Light */}
          <button
            onClick={() => darkMode && onToggle()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-semibold transition ${
              !darkMode
                ? "border-green bg-green text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Sun size={16} />
            Light
          </button>

          {/* Pulsante Dark */}
          <button
            onClick={() => !darkMode && onToggle()}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-semibold transition ${
              darkMode
                ? "border-green bg-green text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Moon size={16} />
            Dark
          </button>

        </div>
      </div>
    </div>
  );
}