import MapWrapper from "@/components/Map/MapWrapper";
import { homeMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = homeMetadata;

// =============================================================================================

export default function Home() {
  return (
    <main className="h-screen w-full">
      <MapWrapper />
    </main>
  );
}

// =============================================================================================
