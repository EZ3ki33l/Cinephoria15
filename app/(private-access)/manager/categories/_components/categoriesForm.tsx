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
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Toast pour les notifications
import { createcategories } from "./actions"; // Importez l'action server

export function EquipementForm() {
  const form = useForm({
    defaultValues: {
      categories: [{ name: "" }], // Par défaut, un champ pour un équipement
    },
  });

  const onSubmit = async (data: { categories: { name: string }[] }) => {
    try {
      const response = await createcategories(data.categories);
      if (response.success) {
        toast.success("Catégories créées avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des catégories.");
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
          {form.watch("categories").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`categories.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la catégorie :</FormLabel>
                  <FormControl>
                    <Input required placeholder="Recrutement" {...field} />
                  </FormControl>
                  <FormDescription>
                    Renseigner le nom de la catégorie
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={() => {
            form.setValue("categories", [
              ...form.getValues("categories"),
              { name: "" },
            ]);
          }}
        >
          Ajouter une catégorie
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
