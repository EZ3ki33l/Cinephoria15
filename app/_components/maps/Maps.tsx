"use client";

import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Spinner } from "../_layout/spinner";
import { useGoogleMaps } from "@/lib/hooks/useGoogleMaps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCustomMarker } from "./customMarker";
import Image from "next/image";
import { RoundedLogo } from "../_layout/logo";
import { Typo } from "../_layout/typography";

export interface MapsCinema {
  id: number;
  name: string;
  Address: {
    street: string;
    postalCode: number;
    city: string;
    lat: number;
    lng: number;
  };
  screens: {
    id: number;
    number: number;
    seats: { id: number; row: number; column: number }[];
    projectionType?: string;
    soundSystemType?: string;
  }[];
  Equipment: { id: number; name: string }[];
}

interface MapsProps {
  cinemas: MapsCinema[];
  selectedCinema?: MapsCinema | null;
  onMarkerClick?: (cinema: MapsCinema) => void;
  className?: string;
}

export function Maps({
  cinemas,
  selectedCinema,
  onMarkerClick,
  className,
}: MapsProps) {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapsCinema | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && selectedCinema && map) {
      const center = new google.maps.LatLng(
        selectedCinema.Address.lat,
        selectedCinema.Address.lng
      );
      map.panTo(center);
      map.setZoom(14);
    }
  }, [isLoaded, selectedCinema, map]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center">
        Chargement de la carte <Spinner />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: className || "400px" }}
      center={{
        lat: selectedCinema ? selectedCinema.Address.lat : 46.232192999999995,
        lng: selectedCinema ? selectedCinema.Address.lng : 2.209666999999996,
      }}
      zoom={selectedCinema ? 14 : 5}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {cinemas.map((cinema) => (
        <Marker
          key={cinema.id}
          position={{
            lat: cinema.Address.lat,
            lng: cinema.Address.lng,
          }}
          icon={createCustomMarker(selectedMarker?.id === cinema.id)}
          title={cinema.name}
          animation={
            hoveredMarkerId === cinema.id
              ? google.maps.Animation.BOUNCE
              : undefined
          }
          onClick={() => {
            setSelectedMarker(cinema);
            onMarkerClick?.(cinema);
          }}
          onMouseOver={() => setHoveredMarkerId(cinema.id)}
          onMouseOut={() => setHoveredMarkerId(null)}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.Address.lat,
            lng: selectedMarker.Address.lng,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <Card className="w-[250px] h-auto border-none">
            <CardHeader className="flex flex-row items-center">
                <RoundedLogo size="extra-small" />
                <Typo variant="body-base">{selectedMarker.name}</Typo>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{selectedMarker.Address.street}</p>
              <p>
                {selectedMarker.Address.postalCode}{" "}
                {selectedMarker.Address.city}
              </p>
              <p>{selectedMarker.screens.length} salles</p>
            </CardContent>
            <CardFooter>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedMarker.Address.lat},${selectedMarker.Address.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full" variant="default" size="sm">
                  S'y rendre
                </Button>
              </a>
            </CardFooter>
          </Card>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
