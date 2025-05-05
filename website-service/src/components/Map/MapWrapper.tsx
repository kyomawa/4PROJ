"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// ========================================================================================================

const DynamicMap = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center">Chargement de la carte...</div>,
});

export default function MapWrapper() {
  return (
    <Suspense
      fallback={<div className="w-full h-screen flex items-center justify-center">Chargement de la carte...</div>}
    >
      <DynamicMap />
    </Suspense>
  );
}

// ========================================================================================================
