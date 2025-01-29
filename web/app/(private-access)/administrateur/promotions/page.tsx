"use client";

import { Typo } from "@/app/_components/_layout/typography";
import React, { useEffect, useState } from "react";
import { PromotionForm } from "./_components/PromotionForm";
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
import { getAllDiscounts } from "./_components/actions";
import { DeleteDropdownItem } from "./_components/deleteDropItem";


export default function PromotionsPage() {
  const [discounts, setDiscounts] = useState<{ id: number; name: string }[]>([]);

  const handleDelete = (id: number) => {
    setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.id !== id));
  };

  useEffect(() => {
    async function loadDiscounts() {
      try {
        const discounts = await getAllDiscounts();
        setDiscounts(discounts);
      } catch (error) {
        console.error("Erreur lors du chargement des promotions :", error);
      }
    }
    loadDiscounts();
  }, []);

  return (
    <div className="space-y-16">
      <div>
        <Typo variant="h1">Créer une promotion :</Typo>
        <PromotionForm />
      </div>
      <div>
        <Typo variant="h1">Liste des promotions :</Typo>
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
            {discounts.map((discount) => (
              <TableRow key={discount.id} className="my-auto">
                <TableCell>{discount.id}</TableCell>
                <TableCell>{discount.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DeleteDropdownItem
                        id={discount.id}
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
