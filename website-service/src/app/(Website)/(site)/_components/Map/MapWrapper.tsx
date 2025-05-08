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

  const hasRouteParams = fromName && fromLat && fromLon && toName && toLat && toLon;
  const hasLocationParams = lat && lng;

  const validateNumeric = (value: string | null): number | null => {
    if (!value) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const parsedFromLat = validateNumeric(fromLat);
  const parsedFromLon = validateNumeric(fromLon);
  const parsedToLat = validateNumeric(toLat);
  const parsedToLon = validateNumeric(toLon);
  const parsedLat = validateNumeric(lat);
  const parsedLng = validateNumeric(lng);

  const initialProps = {
    ...(hasLocationParams && parsedLat !== null && parsedLng !== null
      ? {
          initialCenter: { lat: parsedLat, lng: parsedLng },
          initialZoom: 15,
        }
      : {}),
    ...(hasRouteParams &&
    parsedFromLat !== null &&
    parsedFromLon !== null &&
    parsedToLat !== null &&
    parsedToLon !== null
      ? {
          initialRoute: {
            departure: {
              name: fromName,
              position: { lat: parsedFromLat, lng: parsedFromLon },
            },
            arrival: {
              name: toName,
              position: { lat: parsedToLat, lng: parsedToLon },
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
