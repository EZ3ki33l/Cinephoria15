"use client";

import { Typo } from "@/app/_components/_layout/typography";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/_layout/button";
import { DeleteDropdownItem } from "./_components/deleteDropItems";
import { getAllMovies } from "./_components/actions";
import { ActiveToggleDropdownItem } from "./_components/activeToggleDropdownItem";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        director: string;
        duration: number;
        releaseDate: Date | null;
        summary: string;
        trailer: string;
        images: string[];
        lovedByTeam: boolean | null;
        genres: { name: string }[]; // Ici, genres est un tableau d'objets
      }[]
    | undefined
  >();

  // Fonction de suppression d'un film
  const handleDelete = (id: number) => {
    setMovies((prevMovies) => prevMovies?.filter((movie) => movie.id !== id));
  };

  // Chargement des films
  useEffect(() => {
    async function loadMovies() {
      try {
        const movies = await getAllMovies();
        console.log(movies); // Inspecte la structure de tes films
        setMovies(movies);
      } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
      }
    }
    loadMovies();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <Typo variant="h1">Liste des films :</Typo>
        <Link href={"/administrateur/films/nouveau"}>
          <Button>Créer un film</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Titre</TableHead>
            <TableHead>Réalisateur</TableHead>
            <TableHead>Genres</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies?.map((movie) => (
            <TableRow key={movie.id} className="my-auto">
              <TableCell>{movie.id}</TableCell>
              <TableCell>{movie.title} </TableCell>
              <TableCell>{movie.director}</TableCell>
              <TableCell>
                {movie.genres.map((genre) => genre.name).join(", ")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Action</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ActiveToggleDropdownItem
                      id={movie.id}
                      lovedByTeam={movie.lovedByTeam ?? false}
                    />
                    <DeleteDropdownItem id={movie.id} onDelete={handleDelete} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
