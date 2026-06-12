import { useState, useEffect } from "react";
import SideMenu from "./components/SideMenu";
import Folders from "./components/Folders";
import BottomNavigation from "./components/BottomNavigation";
import SettingsModal from "./components/SettingsModal";
import Authentification from "./components/Authentification";
import Landing from "./pages/landing";
import NavBar from "./components/NavBar"

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
      setResetToken(token);
      window.history.replaceState({}, "", "/");
    } else if (token) {
      fetch(`${BASE_URL}/verify?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          setVerifyMessage(data.message || "Email verificata!");
          window.history.replaceState({}, "", "/");
        })
        .catch(() => setVerifyMessage("Errore durante la verifica."));
    }
  }, []);

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

  function handleLogout() {
    setUser(null);
  }

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
    <>
      {!user ? (
        // Non loggato — mostra landing
        <Landing
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          user={user}
        />
      ) : (
        // Loggato — mostra vault
        <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
          <SideMenu
            onCreateFolder={() => setShowFolderModal(true)}
            onOpenSettings={() => setShowSettings(true)}
            onUploadSuccess={() => setFileRefreshKey(k => k + 1)}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <NavBar onLogout={handleLogout} user={user} />
            <main className="flex-1 overflow-y-auto border-t border-slate-300 p-4 md:p-8 pb-20 lg:pb-8">
              <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">Vault Explorer</h1>
              <Folders
                key={user ? user.username : "guest"}
                showModal={showFolderModal}
                onCloseModal={() => setShowFolderModal(false)}
                fileRefreshKey={fileRefreshKey}
                user={user}
              />
            </main>
            <BottomNavigation onOpenSettings={() => setShowSettings(true)} />
          </div>
        </div>
      )}

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
    </>
  );
}

export default App;