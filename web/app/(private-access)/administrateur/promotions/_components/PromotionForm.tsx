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
import { toast } from "sonner";
import { createDiscounts } from "./actions";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type PromotionType = "permanent" | "annual" | "ponctual";

interface DiscountFormData {
  discounts: {
    name: string;
    amount: number;
    startDate: string;
    endDate: string;
    isRecurrent: boolean;
    promotionType: PromotionType;
    annualStartDay: string;
    annualEndDay: string;
  }[];
}

export function PromotionForm() {
  const form = useForm<DiscountFormData>({
    defaultValues: {
      discounts: [{
        name: "",
        amount: 0,
        startDate: "",
        endDate: "",
        isRecurrent: false,
        promotionType: "ponctual",
        annualStartDay: "",
        annualEndDay: "",
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "discounts",
  });

  const onSubmit = async (data: { 
    discounts: { 
      name: string;
      amount: number;
      startDate: string;
      endDate: string;
      isRecurrent: boolean;
      promotionType: "permanent" | "annual" | "ponctual";
      annualStartDay: string;
      annualEndDay: string;
    }[] 
  }) => {
    try {
      const formattedDiscounts = data.discounts.map(discount => ({
        ...discount,
        isRecurrent: discount.promotionType !== "ponctual",
        // Pour les promotions annuelles, on utilise l'année en cours pour les dates
        startDate: discount.promotionType === "annual" 
          ? `${new Date().getFullYear()}-${discount.annualStartDay}T00:00` 
          : discount.startDate,
        endDate: discount.promotionType === "annual" 
          ? `${new Date().getFullYear()}-${discount.annualEndDay}T23:59` 
          : discount.endDate,
      }));

      const response = await createDiscounts(formattedDiscounts);
      if (response.success) {
        toast.success("Promotions créées avec succès !");
        form.reset();
      } else {
        toast.error("Erreur lors de la création des promotions.");
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
            <div key={field.id} className="space-y-4 p-4 border rounded-lg">
              <FormField
                control={form.control}
                name={`discounts.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la promotion :</FormLabel>
                    <FormControl>
                      <Input required placeholder="Étudiant" {...field} />
                    </FormControl>
                    <FormDescription>Renseigner le nom de la promotion</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`discounts.${index}.amount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la réduction (€) :</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        required 
                        placeholder="5.00" 
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Montant de la réduction en euros</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`discounts.${index}.promotionType`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type de promotion :</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue="ponctual"
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="permanent" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Promotion permanente (ex: étudiant, senior)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="annual" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Promotion annuelle récurrente (ex: fête du cinéma)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="ponctual" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Promotion ponctuelle
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch(`discounts.${index}.promotionType`) === "annual" && (
                <>
                  <FormField
                    control={form.control}
                    name={`discounts.${index}.annualStartDay`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début :</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={field.value.split('-')[0]}
                              onChange={(e) => {
                                const currentDay = field.value.split('-')[1] || '01';
                                field.onChange(`${e.target.value.padStart(2, '0')}-${currentDay}`);
                              }}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month.toString().padStart(2, '0')}>
                                  {new Date(2000, month - 1, 1).toLocaleString('fr-FR', { month: 'long' })}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={field.value.split('-')[1]}
                              onChange={(e) => {
                                const currentMonth = field.value.split('-')[0] || '01';
                                field.onChange(`${currentMonth}-${e.target.value.padStart(2, '0')}`);
                              }}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day.toString().padStart(2, '0')}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </div>
                        <FormDescription>Cette date sera appliquée chaque année</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`discounts.${index}.annualEndDay`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin :</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={field.value.split('-')[0]}
                              onChange={(e) => {
                                const currentDay = field.value.split('-')[1] || '01';
                                field.onChange(`${e.target.value.padStart(2, '0')}-${currentDay}`);
                              }}
                            >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                <option key={month} value={month.toString().padStart(2, '0')}>
                                  {new Date(2000, month - 1, 1).toLocaleString('fr-FR', { month: 'long' })}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={field.value.split('-')[1]}
                              onChange={(e) => {
                                const currentMonth = field.value.split('-')[0] || '01';
                                field.onChange(`${currentMonth}-${e.target.value.padStart(2, '0')}`);
                              }}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day.toString().padStart(2, '0')}>
                                  {day}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </div>
                        <FormDescription>Cette date sera appliquée chaque année</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {form.watch(`discounts.${index}.promotionType`) === "ponctual" && (
                <>
                  <FormField
                    control={form.control}
                    name={`discounts.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début :</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`discounts.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de fin :</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {index > 0 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => remove(index)}
                >
                  Supprimer cette promotion
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          onClick={() => append({ 
            name: "", 
            amount: 0, 
            startDate: "", 
            endDate: "", 
            isRecurrent: false,
            promotionType: "ponctual",
            annualStartDay: "",
            annualEndDay: "",
          })}
        >
          Ajouter une promotion
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
