"use client";

import { Typo } from "@/app/_components/_layout/typography";
import React, { useEffect, useState } from "react";
import { GenreForm } from "./_components/GenreForm";
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
import { DeleteDropdownItem } from "./_components/deleteDropItem";
import { getAllGenres } from "./_components/actions";

export default function EquipementPage() {
  const [genres, setgenres] = useState<{ id: number; name: string }[]>([]);

  const handleDelete = (id: number) => {
    setgenres((prevgenres) => prevgenres.filter((genre) => genre.id !== id));
  };

  useEffect(() => {
    async function loadGenres() {
      try {
        const genres = await getAllGenres();
        setgenres(genres);
      } catch (error) {
        console.error("Erreur lors du chargement des genres :", error);
      }
    }
    loadGenres();
  }, []);

  return (
    <div className="space-y-16">
      <div>
        <Typo variant="h1">Créer un genre :</Typo>
        <GenreForm />
      </div>
      <div>
        <Typo variant="h1">Liste des genre :</Typo>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id} className="my-auto">
                <TableCell>{genre.id}</TableCell>
                <TableCell>{genre.name} </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DeleteDropdownItem
                        id={genre.id}
                        onDelete={handleDelete}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
