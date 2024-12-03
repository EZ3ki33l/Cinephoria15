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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/_components/_layout/button";
import { getAllCinemas } from "./_components/actions";
import { DeleteDropdownItem } from "./_components/deleteDropItem";
import { ActiveToggleDropdownItem } from "./_components/activeToggleDropdownItem";

export default function AdminCinemaPage() {
  const [cinemas, setCinemas] = useState<
    {
      id: number;
      name: string;
      address: string;
      manager: string;
      isOpen: boolean;
    }[]
  >();

  // Fonction de suppression d'un film
  const handleDelete = (id: number) => {
    setCinemas((prevCinemas) =>
      prevCinemas?.filter((cinema) => cinema.id !== id)
    );
  };

  // Chargement des films
  useEffect(() => {
    async function loadCinemas() {
      try {
        const cinemas = await getAllCinemas();
        const transformedCinemas = cinemas.map((cinema) => ({
          id: cinema.id,
          name: cinema.name,
          address: `${cinema.Address?.street} ${cinema.Address?.postalCode} ${cinema.Address?.city}`,
          manager:
            cinema.Manager?.User?.firstName +
            " " +
            cinema.Manager?.User?.lastName,
          isOpen: cinema.isOpen ?? false,
        }));
        setCinemas(transformedCinemas);
      } catch (error) {
        console.error("Erreur lors du chargement des cinémas :", error);
      }
    }
    loadCinemas();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <Typo variant="h1">Liste des cinémas :</Typo>
        <Link href={"/administrateur/cinemas/nouveau"}>
          <Button>Créer un cinéma</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cinemas?.map((cinema) => (
            <TableRow key={cinema.id} className="my-auto">
              <TableCell>{cinema.name}</TableCell>
              <TableCell>{cinema.address} </TableCell>
              <TableCell>{cinema.manager}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical />
                    <span className="sr-only">Action</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <ActiveToggleDropdownItem
                      id={cinema.id}
                      isOpen={cinema.isOpen}
                    />
                    <DeleteDropdownItem
                      id={cinema.id}
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
  );
}
