"use client";

import { Button } from "@/app/_components/_layout/button";
import { Typo } from "@/app/_components/_layout/typography";
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
import React, { useEffect, useState } from "react";
import { FieldValues, useFieldArray, useForm } from "react-hook-form";
import {
  createCinemaAction,
  fetchManagers,
  getAllEquipments,
  getAllProjectionType,
  getAllSoundSystemType,
} from "./actions";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminScreenVisualizer } from "@/app/_components/AdminSeatVisualizer";
import { toast } from "sonner";
import { revalidatePath } from "@/hooks/revalidePath";
import { useRouter } from "next/navigation";

interface Manager {
  id: string;
  name: string;
}

export function CinemaForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      street: "",
      postalCode: "",
      city: "",
      lat: 0,
      lng: 0,
      manager: "",
      equipments: [],
      screens: [],
    } as {
      [key: string]: any;
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "screens",
  });

  // Chargement des données depuis Prisma
  const [projectionTypes, setProjectionTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [soundSystemTypes, setSoundSystemTypes] = useState<
    { id: number; name: string }[]
  >([]);
  const [equipments, setEquipments] = useState<{ id: number; name: string }[]>(
    []
  );
  const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setProjectionTypes(await getAllProjectionType());
        setSoundSystemTypes(await getAllSoundSystemType());
        setEquipments(await getAllEquipments());
        setManagers(await fetchManagers());
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        toast.error("Impossible de charger les données.");
      }
    }
    loadData();
  }, []);

  // Ajout d'une salle
  const addScreen = () => {
    append({
      number: fields.length + 1,
      rows: 10,
      columns: 15,
      projectionType: "",
      soundSystemType: "",
      price: 19,
    });
  };

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Convertir les champs imbriqués en JSON
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "screens" || key === "equipments") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      });

      await createCinemaAction(formData); // Envoyer les données en action server
      toast.success("Cinéma ajouté avec succès!");
      revalidatePath("/");
      revalidatePath("/administrateur/cinemas");
      router.push("/administrateur/cinemas");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du cinéma.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-5 justify-center">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du cinéma :</FormLabel>
              <FormControl>
                <Input
                  required
                  placeholder="Cinéphoria - Toulouse"
                  {...field}
                />
              </FormControl>
              <FormDescription>Renseigner le nom du cinéma</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Manager */}
        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager :</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Renseigner le manager</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro et nom de la rue :</FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="1 place du Capitole"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Renseigner le numéro et le nom de la rue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal :</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    required
                    placeholder="31000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Renseigner le code postal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville :</FormLabel>
                <FormControl>
                  <Input required placeholder="Toulouse" {...field} />
                </FormControl>
                <FormDescription>Renseigner la ville</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude :</FormLabel>
                <FormControl>
                  <Input type="number" required placeholder="14.5" {...field} />
                </FormControl>
                <FormDescription>Renseigner la latitude</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude :</FormLabel>
                <FormControl>
                  <Input type="number" required placeholder="4.5" {...field} />
                </FormControl>
                <FormDescription>Renseigner la longitude</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="equipments"
          render={() => (
            <FormItem>
              <FormLabel>Equipements :</FormLabel>
              <div className="grid grid-cols-3 gap-3 justify-center items-center">
                {equipments.map((equipment) => (
                  <FormField
                    key={equipment.id}
                    control={form.control}
                    name="equipments"
                    render={({ field }) => {
                      const currentValue = field.value as {
                        id: number;
                        name: string;
                      }[];
                      const isChecked = currentValue?.some(
                        (e) => e.id === equipment.id
                      );

                      return (
                        <FormItem key={equipment.id}>
                          <FormControl>
                            <Checkbox
                              required
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const updatedEquipments = currentValue
                                  ? [...currentValue]
                                  : [];

                                if (checked) {
                                  // Ajoute l'équipement complet dans la valeur du champ
                                  updatedEquipments.push(equipment);
                                } else {
                                  // Retire l'équipement correspondant de la valeur du champ
                                  const filteredEquipments =
                                    updatedEquipments.filter(
                                      (e) => e.id !== equipment.id
                                    );
                                  // Met à jour le champ avec la nouvelle liste
                                  field.onChange(filteredEquipments);
                                  return;
                                }
                                // Met à jour le champ avec la liste modifiée
                                field.onChange(updatedEquipments);
                              }}
                            />
                          </FormControl>
                          <Typo className="inline-block pl-3">
                            {equipment.name}
                          </Typo>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormDescription>
                Choisir un ou plusieurs équipement(s)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description :</FormLabel>
              <FormControl>
                <Textarea
                  required
                  className="min-h-[10svh]"
                  placeholder="Pour une sortie cinéma des plus agréables, Cinéphoria Toulouse met à votre disposition un parking gratuit, le wifi gratuit et un accès PMR. Et pour prolonger le plaisir, découvrez notre espace arcade et notre offre de snacks variés."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Renseigner la description du cinéma
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <h1 className="text-lg font-semibold">Ajouter des salles</h1>

        {fields.map((field: FieldValues, index: any) => (
          <div key={field.id} className="border p-4 rounded space-y-4">
            <h2>Salle {index + 1}</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`screens.${index}.number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de la salle</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screens.${index}.rows`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rangées</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screens.${index}.columns`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colonnes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screens.${index}.projectionType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de projection</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de projection" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectionTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screens.${index}.soundSystemType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de son</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de son" />
                        </SelectTrigger>
                        <SelectContent>
                          {soundSystemTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`screens.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AdminScreenVisualizer
              rows={form.watch(`screens.${index}.rows`)}
              columns={form.watch(`screens.${index}.columns`)}
            />

            <Button variant="danger" onClick={() => remove(index)}>
              Supprimer cette salle
            </Button>
          </div>
        ))}

        <Button type="button" onClick={addScreen}>
          Ajouter une salle
        </Button>

        <div className="flex justify-between pt-10">
          <Button variant="danger" size={"large"} action={() => form.reset()}>
            Effacer
          </Button>
          <Button
            variant="secondary"
            size={"large"}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={loading}
          >
            Valider
          </Button>
        </div>
      </div>
    </Form>
  );
}
