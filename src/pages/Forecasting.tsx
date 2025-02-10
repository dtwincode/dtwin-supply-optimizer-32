import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, Zap, Save } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with actual API data
const forecastData = [
  { month: "Jan", actual: 65, forecast: 62, variance: -3, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA" },
  { month: "Feb", actual: 72, forecast: 70, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU" },
  { month: "Mar", actual: 68, forecast: 65, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia" },
  { month: "Apr", actual: 75, forecast: 78, variance: 3, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA" },
  { month: "May", actual: 82, forecast: 80, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU" },
  { month: "Jun", actual: 88, forecast: 85, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia" },
  { month: "Jul", actual: null, forecast: 92, variance: null, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA" },
  { month: "Aug", actual: null, forecast: 88, variance: null, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU" },
  { month: "Sep", actual: null, forecast: 85, variance: null, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia" },
];

const patternData = [
  { name: "Seasonal", value: 35 },
  { name: "Trend", value: 25 },
  { name: "Cyclical", value: 20 },
  { name: "Random", value: 20 },
];

const forecastingModels = [
  { id: "moving-avg", name: "Moving Average" },
  { id: "exp-smoothing", name: "Exponential Smoothing" },
  { id: "arima", name: "ARIMA" },
  { id: "ml-lstm", name: "Machine Learning (LSTM)" },
];

const savedScenarios = [
  { id: 1, name: "Base Scenario", model: "moving-avg", horizon: "6m" },
  { id: 2, name: "High Growth", model: "exp-smoothing", horizon: "12m" },
  { id: 3, name: "Conservative", model: "arima", horizon: "3m" },
];

const regions = [
  "Central Region",
  "Eastern Region",
  "Western Region",
  "Northern Region",
  "Southern Region"
];

const cities = {
  "Central Region": ["Riyadh", "Al-Kharj", "Al-Qassim"],
  "Eastern Region": ["Dammam", "Al-Khobar", "Dhahran"],
  "Western Region": ["Jeddah", "Mecca", "Medina"],
  "Northern Region": ["Tabuk", "Hail", "Al-Jawf"],
  "Southern Region": ["Abha", "Jizan", "Najran"]
};

const channelTypes = [
  "B2B",
  "B2C",
  "Wholesale",
  "Online Marketplace",
  "Direct Store",
  "Distribution Center"
];

const warehouses = [
  "Distribution Center NA",
  "Distribution Center EU",
  "Manufacturing Plant Asia",
  "Regional Warehouse SA"
];

const Forecasting = () => {
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [horizon, setHorizon] = useState("6m");
  const [scenarioName, setScenarioName] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    return forecastData.filter(item => {
      if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
      if (selectedCity !== "all" && item.city !== selectedCity) return false;
      if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;
      if (selectedWarehouse !== "all" && item.warehouse !== selectedWarehouse) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.month.toLowerCase().includes(query) ||
          item.region.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.channel.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedRegion, selectedCity, selectedChannel, selectedWarehouse, searchQuery]);

  const handleSaveScenario = () => {
    if (!scenarioName) {
      toast({
        title: "Error",
        description: "Please enter a scenario name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Scenario saved successfully",
    });
    setScenarioName("");
  };

  const handleCompareScenarios = () => {
    if (!selectedScenario) {
      toast({
        title: "Error",
        description: "Please select a scenario to compare",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comparing Scenarios",
      description: `Comparing current forecast with ${selectedScenario.name}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Demand Forecasting</h1>
            <div className="flex gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {forecastingModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Forecast Horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="12m">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-4xl">
            <div className="flex gap-4">
              <Input
                placeholder="Search forecasts..."
                className="w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={selectedRegion === "all"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {selectedRegion !== "all" && cities[selectedRegion as keyof typeof cities].map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Channel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {channelTypes.map(channel => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Forecast Accuracy</p>
                <p className="text-2xl font-semibold">95.2%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning-50 rounded-full">
                <AlertCircle className="h-6 w-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">MAPE</p>
                <p className="text-2xl font-semibold">4.8%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-50 rounded-full">
                <Zap className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bias</p>
                <p className="text-2xl font-semibold">-1.2%</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scenario Management</h3>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="w-[300px]"
            />
            <Button onClick={handleSaveScenario}>
              <Save className="w-4 h-4 mr-2" />
              Save Scenario
            </Button>
          </div>
          <div className="flex gap-4">
            <Select onValueChange={(value) => setSelectedScenario(savedScenarios.find(s => s.id.toString() === value))}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select scenario to compare" />
              </SelectTrigger>
              <SelectContent>
                {savedScenarios.map(scenario => (
                  <SelectItem key={scenario.id} value={scenario.id.toString()}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleCompareScenarios}>
              Compare Scenarios
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Forecast</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    name="Actual Demand"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#F59E0B"
                    name="Forecast"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Patterns</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#10B981"
                    name="Pattern Distribution (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
