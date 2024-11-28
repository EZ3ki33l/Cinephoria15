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
import { getAllProjectionTypes } from "./_components/actions";
import { ProjectionTypeForm } from "./_components/projectionTypeForm";

export default function EquipementPage() {
  const [projectionTypes, setprojectionTypes] = useState<
    { id: number; name: string }[]
  >([]);

  const handleDelete = (id: number) => {
    setprojectionTypes((prevprojectionTypes) =>
      prevprojectionTypes.filter((projectionType) => projectionType.id !== id)
    );
  };

  useEffect(() => {
    async function loadprojectionTypes() {
      try {
        const projectionTypes = await getAllProjectionTypes();
        setprojectionTypes(projectionTypes);
      } catch (error) {
        console.error("Erreur lors du chargement des projectionTypes :", error);
      }
    }
    loadprojectionTypes();
  }, []);

  return (
    <div className="space-y-16">
      <div>
        <Typo variant="h1">Créer un projectionType :</Typo>
        <ProjectionTypeForm />
      </div>
      <div>
        <Typo variant="h1">Liste des projectionType :</Typo>
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
            {projectionTypes.map((projectionType) => (
              <TableRow key={projectionType.id} className="my-auto">
                <TableCell>{projectionType.id}</TableCell>
                <TableCell>{projectionType.name} </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DeleteDropdownItem
                        id={projectionType.id}
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
