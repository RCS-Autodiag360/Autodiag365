import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

type BrandInfo = { modeles: string[] };

const initialBrands: Record<string, BrandInfo> = {
  Peugeot: { modeles: ["107","108","206","207","208","301","306","307","308","406","407","508","2008","3008","5008","Rifter","Partner","Expert"] },
  Citroen: { modeles: ["C1","C2","C3","C3 Aircross","C4","C4 Cactus","C4 Picasso","C5","C5 Aircross","Berlingo","Jumper","Jumpy"] },
  "DS Automobiles": { modeles: ["DS 3","DS 4","DS 7","DS 9"] },
  Renault: { modeles: ["Clio","Twingo","Megane","Kadjar","Captur","Austral","Scenic","Espace","Laguna","Talisman","Arkana","Zoe","Kangoo","Master","Trafic"] },
  Dacia: { modeles: ["Logan","Sandero","Stepway","Duster","Jogger","Spring"] },
  Alpine: { modeles: ["A110","A110 S","A110 GT"] },
  Bugatti: { modeles: ["Veyron","Chiron","Tourbillon"] },

  Volkswagen: { modeles: ["up!","Polo","Golf","Golf Plus","Beetle","Scirocco","Passat","Arteon","Touran","Tiguan","Touareg","T-Roc","ID.3","ID.4","ID.5"] },
  Audi: { modeles: ["A1","A3","A4","A5","A6","A7","A8","Q2","Q3","Q5","Q7","Q8","e-tron","TT","R8"] },
  Porsche: { modeles: ["911","718 Cayman","718 Boxster","Panamera","Macan","Cayenne","Taycan"] },
  BMW: { modeles: ["Série 1","Série 2","Série 3","Série 4","Série 5","Série 7","Z4","i3","i4","i7","X1","X3","X4","X5","X6","X7"] },
  "Mercedes-Benz": { modeles: ["Classe A","Classe B","Classe C","Classe E","Classe S","GLA","GLB","GLC","GLE","GLS","CLA","CLS","EQB","EQC","EQS","Vito","Sprinter"] },
  Smart: { modeles: ["ForTwo","ForFour","#1"] },
  Opel: { modeles: ["Karl","Corsa","Astra","Insignia","Adam","Mokka","Crossland","Grandland","Zafira","Vivaro","Combo"] },
  Maybach: { modeles: ["57","62","S 580","S 680"] },

  Fiat: { modeles: ["Panda","500","500X","500e","Tipo","Punto","Doblo","Egea"] },
  "Alfa Romeo": { modeles: ["MiTo","Giulietta","Giulia","Stelvio","Tonale","4C"] },
  Lancia: { modeles: ["Ypsilon","Delta","Thema"] },
  Maserati: { modeles: ["Ghibli","Quattroporte","Levante","Grecale","MC20"] },
  Ferrari: { modeles: ["488","F8 Tributo","Roma","Portofino","296","812","SF90"] },
  Lamborghini: { modeles: ["Huracán","Aventador","Revuelto","Urus","Gallardo (ancien)"] },

  SEAT: { modeles: ["Mii","Ibiza","Leon","Toledo","Ateca","Arona","Tarraco","Alhambra"] },
  CUPRA: { modeles: ["Born","Leon","Ateca","Formentor","Tavascan"] },

  Skoda: { modeles: ["Citigo","Fabia","Scala","Octavia","Superb","Kamiq","Karoq","Kodiaq","Enyaq"] },

  Volvo: { modeles: ["C30","S40","V40","S60","V60","S90","V90","XC40","XC60","XC90","EX30","EX90"] },
  Saab: { modeles: ["9-3","9-5","900"] },
  Koenigsegg: { modeles: ["Agera","Regera","Jesko","Gemera"] },

  MINI: { modeles: ["Hatch","Clubman","Countryman","Cabrio","Aceman"] },
  Jaguar: { modeles: ["XE","XF","XJ","F-Pace","E-Pace","I-Pace","F-Type"] },
  "Land Rover": { modeles: ["Defender","Discovery","Discovery Sport","Range Rover","Range Rover Sport","Velar","Evoque"] },
  Lotus: { modeles: ["Elise","Exige","Evora","Emira","Eletre"] },
  Bentley: { modeles: ["Continental GT","Flying Spur","Bentayga","Mulsanne"] },
  "Rolls-Royce": { modeles: ["Ghost","Wraith","Dawn","Phantom","Cullinan","Spectre"] },
  "Aston Martin": { modeles: ["DB11","DB12","DBX","Vantage","Vanquish","Valhalla"] },
  McLaren: { modeles: ["540C","570S","600LT","650S","675LT","720S","Artura","GT"] },
  MG: { modeles: ["ZS","HS","EHS","MG 4","MG 5"] },
  Caterham: { modeles: ["Seven 170","Seven 360","Seven 420","Seven 620"] },
  TVR: { modeles: ["Griffith","Sagaris","Tuscan"] },

  Spyker: { modeles: ["C8","C12"] },
  Donkervoort: { modeles: ["D8","F22"] },

  Rimac: { modeles: ["Nevera","C_Two"] },

  KTM: { modeles: ["X-Bow"] },
};

const MOTORISATIONS = ["Essence","Diesel","Hybride","Hybride rechargeable","Électrique","GNV","GPL"];

const frImmat = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;

