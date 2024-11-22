// app/cinemas/[id]/_components/MapComponent.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RoundedLogo } from "../../_layout/logo";
import { getAllCinemas } from "./marker";

interface MarkerData {
  id: number;
  street: string;
  city: string;
  postalCode: number;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
}
const containerStyle = {
  width: "100%",
  height: "50svh",
};

const options = {
  mapId: "c70c452525173ab5",
  position: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export function MapComponent() {
  // You can also fetch data as a prop
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState<boolean[]>([]);
  const [cinemas, setCinemas] = useState<MarkerData[]>([]);

  useEffect(() => {
    const fetchCinemasData = async () => {
      const fetchedCinemas = await getAllCinemas();
      if (fetchedCinemas) {
        const transformedCinemas: MarkerData[] = fetchedCinemas.map(
          (cinema) => ({
            id: cinema.id,
            name: cinema.name,
            street: cinema.Address?.street || "",
            city: cinema.Address?.city || "",
            postalCode: cinema.Address?.postalCode || 0,
            position: {
              lat: cinema.Address?.lat || 0,
              lng: cinema.Address?.lng || 0,
            },
            screens: cinema.screens.map((screen) => ({
              id: screen.id,
              number: screen.number,
              projectionType: screen.projectionType,
              soundSystemType: screen.soundSystemType,
              seats: screen.seats,
            })),
          })
        );
        setCinemas(transformedCinemas);
        setIsInfoWindowOpen(Array(transformedCinemas.length).fill(false));
      } else {
        setCinemas([]);
      }
    };
    fetchCinemasData();
  }, []);

  const handleMarkerClick = (index: number) => {
    setIsInfoWindowOpen((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={options}
      center={
        { lat: 46.232, lng: 2.209 } // Default center if no cinemas
      }
      zoom={5}
    >
      {cinemas.map((cinema, index) => (
        <Marker
          key={cinema.id}
          position={cinema.position}
          onClick={() => handleMarkerClick(index)} // Pass the index
        >
          {isInfoWindowOpen[index] && ( // Use the index to check state
            <InfoWindow
              onCloseClick={() => {
                const updatedInfoWindowStates = [...isInfoWindowOpen];
                updatedInfoWindowStates[index] = false;
                setIsInfoWindowOpen(updatedInfoWindowStates);
              }}
              position={cinema.position}
            >
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 items-center justify-start">
                  <div className="col-span-1">
                    <RoundedLogo size="very-small" />
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-semibold text-center">
                      {cinema.name}
                    </h3>
                  </div>
                </div>
                <div className="text-center">
                  {cinema.street} <br /> {cinema.postalCode} {cinema.city}
                </div>
                <div className="flex gap-2">
                  <div className="mx-auto">
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="text-primary"
                    >
                      <Link href={`/cinemas/${cinema.id}`}>
                        Accéder à la fiche
                      </Link>
                    </Button>
                  </div>
                  <div className="mx-auto">
                    <Button
                      size="sm"
                      variant={"outline"}
                      className="text-primary"
                    >
                      <Link
                        href={`https://www.google.com/maps/search/?api=1&query=${cinema.position.lat},${cinema.position.lng}`}
                      >
                        Voir sur GoogleMaps
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}
