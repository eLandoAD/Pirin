import { Bell, LogOut, User } from "lucide-react";
import { logout } from "../api/auth";

function NavBar({ onLogout, user, onSearch }) {

  async function handleLogout() {
    await logout();
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    if (onLogout) onLogout();
  }

  return (
    <nav className="bg-primary-white flex items-center p-4 px-6 gap-4 border-b border-slate-700">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full md:w-[30%] p-2 pl-4 border rounded-lg border-slate-700 outline-none focus:border-green bg-primary-white text-sm placeholder-slate-500"
      />

      <div className="flex items-center gap-4 ml-auto">
        <Bell size={20} className="text-slate-500 cursor-pointer hover:text-green shrink-0 transition" />

        <div className="flex items-center gap-3 pr-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green text-primary-white">
              <User size={14} />
            </div>
            <span className="text-sm font-medium text-slate-500">
              {user?.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-500 hover:bg-secondary-white hover:text-white transition"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;