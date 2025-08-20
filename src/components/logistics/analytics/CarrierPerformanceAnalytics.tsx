import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const carrierData = [
  {
    name: "Saudi Post",
    onTime: 88,
    cost: 230,
    success: 97,
    carbonFootprint: 110,
  },
  {
    name: "SMSA Express",
    onTime: 91,
    cost: 260,
    success: 98,
    carbonFootprint: 135,
  },
  { name: "Aramex", onTime: 87, cost: 245, success: 95, carbonFootprint: 140 },
  { name: "DHL", onTime: 93, cost: 290, success: 99, carbonFootprint: 160 },
  { name: "FedEx", onTime: 92, cost: 285, success: 98, carbonFootprint: 145 },
];

const timeRangeOptions = [
  "Last Week",
  "Last Month",
  "Last Quarter",
  "Last Year",
];

export const CarrierPerformanceAnalytics: React.FC = () => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState("Last Month");

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            {getTranslation("logistics.carrierPerformance", language) ||
              "Carrier Performance"}
          </CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ontime">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ontime">On-Time %</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="success">Success Rate</TabsTrigger>
            <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
          </TabsList>

          <TabsContent value="ontime" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carrierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" name="On-Time %" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="cost" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carrierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" name="Avg. Cost (USD)" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="success" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carrierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" name="Success Rate %" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="carbon" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carrierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="carbonFootprint" name="CO2 (kg)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
