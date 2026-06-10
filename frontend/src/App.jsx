import { useState } from "react";
import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from "./components/Folders";

function App() {
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideMenu
        onCreateFolder={() => setShowFolderModal(true)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar onMenuOpen={() => setMobileMenuOpen(true)} />

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