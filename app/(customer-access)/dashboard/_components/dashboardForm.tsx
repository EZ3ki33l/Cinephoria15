"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/app/_components/_layout/button";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Genre, User } from "@prisma/client";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { deleteUserAccount } from "./actions";
import { redirect } from "next/navigation";
import AlertDialog from "./AlertDialog";

interface ProfileFormProps {
  user: User;
  genres: Genre[];
  onSubmit: (data: any) => void;
  userId: string;
}

export const ProfileForm = ({ user, genres, onSubmit, userId }: ProfileFormProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  // Vérification de l'image récupérée de Prisma et utilisation d'une image par défaut si nécessaire
  const [initialImageUrl, setInitialImageUrl] = useState(user.image || "/images/user.png");
  console.log("Image initiale de Prisma :", user.image); // Vérification de l'image

  const newImageUrl = useWatch({
    name: "newImageUrl",
    defaultValue: user.image || "",
  });

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDeleteAccount = () => {
    setIsAlertOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteUserAccount(userId);
      toast.success("Compte supprimé avec succès");
      redirect("/sign-in");
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsAlertOpen(false);
    }
  };

  useEffect(() => {
    // Initialisation des valeurs du formulaire avec setValue
    if (user) {
      console.log("Initialisation des valeurs du formulaire pour l'utilisateur : ", user);
      setValue("userName", user.userName || "");
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("favoriteGenreId", user.genreId?.toString() || "");
      setValue("newImageUrl", user.image || ""); // Initialisation de l'URL de l'image
    }
  }, [user, setValue]);

  useEffect(() => {
    console.log("Nouvelle image URL : ", newImageUrl); // Vérification de la nouvelle image
    if (newImageUrl && newImageUrl !== initialImageUrl) {
      setInitialImageUrl(newImageUrl); // Mettre à jour avec l'image téléchargée
    }
  }, [newImageUrl, initialImageUrl]);

  const handleSubmitForm = async (data: any) => {
    try {
      await onSubmit(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSubmitForm)}>
      {/* Champ Pseudo (Username) */}
      <FormField
        name="userName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pseudo</FormLabel>
            <FormControl>
              <Input
                {...register("userName", { required: "Le pseudo est requis" })}
                placeholder="Entrez votre pseudo"
                defaultValue={user.userName || ""}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-x-10">
        {/* Champ Prénom */}
        <FormField
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input
                  {...register("firstName", {
                    required: "Le prénom est requis",
                  })}
                  placeholder="Entrez votre prénom"
                  defaultValue={user.firstName || ""}
                />
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
                <Input
                  {...register("lastName", { required: "Le nom est requis" })}
                  placeholder="Entrez votre nom"
                  defaultValue={user.lastName || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Sélecteur de genre */}
      <FormField
        name="favoriteGenreId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Genre préféré</FormLabel>
            <FormControl>
              <Select
                value={field.value || user.genreId?.toString() || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  setValue("favoriteGenreId", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 justify-center items-center">
        {/* Gestion de l'image */}
        <FormField
          name="newImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo de profil</FormLabel>
              <FormControl>
                <UploadDropzone
                  appearance={{
                    button:
                      "m-5 p-5 ut-ready:bg-primary-light/50 ut-uploading:cursor-not-allowed rounded-lg bg-primary bg-none after:bg-warning/50",
                    container: "p-5",
                    allowedContent:
                      "flex h-8 flex-col items-center justify-center px-2 text-dark",
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const uploadedUrl = res[0]?.url;
                    setValue("newImageUrl", uploadedUrl); // Mettre à jour l'URL de l'image
                    toast.success("Téléchargement réussi");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Erreur lors du téléchargement : " + error);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Image de prévisualisation */}
        <img
          src={newImageUrl || initialImageUrl} // Prioriser l'image téléchargée, sinon l'image initiale
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mx-auto"
        />
      </div>

      {/* Bouton d'envoi */}
      <div className="flex justify-between gap-4">
        <Button variant="secondary" type="submit" className="mt-4">
          Enregistrer
        </Button>
        <Button type="button" onClick={handleDeleteAccount} className="mt-4 bg-red-500">
          Supprimer le compte
        </Button>
      </div>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={confirmDeleteAccount}
      />
    </form>
  );
};
