import Layout from "../components/Layout";
import { exportConclusionPDF } from "../utils/pdfExporter";

interface ConclusionProps {
  client: any;
  vehicule: any;
  diagnostic: any;
}

export default function Conclusion({ client, vehicule, diagnostic }: ConclusionProps) {
  return (
    <Layout title="Conclusion">
      <h2 className="text-xl font-bold mb-4">Résumé de l’inspection</h2>

      <div className="space-y-2 mb-6">
        <p><strong>Client :</strong> {client.nom} {client.prenom}</p>
        <p><strong>Véhicule :</strong> {vehicule.marque} {vehicule.modele} ({vehicule.immatriculation})</p>
      </div>

      <button
        className="btn"
        onClick={() => exportConclusionPDF(client, vehicule, diagnostic)}
      >
        📄 Exporter en PDF
      </button>
    </Layout>
  );
}
