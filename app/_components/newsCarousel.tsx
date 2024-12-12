"use client";

import { Card, Carousel } from "@/components/ui/appleCardCarousel";
import { useEffect, useState } from "react";
import { getAllNews } from "../(private-access)/manager/articles/_components/actions";
import { JSONContent } from "@tiptap/react";
import { Typo } from "./_layout/typography";
import { Spinner } from "./_layout/spinner";

// Définition du type pour les données
type NewsItem = {
  id: number;
  title: string;
  category: string;
  shortContent: string;
  content: JSONContent;
  src: string;
};

export function NewsCarousel() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      const news = await getAllNews();
      const data = news.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category.name,
        shortContent: item.shortContent,
        content: item.content as JSONContent, // Cast the content property to JSONContent
        src: item.images[0] || "https://via.placeholder.com/300", // Image par défaut
      }));

      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news data:", error);
      setError("Une erreur est survenue lors du chargement des actualités.");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const cards = newsData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <div className="w-full h-[full] py-3">
      {error ? (
        <p className="text-red-500">{error}</p> // Affiche le message d'erreur
      ) : newsData.length > 0 ? (
        <Carousel items={cards} />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="my-5">
            <Typo variant="h4" theme="primary" className="">
              Chargement ...
            </Typo>
          </div>
          <div>
            <Spinner className="my-5" />
          </div>
        </div>
      )}
    </div>
  );
}
