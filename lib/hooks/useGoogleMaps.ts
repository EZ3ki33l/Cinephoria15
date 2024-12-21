import { useJsApiLoader } from "@react-google-maps/api";
import { googleMapsConfig } from "@/lib/googleMarker";

export const useGoogleMaps = () => {
  return useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: googleMapsConfig.libraries,
    language: googleMapsConfig.language,
    region: googleMapsConfig.region,
    version: googleMapsConfig.version,
    mapIds: googleMapsConfig.mapIds,
  });
}; 