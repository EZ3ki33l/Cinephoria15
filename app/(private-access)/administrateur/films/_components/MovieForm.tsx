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
import { createMovieAction, getAllGenres } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieSchema } from "./movieSchema";

export function MovieForm() {
  const form = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      genre: [],
      director: "",
      duration: 0,
      releaseDate: "",
      trailer: "",
      summary: "",
      images: [], // Tableau vide par défaut
    },
  });

  // Charge les données de Prisma
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadGenres() {
      try {
        const genres = await getAllGenres(); // Appel direct de l'action serveur
        setGenres(genres);
      } catch (error) {
        console.error("Erreur lors du chargement des genres :", error);
      }
    }
    loadGenres();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const transformedValues = {
        ...values,
        duration: Number(values.duration), // Convertir duration en nombre
        images: Array.isArray(values.images) ? values.images : [values.images], // Forcer un tableau
      };

      const result = await createMovieAction(transformedValues);
      if (result.success) {
        toast.success("Film créé avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création du film.");
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
            name="genre"
            render={() => (
              <FormItem>
                <FormLabel>Genre :</FormLabel>
                <div className="grid grid-cols-3 gap-3 justify-center items-center">
                  {genres.map((genre) => (
                    <FormField
                      key={genre.id}
                      control={form.control}
                      name="genre"
                      render={({ field }) => {
                        return (
                          <FormItem key={genre.id}>
                            <FormControl>
                              <Checkbox
                                required
                                checked={(field.value as number[])?.includes(
                                  genre.id
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...((field.value as number[]) ?? []),
                                        genre.id,
                                      ])
                                    : field.onChange(
                                        (field.value as number[])?.filter(
                                          (value) => value !== genre.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <Typo className="inline-block pl-3">
                              {genre.name}
                            </Typo>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormDescription>
                  Choisir un ou plusieurs genre(s)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du réalisateur :</FormLabel>
                <FormControl>
                  <Input required placeholder="Tim Burton" {...field} />
                </FormControl>
                <FormDescription>
                  Renseigner le nom du réalisateur
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée :</FormLabel>
                <FormControl>
                  <Input type="number" required placeholder="123" {...field} />
                </FormControl>
                <FormDescription>
                  Renseigner la durée en minutes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de sortie :</FormLabel>
                <FormControl>
                  <Input type="date" required {...field} />
                </FormControl>
                <FormDescription>Renseigner la date de sortie</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trailer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bande annonce :</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="https://www.youtube.com/watch?v=CoZqL9N6Rx4"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Renseigner l'url de la bande annonce
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Résumé :</FormLabel>
              <FormControl>
                <Textarea
                  required
                  className="min-h-[10svh]"
                  placeholder="Après une terrible tragédie, la famille Deetz revient à Winter River. Toujours hantée par le souvenir de Beetlejuice, Lydia voit sa vie bouleversée lorsque sa fille Astrid, adolescente rebelle, ouvre accidentellement un portail vers l’Au-delà. Alors que le chaos plane sur les deux mondes, ce n’est qu’une question de temps avant que quelqu’un ne prononce le nom de Beetlejuice trois fois et que ce démon farceur ne revienne semer la pagaille…"
                  {...field}
                />
              </FormControl>
              <FormDescription>Renseigner un résumé</FormDescription>
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
                endpoint="movieImageUploader"
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
