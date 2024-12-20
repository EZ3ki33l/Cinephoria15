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
import { format, addMinutes, isBefore, isAfter, startOfToday } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from "@/hooks/revalidePath";

export function ShowtimeForm() {
  const [screens, setScreens] = useState<
    { id: number; number: number; cinemaName: string }[]
  >([]);
  const [movies, setMovies] = useState<{ id: number; title: string; duration: number }[]>([]);
  const userId = useUser().user?.id;
  const [selectedMovie, setSelectedMovie] = useState<{
    id: number;
    title: string;
    duration: number;
  } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      screen: "",
      movie: "",
      startDate: { 
        from: new Date(), 
        to: new Date(new Date().setHours(23, 59, 59, 999)) 
      },
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
    setMovies(
      movieList.map((movie) => ({
        id: movie.id,
        title: movie.title,
        duration: movie.duration,
      }))
    );
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

  const validateTimeSlot = (newTime: string, index: number) => {
    if (!selectedMovie) return true;

    const [hours, minutes] = newTime.split(':').map(Number);
    
    // Créer la date de la séance en utilisant la date sélectionnée
    const selectedDate = form.getValues("startDate").from;
    const startTimeDate = new Date(selectedDate);
    startTimeDate.setHours(hours, minutes, 0, 0);

    // Vérifier si la séance est dans le passé en comparant avec la date actuelle
    const now = new Date();
    if (isBefore(startTimeDate, now)) {
      setAlertMessage("Impossible de créer une séance dans le passé");
      return false;
    }

    const endTimeDate = addMinutes(startTimeDate, selectedMovie.duration);
    const times = form.getValues("times");

    // Vérifier le chevauchement avec d'autres séances
    for (let i = 0; i < times.length; i++) {
      if (i !== index && times[i]) {
        const [otherHours, otherMinutes] = times[i].split(':').map(Number);
        
        // Convertir les heures en minutes pour une comparaison plus simple
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + selectedMovie.duration;
        const otherStartMinutes = otherHours * 60 + otherMinutes;
        const otherEndMinutes = otherStartMinutes + selectedMovie.duration;

        // Logique de chevauchement basée sur les minutes
        const hasOverlap = (
          (startMinutes >= otherStartMinutes && startMinutes < otherEndMinutes) ||
          (endMinutes > otherStartMinutes && endMinutes <= otherEndMinutes) ||
          (startMinutes <= otherStartMinutes && endMinutes >= otherEndMinutes)
        );

        if (hasOverlap) {
          const formatTime = (mins: number) => 
            `${Math.floor(mins/60).toString().padStart(2, '0')}:${(mins%60).toString().padStart(2, '0')}`;

          setAlertMessage(
            `Les séances se chevauchent : ${formatTime(startMinutes)} - ${formatTime(endMinutes)} ` +
            `chevauche ${formatTime(otherStartMinutes)} - ${formatTime(otherEndMinutes)}`
          );
          return false;
        }
      }
    }

    return true;
  };

  const updateTime = (index: number, time: string) => {
    if (validateTimeSlot(time, index)) {
      const newTimes = [...form.getValues("times")];
      newTimes[index] = time;
      form.setValue("times", newTimes, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
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
      // Vérifier que les dates sont valides
      if (!data.startDate?.from || !data.startDate?.to) {
        setAlertMessage("Veuillez sélectionner une plage de dates valide");
        return;
      }

      // Vérifier qu'au moins un créneau horaire est défini
      if (data.times.length === 0) {
        setAlertMessage("Veuillez ajouter au moins un créneau horaire");
        return;
      }

      // Vérifier qu'un film et une salle sont sélectionnés
      if (!data.movie || !data.screen) {
        setAlertMessage("Veuillez sélectionner un film et une salle");
        return;
      }

      // Normaliser les dates pour éviter les problèmes de timezone
      const formattedData = {
        ...data,
        startDate: {
          from: new Date(data.startDate.from.setHours(0, 0, 0, 0)),
          to: new Date(data.startDate.to.setHours(23, 59, 59, 999))
        }
      };

      // Appeler l'action server pour créer les showtimes
      await createShowtimes(userId as string, formattedData);
      setSuccessMessage("Les séances ont été créées avec succès !");
      
      //revalidater la page
      revalidatePath("/manager/seances");
      
      // Réinitialiser le formulaire
      form.reset({
        screen: "",
        movie: "",
        startDate: { 
          from: new Date(), 
          to: new Date(new Date().setHours(23, 59, 59, 999)) 
        },
        times: []
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la création des showtimes : ", error);
      setAlertMessage(error.message || "Une erreur est survenue lors de la création des séances.");
    }
  };

  return (
    <>
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        const movie = movies.find(m => m.id.toString() === value);
                        setSelectedMovie(movie || null);
                      }}
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
                  <FormDescription>
                    {selectedMovie && `Durée du film : ${selectedMovie.duration} minutes`}
                  </FormDescription>
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
                        disabled={(date) => isBefore(date, startOfToday())}
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

      <AlertDialog open={!!alertMessage} onOpenChange={() => setAlertMessage(null)}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-sm border border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 text-xl">
              Attention
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-base">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setAlertMessage(null)}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!successMessage} onOpenChange={() => setSuccessMessage(null)}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-sm border border-green-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600 text-xl">
              Succès
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-base">
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setSuccessMessage(null)}
              className="bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
