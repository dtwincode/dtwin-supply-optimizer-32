
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Leaf, TrendingDown, FileBarChart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

const monthlyData = [
  { name: 'Jan', co2: 1420, distance: 28500, shipments: 142 },
  { name: 'Feb', co2: 1380, distance: 27600, shipments: 138 },
  { name: 'Mar', co2: 1520, distance: 30400, shipments: 152 },
  { name: 'Apr', co2: 1340, distance: 26800, shipments: 134 },
  { name: 'May', co2: 1210, distance: 24200, shipments: 121 },
  { name: 'Jun', co2: 1180, distance: 23600, shipments: 118 },
  { name: 'Jul', co2: 1250, distance: 25000, shipments: 125 },
  { name: 'Aug', co2: 1320, distance: 26400, shipments: 132 },
  { name: 'Sep', co2: 1450, distance: 29000, shipments: 145 },
  { name: 'Oct', co2: 1510, distance: 30200, shipments: 151 },
  { name: 'Nov', co2: 1280, distance: 25600, shipments: 128 },
  { name: 'Dec', co2: 1220, distance: 24400, shipments: 122 }
];

const transportTypes = [
  { name: 'Truck', co2: 8450, percentage: 65 },
  { name: 'Air', co2: 2600, percentage: 20 },
  { name: 'Rail', co2: 1300, percentage: 10 },
  { name: 'Sea', co2: 650, percentage: 5 }
];

export const CarbonFootprintTracker: React.FC = () => {
  const { language } = useLanguage();
  const [period, setPeriod] = useState('month');
  const [year, setYear] = useState('2023');
  
  const totalCO2 = monthlyData.reduce((sum, data) => sum + data.co2, 0);
  const totalDistance = monthlyData.reduce((sum, data) => sum + data.distance, 0);
  const totalShipments = monthlyData.reduce((sum, data) => sum + data.shipments, 0);
  const co2PerShipment = Math.round((totalCO2 / totalShipments) * 10) / 10;
  const co2PerKm = Math.round((totalCO2 / totalDistance) * 1000) / 1000;
  
  // Calculate year-over-year comparison (simulated data)
  const prevYearCO2 = 15500; // Simulated previous year total
  const co2Change = Math.round(((totalCO2 - prevYearCO2) / prevYearCO2) * 100);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl">
              {getTranslation("common.sustainability.carbonFootprint", language)}
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <FileBarChart className="h-4 w-4 mr-2" />
              {getTranslation("common.sustainability.exportReport", language)}
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center mt-2">
          <span className="font-medium text-lg mr-2">{totalCO2.toLocaleString()} kg CO₂</span>
          <Badge className={co2Change < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            <span className="flex items-center">
              {co2Change < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
              {co2Change}% {getTranslation("common.sustainability.vsLastYear", language)}
            </span>
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">
              {getTranslation("common.sustainability.trends", language)}
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              {getTranslation("common.sustainability.breakdown", language)}
            </TabsTrigger>
            <TabsTrigger value="efficiency">
              {getTranslation("common.sustainability.efficiency", language)}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="co2" 
                  name="CO₂ (kg)" 
                  stroke="#10b981" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="breakdown" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {getTranslation("common.sustainability.transportTypes", language)}
                </h3>
                {transportTypes.map((transport) => (
                  <div key={transport.name} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{transport.name}</span>
                      <span className="text-sm font-medium">{transport.co2.toLocaleString()} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${transport.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{transport.percentage}%</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">
                    {getTranslation("common.sustainability.topReductions", language)}
                  </h3>
                  <ul className="space-y-2 mt-3">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        {getTranslation("common.sustainability.switchToRail", language)}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        {getTranslation("common.sustainability.optimizeRoutes", language)}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        {getTranslation("common.sustainability.useEVs", language)}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">
                    {getTranslation("common.sustainability.yearGoalProgress", language)}
                  </h3>
                  <div className="flex items-end space-x-1">
                    <span className="text-2xl font-medium">{Math.round((totalCO2 / 14000) * 100)}%</span>
                    <span className="text-sm text-gray-500 mb-1">
                      {getTranslation("common.sustainability.ofTarget", language)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, Math.round((totalCO2 / 14000) * 100))}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTranslation("common.sustainability.yearTarget", language)}: 14,000 kg CO₂
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="efficiency" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("common.sustainability.co2PerShipment", language)}
                    </p>
                    <p className="text-3xl font-medium mt-2">{co2PerShipment} kg</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">-4.2% {getTranslation("common.sustainability.yoy", language)}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("common.sustainability.co2PerKm", language)}
                    </p>
                    <p className="text-3xl font-medium mt-2">{co2PerKm} kg</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">-2.7% {getTranslation("common.sustainability.yoy", language)}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {getTranslation("common.sustainability.carbonOffset", language)}
                    </p>
                    <p className="text-3xl font-medium mt-2">3,450 kg</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">24.6% {getTranslation("common.sustainability.ofTotal", language)}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
