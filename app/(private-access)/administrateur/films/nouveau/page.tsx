import React from "react";
import { MovieForm } from "../_components/MovieForm";
import { Typo } from "@/app/_components/_layout/typography";

export default function CreateMoviePage() {
  return (
    <div>
      <Typo variant="h1">Créer un film</Typo>
      <MovieForm />
    </div>
  );
}
