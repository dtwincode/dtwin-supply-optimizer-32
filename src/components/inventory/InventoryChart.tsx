
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { InventoryItem } from "@/types/inventory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface InventoryChartProps {
  data: InventoryItem[];
}

type ChartType = 'bar' | 'line' | 'area';
type TimeRange = '1week' | '2weeks' | '4weeks' | '8weeks' | '12weeks';

export const InventoryChart = ({ data }: InventoryChartProps) => {
  const { language } = useLanguage();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [timeRange, setTimeRange] = useState<TimeRange>('4weeks');

  // Filter data based on time range in weeks
  const getFilteredData = () => {
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item.lastUpdated);
      const weeksDiff = Math.floor((now.getTime() - itemDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      switch (timeRange) {
        case '1week':
          return weeksDiff <= 1;
        case '2weeks':
          return weeksDiff <= 2;
        case '4weeks':
          return weeksDiff <= 4;
        case '8weeks':
          return weeksDiff <= 8;
        case '12weeks':
          return weeksDiff <= 12;
        default:
          return true;
      }
    });

    return filtered.map(item => ({
      name: item.name,
      red: item.netFlow.redZone,
      yellow: item.netFlow.yellowZone,
      green: item.netFlow.greenZone,
      currentStock: item.currentStock
    }));
  };

  const chartData = getFilteredData();

  const commonProps = {
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="green" stroke="#10B981" name={getTranslation('common.zones.green', language)} />
            <Line type="monotone" dataKey="yellow" stroke="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Line type="monotone" dataKey="red" stroke="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Line type="monotone" dataKey="currentStock" stroke="#6B7280" name={getTranslation('common.inventory', language)} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="green" stackId="1" fill="#10B981" name={getTranslation('common.zones.green', language)} />
            <Area type="monotone" dataKey="yellow" stackId="1" fill="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Area type="monotone" dataKey="red" stackId="1" fill="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Area type="monotone" dataKey="currentStock" fill="#6B7280" name={getTranslation('common.inventory', language)} />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="green" stackId="buffer" fill="#10B981" name={getTranslation('common.zones.green', language)} />
            <Bar dataKey="yellow" stackId="buffer" fill="#F59E0B" name={getTranslation('common.zones.yellow', language)} />
            <Bar dataKey="red" stackId="buffer" fill="#EF4444" name={getTranslation('common.zones.red', language)} />
            <Bar dataKey="currentStock" fill="#6B7280" name={getTranslation('common.inventory', language)} />
          </BarChart>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {getTranslation('common.chartTitles.bufferProfile', language)}
        </h3>
        <div className="flex gap-4">
          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">Last Week</SelectItem>
              <SelectItem value="2weeks">Last 2 Weeks</SelectItem>
              <SelectItem value="4weeks">Last 4 Weeks</SelectItem>
              <SelectItem value="8weeks">Last 8 Weeks</SelectItem>
              <SelectItem value="12weeks">Last 12 Weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
