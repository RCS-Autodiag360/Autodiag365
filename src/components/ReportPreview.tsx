import jsPDF from "jspdf";

interface Props {
  client: any;
  vehicule: any;
  diagnostic: any;
}

export default function ReportPreview({ client, vehicule, diagnostic }: Props) {
  function handleExportPDF() {
    const doc = new jsPDF();
    doc.text("Rapport de Diagnostic - GarageDiag", 10, 10);
    doc.text(`Client: ${client.nom || ""} ${client.prenom || ""}`, 10, 20);
    doc.text(`Adresse: ${client.adresse || ""}`, 10, 30);
    doc.text(`Téléphone: ${client.telephone || ""}`, 10, 40);

    doc.text(`Véhicule: ${vehicule.marque || ""} ${vehicule.modele || ""}`, 10, 55);

    doc.text("Diagnostic:", 10, 70);
    doc.text(JSON.stringify(diagnostic, null, 2), 10, 80);

    doc.text("Date: " + new Date().toLocaleString(), 10, 140);
    doc.save("diagnostic.pdf");
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Rapport de Diagnostic</h2>

      {/* Carte Client */}
      <div className="mb-4 p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Client</h3>
        <p><strong>Nom:</strong> {client.nom || "-"}</p>
        <p><strong>Prénom:</strong> {client.prenom || "-"}</p>
        <p><strong>Adresse:</strong> {client.adresse || "-"}</p>
        <p><strong>Téléphone:</strong> {client.telephone || "-"}</p>
      </div>

      {/* Carte Véhicule */}
      <div className="mb-4 p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Véhicule</h3>
        <p><strong>Marque:</strong> {vehicule.marque || "-"}</p>
        <p><strong>Modèle:</strong> {vehicule.modele || "-"}</p>
      </div>

      {/* Carte Diagnostic */}
      <div className="mb-4 p-4 border rounded shadow-sm bg-white">
        <h3 className="font-semibold mb-2">Diagnostic</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
          {JSON.stringify(diagnostic, null, 2)}
        </pre>
      </div>

      {/* Export */}
      <button
        onClick={handleExportPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        📄 Exporter en PDF
      </button>
    </div>
  );
}
