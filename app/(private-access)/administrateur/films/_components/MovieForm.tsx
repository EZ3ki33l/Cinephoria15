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
import { fetchGenres } from "./actions";

export function MovieForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      genre: [],
      director: "",
      duration: 0,
      releaseDate: "",
      trailer: "",
      summary: "",
    },
  });
  // Charge les données de Prisma
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    async function loadGenres() {
      try {
        const genres = await fetchGenres(); // Appel direct de l'action serveur
        setItems(genres);
      } catch (error) {
        console.error("Erreur lors du chargement des genres :", error);
      }
    }

    loadGenres();
  }, []);
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
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="genre"
                      render={({ field }) => {
                        return (
                          <FormItem key={item.id}>
                            <FormControl>
                              <Checkbox
                                required
                                checked={(field.value as string[])?.includes(
                                  item.id
                                )}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...((field.value as string[]) ?? []),
                                        item.id,
                                      ])
                                    : field.onChange(
                                        (field.value as string[])?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <Typo className="inline-block pl-3">
                              {item.label
                                .replace("_", " ")
                                .toLowerCase()
                                .replace(/^\w/, (c) => c.toUpperCase())}
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
        <div className="flex justify-between pt-10">
          <Button variant="danger" size={"large"} action={() => form.reset()}>
            Effacer
          </Button>
          <Button variant="secondary" size={"large"} type="submit">
            Valider
          </Button>
        </div>
      </div>
    </Form>
  );
}
