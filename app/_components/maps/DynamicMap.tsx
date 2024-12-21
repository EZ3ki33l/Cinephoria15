import dynamic from "next/dynamic";
import { Maps } from "./Maps";
import type { MapsCinema } from "./Maps";

export const DynamicMap = dynamic(
  () => import("./Maps").then((mod) => mod.Maps),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px]">
        Chargement de la carte...
      </div>
    )
  }
); 