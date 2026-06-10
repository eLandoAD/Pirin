import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from "./components/Folders";

function App() {
  // Stati locali (Current)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stati in arrivo da GitHub (Incoming)
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  function handleLoginSuccess(data) {
    setUser(data);
  }

  // Gestione Dark Mode
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
    <div className="flex h-screen overflow-hidden bg-white">
      <SideMenu
        onCreateFolder={() => setShowFolderModal(true)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Unisce l'apertura del menu e il login */}
        <NavBar 
          onMenuOpen={() => setMobileMenuOpen(true)} 
          onLoginSuccess={handleLoginSuccess} 
        />
        
        <main className="flex-1 overflow-y-auto border-t border-slate-300 p-4 md:p-8">
          <h1 className="mb-4 text-2xl font-bold">Vault Explorer</h1>
          <Folders
            showModal={showFolderModal}
            onCloseModal={() => setShowFolderModal(false)}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
