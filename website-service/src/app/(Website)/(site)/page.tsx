import MapComponent from "@/components/Map/MapComponent";
import { homeMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = homeMetadata;

// =============================================================================================

export default function Home() {
  return (
    <div>
      <main>
        <MapComponent />
      </main>
    </div>
  );
}

// =============================================================================================
