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
import { createprojectionTypes } from "./actions"; // Importez l'action server

export function ProjectionTypeForm() {
  const form = useForm({
    defaultValues: {
      projectionTypes: [{ name: "" }], // Par défaut, un champ pour un équipement
    },
  });

  const onSubmit = async (data: { projectionTypes: { name: string }[] }) => {
    try {
      const response = await createprojectionTypes(data.projectionTypes);
      if (response.success) {
        toast.success("Type(s) de projection créé(s) avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des types de projection.");
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
          {form.watch("projectionTypes").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`projectionTypes.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du type de projection :</FormLabel>
                  <FormControl>
                    <Input required placeholder="IMAX" {...field} />
                  </FormControl>
                  <FormDescription>
                    Renseigner le nom du type de projection
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
            form.setValue("projectionTypes", [
              ...form.getValues("projectionTypes"),
              { name: "" },
            ]);
          }}
        >
          Ajouter un type de projection
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
