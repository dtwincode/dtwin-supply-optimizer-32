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
  AreaChart,
  Area,
  ComposedChart,
  ErrorBar,
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
import { TrendingUp, AlertCircle, Zap, Save, FileDown, Share2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateMetrics,
  calculateConfidenceIntervals,
  decomposeSeasonality,
  generateScenario,
  type Scenario
} from "@/utils/forecastingUtils";

// Mock data - replace with actual API data
const forecastData = [
  { month: "Jan", actual: 65, forecast: 62, variance: -3, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA", category: "Electronics", subcategory: "Smartphones", sku: "IPH-12" },
  { month: "Feb", actual: 72, forecast: 70, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-HP-1" },
  { month: "Mar", actual: 68, forecast: 65, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-1" },
  { month: "Apr", actual: 75, forecast: 78, variance: 3, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA", category: "Electronics", subcategory: "Smartphones", sku: "IPH-13" },
  { month: "May", actual: 82, forecast: 80, variance: -2, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-DL-1" },
  { month: "Jun", actual: 88, forecast: 85, variance: -3, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-2" },
  { month: "Jul", actual: null, forecast: 92, variance: null, region: "Central Region", city: "Riyadh", channel: "B2B", warehouse: "Distribution Center NA", category: "Electronics", subcategory: "Smartphones", sku: "IPH-14" },
  { month: "Aug", actual: null, forecast: 88, variance: null, region: "Eastern Region", city: "Dammam", channel: "B2C", warehouse: "Distribution Center EU", category: "Electronics", subcategory: "Laptops", sku: "LT-HP-2" },
  { month: "Sep", actual: null, forecast: 85, variance: null, region: "Western Region", city: "Jeddah", channel: "Wholesale", warehouse: "Manufacturing Plant Asia", category: "Electronics", subcategory: "Tablets", sku: "TAB-SM-3" },
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
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(false);
  const [activeTab, setActiveTab] = useState("forecast");
  const [whatIfParams, setWhatIfParams] = useState({
    growthRate: 0,
    seasonality: 0,
    events: []
  });
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

  const metrics = useMemo(() => {
    const actuals = filteredData.map(d => d.actual).filter(a => a !== null) as number[];
    const forecasts = filteredData.map(d => d.forecast).filter(f => f !== null) as number[];
    return calculateMetrics(actuals, forecasts);
  }, [filteredData]);

  const confidenceIntervals = useMemo(() => {
    const forecasts = filteredData.map(d => d.forecast);
    return calculateConfidenceIntervals(forecasts);
  }, [filteredData]);

  const decomposition = useMemo(() => {
    const values = filteredData.map(d => d.actual || d.forecast);
    return decomposeSeasonality(values);
  }, [filteredData]);

  const whatIfScenario = useMemo(() => {
    const baseline = filteredData.map(d => d.forecast);
    return generateScenario(baseline, whatIfParams, filteredData); // Pass filteredData as timeData
  }, [filteredData, whatIfParams]);

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

  const handleExport = () => {
    const csvContent = [
      ["Month", "Actual", "Forecast", "Variance", "Region", "City", "Channel", "Category", "Subcategory", "SKU"],
      ...filteredData.map(d => [
        d.month,
        d.actual,
        d.forecast,
        d.variance,
        d.region,
        d.city,
        d.channel,
        d.category,
        d.subcategory,
        d.sku
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forecast_data.csv";
    a.click();
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
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Forecast Accuracy</p>
                <p className="text-2xl font-semibold">{(100 - metrics.mape).toFixed(1)}%</p>
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
                <p className="text-2xl font-semibold">{metrics.mape}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-50 rounded-full">
                <Zap className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">MAE</p>
                <p className="text-2xl font-semibold">{metrics.mae}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-info-50 rounded-full">
                <Share2 className="h-6 w-6 text-info-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">RMSE</p>
                <p className="text-2xl font-semibold">{metrics.rmse}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="forecast">Forecast Analysis</TabsTrigger>
            <TabsTrigger value="decomposition">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="scenarios">What-If Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Demand Forecast</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
                >
                  {showConfidenceIntervals ? "Hide" : "Show"} Confidence Intervals
                </Button>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={filteredData.map((d, i) => ({
                    ...d,
                    ci: confidenceIntervals[i]
                  }))}>
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
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#F59E0B"
                      name="Forecast"
                      strokeWidth={2}
                    />
                    {showConfidenceIntervals && (
                      <Area
                        dataKey="ci.upper"
                        stroke="transparent"
                        fill="#F59E0B"
                        fillOpacity={0.1}
                        name="Confidence Interval"
                      />
                    )}
                    {showConfidenceIntervals && (
                      <Area
                        dataKey="ci.lower"
                        stroke="transparent"
                        fill="#F59E0B"
                        fillOpacity={0.1}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="decomposition">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trend Analysis</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData.map((d, i) => ({
                      month: d.month,
                      trend: decomposition.trend[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#10B981"
                        name="Trend"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Seasonality Pattern</h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData.map((d, i) => ({
                      month: d.month,
                      seasonal: decomposition.seasonal[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="seasonal"
                        stroke="#F59E0B"
                        name="Seasonal Component"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card className="p-6">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Growth Rate (%)</label>
                    <Input
                      type="number"
                      value={whatIfParams.growthRate}
                      onChange={(e) => setWhatIfParams(prev => ({
                        ...prev,
                        growthRate: parseFloat(e.target.value) / 100
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Seasonality Impact</label>
                    <Input
                      type="number"
                      value={whatIfParams.seasonality}
                      onChange={(e) => setWhatIfParams(prev => ({
                        ...prev,
                        seasonality: parseFloat(e.target.value)
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Impact</label>
                    <Button
                      variant="outline"
                      onClick={() => setWhatIfParams(prev => ({
                        ...prev,
                        events: [...prev.events, { month: "", impact: 0 }]
                      }))}
                    >
                      Add Event
                    </Button>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData.map((d, i) => ({
                      ...d,
                      scenario: whatIfScenario[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#F59E0B"
                        name="Base Forecast"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="scenario"
                        stroke="#10B981"
                        name="Scenario Forecast"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

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
            <Button variant="outline">
              Compare Scenarios
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
