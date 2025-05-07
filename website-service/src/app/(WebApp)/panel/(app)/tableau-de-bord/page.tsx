"use client";

import { useEffect, useState } from "react";
import { getUserCountByMonth, getIncidentCountByType, getCongestionPeriodByHour } from "@/actions/statistics/action";
import { incidentTypeLabels } from "@/types/incident";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import SubHeader from "../_components/SubHeader";

// =============================================================================================

const DashboardVisualizations = dynamic(() => import("@/components/DashboardVisualizations"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[900px] rounded-lg" />,
});

// =============================================================================================

export default function DashboardPage() {
  const [userData, setUserData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
  const [congestionData, setCongestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Récupérer les données statistiques
        const [usersResponse, incidentsResponse, congestionResponse] = await Promise.all([
          getUserCountByMonth(),
          getIncidentCountByType(),
          getCongestionPeriodByHour(),
        ]);

        if (usersResponse.success) {
          setUserData(usersResponse.data);
        }

        if (incidentsResponse.success) {
          // Convertir les types d'incidents en libellés français
          const formattedData = incidentsResponse.data.map((item) => ({
            ...item,
            type: incidentTypeLabels[item.type] || item.type,
          }));
          setIncidentData(formattedData);
        }

        if (congestionResponse.success) {
          setCongestionData(congestionResponse.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-y-8">
      <SubHeader title="Tableau de bord" button={null} />

      {isLoading ? (
        <Skeleton className="w-full h-[900px] rounded-lg" />
      ) : (
        <DashboardVisualizations userData={userData} incidentData={incidentData} congestionData={congestionData} />
      )}
    </div>
  );
}

// =============================================================================================

type StatsCardProps = {
  title: string;
  data: any[];
  type: "users" | "incidents" | "congestion";
  className?: string;
};

function StatsCard({ title, data, type, className }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-neutral-500">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="h-64">
          {type === "users" && <UsersChart data={data} />}
          {type === "incidents" && <IncidentsChart data={data} />}
          {type === "congestion" && <CongestionChart data={data} />}
        </div>
      )}
    </div>
  );
}

// =============================================================================================

function UsersChart({ data }: { data: any[] }) {
  // Cette fonction serait remplacée par un vrai graphique dans une implémentation complète
  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left font-semibold">Mois</th>
            <th className="py-2 text-right font-semibold">Nombre d&apos;inscriptions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-neutral-50">
              <td className="py-2">{item.month}</td>
              <td className="py-2 text-right">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================================

function IncidentsChart({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left font-semibold">Type d&apos;incident</th>
            <th className="py-2 text-right font-semibold">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-neutral-50">
              <td className="py-2">{incidentTypeLabels[item.type as keyof typeof incidentTypeLabels] || item.type}</td>
              <td className="py-2 text-right">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================================

function CongestionChart({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left font-semibold">Heure</th>
            <th className="py-2 text-right font-semibold">Nombre d&apos;embouteillages</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-neutral-50">
              <td className="py-2">{`${item.hour}:00 - ${item.hour + 1}:00`}</td>
              <td className="py-2 text-right">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================================
