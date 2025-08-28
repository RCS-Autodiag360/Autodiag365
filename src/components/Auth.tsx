import { useState } from "react";

interface AuthProps {
  onLogin: (user: { email: string }) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email === "admin" && password === "demo1234") {
      onLogin({ email });
    } else {
      alert("Identifiants incorrects");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ✅ Image de fond depuis public/fondlog.jpeg */}
      <img
        src={`${import.meta.env.BASE_URL}fondlog.jpeg`}
        alt="Garage background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ✅ Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* ✅ Carte login */}
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-80 z-10">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          AutoCheck360
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Identifiant"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
