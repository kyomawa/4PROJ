import MapWrapper from "@/components/Map/MapWrapper";
import { homeMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = homeMetadata;

// =============================================================================================

export default function Home() {
  return (
    <main className="h-[calc(100dvh-4.5rem)] w-full">
      <MapWrapper />
    </main>
  );
}

// =============================================================================================
