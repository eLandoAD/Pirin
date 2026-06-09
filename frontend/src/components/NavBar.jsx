
import { useState } from "react";
import Authentification from "./Authentification";
import { Bell } from "lucide-react";


function NavBar() {
  const [modal, setModal] = useState(null); // null | "login" | "signup"

  return (
    <>
      <nav className="bg-primary-white flex items-center p-4 px-6">
        <input
  type="text"
  placeholder="Search..."
  className="bg-secondary-white w-[30%] p-1 pl-3 border rounded-lg border-slate-300 outline-none focus:border-teal-600"
/>
        <div className="flex justify-end items-center gap-8 w-[70%]">
          <div><Bell size={20} className="text-slate-600 cursor-pointer hover:text-teal-700" /></div>
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
        </div>
      </nav>

      {modal && (
        <Authentification initialView={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}

export default NavBar;