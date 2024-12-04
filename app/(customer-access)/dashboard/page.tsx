// page.tsx
"use client"; // Indique que cette page est rendue côté client

import { useAuth } from "@clerk/nextjs"; // Importer le hook useAuth
import { useEffect, useState } from "react"; // Pour gérer l'état et l'effet
import { getUserProfile, getGenres } from "./_components/actions"; // Vos actions
import { ProfileForm } from "./_components/dashboardForm"; // Votre formulaire de profil
import { redirect } from "next/navigation"; // Pour rediriger si nécessaire

export default function ProfilePage() {
  const { isLoaded, isSignedIn, userId } = useAuth(); // Utilisation des propriétés isLoaded, isSignedIn et userId
  const [userData, setUserData] = useState<any>(null);
  const [genres, setGenres] = useState<any[]>([]);

  // Si l'utilisateur n'est pas encore chargé ou non authentifié, on attend
  useEffect(() => {
    if (!isLoaded) return; // Attendez que Clerk charge les données de l'utilisateur

    if (!isSignedIn || !userId) {
      redirect("/"); // Redirige si l'utilisateur n'est pas connecté
    } else {
      // Récupérer les données de l'utilisateur et les genres si connecté
      const fetchData = async () => {
        const userProfile = await getUserProfile(userId);
        const genreList = await getGenres();
        setUserData(userProfile);
        setGenres(genreList);
      };
      fetchData();
    }
  }, [isLoaded, isSignedIn, userId]);

  // Si les données sont encore en cours de chargement, afficher un message de chargement
  if (!userData || !genres.length) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      <ProfileForm user={userData} genres={genres} />
    </div>
  );
}
