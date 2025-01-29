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
import { DeleteDropdownItem } from "./_components/deleteDropItem";
import { getAllsoundSystemTypes } from "./_components/actions";
import { SoundSystemTypeForm } from "./_components/soundSystemTypeForm";

export default function EquipementPage() {
  const [soundSystemTypes, setsoundSystemTypes] = useState<
    { id: number; name: string }[]
  >([]);

  const handleDelete = (id: number) => {
    setsoundSystemTypes((prevsoundSystemTypes) =>
      prevsoundSystemTypes.filter(
        (soundSystemType) => soundSystemType.id !== id
      )
    );
  };

  useEffect(() => {
    async function loadsoundSystemTypes() {
      try {
        const soundSystemTypes = await getAllsoundSystemTypes();
        setsoundSystemTypes(soundSystemTypes);
      } catch (error) {
        console.error("Erreur lors du chargement des types de son", error);
      }
    }
    loadsoundSystemTypes();
  }, []);

  return (
    <div className="space-y-16">
      <div>
        <Typo variant="h1">Créer un type de système audio :</Typo>
        <SoundSystemTypeForm />
      </div>
      <div>
        <Typo variant="h1">Liste des types de système audio :</Typo>
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
            {soundSystemTypes.map((soundSystemType) => (
              <TableRow key={soundSystemType.id} className="my-auto">
                <TableCell>{soundSystemType.id}</TableCell>
                <TableCell>{soundSystemType.name} </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DeleteDropdownItem
                        id={soundSystemType.id}
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
