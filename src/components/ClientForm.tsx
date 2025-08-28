import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Label } from "./ui/label";

const clientSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  societe: z.string().optional(),
  adresse: z.string().min(5, { message: "Adresse trop courte" }),
  codePostal: z.string().regex(/^[0-9]{5}$/, { message: "Code postal invalide" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  telephone: z.string().regex(/^\+?[0-9 ]{6,15}$/, { message: "Numéro de téléphone invalide" }),
});

export type Client = z.infer<typeof clientSchema>;

interface ClientFormProps {
  data: Client;
  onChange: (c: Client) => void;
  onSubmitSuccess?: () => void;
}

export default function ClientForm({ data, onChange, onSubmitSuccess }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Client>({
    resolver: zodResolver(clientSchema),
    defaultValues: data,
  });

  useEffect(() => { reset(data); }, [data, reset]);

  const onSubmit = (formData: Client) => {
    onChange(formData);
    if (onSubmitSuccess) onSubmitSuccess();
  };

  return (
    <div style={{maxWidth:'640px', margin:'0 auto'}}>
      <Card>
        <CardHeader>
          <CardTitle>Identification Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" {...register("nom")} placeholder="Dupont" />
              {errors.nom && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.nom.message}</p>}
            </div>
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" {...register("prenom")} placeholder="Jean" />
              {errors.prenom && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.prenom.message}</p>}
            </div>
            <div>
              <Label htmlFor="societe">Société</Label>
              <Input id="societe" {...register("societe")} placeholder="Mon entreprise" />
            </div>
            <div>
              <Label htmlFor="adresse">Adresse postale</Label>
              <Input id="adresse" {...register("adresse")} placeholder="12 rue de la République" />
              {errors.adresse && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.adresse.message}</p>}
            </div>
            <div>
              <Label htmlFor="codePostal">Code postal</Label>
              <Input id="codePostal" {...register("codePostal")} placeholder="75000" />
              {errors.codePostal && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.codePostal.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="exemple@mail.com" />
              {errors.email && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" {...register("telephone")} placeholder="+33612345678" />
              {errors.telephone && <p style={{color:'#dc2626', fontSize:'.85rem'}}>{errors.telephone.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} style={{width:'100%'}}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
