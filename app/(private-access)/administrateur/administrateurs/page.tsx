"use client";

import React, { useEffect, useState } from "react";
import { Typo } from "@/app/_components/_layout/typography";
import { AdminForm } from "./_components/AdminForm";
import { getAllAdmins } from "./_components/actions";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Genre } from "@prisma/client";
import { DeleteDropdownItem } from "./_components/deleteDropItem";

type Admin = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  User: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    firstName: string;
    lastName: string;
    userName: string | null;
    email: string | null;
    image: string | null;
    favoriteCinemaId: number | null;
    genreId: number | null;
    Genre?: {
      name: string;
    } | null;
  };
};

type AdminWithUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string | null;
    email: string | null;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    favoriteGenre: string | null;
  };
};

export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminWithUser[]>([]);

  const handleDelete = (id: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.filter((admin) => admin.id !== id)
    );
  };

  useEffect(() => {
    async function loadAdmins() {
      try {
        const admins = (await getAllAdmins()) as Admin[];
        const transformedAdmins = admins.map((admin) => ({
          id: admin.id,
          createdAt: admin.createdAt.toISOString(),
          updatedAt: admin.updatedAt.toISOString(),
          User: {
            id: admin.User.id,
            firstName: admin.User.firstName,
            lastName: admin.User.lastName,
            userName: admin.User.userName,
            email: admin.User.email,
            image: admin.User.image,
            createdAt: admin.User.createdAt.toISOString(),
            updatedAt: admin.User.updatedAt.toISOString(),
            favoriteGenre: admin.User.Genre?.name ?? null,
          },
        }));
        setAdmins(transformedAdmins);
      } catch (error) {
        console.error("Erreur lors du chargement des administrateurs :", error);
      }
    }

    loadAdmins();
  }, []);

  return (
    <div className="flex flex-col py-10 gap-16">
      <div>
        <Typo variant="h1">Créer un administrateur</Typo>
        <AdminForm />
      </div>
      <div>
        <Typo variant="h1">Administrateurs :</Typo>

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
            {admins.map((admin) => (
              <TableRow key={admin.id} className="my-auto">
                <TableCell>
                  <Image
                    src={admin.User?.image || "/placeholder-avatar.png"}
                    alt={`Avatar de ${admin.User?.firstName || "inconnu"}`}
                    width={35}
                    height={35}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{admin.User.id}</TableCell>
                <TableCell>{admin.User.firstName}</TableCell>
                <TableCell>{admin.User.lastName}</TableCell>
                <TableCell>{admin.User.userName || "Non renseigné"}</TableCell>
                <TableCell>
                  {new Date(admin.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">
                        Action pour {admin.User.userName || "cet utilisateur"}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DeleteDropdownItem
                        id={admin.id}
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
