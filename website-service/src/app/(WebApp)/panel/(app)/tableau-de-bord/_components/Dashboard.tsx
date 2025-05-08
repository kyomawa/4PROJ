import { MonthlyUserStats, IncidentTypeStats, HourlyIncidentStats } from "@/actions/statistics/types";
import SubHeader from "../../_components/SubHeader";
import DashboardVisualizations from "./DashboardVisualizations";

// =============================================================================================

type DashboardProps = {
  userData: MonthlyUserStats[];
  incidentData: IncidentTypeStats[];
  congestionData: HourlyIncidentStats[];
  error: string | null;
};

// =============================================================================================

export default function Dashboard({ userData, incidentData, congestionData, error }: DashboardProps) {
  return (
    <div className="flex flex-col gap-y-8">
      <SubHeader title="Tableau de bord" button={null} />
      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">{error}</div>}
      <DashboardVisualizations userData={userData} incidentData={incidentData} congestionData={congestionData} />
    </div>
  );
}

// =============================================================================================
