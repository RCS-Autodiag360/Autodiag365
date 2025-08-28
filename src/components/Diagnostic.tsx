import { useState } from "react";
import { exportConclusionPDF } from "../utils/pdfExporter";

export default function Diagnostic({ onChange, client, vehicule }: any) {
  const [diagnostic, setDiagnostic] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setDiagnostic((prev: any) => {
      const updated = { ...prev, [field]: value };
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Diagnostic</h2>

      {/* ⚡ Ici ton formulaire diagnostic déjà existant */}

      {/* 🔽 Section Conclusion */}
      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
        <p className="text-gray-600 mb-4">
          Une fois le diagnostic terminé, exportez un rapport complet.
        </p>
        <button
          className="btn"
          onClick={() => exportConclusionPDF(client, vehicule, diagnostic)}
        >
          📄 Exporter le rapport PDF
        </button>
      </div>
    </div>
  );
}
