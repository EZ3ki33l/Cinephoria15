import { useJsApiLoader } from "@react-google-maps/api";

const useGoogleMapsLoader = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, 
    libraries: ["places", "marker"], 
    language: "fr", // Langue
    region: "FR", // Région
  });

  return { isLoaded };
};

export default useGoogleMapsLoader;
