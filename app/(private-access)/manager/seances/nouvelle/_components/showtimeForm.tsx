"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createShowtimes, GetMyCinemas } from "./actions"; // Importer la fonction server
import { getAllMovies } from "@/app/(private-access)/administrateur/films/_components/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";

export function ShowtimeForm() {
  const [screens, setScreens] = useState<
    { id: number; number: number; cinemaName: string }[]
  >([]);
  const [movies, setMovies] = useState<{ id: number; title: string }[]>([]);
  const userId = useUser().user?.id;

  const form = useForm({
    defaultValues: {
      screen: "",
      movie: "",
      startDate: { from: new Date(), to: new Date() },
      times: [] as string[],
    },
  });

  // Charger les cinémas et films (géré côté serveur avec une action server)
  const loadCinemaAndMovies = async () => {
    const cinemas = await GetMyCinemas(userId as string);
    const movieList = await getAllMovies();
    setScreens(
      cinemas.flatMap((cinema) =>
        cinema.Screens.map((screen) => ({
          id: screen.id,
          number: screen.number,
          cinemaName: cinema.name,
        }))
      )
    );
    setMovies(movieList.map((movie) => ({ id: movie.id, title: movie.title })));
  };

  // Effectuer l'appel de récupération des cinémas et films (exécution côté serveur)
  useEffect(() => {
    loadCinemaAndMovies();
  }, [userId]);

  const addTimeSlot = () => {
    const newTimes = [...form.getValues("times"), ""];
    form.setValue("times", newTimes, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const updateTime = (index: number, time: string) => {
    const newTimes = [...form.getValues("times")];
    newTimes[index] = time;
    form.setValue("times", newTimes, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeTime = (index: number) => {
    const newTimes = form.getValues("times").filter((_, i) => i !== index);
    form.setValue("times", newTimes, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: any) => {
    try {
      // Appeler l'action server pour créer les showtimes
      await createShowtimes(userId as string, data);
      alert("Les séances ont été créées avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création des showtimes : ", error);
      alert("Une erreur est survenue lors de la création des séances.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-5 justify-center">
          <FormField
            control={form.control}
            name="screen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salle :</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {screens.map((screen) => (
                        <SelectItem
                          key={screen.id}
                          value={screen.id.toString()}
                        >
                          {screen.number} - {screen.cinemaName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Choisissez une salle</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="movie"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film :</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un film" />
                    </SelectTrigger>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id.toString()}>
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Choisissez un film</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Plage de dates :</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left"
                    >
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            Du {format(field.value.from, "PPP")} au{" "}
                            {format(field.value.to, "PPP")}
                          </>
                        ) : (
                          format(field.value.from, "PPP")
                        )
                      ) : (
                        <span>Choisissez une plage</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Sélectionnez la plage de dates pour les séances.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="times"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Créneaux horaires :</FormLabel>
                {field.value.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTime(index, e.target.value)}
                      className="w-24"
                    />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => removeTime(index)}
                      className="w-20"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  type="button"
                  onClick={addTimeSlot}
                  className="mt-3"
                >
                  Ajouter une heure
                </Button>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Enregistrer la séance
          </Button>
        </div>
      </form>
    </Form>
  );
}
