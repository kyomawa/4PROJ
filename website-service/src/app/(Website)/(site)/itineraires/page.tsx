import { getUserItineraries } from "@/actions/navigation/action";
import { getConnectedUser } from "@/actions/user/action";
import { itinerariesMetadata } from "@/constants/metadata";
import { redirect } from "next/navigation";
import Itineraries from "./_components/Itineraries";

// =============================================================================================

export const metadata = itinerariesMetadata;

// =============================================================================================

export default async function ItinerariesPage() {
  const userResponse = await getConnectedUser();

  if (!userResponse.success) {
    redirect("/connexion");
  }

  const itinerariesResponse = await getUserItineraries();
  const itineraries = itinerariesResponse.success ? itinerariesResponse.data?.itineraries || [] : [];

  return <Itineraries itineraries={itineraries} />;
}

// =============================================================================================
