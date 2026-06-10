import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import Authentification from "./Authentification";

function NavBar({ onMenuOpen }) {
  const [modal, setModal] = useState(null);

  return (
    <>
      <nav className="bg-primary-white flex items-center p-4 px-6 gap-4">
        {/* hamburger — solo mobile */}
        <button
          onClick={onMenuOpen}
          className="md:hidden text-slate-600 hover:text-slate-900"
        >
          <Menu size={22} />
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-[30%] p-1 pl-3 border rounded-lg border-slate-300 outline-none focus:border-teal-600 bg-white text-sm"
        />

        <div className="flex items-center gap-4 ml-auto">
          <Bell size={20} className="text-slate-600 cursor-pointer hover:text-teal-700 shrink-0" />

          <div className="flex gap-2">
            <button
              onClick={() => setModal("login")}
              className="rounded-lg hover:bg-slate-200 cursor-pointer px-3 py-1.5 border text-sm whitespace-nowrap"
            >
              Log In
            </button>
            <button
              onClick={() => setModal("signup")}
              className="bg-[#0f766e] rounded-lg hover:bg-teal-600 cursor-pointer px-3 py-1.5 text-white text-sm whitespace-nowrap"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {modal && <Authentification initialView={modal} onClose={() => setModal(null)} />}
    </>
  );
}

export default NavBar;