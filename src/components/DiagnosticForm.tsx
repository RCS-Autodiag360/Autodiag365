import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

type DefautItem = { etat: string; position: string };
type VoyantItem = { type: string; autre?: string };
type WearStatus = "bon" | "à prévoir" | "usé" | "à changer";
type EquipementStatus = "equipé" | "non_equipé";

export default function DiagnosticForm() {
  // 1) AJOUT : on inclut "conclusion" dans les onglets
  const [tab, setTab] = useState<"exterieur" | "habitacle" | "securite" | "conclusion">("exterieur");

  // 2) État global (inchangé + ajouts 'general' et 'conclusion')
  const [diag, setDiag] = useState({
    exterieur: {
      carrosserie: { defauts: [{ etat: "", position: "" }] },
      vitrage: { defauts: [{ etat: "", position: "" }] },
      plaqueAvant: { etat: "" },
      plaqueArriere: { etat: "" },
      retroviseurs: { etat: "", droit: false, gauche: false },
      jantes: { type: "alu", defauts: [{ etat: "", position: "" }] },
      pneusAvant: { usure: 50 },
      pneusArriere: { usure: 50 },
      feux: {
        "Feu de jour": true,
        "Position": true,
        "Croisement": true,
        "Phare": true,
        "Antibrouillard": true,
        "Clignotant": true,
        "Répétiteur": true,
        "Plaque": true,
        "Recul": true,
      },
    },
    habitacle: {
      voyants: [{ type: "" }],
      lectureDefauts: false,
      liquideFrein: { niveau: 50, humidite: 0, couleur: "clair" },
      liquideRefroidissement: { niveau: 50, couleur: "vert", aCompleter: false },
      huile: { niveau: 50 },
      dirAssistee: { niveau: 50 },
      courroieAccessoire: "bon" as WearStatus,
      tensionChargeV: "",
      etatBatterie: "bon" as WearStatus,
      circuitChargeRemarque: "",
    },
    securite: {
      avant: {
        amortisseur: "bon" as WearStatus,
        coupelle: "bon" as WearStatus,
        disque: 50,
        plaquettes: 50,
        flexible: "bon" as WearStatus,
        palier: "bon" as WearStatus,
        rotule: "bon" as WearStatus,
        soufflet: "bon" as WearStatus,
        roulement: "bon" as WearStatus,
        triangle: "bon" as WearStatus,
        cardan: "bon" as WearStatus,
      },
      arriere: {
        amortisseur: "bon" as WearStatus,
        disque: 50,
        plaquettes: 50,
        kitFrein: "bon" as WearStatus,
        tambours: "bon" as WearStatus,
        roulement: "bon" as WearStatus,
        flexible: "bon" as WearStatus,
        bras: "bon" as WearStatus,
        echappement: "bon" as WearStatus,

        // (ajoutés précédemment) contrôles d'équipement
        equipementDisque: "equipé" as EquipementStatus,
        equipementPlaquettes: "equipé" as EquipementStatus,
        equipementKitFrein: "equipé" as EquipementStatus,
        equipementTambours: "equipé" as EquipementStatus,
      }
    },

    // 3) AJOUT : infos générales pour la conclusion
    general: {
      kilometrage: "",
      controleTechniqueDate: "", // format AAAA-MM-JJ
      controleTechniqueOK: true,
    },

    // 4) AJOUT : zone texte conclusion (éditable par la suite)
    conclusion: {
      observations: "",
      recommandations: "",
    }
  });

  // Setters inchangés
  const setExt = <K extends keyof typeof diag.exterieur>(key: K, value: any) =>
    setDiag((d) => ({ ...d, exterieur: { ...d.exterieur, [key]: value } }));
  const setHab = <K extends keyof typeof diag.habitacle>(key: K, value: any) =>
    setDiag((d) => ({ ...d, habitacle: { ...d.habitacle, [key]: value } }));
  const setSec = <K extends keyof typeof diag.securite, F extends keyof typeof diag.securite[K]>(
    part: K, field: F, value: any
  ) => setDiag(d => ({
    ...d,
    securite: {
      ...d.securite,
      [part]: { ...d.securite[part], [field]: value }
    }
  }));

  // =================== Helpers POUR LA CONCLUSION ===================

  // Libellé Range5 (même logique que Range5 visuel)
  function labelRange5(value: number) {
    if (value === 0) return "Urgent";
    if (value === 25) return "Au témoin";
    if (value === 50) return "À prévoir";
    if (value === 75) return "Bon état";
    if (value === 100) return "Neuf";
    return `${value}%`;
  }
  function isRange5Issue(value: number) {
    // On considère "À prévoir" et en dessous comme défaut à signaler
    return value <= 50;
  }
  function isWearIssue(v: WearStatus) {
    return v !== "bon";
  }

  // Collecte des défauts: EXTERIEUR
  function collectExterieurIssues() {
    const res: string[] = [];

    // Carrosserie / Vitrage
    diag.exterieur.carrosserie.defauts.forEach(d => {
      if (d.etat || d.position) res.push(`Carrosserie — ${[d.etat, d.position].filter(Boolean).join(" / ")}`);
    });
    diag.exterieur.vitrage.defauts.forEach(d => {
      if (d.etat || d.position) res.push(`Vitrage — ${[d.etat, d.position].filter(Boolean).join(" / ")}`);
    });

    // Plaques
    if (diag.exterieur.plaqueAvant.etat) res.push(`Plaque avant — ${diag.exterieur.plaqueAvant.etat}`);
    if (diag.exterieur.plaqueArriere.etat) res.push(`Plaque arrière — ${diag.exterieur.plaqueArriere.etat}`);

    // Rétroviseurs
    if (diag.exterieur.retroviseurs.etat) res.push(`Rétroviseurs — ${diag.exterieur.retroviseurs.etat}`);

    // Jantes
    diag.exterieur.jantes.defauts.forEach(d => {
      if (d.etat || d.position) res.push(`Jantes — ${[d.etat, d.position].filter(Boolean).join(" / ")}`);
    });

    // Pneus
    if (isRange5Issue(diag.exterieur.pneusAvant.usure))
      res.push(`Pneus avant — ${labelRange5(diag.exterieur.pneusAvant.usure)}`);
    if (isRange5Issue(diag.exterieur.pneusArriere.usure))
      res.push(`Pneus arrière — ${labelRange5(diag.exterieur.pneusArriere.usure)}`);

    // Feux (false = défectueux)
    Object.keys(diag.exterieur.feux).forEach((k) => {
      const ok = (diag.exterieur.feux as any)[k];
      if (!ok) res.push(`Feux — ${k} défectueux`);
    });

    return res;
  }

  // Collecte des défauts: HABITACLE & MOTEUR
  function collectHabitacleIssues() {
    const res: string[] = [];

    // Voyants
    diag.habitacle.voyants.forEach((v, i) => {
      if (v.type) res.push(`Voyant ${i + 1} — ${v.type}${v.type === "autre" && v.autre ? ` (${v.autre})` : ""}`);
    });
    if (diag.habitacle.lectureDefauts) res.push("Lecture des défauts — Anomalies lues");

    // Liquide de frein
    if (diag.habitacle.liquideFrein.humidite >= 2)
      res.push(`Liquide de frein — Humidité élevée (${diag.habitacle.liquideFrein.humidite}/3)`);
    if (diag.habitacle.liquideFrein.niveau <= 0 || diag.habitacle.liquideFrein.niveau >= 125)
      res.push(`Liquide de frein — Niveau anormal (${diag.habitacle.liquideFrein.niveau}%)`);

    // LdR
    if (diag.habitacle.liquideRefroidissement.aCompleter)
      res.push("Liquide de refroidissement — À compléter");
    if (diag.habitacle.liquideRefroidissement.niveau <= 0 || diag.habitacle.liquideRefroidissement.niveau >= 125)
      res.push(`Liquide de refroidissement — Niveau anormal (${diag.habitacle.liquideRefroidissement.niveau}%)`);

    // Huile / DA
    if (diag.habitacle.huile.niveau <= 0)
      res.push(`Huile moteur — Sous mini (${diag.habitacle.huile.niveau}%)`);
    if (diag.habitacle.dirAssistee.niveau <= 0)
      res.push(`Direction assistée — Sous mini (${diag.habitacle.dirAssistee.niveau}%)`);

    // Courroie / Batterie
    if (isWearIssue(diag.habitacle.courroieAccessoire))
      res.push(`Courroie accessoire — ${diag.habitacle.courroieAccessoire}`);
    if (isWearIssue(diag.habitacle.etatBatterie))
      res.push(`Batterie — ${diag.habitacle.etatBatterie}`);

    // Tension de charge (si numérique)
    const v = parseFloat(diag.habitacle.tensionChargeV || "0");
    if (!isNaN(v) && v > 0 && (v < 13.5 || v > 15)) res.push(`Circuit de charge — Tension atypique (${v}V)`);
    if (diag.habitacle.circuitChargeRemarque) res.push(`Circuit de charge — Remarque: ${diag.habitacle.circuitChargeRemarque}`);

    return res;
  }

  // Collecte des défauts: ORGANES SÉCURITÉ (avant et arrière)
  function collectSecuriteIssues() {
    const res: string[] = [];
    const av = diag.securite.avant;
    const ar = diag.securite.arriere;

    // Avant (usure et états)
    if (isWearIssue(av.amortisseur)) res.push(`Sécurité AV — Amortisseur: ${av.amortisseur}`);
    if (isWearIssue(av.coupelle)) res.push(`Sécurité AV — Coupelle: ${av.coupelle}`);
    if (isRange5Issue(av.disque)) res.push(`Sécurité AV — Disque: ${labelRange5(av.disque)}`);
    if (isRange5Issue(av.plaquettes)) res.push(`Sécurité AV — Plaquettes: ${labelRange5(av.plaquettes)}`);
    if (isWearIssue(av.flexible)) res.push(`Sécurité AV — Flexible: ${av.flexible}`);
    if (isWearIssue(av.palier)) res.push(`Sécurité AV — Palier/barre stab.: ${av.palier}`);
    if (isWearIssue(av.rotule)) res.push(`Sécurité AV — Rotule: ${av.rotule}`);
    if (isWearIssue(av.soufflet)) res.push(`Sécurité AV — Soufflet de direction: ${av.soufflet}`);
    if (isWearIssue(av.roulement)) res.push(`Sécurité AV — Roulement: ${av.roulement}`);
    if (isWearIssue(av.triangle)) res.push(`Sécurité AV — Triangle/bras: ${av.triangle}`);
    if (isWearIssue(av.cardan)) res.push(`Sécurité AV — Cardan: ${av.cardan}`);

    // Arrière (respecte "équipé / non équipé")
    if (isWearIssue(ar.amortisseur)) res.push(`Sécurité AR — Amortisseur: ${ar.amortisseur}`);

    if (ar.equipementDisque === "equipé" && isRange5Issue(ar.disque))
      res.push(`Sécurité AR — Disque: ${labelRange5(ar.disque)}`);

    if (ar.equipementPlaquettes === "equipé" && isRange5Issue(ar.plaquettes))
      res.push(`Sécurité AR — Plaquettes: ${labelRange5(ar.plaquettes)}`);

    if (ar.equipementKitFrein === "equipé" && isWearIssue(ar.kitFrein))
      res.push(`Sécurité AR — Kit frein: ${ar.kitFrein}`);

    if (ar.equipementTambours === "equipé" && isWearIssue(ar.tambours))
      res.push(`Sécurité AR — Tambours: ${ar.tambours}`);

    if (isWearIssue(ar.roulement)) res.push(`Sécurité AR — Roulement: ${ar.roulement}`);
    if (isWearIssue(ar.flexible)) res.push(`Sécurité AR — Flexible: ${ar.flexible}`);
    if (isWearIssue(ar.bras)) res.push(`Sécurité AR — Bras/Train AR: ${ar.bras}`);
    if (isWearIssue(ar.echappement)) res.push(`Sécurité AR — Échappement: ${ar.echappement}`);

    return res;
  }

  // Scores par section (0..5), score général /20
  function computeScores() {
    const extI = collectExterieurIssues();
    const habI = collectHabitacleIssues();
    const secI = collectSecuriteIssues();

    const penalty = (issues: string[], per = 0.5) => Math.min(5, Math.max(0, 5 - issues.length * per));
    // Pondération simple : chaque section /5 puis mise à l'échelle sur /20
    const extScore = penalty(extI);
    const habScore = penalty(habI);
    // Sécurité plus sensible (0.7 par défauts)
    const secScore = Math.min(5, Math.max(0, 5 - secI.length * 0.7));

    const total20 = Math.round((extScore + habScore + secScore) * (20 / 15));

    return { extScore, habScore, secScore, total20, extI, habI, secI };
  }

  const scores = computeScores();

  // =================== RENDER ===================
  return (
    <Card>
      <CardHeader><CardTitle>Diagnostic</CardTitle></CardHeader>
      <CardContent>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap:"wrap" }}>
          <TabButton label="Extérieur" active={tab === "exterieur"} onClick={() => setTab("exterieur")} />
          <TabButton label="Habitacle & Moteur" active={tab === "habitacle"} onClick={() => setTab("habitacle")} />
          <TabButton label="Organes sécurité" active={tab === "securite"} onClick={() => setTab("securite")} />
          {/* 5) AJOUT : bouton Onglet Conclusion */}
          <TabButton label="Conclusion" active={tab === "conclusion"} onClick={() => setTab("conclusion")} />
        </div>

        {/* ================== EXTERIEUR ================== */}
        {tab === "exterieur" && (
          <>
            <Section title="Carrosserie">
              <MultiDefautField
                items={diag.exterieur.carrosserie.defauts}
                onChange={(val)=>setExt("carrosserie", { defauts: val })}
                etatOptions={["Rien à signaler","Rayure","Déformé","Cassé","Absent"]}
                posOptions={["Avant","Arrière","Latéral droit","Latéral gauche","Toit","Capot","Aile"]}
              />
            </Section>

            <Section title="Vitrage">
              <MultiDefautField
                items={diag.exterieur.vitrage.defauts}
                onChange={(val)=>setExt("vitrage", { defauts: val })}
                etatOptions={["Fissure","Cassé","Impact","Absent"]}
                posOptions={["Pare-brise","Vitre avant","Vitre arrière","Custode","Toit ouvrant","Coffre"]}
              />
            </Section>

            <Section title="Plaques">
              <SingleSelect label="Plaque avant" options={["","Illisible","Cassé","Non conforme","Absent"]}
                value={diag.exterieur.plaqueAvant.etat}
                onChange={(v)=>setExt("plaqueAvant",{ etat:v })}/>
              <SingleSelect label="Plaque arrière" options={["","Illisible","Cassé","Non conforme","Absent"]}
                value={diag.exterieur.plaqueArriere.etat}
                onChange={(v)=>setExt("plaqueArriere",{ etat:v })}/>
            </Section>

            <Section title="Rétroviseurs">
              <SingleSelect label="État" options={["","Cassé","Absent","Fendu"]}
                value={diag.exterieur.retroviseurs.etat}
                onChange={(v)=>setExt("retroviseurs",{...diag.exterieur.retroviseurs, etat:v})}/>
              <label><input type="checkbox" checked={diag.exterieur.retroviseurs.droit}
                onChange={(e)=>setExt("retroviseurs",{...diag.exterieur.retroviseurs,droit:e.target.checked})}/> Droit</label>
              <label><input type="checkbox" checked={diag.exterieur.retroviseurs.gauche}
                onChange={(e)=>setExt("retroviseurs",{...diag.exterieur.retroviseurs,gauche:e.target.checked})}/> Gauche</label>
            </Section>

            <Section title="Pneumatiques">
              <Range5 label="Pneu avant" value={diag.exterieur.pneusAvant.usure}
                onChange={(n)=>setExt("pneusAvant",{ usure:n })}/>
              <Range5 label="Pneu arrière" value={diag.exterieur.pneusArriere.usure}
                onChange={(n)=>setExt("pneusArriere",{ usure:n })}/>
            </Section>

            <Section title="Jantes">
              <SingleSelect label="Type" options={["alu","tole"]}
                value={diag.exterieur.jantes.type}
                onChange={(v)=>setExt("jantes",{...diag.exterieur.jantes, type:v})}/>
              <MultiDefautField
                items={diag.exterieur.jantes.defauts}
                onChange={(val)=>setExt("jantes",{...diag.exterieur.jantes, defauts:val})}
                etatOptions={["Rayure","Impact","Fissure","Cassé","Enjoliveur absent"]}
                posOptions={["Avant droit","Avant gauche","Arrière droit","Arrière gauche"]}
              />
            </Section>

            <Section title="Feux">
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
                <div>
                  <h4>Feux avant</h4>
                  {["Feu de jour","Position","Croisement","Phare","Antibrouillard","Clignotant","Répétiteur"].map(f=>(
                    <CheckLight key={f} label={f} checked={!!diag.exterieur.feux[f]}
                      onChange={(val)=>setExt("feux",{...diag.exterieur.feux,[f]:val})}/>
                  ))}
                </div>
                <div>
                  <h4>Feux arrière</h4>
                  {["Position","Plaque","Recul","Antibrouillard","Clignotant"].map(f=>(
                    <CheckLight key={f} label={f} checked={!!diag.exterieur.feux[f]}
                      onChange={(val)=>setExt("feux",{...diag.exterieur.feux,[f]:val})}/>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {/* ================== HABITACLE & MOTEUR ================== */}
        {tab === "habitacle" && (
          <>
            <Section title="Voyants (tableau de bord)">
              <MultiVoyants items={diag.habitacle.voyants} onChange={(v)=>setHab("voyants", v)} />
              <div style={{ marginTop: 8 }}>
                <Label>Lecture des défauts</Label>
                <select value={diag.habitacle.lectureDefauts ? "oui" : "non"}
                        onChange={(e)=>setHab("lectureDefauts", e.target.value === "oui")}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>
            </Section>

            <Section title="Liquide de frein">
              <Range7 label="Niveau" value={diag.habitacle.liquideFrein.niveau}
                      onChange={(n)=>setHab("liquideFrein",{...diag.habitacle.liquideFrein, niveau:n})}/>
              <RangeHumidite value={diag.habitacle.liquideFrein.humidite}
                      onChange={(n)=>setHab("liquideFrein",{...diag.habitacle.liquideFrein, humidite:n})}/>
              <SingleSelect label="Couleur" options={["clair","ambre","foncé","autre"]}
                            value={diag.habitacle.liquideFrein.couleur}
                            onChange={(v)=>setHab("liquideFrein",{...diag.habitacle.liquideFrein, couleur:v})}/>
            </Section>

            <Section title="Liquide de refroidissement">
              <Range7 label="Niveau" value={diag.habitacle.liquideRefroidissement.niveau}
                      onChange={(n)=>setHab("liquideRefroidissement",{...diag.habitacle.liquideRefroidissement, niveau:n})}/>
              <SingleSelect label="Couleur" options={["vert","rose","bleu","jaune","autre"]}
                            value={diag.habitacle.liquideRefroidissement.couleur}
                            onChange={(v)=>setHab("liquideRefroidissement",{...diag.habitacle.liquideRefroidissement, couleur:v})}/>
              <label><input type="checkbox" checked={diag.habitacle.liquideRefroidissement.aCompleter}
                      onChange={(e)=>setHab("liquideRefroidissement",{...diag.habitacle.liquideRefroidissement, aCompleter:e.target.checked})}/> À compléter</label>
            </Section>

            <Section title="Huile moteur">
              <Range7 label="Niveau" value={diag.habitacle.huile.niveau}
                      onChange={(n)=>setHab("huile",{niveau:n})}/>
            </Section>

            <Section title="Direction assistée">
              <Range7 label="Niveau" value={diag.habitacle.dirAssistee.niveau}
                      onChange={(n)=>setHab("dirAssistee",{niveau:n})}/>
            </Section>

            <Section title="Courroie accessoire">
              <SingleSelect label="État" options={["bon","à prévoir","usé","à changer"]}
                            value={diag.habitacle.courroieAccessoire}
                            onChange={(v)=>setHab("courroieAccessoire", v as WearStatus)}/>
            </Section>

            <Section title="Batterie & charge">
              <Label>Tension de charge (V)</Label>
              <input value={diag.habitacle.tensionChargeV}
                     onChange={(e)=>setHab("tensionChargeV", e.target.value)}
                     placeholder="ex: 14.2" />
              <Label>État batterie</Label>
              <select value={diag.habitacle.etatBatterie}
                      onChange={(e)=>setHab("etatBatterie", e.target.value as WearStatus)}>
                {["bon","à prévoir","usé","à changer"].map(o=><option key={o}>{o}</option>)}
              </select>
              <textarea placeholder="Remarque circuit de charge"
                        value={diag.habitacle.circuitChargeRemarque}
                        onChange={(e)=>setHab("circuitChargeRemarque", e.target.value)}/>
            </Section>
          </>
        )}

        {/* ================== ORGANES DE SECURITE ================== */}
        {tab === "securite" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <Section title="Partie Avant">
              <SingleSelect label="Amortisseur" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.amortisseur}
                onChange={(v)=>setSec("avant","amortisseur",v as WearStatus)}/>
              <SingleSelect label="Coupelle" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.coupelle}
                onChange={(v)=>setSec("avant","coupelle",v as WearStatus)}/>
              <Range5 label="Disque" value={diag.securite.avant.disque}
                onChange={(n)=>setSec("avant","disque",n)}/>
              <Range5 label="Plaquettes" value={diag.securite.avant.plaquettes}
                onChange={(n)=>setSec("avant","plaquettes",n)}/>
              <SingleSelect label="Flexible AV" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.flexible}
                onChange={(v)=>setSec("avant","flexible",v as WearStatus)}/>
              <SingleSelect label="Palier / barre stab." options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.palier}
                onChange={(v)=>setSec("avant","palier",v as WearStatus)}/>
              <SingleSelect label="Rotule direction / axiale" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.rotule}
                onChange={(v)=>setSec("avant","rotule",v as WearStatus)}/>
              <SingleSelect label="Soufflet de direction" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.soufflet}
                onChange={(v)=>setSec("avant","soufflet",v as WearStatus)}/>
              <SingleSelect label="Roulement de roue" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.roulement}
                onChange={(v)=>setSec("avant","roulement",v as WearStatus)}/>
              <SingleSelect label="Triangle / bras suspension" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.triangle}
                onChange={(v)=>setSec("avant","triangle",v as WearStatus)}/>
              <SingleSelect label="Cardan / soufflet cardan" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.avant.cardan}
                onChange={(v)=>setSec("avant","cardan",v as WearStatus)}/>
            </Section>

            <Section title="Partie Arrière">
              <SingleSelect label="Amortisseur" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.arriere.amortisseur}
                onChange={(v)=>setSec("arriere","amortisseur",v as WearStatus)}/>

              {/* Disque AR conditionné par équipement */}
              <Label>Disque arrière</Label>
              <select
                value={diag.securite.arriere.equipementDisque}
                onChange={(e)=>setSec("arriere","equipementDisque", e.target.value as EquipementStatus)}
              >
                <option value="equipé">Équipé</option>
                <option value="non_equipé">Non équipé</option>
              </select>
              {diag.securite.arriere.equipementDisque === "equipé" && (
                <Range5 label="Disque" value={diag.securite.arriere.disque}
                        onChange={(n)=>setSec("arriere","disque",n)}/>
              )}

              {/* Plaquettes AR */}
              <Label>Plaquettes arrière</Label>
              <select
                value={diag.securite.arriere.equipementPlaquettes}
                onChange={(e)=>setSec("arriere","equipementPlaquettes", e.target.value as EquipementStatus)}
              >
                <option value="equipé">Équipé</option>
                <option value="non_equipé">Non équipé</option>
              </select>
              {diag.securite.arriere.equipementPlaquettes === "equipé" && (
                <Range5 label="Plaquettes" value={diag.securite.arriere.plaquettes}
                        onChange={(n)=>setSec("arriere","plaquettes",n)}/>
              )}

              {/* Kit frein AR */}
              <Label>Kit frein arrière</Label>
              <select
                value={diag.securite.arriere.equipementKitFrein}
                onChange={(e)=>setSec("arriere","equipementKitFrein", e.target.value as EquipementStatus)}
              >
                <option value="equipé">Équipé</option>
                <option value="non_equipé">Non équipé</option>
              </select>
              {diag.securite.arriere.equipementKitFrein === "equipé" && (
                <SingleSelect label="Kit frein" options={["bon","à prévoir","usé","à changer"]}
                  value={diag.securite.arriere.kitFrein}
                  onChange={(v)=>setSec("arriere","kitFrein",v as WearStatus)}/>
              )}

              {/* Tambours AR */}
              <Label>Tambours arrière</Label>
              <select
                value={diag.securite.arriere.equipementTambours}
                onChange={(e)=>setSec("arriere","equipementTambours", e.target.value as EquipementStatus)}
              >
                <option value="equipé">Équipé</option>
                <option value="non_equipé">Non équipé</option>
              </select>
              {diag.securite.arriere.equipementTambours === "equipé" && (
                <SingleSelect label="Tambours" options={["bon","à prévoir","usé","à changer"]}
                  value={diag.securite.arriere.tambours}
                  onChange={(v)=>setSec("arriere","tambours",v as WearStatus)}/>
              )}

              {/* autres champs */}
              <SingleSelect label="Roulement" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.arriere.roulement}
                onChange={(v)=>setSec("arriere","roulement",v as WearStatus)}/>
              <SingleSelect label="Flexible AR" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.arriere.flexible}
                onChange={(v)=>setSec("arriere","flexible",v as WearStatus)}/>
              <SingleSelect label="Bras suspension / train arrière" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.arriere.bras}
                onChange={(v)=>setSec("arriere","bras",v as WearStatus)}/>
              <SingleSelect label="Système échappement" options={["bon","à prévoir","usé","à changer"]}
                value={diag.securite.arriere.echappement}
                onChange={(v)=>setSec("arriere","echappement",v as WearStatus)}/>
            </Section>
          </div>
        )}

        {/* ================== CONCLUSION (NOUVEL ONGLET) ================== */}
        {tab === "conclusion" && (
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
            {/* Résumé défauts */}
            <Section title="Résumé des défauts détectés">
              <h4>Extérieur</h4>
              {scores.extI.length ? (
                <ul>{scores.extI.map((s,i)=><li key={i}>• {s}</li>)}</ul>
              ) : <p>Aucun défaut signalé.</p>}

              <h4 style={{marginTop:10}}>Habitacle & Moteur</h4>
              {scores.habI.length ? (
                <ul>{scores.habI.map((s,i)=><li key={i}>• {s}</li>)}</ul>
              ) : <p>Aucun défaut signalé.</p>}

              <h4 style={{marginTop:10}}>Organes de sécurité</h4>
              {scores.secI.length ? (
                <ul>{scores.secI.map((s,i)=><li key={i}>• {s}</li>)}</ul>
              ) : <p>Aucun défaut signalé.</p>}
            </Section>

            {/* Infos générales + Score */}
            <Section title="Informations & État général">
              {/* Infos générales */}
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
                <div>
                  <Label>Kilométrage</Label>
                  <input
                    placeholder="ex: 128500"
                    value={diag.general.kilometrage}
                    onChange={(e)=>setDiag(d=>({...d, general:{...d.general, kilometrage:e.target.value}}))}
                  />
                </div>
                <div>
                  <Label>Date contrôle technique</Label>
                  <input
                    type="date"
                    value={diag.general.controleTechniqueDate}
                    onChange={(e)=>setDiag(d=>({...d, general:{...d.general, controleTechniqueDate:e.target.value}}))}
                  />
                </div>
                <div>
                  <Label>Contrôle technique</Label>
                  <select
                    value={diag.general.controleTechniqueOK ? "valide" : "contre_visite"}
                    onChange={(e)=>setDiag(d=>({...d, general:{...d.general, controleTechniqueOK: e.target.value==="valide"}}))}
                  >
                    <option value="valide">Valide</option>
                    <option value="contre_visite">Contre-visite</option>
                  </select>
                </div>
              </div>

              {/* Synthèse niveaux (automatique, lecture seule) */}
              <div style={{marginTop:12, padding:10, background:"#f8fafc", borderRadius:8}}>
                <strong>Synthèse niveaux</strong>
                <ul style={{marginTop:6}}>
                  <li>Liquide de frein — niveau {diag.habitacle.liquideFrein.niveau}%, humidité {diag.habitacle.liquideFrein.humidite}/3 ({diag.habitacle.liquideFrein.couleur})</li>
                  <li>Liquide de refroidissement — niveau {diag.habitacle.liquideRefroidissement.niveau}%, couleur {diag.habitacle.liquideRefroidissement.couleur}{diag.habitacle.liquideRefroidissement.aCompleter ? " (À compléter)" : ""}</li>
                  <li>Huile moteur — niveau {diag.habitacle.huile.niveau}%</li>
                  <li>Direction assistée — niveau {diag.habitacle.dirAssistee.niveau}%</li>
                </ul>
              </div>

              {/* Score général /20 */}
              <div style={{marginTop:12}}>
                <Label>État général du véhicule</Label>
                <div style={{display:"flex", alignItems:"center", gap:12, marginTop:6}}>
                  <div style={{fontSize:28, fontWeight:700, minWidth:64, textAlign:"center"}}>
                    {scores.total20} / 20
                  </div>
                  <div style={{flex:1, background:"#e5e7eb", height:10, borderRadius:6, overflow:"hidden"}}>
                    <div
                      style={{
                        width: `${(scores.total20/20)*100}%`,
                        height: "100%",
                        background: scores.total20 >= 15 ? "#16a34a" : scores.total20 >= 10 ? "#f59e0b" : "#dc2626"
                      }}
                    />
                  </div>
                </div>
                <div style={{marginTop:6, fontSize:12, color:"#6b7280"}}>
                  Détail (sur 5) — Extérieur: {scores.extScore.toFixed(1)} • Habitacle: {scores.habScore.toFixed(1)} • Sécurité: {scores.secScore.toFixed(1)}
                </div>
              </div>

              {/* Observations / Recommandations (déjà dans l'état pour la suite) */}
              <div style={{marginTop:12}}>
                <Label>Observations générales</Label>
                <textarea
                  style={{width:"100%",minHeight:80}}
                  value={diag.conclusion.observations}
                  onChange={(e)=>setDiag(d=>({...d, conclusion:{...d.conclusion, observations:e.target.value}}))}
                />
                <Label>Recommandations</Label>
                <textarea
                  style={{width:"100%",minHeight:80}}
                  value={diag.conclusion.recommandations}
                  onChange={(e)=>setDiag(d=>({...d, conclusion:{...d.conclusion, recommandations:e.target.value}}))}
                />
              </div>
            </Section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ===== Helpers UI ===== */
function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} style={{background:active?"#2563eb":"#e5e7eb",color:active?"#fff":"#111",padding:"6px 12px",border:"none",borderRadius:6}}>{label}</button>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{marginBottom:20}}><h3>{title}</h3>{children}</div>;
}
function SingleSelect({label,options,value,onChange}:{label:string;options:string[];value:string;onChange:(v:string)=>void}){
  return(<div><Label>{label}</Label><select value={value} onChange={(e)=>onChange(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></div>);
}
function MultiDefautField({items,onChange,etatOptions,posOptions}:{items:DefautItem[],onChange:(v:DefautItem[])=>void,etatOptions:string[],posOptions:string[]}){
  const update=(i:number,f:keyof DefautItem,v:string)=>{const copy=[...items];copy[i]={...copy[i],[f]:v};onChange(copy);};
  const remove=(i:number)=>{const copy=[...items];copy.splice(i,1);onChange(copy.length?copy:[{etat:"",position:""}]);};
  return(<div>{items.map((it,i)=>(<div key={i} style={{display:"flex",gap:6}}><select value={it.etat} onChange={(e)=>update(i,"etat",e.target.value)}><option value="">État</option>{etatOptions.map(o=><option key={o}>{o}</option>)}</select><select value={it.position} onChange={(e)=>update(i,"position",e.target.value)}><option value="">Emplacement</option>{posOptions.map(o=><option key={o}>{o}</option>)}</select><button onClick={()=>remove(i)}>❌</button></div>))}<button onClick={()=>onChange([...items,{etat:"",position:""}])}>+ Ajouter</button></div>);
}
function CheckLight({label,checked,onChange}:{label:string;checked:boolean;onChange:(v:boolean)=>void}){
  return(<label style={{display:"flex",gap:6}}><span style={{width:12,height:12,borderRadius:"50%",background:checked?"#16a34a":"#dc2626"}}/>{label}<input type="checkbox" checked={checked} onChange={(e)=>onChange(e.target.checked)}/></label>);
}
function Range5({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  let etat = ""; let color = "#16a34a";
  if (value === 0) { etat = "Urgent"; color = "#dc2626"; }
  else if (value === 25) { etat = "Au témoin"; color = "#f97316"; }
  else if (value === 50) { etat = "À prévoir"; color = "#f59e0b"; }
  else if (value === 75) { etat = "Bon état"; color = "#16a34a"; }
  else if (value === 100) { etat = "Neuf"; color = "#0284c7"; }
  return(<div><Label>{label}: <span style={{color}}>{etat} ({value}%)</span></Label><input type="range" min={0} max={100} step={25} value={value} onChange={(e)=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:color}}/></div>);
}
function Range7({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  let etat="";let color="#16a34a";
  if(value<=-25){etat="Vide";color="#dc2626";}else if(value===0){etat="Sous mini";color="#dc2626";}else if(value===25){etat="Proche mini";color="#f97316";}else if(value===50){etat="Correct";color="#16a34a";}else if(value===75){etat="Proche maxi";color="#f97316";}else if(value===100){etat="Maxi";color="#16a34a";}else if(value>=125){etat="Au-dessus maxi";color="#dc2626";}
  return(<div><Label>{label}: <span style={{color}}>{etat} ({value}%)</span></Label><input type="range" min={-25} max={125} step={25} value={value} onChange={(e)=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:color}}/></div>);
}
function RangeHumidite({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  let etat=""; let color="#16a34a";
  if(value===0){etat="Neuf";color="#16a34a";}
  else if(value===1){etat="À prévoir";color="#f59e0b";}
  else if(value===2){etat="À changer";color="#f97316";}
  else if(value>=3){etat="À changer URGENT";color="#dc2626";}
  return(<div><Label>Humidité: <span style={{color}}>{etat} ({value}%)</span></Label><input type="range" min={0} max={3} step={1} value={value} onChange={(e)=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:color}}/></div>);
}
function MultiVoyants({ items, onChange }: { items: VoyantItem[]; onChange: (v: VoyantItem[]) => void }) {
  const update=(i:number,f:keyof VoyantItem,v:string)=>{const copy=[...items];copy[i]={...copy[i],[f]:v};onChange(copy);};
  const remove=(i:number)=>{const copy=[...items];copy.splice(i,1);onChange(copy.length?copy:[{type:""}]);};
  return(<div>{items.map((it,i)=>(<div key={i} style={{display:"flex",gap:6,marginBottom:4}}><select value={it.type} onChange={(e)=>update(i,"type",e.target.value)}><option value="">Choisir</option>{["moteur","frein","refroidissement","révision","urea","adblue","pollution","abs","esp","direction","pneumatique","autre"].map(v=><option key={v}>{v}</option>)}</select>{it.type==="autre"&&<input placeholder="Préciser" value={it.autre||""} onChange={(e)=>update(i,"autre",e.target.value)}/>}<button onClick={()=>remove(i)}>❌</button></div>))}<button onClick={()=>onChange([...items,{type:""}])}>+ Ajouter voyant</button></div>);
}
