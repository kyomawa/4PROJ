"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface UserStat {
  month: string;
  count: number;
}

interface IncidentStat {
  type: string;
  count: number;
}

interface CongestionStat {
  hour: number;
  count: number;
}

const defaultUserData: UserStat[] = [
  { month: "Janvier", count: 0 },
  { month: "Février", count: 0 },
  { month: "Mars", count: 0 },
  { month: "Avril", count: 0 },
  { month: "Mai", count: 0 },
  { month: "Juin", count: 0 },
  { month: "Juillet", count: 0 },
  { month: "Août", count: 0 },
  { month: "Septembre", count: 0 },
  { month: "Octobre", count: 0 },
  { month: "Novembre", count: 0 },
  { month: "Décembre", count: 0 },
];

const defaultIncidentData: IncidentStat[] = [
  { type: "Accident", count: 0 },
  { type: "Embouteillage", count: 0 },
  { type: "Route fermée", count: 0 },
  { type: "Contrôle policier", count: 0 },
  { type: "Obstacle", count: 0 },
];

const defaultCongestionData: CongestionStat[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  count: 0,
}));

const COLORS = ["#695bf9", "#ff8042", "#ffc658", "#00C49F", "#0088fe", "#82ca9d"];

interface DashboardVisualizationsProps {
  userData?: UserStat[];
  incidentData?: IncidentStat[];
  congestionData?: CongestionStat[];
}

export default function DashboardVisualizations({
  userData = defaultUserData,
  incidentData = defaultIncidentData,
  congestionData = defaultCongestionData,
}: DashboardVisualizationsProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatHour = (hour: number) => {
    return `${hour}h`;
  };

  return (
    <div className="flex flex-col gap-8 w-full p-4">
      {/* Graphique des inscriptions d'utilisateurs */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Inscriptions d&apos;utilisateurs par mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} utilisateurs`, "Inscriptions"]} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Inscriptions"
              stroke="#695bf9"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique des types d'incidents */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Types d&apos;incidents signalés</h2>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <ResponsiveContainer width={windowWidth < 768 ? "100%" : "50%"} height={300}>
            <BarChart data={incidentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} incidents`, "Nombre"]} />
              <Legend />
              <Bar dataKey="count" name="Nombre d'incidents" fill="#695bf9" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width={windowWidth < 768 ? "100%" : "50%"} height={300}>
            <PieChart>
              <Pie
                data={incidentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="type"
                label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
              >
                {incidentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} incidents`, props.payload.type]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des périodes de congestion */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-bold mb-4">Périodes de congestion (par heure)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={congestionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={formatHour} />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} embouteillages`, "Nombre"]}
              labelFormatter={(label) => `${label}h00 - ${(label + 1) % 24}h00`}
            />
            <Legend />
            <Bar dataKey="count" name="Nombre d'embouteillages" fill="#ff8042">
              {congestionData.map((entry, index) => {
                const isPeak = (entry.hour >= 7 && entry.hour <= 9) || (entry.hour >= 16 && entry.hour <= 19);
                return <Cell key={`cell-${index}`} fillOpacity={isPeak ? 1 : 0.6} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