const vehiculeSchema = z.object({
  marque: z.string().min(1, { message: "Sélectionnez une marque" }),
  modele: z.string().min(1, { message: "Sélectionnez un modèle" }),
  motorisation: z.string().min(1, { message: "Sélectionnez une motorisation" }),
  immatriculation: z.string().regex(frImmat, { message: "Format attendu : AA-123-BB" }),
  vin: z.string().regex(vinRegex, { message: "VIN invalide (17 caractères, sans I/O/Q)" }),
  miseEnCirculation: z.string().min(4, { message: "Date invalide" }),
});

export type Vehicule = z.infer<typeof vehiculeSchema>;

interface VehiculeFormProps {
  data: Vehicule;
  onChange: (v: Vehicule) => void;
  onSubmitSuccess?: () => void;
}

function slugifyBrand(b: string) {
  return b.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function logoPath(brand: string) {
  const slug = slugifyBrand(brand);
  return `/logos/${slug}.png`;
}

export default function VehiculeForm({ data, onChange, onSubmitSuccess }: VehiculeFormProps) {
  const [brands, setBrands] = useState<Record<string, BrandInfo>>(initialBrands);
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModel, setNewModel] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm<Vehicule>({
    resolver: zodResolver(vehiculeSchema),
    defaultValues: data,
  });

  const selectedMarque = watch("marque");
  const selectedModele = watch("modele");

  useEffect(() => { reset(data); }, [data, reset]);
  useEffect(() => { setValue("modele", ""); setShowAddModel(false); setNewModel(""); }, [selectedMarque, setValue]);

  const modeles = useMemo(() => selectedMarque ? (brands[selectedMarque]?.modeles ?? []) : [], [selectedMarque, brands]);

  const addModel = () => {
    const m = newModel.trim();
    if (!selectedMarque || m.length < 1) return;
    setBrands(prev => {
      const existing = new Set(prev[selectedMarque]?.modeles ?? []);
      if (!existing.has(m)) existing.add(m);
      return { ...prev, [selectedMarque]: { modeles: Array.from(existing).sort((a,b)=>a.localeCompare(b,"fr")) } };
    });
    setValue("modele", m);
    setShowAddModel(false);
    setNewModel("");
  };

  const onSubmit = (formData: Vehicule) => {
    onChange(formData);
    alert("Véhicule enregistré ✅");
    if (onSubmitSuccess) onSubmitSuccess();
  };

  const showLogo = Boolean(selectedMarque);

  return (
    <div className="max-w-xl mx-auto">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Identification Véhicule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="marque">Marque</Label>
              <div className="flex items-center gap-3">
                {showLogo && (
                  <img
                    src={logoPath(selectedMarque!)}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/logos/generic.png"; }}
                    alt={selectedMarque!}
                    className="h-8 w-8 object-contain"
                  />
                )}
                <select id="marque" {...register("marque")} className="w-full border rounded px-3 py-2">
                  <option value="">-- Sélectionnez une marque --</option>
                  {Object.keys(brands).sort((a,b)=>a.localeCompare(b,"fr")).map((nom) => (
                    <option key={nom} value={nom}>{nom}</option>
                  ))}
                </select>
              </div>
              {errors.marque && <p className="text-red-500 text-sm">{errors.marque.message}</p>}
            </div>

            <div>
              <Label htmlFor="modele">Modèle</Label>
              <div className="flex gap-2">
                <select id="modele" {...register("modele")} className="w-full border rounded px-3 py-2">
                  <option value="">-- Sélectionnez un modèle --</option>
                  {modeles.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <Button type="button" onClick={() => setShowAddModel(v=>!v)}>
                  {showAddModel ? "Annuler" : "Ajouter un modèle"}
                </Button>
              </div>

              {showAddModel && (
                <div className="mt-2 flex gap-2">
                  <Input value={newModel} onChange={(e)=>setNewModel(e.target.value)} placeholder="Nouveau modèle (ex: 408, ID.7, ...)" />
                  <Button type="button" onClick={addModel}>Ajouter</Button>
                </div>
              )}

              {selectedMarque && selectedModele && !modeles.includes(selectedModele) && (
                <p className="text-amber-700 text-sm mt-1">
                  Modèle “{selectedModele}” non répertorié pour {selectedMarque}. Vous pouvez l’ajouter.
                </p>
              )}
              {errors.modele && <p className="text-red-500 text-sm">{errors.modele.message}</p>}
            </div>

            <div>
              <Label htmlFor="motorisation">Motorisation</Label>
              <select id="motorisation" {...register("motorisation")} className="w-full border rounded px-3 py-2">
                <option value="">-- Sélectionnez --</option>
                {MOTORISATIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.motorisation && <p className="text-red-500 text-sm">{errors.motorisation.message}</p>}
            </div>

            <div>
              <Label htmlFor="immatriculation">Immatriculation</Label>
              <Input id="immatriculation" {...register("immatriculation")} placeholder="AA-123-BB" />
              {errors.immatriculation && <p className="text-red-500 text-sm">{errors.immatriculation.message}</p>}
            </div>

            <div>
              <Label htmlFor="vin">VIN (17 caractères)</Label>
              <Input id="vin" {...register("vin")} placeholder="VF1AAAAA1A1234567" />
              {errors.vin && <p className="text-red-500 text-sm">{errors.vin.message}</p>}
            </div>

            <div>
              <Label htmlFor="miseEnCirculation">Mise en circulation</Label>
              <Input id="miseEnCirculation" type="date" {...register("miseEnCirculation")} />
              {errors.miseEnCirculation && <p className="text-red-500 text-sm">{errors.miseEnCirculation.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
