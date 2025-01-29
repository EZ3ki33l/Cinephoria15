"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Spinner } from "../_layout/spinner";

export interface Cinema {
  id: number;
  name: string;
  Address: {
    street: string;
    postalCode: number;
    city: string;
    lat: number;
    lng: number;
  };
  screens: any[]; // Définir le type des écrans plus précisément si possible
  Equipment: any[]; // Définir le type des équipements plus précisément si possible
}

interface Maps2Props {
  cinemas: Cinema[];
  selectedCinema: Cinema | null;
  onMarkerClick: (cinema: Cinema) => void;
}

export function Maps2({ cinemas, selectedCinema, onMarkerClick }: Maps2Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "marker"],
    language: "fr", // Langue
    region: "FR", // Région
    version: "weekly",
    mapIds : ["7be8cdcc947285d6"],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Centrer la carte sur le cinéma sélectionné
  useEffect(() => {
    if (isLoaded && selectedCinema && map) {
      const center = new google.maps.LatLng(
        selectedCinema.Address.lat,
        selectedCinema.Address.lng
      );
      map.panTo(center);
      map.setZoom(14); // Ajuste le zoom
    }
  }, [isLoaded, selectedCinema, map]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{
        lat: selectedCinema ? selectedCinema.Address.lat : 46.232192999999995, // Coordonnée par défaut
        lng: selectedCinema ? selectedCinema.Address.lng : 2.209666999999996,
      }}
      zoom={selectedCinema ? 14 : 5}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {/* Marqueurs pour chaque cinéma */}
      {cinemas.map((cinema) => (
        <Marker
          key={cinema.id}
          position={{
            lat: cinema.Address.lat,
            lng: cinema.Address.lng,
          }}
          title={cinema.name}
          onClick={() => onMarkerClick(cinema)} // Lorsqu'on clique sur un marqueur
        />
      ))}
    </GoogleMap>
  ) : (
    <div className="flex flex-col items-center justify-center">
      Chargement de la carte <Spinner />
    </div>
  );
}
