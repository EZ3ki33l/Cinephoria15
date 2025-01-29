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
import { useForm } from "react-hook-form";

export function AdminForm() {
  const form = useForm({
    defaultValues: {
      userId: "",
    },
  });

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-5 justify-center">
        <div className="grid grid-cols-2 gap-12">
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de l'utilisateur :</FormLabel>
                <FormControl>
                  <Input required placeholder="User_XxXXXxxxx" {...field} />
                </FormControl>
                <FormDescription>
                  Renseigner l'identifiant de l'utilisateur'
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between pt-5">
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
