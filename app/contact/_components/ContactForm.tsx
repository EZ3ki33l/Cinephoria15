"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Phone,
  MapPin,
} from "lucide-react";
import { DynamicMap } from "@/app/_components/maps/DynamicMap";
import { PLATFORM_PHONE } from "@/lib/constants";
import { submitContactForm, ContactFormData } from "../actions";

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  motif: z.string().min(1, "Veuillez sélectionner un motif"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

const motifs = [
  "Information générale",
  "Réservation",
  "Problème technique",
  "Partenariat",
  "Autre",
];

const reseauxSociaux = [
  {
    nom: "Facebook",
    url: "https://facebook.com/cinephoria15",
    icon: Facebook,
  },
  {
    nom: "X",
    url: "https://twitter.com/cinephoria15",
    icon: Twitter,
  },
  {
    nom: "Youtube",
    url: "https://youtube.com/cinephoria15",
    icon: Youtube,
  },
  {
    nom: "LinkedIn",
    url: "https://linkedin.com/company/cinephoria15",
    icon: Linkedin,
  },
];

interface Cinema {
  id: number;
  name: string;
  addressId: number;
  isOpen: boolean | null;
  managerId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  Address: {
    id: number;
    street: string;
    city: string;
    postalCode: number;
    lat: number;
    lng: number;
  };
  Equipment: {
    id: number;
    name: string;
  }[];
  Screens: {
    id: number;
    number: number;
    projectionType: string;
    soundSystemType: string;
  }[];
}

interface ContactFormProps {
  cinemas: Cinema[];
}

const transformCinema = (cinema: Cinema) => ({
  id: cinema.id,
  name: cinema.name,
  Address: cinema.Address,
  Equipment: cinema.Equipment,
  screens: cinema.Screens.map(screen => ({
    id: screen.id,
    number: screen.number,
    seats: [],
    projectionType: screen.projectionType || "",
    soundSystemType: screen.soundSystemType || ""
  }))
});

export function ContactForm({ cinemas }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitContactForm(data);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Votre message a bien été envoyé !");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Contactez-nous</h1>

      {/* Réseaux sociaux */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Nos réseaux sociaux</h2>
        <div className="flex gap-4">
          {reseauxSociaux.map((reseau) => (
            <a
              key={reseau.nom}
              href={reseau.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary"
            >
              <reseau.icon className="w-6 h-6" />
              <span>{reseau.nom}</span>
            </a>
          ))}
        </div>
      </Card>

      {/* Numéro de téléphone de la plateforme */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Nous appeler</h2>
        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6" />
          <span className="text-lg">{PLATFORM_PHONE}</span>
        </div>
      </Card>

      {/* Nos cinémas */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Nos cinémas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {cinemas.map((cinema) => (
              <div key={cinema.id} className="space-y-2">
                <h3 className="text-xl font-medium">{cinema.name}</h3>
                <button
                  onClick={() => setSelectedCinemaId(cinema.id)}
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <MapPin className="w-4 h-4" />
                  <span>
                    {cinema.Address.street}, {cinema.Address.postalCode}{" "}
                    {cinema.Address.city}
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div className="h-[400px]">
            <DynamicMap 
              cinemas={cinemas?.map(transformCinema)}
              selectedCinema={selectedCinemaId ? transformCinema(cinemas.find(c => c.id === selectedCinemaId)!) : null}
            />
          </div>
        </div>
      </Card>

      {/* Formulaire de contact */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Formulaire de contact</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" {...register("nom")} />
              {errors.nom?.message && (
                <p className="text-red-500 text-sm">{errors.nom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input id="prenom" {...register("prenom")} />
              {errors.prenom?.message && (
                <p className="text-red-500 text-sm">{errors.prenom.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email?.message && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif de la demande</Label>
            <Controller
              name="motif"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger data-testid="motif-trigger">
                    <SelectValue placeholder="Sélectionnez un motif" />
                  </SelectTrigger>
                  <SelectContent>
                    {motifs.map((motif) => (
                      <SelectItem 
                        key={motif} 
                        value={motif}
                        data-testid={`select-item-${motif}`}
                      >
                        {motif}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.motif?.message && (
              <p className="text-red-500 text-sm">{errors.motif.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              {...register("message")}
              rows={5}
              placeholder="Écrivez votre message ici..."
            />
            {errors.message?.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </form>
      </Card>
    </div>
  );
} 