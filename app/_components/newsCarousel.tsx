"use client";

import { Card, Carousel } from "@/components/ui/appleCardCarousel";
import { useEffect, useState } from "react";

// Définition du type pour les données
type NewsItem = {
  id: number; // Add this line
  category: string;
  title: string;
  content: string;
  src: string;
};
export function NewsCarousel() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news"); // Route API pour récupérer les données
        const data: NewsItem[] = await response.json();

        // Transforme les données pour s'assurer qu'elles respectent les champs nécessaires
        const transformedData = data.map((item) => ({
          ...item,
          category: item.category || "Uncategorized",
          title: item.title || "Untitled",
          content: item.content || "",
          src: item.src || "https://via.placeholder.com/300", // Image par défaut
        }));

        setNewsData(transformedData);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    }
    fetchNews();
  }, []);

  const cards = newsData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <div className="w-full h-[full] py-3">
      {newsData.length > 0 ? <Carousel items={cards} /> : <p>Loading...</p>}
    </div>
  );
}
