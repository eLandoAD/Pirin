import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from './components/Folders';
import SettingsModal from "./components/SettingsModal";

function App() {
  // Questo stato controlla se il modal "Create Folder" è aperto o chiuso.
  // Sta qui in App.jsx perché sia SideMenu che Folders devono accedervi.
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", next);
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SideMenu
          onCreateFolder={() => setShowCreateFolder(true)}
          onOpenSettings={() => setShowSettings(true)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <NavBar />
          <main className="flex-1 overflow-y-auto border-t border-slate-300 p-8">
            <h1 className="mb-4 text-2xl font-bold">Vault Explorer</h1>
            <Folders
              showModal={showCreateFolder}
              onCloseModal={() => setShowCreateFolder(false)}
            />
          </main>
        </div>
      </div>

      {
        showSettings && (
          <SettingsModal
            darkMode={darkMode}
            onToggle={toggleDarkMode}
            onClose={() => setShowSettings(false)}
          />
        )
      }
    </>
  );
}

export default App;
