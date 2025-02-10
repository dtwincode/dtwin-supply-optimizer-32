
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
  { date: "Week 1", ADU: 100, demand: 95, buffer: 120 },
  { date: "Week 2", ADU: 100, demand: 110, buffer: 120 },
  { date: "Week 3", ADU: 100, demand: 85, buffer: 120 },
  { date: "Week 4", ADU: 100, demand: 120, buffer: 120 },
  { date: "Week 5", ADU: 100, demand: 90, buffer: 120 },
  { date: "Week 6", ADU: 100, demand: 105, buffer: 120 },
];

const DashboardCharts = () => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h4 className="font-display text-xl font-semibold mb-4">
          {getTranslation('common.chartTitles.bufferProfile', language)}
        </h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bufferProfileData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
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
      </Card>

      <Card className="p-6">
        <h4 className="font-display text-xl font-semibold mb-4">
          {getTranslation('common.chartTitles.demandVariability', language)}
        </h4>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandVariabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ADU"
                stroke="#10B981"
                name="Average Daily Usage"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#F59E0B"
                name="Actual Demand"
              />
              <Line
                type="monotone"
                dataKey="buffer"
                stroke="#6B7280"
                name="Buffer Level"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCharts;
