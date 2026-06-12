import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from "./components/Folders";
import BottomNavigation from "./components/BottomNavigation";
import SettingsModal from "./components/SettingsModal";

const BASE_URL = "https://crispy-potato-qv76gg55rgxxc99r5-8080.app.github.dev/api/auth";

function App() {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [fileRefreshKey, setFileRefreshKey] = useState(0);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [verifyMessage, setVerifyMessage] = useState("");
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const path = window.location.pathname;

    if (token && path === "/reset-password") {
      // è un link di reset password — apri il modal
      setResetToken(token);
      window.history.replaceState({}, "", "/");
    } else if (token) {
      // è un link di verifica email
      fetch(`${BASE_URL}/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setVerifyMessage(data.message || "Email verificata!");
          window.history.replaceState({}, "", "/");
        })
        .catch(() => setVerifyMessage("Errore durante la verifica."));
    }
  }, []);

  // Ripristina utente dal localStorage al refresh
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (token && username) {
      setUser({ token, username, email });
    }
  }, []);

  function handleLoginSuccess(data) {
    setUser(data);
    if (data.username) localStorage.setItem("username", data.username);
    if (data.email) localStorage.setItem("email", data.email);
  }

  // Dark mode
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
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <SideMenu
        onCreateFolder={() => setShowFolderModal(true)}
        onOpenSettings={() => setShowSettings(true)}
        onUploadSuccess={() => setFileRefreshKey(k => k + 1)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar onLoginSuccess={handleLoginSuccess} user={user} />

        {verifyMessage && (
          <div style={{ backgroundColor: "#f0fdf4", borderBottom: "1px solid #bbf7d0", padding: "10px 24px", fontSize: "13px", color: "#166534" }}>
            ✓ {verifyMessage}{" "}
            <button onClick={() => setVerifyMessage("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#166534", fontWeight: 600 }}>
              ✕
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto border-t border-slate-300 p-4 md:p-8 pb-20 lg:pb-8">
          <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Vault Explorer</h1>
          <Folders
            showModal={showFolderModal}
            onCloseModal={() => setShowFolderModal(false)}
            fileRefreshKey={fileRefreshKey}
          />
        </main>

        <BottomNavigation onOpenSettings={() => setShowSettings(true)} />
      </div>

      {showSettings && (
        <SettingsModal
          darkMode={darkMode}
          onToggle={toggleDarkMode}
          onClose={() => setShowSettings(false)}
        />
      )}

      {resetToken && (
        <Authentification
          initialView="reset"
          resetToken={resetToken}
          onClose={() => setResetToken(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
