"use client";

import { Typo } from "@/app/_components/_layout/typography";
import React, { useEffect, useState } from "react";
import { EquipementForm } from "./_components/equipmentForm";
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
import { getAllEquipments } from "./_components/actions";

export default function EquipementPage() {
  const [equipments, setEquipments] = useState<
    { id: number; name: string; cinemaId: number | null }[]
  >([]);

  const handleDelete = (id: number) => {
    setEquipments((prevEquipments) =>
      prevEquipments.filter((equipment) => equipment.id !== id)
    );
  };

  useEffect(() => {
    async function loadEquipments() {
      try {
        const equipments = await getAllEquipments();
        setEquipments(equipments);
      } catch (error) {
        console.error("Erreur lors du chargement des equipements :", error);
      }
    }
    loadEquipments();
  }, []);

  return (
    <div className="space-y-16">
      <div>
        <Typo variant="h1">Créer un équipement :</Typo>
        <EquipementForm />
      </div>
      <div>
        <Typo variant="h1">Liste des équipements :</Typo>
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
            {equipments.map((equipment) => (
              <TableRow key={equipment.id} className="my-auto">
                <TableCell>{equipment.id}</TableCell>
                <TableCell>{equipment.name} </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DeleteDropdownItem
                        id={equipment.id}
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
