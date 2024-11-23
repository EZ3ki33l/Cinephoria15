import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";

export default function checkboxGenre() {
  const form = useForm();

  return (
    <FormField
      control={form.control}
      name="items"
      render={() => (
        <FormItem>
          <FormLabel>Genre :</FormLabel>
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
                        checked={field.value?.includes(item.id)}
                        required
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== item.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Sélectionner un ou plusieurs genres
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
