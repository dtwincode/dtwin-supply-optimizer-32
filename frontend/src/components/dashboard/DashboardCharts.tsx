
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const bufferProfileData = [
  { category: "Raw Materials", green: 65, yellow: 20, red: 15 },
  { category: "WIP", green: 55, yellow: 30, red: 15 },
  { category: "Finished Goods", green: 70, yellow: 20, red: 10 },
];

const demandVariabilityData = [
  { date: "W1", ADU: 100, demand: 95, buffer: 120 },
  { date: "W2", ADU: 100, demand: 110, buffer: 120 },
  { date: "W3", ADU: 100, demand: 85, buffer: 120 },
  { date: "W4", ADU: 100, demand: 120, buffer: 120 },
  { date: "W5", ADU: 100, demand: 90, buffer: 120 },
  { date: "W6", ADU: 100, demand: 105, buffer: 120 },
];

const DashboardCharts = () => {
  const { language } = useLanguage();

  return (
    <Card className="p-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <h4 className="font-display text-md font-semibold mb-2">
            {getTranslation('common.chartTitles.bufferProfile', language)}
          </h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bufferProfileData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar
                  dataKey="green"
                  stackId="stack"
                  fill="#10B981"
                  name={getTranslation('common.zones.green', language)}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="yellow"
                  stackId="stack"
                  fill="#F59E0B"
                  name={getTranslation('common.zones.yellow', language)}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="red"
                  stackId="stack"
                  fill="#EF4444"
                  name={getTranslation('common.zones.red', language)}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-display text-md font-semibold mb-2">
            {getTranslation('common.chartTitles.demandVariability', language)}
          </h4>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandVariabilityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="ADU"
                  stroke="#10B981"
                  name="Average Daily Usage"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#F59E0B"
                  name="Actual Demand"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="buffer"
                  stroke="#6B7280"
                  name="Buffer Level"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardCharts;
