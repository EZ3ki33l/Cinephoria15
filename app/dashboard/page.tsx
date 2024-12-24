"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/dashboardForm";
import {
  getUserProfile,
  getGenres,
  updateUserProfile,
  deleteUserAccount,
} from "./_components/actions";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !userId) {
      redirect("/sign-in");
    } else {
      const fetchData = async () => {
        const userProfile = await getUserProfile(userId);
        const genreList = await getGenres();
        setUserData(userProfile);
        setGenres(genreList);
      };
      fetchData();
    }
  }, [isLoaded, isSignedIn, userId]);

  // Initialisation du formulaire après la récupération des données
  const methods = useForm({
    defaultValues: {
      userName: "",
      firstName: "",
      lastName: "",
      favoriteGenreId: "",
      newImageUrl: "", // Nous initialiserons cette valeur après le chargement des données
    },
  });

  useEffect(() => {
    if (userData && genres.length) {
      methods.reset({
        userName: userData.userName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        favoriteGenreId: userData.genreId?.toString() || "",
        newImageUrl: userData.imageUrl || "", // Initialiser ici l'image
      });
      setFormInitialized(true); // Indiquer que le formulaire peut être rendu
    }
  }, [userData, genres, methods]);

  const handleSubmitForm = async (data: {
    userName: string;
    firstName: string;
    lastName: string;
    favoriteGenreId: string;
    newImageUrl?: string | null;
  }) => {
    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserProfile({
        userId: userId ?? "",
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        genreId: parseInt(data.favoriteGenreId, 10),
        newImageUrl: data.newImageUrl,
      });

      setUserData(updatedUser);
      toast.success("Profil mis à jour");
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!formInitialized) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>

      <div className="mb-4">
        <FormProvider {...methods}>
          <ProfileForm
            user={userData}
            genres={genres}
            onSubmit={methods.handleSubmit(handleSubmitForm)} // Passer la fonction handleSubmit ici
            userId={userId ?? ""} // Fournir une chaîne vide par défaut
          />
        </FormProvider>
      </div>

      <div>

      </div>
    </div>
  );
}
