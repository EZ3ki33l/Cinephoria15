"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProfileForm } from "./dashboardForm";
import {
  getUserProfile,
  getGenres,
  updateUserProfile,
} from "./actions";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ProfilePageSkeleton } from "@/app/_components/skeletons";

export function ProfileContent() {
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
        console.log("Données utilisateur:", userProfile);
        console.log("Type de createdAt:", typeof userProfile?.createdAt);
        console.log("Valeur de createdAt:", userProfile?.createdAt);
        const genreList = await getGenres();
        setUserData(userProfile);
        setGenres(genreList);
      };
      fetchData();
    }
  }, [isLoaded, isSignedIn, userId]);

  const methods = useForm({
    defaultValues: {
      userName: "",
      firstName: "",
      lastName: "",
      favoriteGenreId: "",
      newImageUrl: "",
    },
  });

  useEffect(() => {
    if (userData && genres.length) {
      methods.reset({
        userName: userData.userName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        favoriteGenreId: userData.genreId?.toString() || "",
        newImageUrl: userData.imageUrl || "",
      });
      setFormInitialized(true);
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
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="flex flex-col">
      {/* Hero avec Aurora */}
      <div className="relative h-[300px] bg-gradient-to-b from-primary-light/20 to-transparent">
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center h-full px-4"
          >
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img 
                src={userData.imageUrl || "/images/default-avatar.png"} 
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xl md:text-3xl font-bold dark:text-white text-center">
              {userData.userName}
            </div>
            <div className="font-extralight text-base md:text-xl dark:text-neutral-200">
              Membre depuis {userData.createdAt ? format(new Date(userData.createdAt), "d MMMM yyyy", { locale: fr }) : ""}
            </div>
          </motion.div>
        </AuroraBackground>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-16">
        <FormProvider {...methods}>
          <ProfileForm
            user={userData}
            genres={genres}
            onSubmit={methods.handleSubmit(handleSubmitForm)}
            userId={userId ?? ""}
          />
        </FormProvider>
      </div>
    </div>
  );
} 