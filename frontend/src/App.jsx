import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from "./components/Folders";

const BASE_URL = "/api/auth";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [verifyMessage, setVerifyMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
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
    if (data.email)    localStorage.setItem("email",    data.email);
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
      document.documentElement.classList.toggle("dark", next);
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
        <NavBar
          onMenuOpen={() => setMobileMenuOpen(true)}
          onLoginSuccess={handleLoginSuccess}
          user={user}
        />

        {verifyMessage && (
          <div style={{ backgroundColor: "#f0fdf4", borderBottom: "1px solid #bbf7d0", padding: "10px 24px", fontSize: "13px", color: "#166534" }}>
            ✓ {verifyMessage}{" "}
            <button onClick={() => setVerifyMessage("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#166534", fontWeight: 600 }}>
              ✕
            </button>
          </div>
        )}

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
