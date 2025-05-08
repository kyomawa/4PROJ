import { getUserCountByMonth, getIncidentCountByType, getCongestionPeriodByHour } from "@/actions/statistics/action";
import { incidentTypeLabels } from "@/types/incident";
import { MonthlyUserStats, IncidentTypeStats, HourlyIncidentStats } from "@/actions/statistics/types";
import Dashboard from "./_components/Dashboard";
import { dashboardMetadata } from "@/constants/metadata";

// =============================================================================================

export const metadata = dashboardMetadata;

// =============================================================================================

export default async function DashboardPage() {
  let userData: MonthlyUserStats[] | [] = [];
  let incidentData: IncidentTypeStats[] | [] = [];
  let congestionData: HourlyIncidentStats[] | [] = [];
  let error = null;

  const [usersRes, incidentsRes, congestionRes] = await Promise.all([
    getUserCountByMonth(),
    getIncidentCountByType(),
    getCongestionPeriodByHour(),
  ]);

  if (usersRes.success) {
    userData = usersRes.data;
  }

  if (incidentsRes.success) {
    const formatted = incidentsRes.data.map((item) => ({
      ...item,
      type: incidentTypeLabels[item.type as keyof typeof incidentTypeLabels] || item.type,
    }));
    incidentData = formatted;
  }

  if (congestionRes.success) {
    congestionData = congestionRes.data;
  }

  if (!usersRes.success || !incidentsRes.success || !congestionRes.success) {
    error = "Une erreur est survenue lors de la récupération des statistiques. Vérifiez votre accès administrateur.";
  }

  return <Dashboard userData={userData} incidentData={incidentData} congestionData={congestionData} error={error} />;
}

// =============================================================================================
