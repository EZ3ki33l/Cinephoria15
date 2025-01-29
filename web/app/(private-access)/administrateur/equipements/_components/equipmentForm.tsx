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
import { createEquipments } from "./actions"; // Importez l'action server

export function EquipementForm() {
  const form = useForm({
    defaultValues: {
      equipments: [{ name: "" }], // Par défaut, un champ pour un équipement
    },
  });

  const onSubmit = async (data: { equipments: { name: string }[] }) => {
    try {
      const response = await createEquipments(data.equipments);
      if (response.success) {
        toast.success("Équipements créés avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des équipements.");
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
          {form.watch("equipments").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`equipments.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'équipement :</FormLabel>
                  <FormControl>
                    <Input required placeholder="Wifi gratuit" {...field} />
                  </FormControl>
                  <FormDescription>
                    Renseigner le nom de l'équipement
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
            form.setValue("equipments", [
              ...form.getValues("equipments"),
              { name: "" },
            ]);
          }}
        >
          Ajouter un équipement
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
