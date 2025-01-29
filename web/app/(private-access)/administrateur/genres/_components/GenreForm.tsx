"use client";

import { Button } from "@/app/_components/_layout/button";
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
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner"; // Toast pour les notifications
import { createGenres } from "./actions"; // Importez l'action server

export function GenreForm() {
  const form = useForm({
    defaultValues: {
      genres: [{ name: "" }], // Par défaut, un champ pour un équipement
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "genres",
  });

  const onSubmit = async (data: { genres: { name: string }[] }) => {
    try {
      const response = await createGenres(data.genres);
      if (response.success) {
        toast.success("Genres créés avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des genres.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      toast.error("Une erreur s'est produite.");
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-5 justify-center">
        <div className="grid gap-4">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`genres.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du genre :</FormLabel>
                  <FormControl>
                    <Input required placeholder="Thriller" {...field} />
                  </FormControl>
                  <FormDescription>Renseigner le nom du genre</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={() => append({ name: "" })}
        >
          Ajouter un genre
        </Button>

        <div className="flex justify-between pt-5">
          <Button variant="danger" size="large" action={() => form.reset()}>
            Effacer
          </Button>
          <Button
            variant="secondary"
            size="large"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Valider
          </Button>
        </div>
      </div>
    </Form>
  );
}
