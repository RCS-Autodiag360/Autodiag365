import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportConclusionPDF(client: any, vehicule: any, diagnostic: any) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("GarageDiag - Rapport de Conclusion", pageWidth / 2, 20, { align: "center" });

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14);
  doc.text("🧑 Fiche Client", 14, 45);
  autoTable(doc, {
    startY: 50,
    head: [["Nom", "Prénom", "Téléphone", "Email"]],
    body: [[client?.nom || "-", client?.prenom || "-", client?.telephone || "-", client?.email || "-"]],
  });

  doc.setFontSize(14);
  doc.text("🚗 Identification Véhicule", 14, doc.lastAutoTable.finalY + 15);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Marque", "Modèle", "Immatriculation", "Année"]],
    body: [[vehicule?.marque || "-", vehicule?.modele || "-", vehicule?.immatriculation || "-", vehicule?.annee || "-"]],
  });

  doc.setFontSize(14);
  doc.text("🛠️ Diagnostic", 14, doc.lastAutoTable.finalY + 15);
  const diagRows = Object.entries(diagnostic || {}).map(([key, value]) => [
    key,
    typeof value === "object" ? JSON.stringify(value) : String(value),
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Élément", "État"]],
    body: diagRows,
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("GarageDiag - Rapport généré automatiquement", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`rapport_${vehicule?.immatriculation || "vehicule"}.pdf`);
}
