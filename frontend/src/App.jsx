import NavBar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Folders from './components/Folders';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-primary-white">
      <SideMenu />

      <div className="flex min-w-0 flex-1 flex-col">
        <NavBar />

        <main className="flex-1 overflow-y-auto border-t border-slate-300 p-8">
          <h1 className="mb-4 text-2xl font-bold">Vault Explorer</h1>
          <Folders />
        </main>
      </div>
    </div>
  );
}

export default App;
