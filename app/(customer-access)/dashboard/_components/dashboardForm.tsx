"use client";
import { Button } from "@/app/_components/_layout/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"; // Assurez-vous d'avoir ces composants correctement configurés
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

type ProfileFormProps = {
  user: {
    firstName: string;
    lastName: string;
    genreId: number;
  } | null;  // Permettre que user soit null
  genres: { id: number; name: string }[];
};

type FormData = {
  firstName: string;
  lastName: string;
  favoriteGenreId: string; // genreId est une string car les valeurs dans <select> sont des chaînes
};

export const ProfileForm = ({ user, genres }: ProfileFormProps) => {
  const methods = useForm<FormData>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      favoriteGenreId: String(user?.genreId), // Convertion de genreId en string pour <select>
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Traitement des données soumises
    console.log(data);
    // Vous pouvez envoyer ces données à votre backend pour mettre à jour l'utilisateur
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {/* Champ Prénom */}
        <FormField
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <input {...field} className="input" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Champ Nom */}
        <FormField
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <input {...field} className="input" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Champ Genre Préféré */}
        <FormField
          name="favoriteGenreId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre préféré</FormLabel>
              <FormControl>
                <select {...field} className="select">
                  {genres.map((genre) => (
                    <option key={genre.id} value={String(genre.id)}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Bouton de soumission */}
        <Button type="submit">Enregistrer</Button>
      </form>
    </FormProvider>
  );
};
