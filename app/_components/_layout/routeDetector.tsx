"use client";

import { usePathname } from "next/navigation";

interface RouteDetectorProps {
  publicContent: React.ReactNode;
  privateContent: React.ReactNode;
}

export function RouteDetector({ publicContent, privateContent }: RouteDetectorProps) {
  const pathname = usePathname();
  const isPrivateRoute = pathname?.includes("/administrateur") || pathname?.includes("/manager");

  return isPrivateRoute ? privateContent : publicContent;
} 