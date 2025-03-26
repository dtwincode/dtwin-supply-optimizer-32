
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface SalesTrendsChartProps {
  timeFrame: "monthly" | "quarterly" | "yearly";
}

interface SalesDataPoint {
  name: string;
  planned: number;
  actual: number;
  forecast: number;
}

export const SalesTrendsChart = ({ timeFrame }: SalesTrendsChartProps) => {
  const { language } = useLanguage();
  const [data, setData] = useState<SalesDataPoint[]>([]);

  useEffect(() => {
    // Generate sample data based on the selected time frame
    if (timeFrame === "monthly") {
      setData([
        { name: "Jan", planned: 4000, actual: 3800, forecast: 4200 },
        { name: "Feb", planned: 4500, actual: 4300, forecast: 4600 },
        { name: "Mar", planned: 5000, actual: 5200, forecast: 5100 },
        { name: "Apr", planned: 4800, actual: 4700, forecast: 4900 },
        { name: "May", planned: 5200, actual: 5500, forecast: 5300 },
        { name: "Jun", planned: 5500, actual: 5300, forecast: 5600 }
      ]);
    } else if (timeFrame === "quarterly") {
      setData([
        { name: "Q1 2023", planned: 12000, actual: 11500, forecast: 12200 },
        { name: "Q2 2023", planned: 13500, actual: 14000, forecast: 13700 },
        { name: "Q3 2023", planned: 15000, actual: 14800, forecast: 15200 },
        { name: "Q4 2023", planned: 17000, actual: 16500, forecast: 17200 },
        { name: "Q1 2024", planned: 14000, actual: 13800, forecast: 14500 },
        { name: "Q2 2024", planned: 15500, actual: 15200, forecast: 16000 }
      ]);
    } else {
      // Yearly
      setData([
        { name: "2019", planned: 45000, actual: 44000, forecast: 45500 },
        { name: "2020", planned: 40000, actual: 38000, forecast: 41000 },
        { name: "2021", planned: 48000, actual: 47500, forecast: 48500 },
        { name: "2022", planned: 53000, actual: 54000, forecast: 53500 },
        { name: "2023", planned: 57000, actual: 57800, forecast: 57200 },
        { name: "2024", planned: 62000, actual: 30000, forecast: 63000 }
      ]);
    }
  }, [timeFrame]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            {language === 'ar' ? 'المخطط: ' : 'Planned: '}
            <span className="font-medium">{payload[0].value?.toLocaleString()}</span>
          </p>
          <p className="text-sm text-green-600">
            {language === 'ar' ? 'الفعلي: ' : 'Actual: '}
            <span className="font-medium">{payload[1].value?.toLocaleString()}</span>
          </p>
          <p className="text-sm text-purple-600">
            {language === 'ar' ? 'التنبؤ: ' : 'Forecast: '}
            <span className="font-medium">{payload[2].value?.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#888" }}
          />
          <YAxis 
            tick={{ fill: "#888" }}
            tickFormatter={(value) => {
              if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}k`;
              }
              return value.toString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="planned" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name={language === 'ar' ? 'المخطط' : 'Planned'}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            name={language === 'ar' ? 'الفعلي' : 'Actual'}
          />
          <Line 
            type="monotone" 
            dataKey="forecast" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            name={language === 'ar' ? 'التنبؤ' : 'Forecast'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
