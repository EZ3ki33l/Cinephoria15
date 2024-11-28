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
import { createsoundSystemTypes } from "./actions"; // Importez l'action server

export function SoundSystemTypeForm() {
  const form = useForm({
    defaultValues: {
      soundSystemTypes: [{ name: "" }], // Par défaut, un champ pour un équipement
    },
  });

  const onSubmit = async (data: { soundSystemTypes: { name: string }[] }) => {
    try {
      const response = await createsoundSystemTypes(data.soundSystemTypes);
      if (response.success) {
        toast.success("Type(s) de système audio créé(s) avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des types de système audio.");
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
          {form.watch("soundSystemTypes").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`soundSystemTypes.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du type de système audio :</FormLabel>
                  <FormControl>
                    <Input required placeholder="Dolby Digital" {...field} />
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
            form.setValue("soundSystemTypes", [
              ...form.getValues("soundSystemTypes"),
              { name: "" },
            ]);
          }}
        >
          Ajouter un type de système audio
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
