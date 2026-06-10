import { useState } from "react";
import Authentification from "./Authentification";
import { Bell, LogOut, User } from "lucide-react";
import { logout, getToken } from "../api/auth";

function NavBar({ onLoginSuccess }) {
  const [modal, setModal] = useState(null);

  // Legge i dati utente dal localStorage se già loggato
  const [user, setUser] = useState(() => {
    const token = getToken();
    if (!token) return null;
    try {
      // Il JWT contiene i dati utente nel payload (parte centrale)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { username: payload.username };
    } catch {
      return null;
    }
  });

  function handleLoginSuccess(data) {
    setUser(data);
    onLoginSuccess(data);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return (
    <>
      <nav className="bg-primary-white flex items-center p-4 px-6">
        <input
          type="text"
          placeholder="Search..."
          className="bg-secondary-white w-[30%] p-1 pl-3 border rounded-lg border-slate-300 outline-none focus:border-teal-600"
        />

        <div className="flex justify-end items-center gap-8 w-[70%]">
          <Bell size={20} className="text-slate-600 cursor-pointer hover:text-green" />

          {user ? (
            <div className="flex items-center gap-3 pr-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-white">
                  <User size={14} />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex pr-4 gap-4">
              <button
                onClick={() => setModal("login")}
                className="bg-secondary-white rounded-lg hover:bg-slate-200 cursor-pointer px-2 py-1 border"
              >
                Log In
              </button>
              <button
                onClick={() => setModal("signup")}
                className="bg-green rounded-lg hover:bg-green-dark cursor-pointer px-2 py-1 text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {modal && (
        <Authentification
          initialView={modal}
          onClose={() => setModal(null)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default NavBar;
