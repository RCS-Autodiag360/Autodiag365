import { useState } from "react";

export default function Settings() {
  const [garageName, setGarageName] = useState("");
  const [siret, setSiret] = useState("");

  return (
    <div>
      <h2>Paramètres Garage</h2>
      <form>
        <div>
          <label>Nom du garage</label>
          <input value={garageName} onChange={e => setGarageName(e.target.value)} />
        </div>
        <div>
          <label>SIRET</label>
          <input value={siret} onChange={e => setSiret(e.target.value)} />
        </div>
      </form>
    </div>
  );
}
