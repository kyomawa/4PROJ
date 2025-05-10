import { homeMetadata } from "@/constants/metadata";
import MapWrapper from "./_components/Map/MapWrapper";
import { Suspense } from "react";

// =============================================================================================

export const metadata = homeMetadata;

// =============================================================================================

export default function Home() {
  return (
    <main className="h-[calc(100dvh-4.5rem)] w-full">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Chargement de la carte…</div>}>
        <MapWrapper />
      </Suspense>
    </main>
  );
}

// =============================================================================================
