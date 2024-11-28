"use client";

import { Button } from "@/app/_components/_layout/button";
import { Typo } from "@/app/_components/_layout/typography";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllcategories } from "../../categories/_components/actions";
import { NewsSchema } from "./newsSchema";
import { CreateNews } from "./actions";

export function NewsForm() {
  const form = useForm({
    resolver: zodResolver(NewsSchema),
    defaultValues: {
      title: "",
      categories: [],
      shortContent: "",
      content: "",
      images: [], // Tableau vide par défaut
    },
  });

  // Charge les données de Prisma
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const categories = await getAllcategories(); // Appel direct de l'action serveur
        setCategories(categories);
      } catch (error) {
        console.error("Erreur lors du chargement des genres :", error);
      }
    }
    loadCategories();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const transformedValues = {
        ...values,
        duration: Number(values.duration), // Convertir duration en nombre
        images: Array.isArray(values.images) ? values.images : [values.images], // Forcer un tableau
      };

      const result = await CreateNews(transformedValues);
      if (result.success) {
        toast.success("Article créé avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création de l'article.");
        console.error(result.errors || result.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la soumission.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-5 justify-center">
        <div className="grid grid-cols-2 gap-12">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre du film :</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="BeetleJuice BeetleJuice"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Renseigner le titre du film</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel>Genre :</FormLabel>
                <div className="grid grid-cols-3 gap-3 justify-center items-center">
                  {categories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="categories"
                      render={({ field }) => {
                        return (
                          <FormItem key={category.id}>
                            <FormControl>
                              <Checkbox
                                required
                                checked={(field.value as number[])?.includes(
                                  category.id
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...((field.value as number[]) ?? []),
                                        category.id,
                                      ])
                                    : field.onChange(
                                        (field.value as number[])?.filter(
                                          (value) => value !== category.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <Typo className="inline-block pl-3">
                              {category.name}
                            </Typo>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormDescription>Choisir une catégorie</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courte description :</FormLabel>
                <FormControl>
                  <Input required placeholder="Tim Burton" {...field} />
                </FormControl>
                <FormDescription>
                  Renseigner une description courte
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description :</FormLabel>
                <FormControl>
                  <Input required placeholder="Tim Burton" {...field} />
                </FormControl>
                <FormDescription>Renseigner une description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image(s) du film :</FormLabel>
                <UploadDropzone
                  appearance={{
                    button:
                      "m-5 p-5 ut-ready:bg-primary-light/50 ut-uploading:cursor-not-allowed rounded-lg bg-primary bg-none after:bg-warning/50",
                    container: "p-5",
                    allowedContent:
                      "flex h-8 flex-col items-center justify-center px-2 text-dark",
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const uploadedUrls = res.map((file) => file.url); // Collecter les URLs des images
                    field.onChange([
                      ...(field.value as string[]),
                      ...uploadedUrls,
                    ]); // Ajouter les nouvelles images au tableau existant
                    toast.success("Téléchargement réussi");
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Erreur lors du téléchargement");
                  }}
                />
                <FormDescription>
                  Uploader une ou plusieurs images pour le film.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between pt-10">
          <Button variant="danger" size={"large"} action={() => form.reset()}>
            Effacer
          </Button>
          <Button
            variant="secondary"
            size={"large"}
            type="submit"
            isLoading={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            Valider
          </Button>
        </div>
      </div>
    </Form>
  );
}
