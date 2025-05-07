"use client";

import { useEffect, useState } from "react";
import { getUserCountByMonth, getIncidentCountByType, getCongestionPeriodByHour } from "@/actions/statistics/action";
import { incidentTypeLabels } from "@/types/incident";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import SubHeader from "../_components/SubHeader";
import { MonthlyUserStats, IncidentTypeStats, HourlyIncidentStats } from "@/actions/statistics/types";

// =============================================================================================

const DashboardVisualizations = dynamic(() => import("@/components/DashboardVisualizations"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[900px] rounded-lg" />,
});

// =============================================================================================

export default function DashboardPage() {
  const [userData, setUserData] = useState<MonthlyUserStats[]>([]);
  const [incidentData, setIncidentData] = useState<IncidentTypeStats[]>([]);
  const [congestionData, setCongestionData] = useState<HourlyIncidentStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [usersResponse, incidentsResponse, congestionResponse] = await Promise.all([
          getUserCountByMonth(),
          getIncidentCountByType(),
          getCongestionPeriodByHour(),
        ]);

        if (usersResponse.success) {
          setUserData(usersResponse.data);
        } else {
          console.error("Erreur lors de la récupération des statistiques utilisateurs:", usersResponse.message);
        }

        if (incidentsResponse.success) {
          const formattedData = incidentsResponse.data.map((item) => ({
            ...item,
            type: incidentTypeLabels[item.type as keyof typeof incidentTypeLabels] || item.type,
          }));
          setIncidentData(formattedData);
        } else {
          console.error("Erreur lors de la récupération des statistiques d'incidents:", incidentsResponse.message);
        }

        if (congestionResponse.success) {
          setCongestionData(congestionResponse.data);
        } else {
          console.error("Erreur lors de la récupération des statistiques de congestion:", congestionResponse.message);
        }

        if (!usersResponse.success || !incidentsResponse.success || !congestionResponse.success) {
          setError(
            "Une erreur est survenue lors de la récupération des statistiques. Veuillez vérifier que vous êtes connecté en tant qu'administrateur."
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        setError("Une erreur inattendue est survenue lors de la récupération des statistiques.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-y-8">
      <SubHeader title="Tableau de bord" button={null} />

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">{error}</div>}

      {isLoading ? (
        <Skeleton className="w-full h-[900px] rounded-lg" />
      ) : (
        <DashboardVisualizations userData={userData} incidentData={incidentData} congestionData={congestionData} />
      )}
    </div>
  );
}

// ===================================================================================================
