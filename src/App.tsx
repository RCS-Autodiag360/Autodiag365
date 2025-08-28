import { useState } from "react";
import Auth from "./components/Auth";
import ClientForm from "./components/ClientForm";
import VehiculeForm from "./components/VehiculeForm";
import Diagnostic from "./components/Diagnostic";
import ReportPreview from "./components/ReportPreview";
import Settings from "./components/Settings";
import Conclusion from "./pages/Conclusion";

export default function App() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [tab, setTab] = useState("client");

  // états globaux
  const [client, setClient] = useState<any>({});
  const [vehicule, setVehicule] = useState<any>({});
  const [diagnostic, setDiagnostic] = useState<any>({});

  // ⚡ si pas connecté → formulaire d’authentification
  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-3xl font-bold">GarageDiag 🚗</h1>
      </header>

      {/* Navigation simple par onglets */}
      <nav className="flex gap-2 p-2 bg-gray-100 border-b">
        <button
          onClick={() => setTab("client")}
          className={`px-3 py-1 rounded ${tab === "client" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Client
        </button>
        <button
          onClick={() => setTab("vehicule")}
          className={`px-3 py-1 rounded ${tab === "vehicule" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Véhicule
        </button>
        <button
          onClick={() => setTab("diagnostic")}
          className={`px-3 py-1 rounded ${tab === "diagnostic" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Diagnostic
        </button>
        <button
          onClick={() => setTab("rapport")}
          className={`px-3 py-1 rounded ${tab === "rapport" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Rapport
        </button>
        <button
          onClick={() => setTab("parametres")}
          className={`px-3 py-1 rounded ${tab === "parametres" ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          Paramètres
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="p-4">
        {tab === "client" && <ClientForm data={client} onChange={setClient} />}
        {tab === "vehicule" && <VehiculeForm data={vehicule} onChange={setVehicule} />}
        {tab === "diagnostic" && <Diagnostic data={diagnostic} onChange={setDiagnostic} />}
        {tab === "rapport" && (
          <ReportPreview client={client} vehicule={vehicule} diagnostic={diagnostic} />
        )}
        {tab === "parametres" && <Settings />}
      </main>
    </div>
  );
}
