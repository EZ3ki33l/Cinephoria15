"use client";

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
import { Typo } from "@/app/_components/_layout/typography";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllNews } from "./_components/actions";
import { Button } from "@/app/_components/_layout/button";
import { DeleteDropdownItem } from "./_components/deleteDropItems";

export default function NewsPage() {
  const [news, setNews] = useState<
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: { name: string }[];
        shortContent: string;
        content: string;
        images: string[];
      }[]
    | undefined
  >();

  // Fonction de suppression d'un film
  const handleDelete = (id: number) => {
    setNews((prevNews) => prevNews?.filter((news) => news.id !== id));
  };

  // Chargement des films
  useEffect(() => {
    async function loadNews() {
      try {
        const news = await getAllNews();
        console.log(news); // Inspecte la structure de tes films
        const transformedNews = news.map((article) => ({
          ...article,
          category: [{ name: article.categoryId.toString() }],
          content: String(article.content), // Convert content to a string
        }));
        setNews(transformedNews);
      } catch (error) {
        console.error("Erreur lors du chargement des articles :", error);
      }
    }
    loadNews();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <Typo variant="h1">Liste des articles :</Typo>
        <Link href={"/manager/articles/nouveau"}>
          <Button>Créer un article</Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news &&
            news.map((news) => (
              <TableRow key={news.id}>
                <TableCell>{news.title}</TableCell>
                <TableCell>
                  {news.createdAt.getDate()}/{news.createdAt.getMonth()}/
                  {news.createdAt.getFullYear()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Action</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/manager/actualites/${news.id}/edit`}>
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DeleteDropdownItem
                        id={news.id}
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
