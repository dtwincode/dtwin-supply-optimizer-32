
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryItem } from "@/types/inventory";

interface InventoryChartProps {
  data: InventoryItem[];
}

export const InventoryChart = ({ data }: InventoryChartProps) => {
  const { language } = useLanguage();

  const chartData = data.map(item => ({
    name: item.name,
    red: item.netFlow.redZone,
    yellow: item.netFlow.yellowZone,
    green: item.netFlow.greenZone,
    currentStock: item.currentStock
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {getTranslation('common.chartTitles.bufferProfile', language)}
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="green"
              stackId="buffer"
              fill="#10B981"
              name={getTranslation('common.zones.green', language)}
            />
            <Bar
              dataKey="yellow"
              stackId="buffer"
              fill="#F59E0B"
              name={getTranslation('common.zones.yellow', language)}
            />
            <Bar
              dataKey="red"
              stackId="buffer"
              fill="#EF4444"
              name={getTranslation('common.zones.red', language)}
            />
            <Bar
              dataKey="currentStock"
              fill="#6B7280"
              name={getTranslation('common.inventory', language)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
