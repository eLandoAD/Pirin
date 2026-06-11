import SideMenu from "./SideMenu";
import NavBar from "./NavBar";
import BottomNavigation from "./BottomNavigation";

export default function DashboardLayout({ children, onCreateFolder, onUpload }) {
  return (
    <div className="flex min-h-screen bg-[#030d16] text-white">
      {/* 1. Sidebar Desktop: visibile solo da schermi grandi (lg) in poi */}
      <SideMenu onCreateFolder={onCreateFolder} onUpload={onUpload} />

      {/* 2. Area Contenuto Principale */}
      <div className="flex flex-1 flex-col pb-16 lg:pb-0">
        {/* 'pb-16' crea lo spazio in basso per evitare che la barra mobile copra i file nella pagina */}
        
        {/* Barra di ricerca in alto (Comune sia a mobile che desktop) */}
        <NavBar onLoginSuccess={(data) => console.log("Logged in:", data)} />
        
        {/* Contenuto della pagina (Vault Explorer, Cartelle, ecc.) */}
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>

      {/* 3. Barra di Navigazione Mobile: visibile solo su schermi piccoli */}
      <BottomNavigation />
    </div>
  );
}