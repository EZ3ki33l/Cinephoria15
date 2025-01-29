export const googleMapsConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  version: "weekly",
  libraries: ["places", "marker"] as ("places" | "marker")[],
  language: "fr",
  region: "FR",
  mapIds: ["7be8cdcc947285d6"],
};