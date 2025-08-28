import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import ClientForm, { Client } from "./components/ClientForm";
import VehiculeForm, { Vehicule } from "./components/VehiculeForm";
import DiagnosticForm, { Diagnostic } from "./components/DiagnosticForm";

/* ============== LOGIN PAGE ============== */
function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin" && password === "demo1234") {
      localStorage.setItem("auth_token", "demo-token");
      onSuccess();
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <main className="relative min-h-screen w-full">
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: "url(/fondlog.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            marginBottom: "2rem",
            fontSize: "2rem",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          AutoDiag360
        </h1>

        <form
          onSubmit={submit}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "20px",
            padding: "1.25rem",
            boxShadow: "0 12px 30px rgba(0,0,0,.15)",
          }}
        >
          {error && (
            <p
              style={{
                margin: "0 0 .75rem",
                fontSize: ".9rem",
                color: "#dc2626",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <input
            type="text"
            placeholder="Email"
            style={{
              marginBottom: ".75rem",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              padding: ".6rem .75rem",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            style={{
              marginBottom: ".75rem",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              padding: ".6rem .75rem",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              borderRadius: "10px",
              background: "#2563eb",
              color: "#fff",
              padding: ".65rem 1rem",
              border: 0,
              cursor: "pointer",
            }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </main>
  );
}

/* ============== DASHBOARD ============== */
function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen" style={{ padding: "2rem" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: "url(/fondapp.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "rgba(255,255,255,.7)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Bienvenue 👋</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/parametres")}
            style={{
              borderRadius: "12px",
              background: "#2563eb",
              color: "#fff",
              padding: ".5rem 1rem",
              border: 0,
              cursor: "pointer",
            }}
          >
            ⚙️ Paramètres
          </button>
          <button
            onClick={handleLogout}
            style={{
              borderRadius: "12px",
              background: "#dc2626",
              color: "#fff",
              padding: ".5rem 1rem",
              border: 0,
              cursor: "pointer",
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Tuiles */}
      <div className="dashboard-grid">
        <Tile title="👤 Clients" to="/clients" />
        <Tile title="🚗 Véhicules" to="/vehicules" />
        <Tile title="🧪 Diagnostic" to="/diagnostic" />
        <Tile title="📄 Rapport" to="/rapport" />
        <Tile title="📚 Historique" to="/historique" />
      </div>
    </div>
  );
}

function Tile({ title, to }: { title: string; to: string }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        textAlign: "center",
        fontWeight: 800,
        fontSize: "1.15rem",
        padding: "3rem",
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 10px 18px rgba(0,0,0,.10)",
        transition: "transform .25s, box-shadow .25s",
      }}
    >
      {title}
    </Link>
  );
}

/* ============== WRAPPER PAGE ============== */
function PageWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen" style={{ padding: "1.5rem" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: "url(/fondapp.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "rgba(255,255,255,.7)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            borderRadius: "12px",
            background: "#2563eb",
            color: "#fff",
            padding: ".5rem 1rem",
            border: 0,
            cursor: "pointer",
          }}
        >
          ← Retour
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{title}</h2>
      </div>

      <div style={{ maxWidth: "880px", margin: "0 auto" }}>{children}</div>
    </div>
  );
}

/* ============== PAGES ============== */
function ClientsPage() {
  const [client, setClient] = useState<Partial<Client>>({});
  const navigate = useNavigate();
  return (
    <PageWrapper title="Identification Client">
      <ClientForm
        data={client as any}
        onChange={setClient}
        onSubmitSuccess={() => navigate("/vehicules")}
      />
    </PageWrapper>
  );
}

function VehiculesPage() {
  const [vehicule, setVehicule] = useState<Partial<Vehicule>>({});
  const navigate = useNavigate();
  return (
    <PageWrapper title="Identification Véhicule">
      <VehiculeForm
        data={vehicule as any}
        onChange={setVehicule}
        onSubmitSuccess={() => navigate("/diagnostic")}
      />
    </PageWrapper>
  );
}

function DiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState<Partial<Diagnostic>>({});
  const navigate = useNavigate();
  return (
    <PageWrapper title="Diagnostic">
      <DiagnosticForm
        data={diagnostic as any}
        onChange={setDiagnostic}
        onSubmitSuccess={() => navigate("/rapport")}
      />
    </PageWrapper>
  );
}

function ReportPage() {
  return (
    <PageWrapper title="Rapport">
      📌 Page Rapport (à développer)
    </PageWrapper>
  );
}

function HistoriquePage() {
  return (
    <PageWrapper title="Historique">
      📌 Ici s’affichera l’historique des diagnostics.
    </PageWrapper>
  );
}

function SettingsPage() {
  return (
    <PageWrapper title="Paramètres">
      📌 Page Paramètres (à développer)
    </PageWrapper>
  );
}

/* ============== PROTECTED ROUTE ============== */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/* ============== ROUTES ============== */
function AppRoutes() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage onSuccess={() => navigate("/")} />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
      <Route path="/vehicules" element={<ProtectedRoute><VehiculesPage /></ProtectedRoute>} />
      <Route path="/diagnostic" element={<ProtectedRoute><DiagnosticPage /></ProtectedRoute>} />
      <Route path="/rapport" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
      <Route path="/historique" element={<ProtectedRoute><HistoriquePage /></ProtectedRoute>} />
      <Route path="/parametres" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
    </Routes>
  );
}

/* ============== EXPORT ============== */
export default function AppShell() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
