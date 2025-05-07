"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ========================================================================================================

const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export default function MapWrapper() {
  const searchParams = useSearchParams();

  const fromName = searchParams.get("from");
  const fromLat = searchParams.get("fromLat");
  const fromLon = searchParams.get("fromLon");
  const toName = searchParams.get("to");
  const toLat = searchParams.get("toLat");
  const toLon = searchParams.get("toLon");
  const mode = searchParams.get("mode") as "car" | "bike" | "foot" | "train" | null;

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const initialProps = {
    ...(lat && lng ? { initialCenter: { lat: parseFloat(lat), lng: parseFloat(lng) }, initialZoom: 15 } : {}),
    ...(fromName && fromLat && fromLon && toName && toLat && toLon
      ? {
          initialRoute: {
            departure: {
              name: fromName,
              position: { lat: parseFloat(fromLat), lng: parseFloat(fromLon) },
            },
            arrival: {
              name: toName,
              position: { lat: parseFloat(toLat), lng: parseFloat(toLon) },
            },
            travelMode: mode || "car",
          },
        }
      : {}),
  };

  return (
    <Suspense fallback={<MapLoading />}>
      <DynamicMap {...initialProps} />
    </Suspense>
  );
}

// ========================================================================================================

function MapLoading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-pulse rounded-full bg-primary-200 h-16 w-16 mb-4"></div>
      <p className="text-neutral-600 animate-pulse">Chargement de la carte...</p>
    </div>
  );
}

// ========================================================================================================
