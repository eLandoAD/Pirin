import { useState } from "react";
import { Bell, Menu, LogOut, User } from "lucide-react";
import Authentification from "./Authentification";
import { logout, getToken } from "../api/auth";

function NavBar({ onMenuOpen, onLoginSuccess }) {
  const [modal, setModal] = useState(null);

  const [user, setUser] = useState(() => {
    const token = getToken();
    if (!token) return null;
    try {
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
      <nav className="bg-primary-white flex items-center p-4 px-6 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-[30%] p-1 pl-3 border rounded-lg border-slate-300 outline-none focus:border-green-dark bg-white text-sm"
        />

        <div className="flex items-center gap-4 ml-auto">
          <Bell size={20} className="text-slate-500 cursor-pointer hover:text-green shrink-0" />

          {user ? (
            <div className="flex items-center gap-3 pr-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-white">
                  <User size={14} />
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {user.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setModal("login")}
                className="rounded-lg hover:bg-slate-200 cursor-pointer px-3 py-1.5 border text-sm whitespace-nowrap"
              >
                Log In
              </button>
              <button
                onClick={() => setModal("signup")}
                className="bg-green-dark rounded-lg hover:bg-green cursor-pointer px-3 py-1.5 text-white text-sm whitespace-nowrap"
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
