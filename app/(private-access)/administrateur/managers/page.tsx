"use client";

import React, { useEffect, useState } from "react";
import { Typo } from "@/app/_components/_layout/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Genre } from "@prisma/client";
import { DeleteDropdownItem } from "./_components/deleteDropItem";
import { getAllManagers } from "./_components/actions";
import { ManagerForm } from "./_components/ManagerForm";
import { Button } from "@/app/_components/_layout/button";
import { useRouter } from "next/navigation";

type ManagerWithUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    userName: string | null;
    email: string | null;
    image: string | null;
    favoriteGenre: Genre | null;
  };
};

export default function ManagerPage() {
  const [managers, setManagers] = useState<ManagerWithUser[]>([]);

  const handleDelete = (id: string) => {
    setManagers((prevManagers) =>
      prevManagers.filter((manager) => manager.id !== id)
    );
  };

  useEffect(() => {
    async function loadManagers() {
      try {
        const managers = await getAllManagers();
        const transformedManagers = managers.map((manager) => ({
          ...manager,
          createdAt: manager.createdAt.toISOString(),
          updatedAt: manager.updatedAt.toISOString(),
          User: {
            ...manager.User,
            createdAt: manager.User.createdAt.toISOString(),
            updatedAt: manager.User.updatedAt.toISOString(),
          },
        }));
        setManagers(transformedManagers);
      } catch (error) {
        console.error("Erreur lors du chargement des managers :", error);
      }
    }

    loadManagers();
  }, []);

  return (
    <div className="flex flex-col py-10 gap-16">
      <div>
        <Typo variant="h1">Créer un manager</Typo>
        <ManagerForm />
      </div>
      <div>
        <Typo variant="h1">Managers :</Typo>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Id utilisateur</TableHead>
              <TableHead>Prénom</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Pseudo</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id} className="my-auto">
                <TableCell>
                  <Image
                    src={manager.User?.image || "/placeholder-avatar.png"}
                    alt={`Avatar de ${manager.User?.firstName || "inconnu"}`}
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{manager.User.id}</TableCell>
                <TableCell>{manager.User.firstName}</TableCell>
                <TableCell>{manager.User.lastName}</TableCell>
                <TableCell>
                  {manager.User.userName || "Non renseigné"}
                </TableCell>
                <TableCell>
                  {new Date(manager.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">
                        Action pour {manager.User.userName || "cet utilisateur"}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DeleteDropdownItem
                        id={manager.id}
                        onDelete={handleDelete} // Passe la fonction au composant enfant
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
