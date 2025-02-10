
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
import { TrendingUp, AlertCircle, Zap, Save, FileDown, Share2, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateMetrics,
  calculateConfidenceIntervals,
  decomposeSeasonality,
  generateScenario,
  type Scenario,
  validateForecast,
  performCrossValidation,
  type WeatherData,
  type MarketEvent,
  fetchWeatherForecast,
  type PriceData
} from "@/utils/forecastingUtils";

const forecastData = [
  { 
    month: "Jan", 
    actual: 65, 
    forecast: 62, 
    variance: -3, 
    region: "Central Region", 
    city: "Riyadh", 
    channel: "B2B", 
    warehouse: "Distribution Center NA", 
    category: "Electronics", 
    subcategory: "Smartphones", 
    sku: "IPH-12",
    promotionalEvent: true,
    weatherImpact: 0.02,
    marketEvents: ["New Competitor Launch"],
    stockLevels: 500,
    priceElasticity: -1.2
  },
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

const marketEventTypes = [
  { value: 'competitor_action', label: 'Competitor Action' },
  { value: 'regulatory_change', label: 'Regulatory Change' },
  { value: 'market_disruption', label: 'Market Disruption' },
  { value: 'technology_change', label: 'Technology Change' },
  { value: 'economic_event', label: 'Economic Event' }
];

const marketEventCategories = [
  { value: 'pricing', label: 'Pricing Changes' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'promotion', label: 'Promotional Activity' },
  { value: 'distribution', label: 'Distribution Changes' },
  { value: 'merger_acquisition', label: 'Merger & Acquisition' }
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
    events: [],
    priceData: undefined as PriceData | undefined
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedSku, setSelectedSku] = useState<string>("all");
  const [showValidation, setShowValidation] = useState(false);
  const [showExternalFactors, setShowExternalFactors] = useState(false);
  const [macroFactors, setMacroFactors] = useState({
    gdpGrowth: 0.02,
    inflation: 0.03,
    exchangeRates: { USD: 1, EUR: 0.85 }
  });
  const [weatherLocation, setWeatherLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [marketEvents, setMarketEvents] = useState<MarketEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<MarketEvent>>({
    type: 'competitor_action',
    category: 'pricing',
    impact: 0
  });
  const [priceData, setPriceData] = useState<PriceData>({
    basePrice: 0,
    elasticity: -1,
    historicalPrices: []
  });
  const { toast } = useToast();

  const filteredData = useMemo(() => {
    return forecastData.filter(item => {
      if (selectedRegion !== "all" && item.region !== selectedRegion) return false;
      if (selectedCity !== "all" && item.city !== selectedCity) return false;
      if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;
      if (selectedWarehouse !== "all" && item.warehouse !== selectedWarehouse) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      if (selectedSubcategory !== "all" && item.subcategory !== selectedSubcategory) return false;
      if (selectedSku !== "all" && item.sku !== selectedSku) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.month.toLowerCase().includes(query) ||
          item.region.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.channel.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.subcategory.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedRegion, selectedCity, selectedChannel, selectedWarehouse, selectedCategory, selectedSubcategory, selectedSku, searchQuery]);

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
    return generateScenario(baseline, {
      ...whatIfParams,
      priceData: priceData.basePrice > 0 ? priceData : undefined
    }, filteredData);
  }, [filteredData, whatIfParams, priceData]);

  const validationResults = useMemo(() => {
    const actuals = filteredData.map(d => d.actual).filter(a => a !== null) as number[];
    const forecasts = filteredData.map(d => d.forecast).filter(f => f !== null) as number[];
    return validateForecast(actuals, forecasts);
  }, [filteredData]);

  const crossValidationResults = useMemo(() => {
    const values = filteredData.map(d => d.actual || d.forecast);
    return performCrossValidation(values);
  }, [filteredData]);

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
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Array.from(new Set(forecastData.map(item => item.category))).map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={selectedSubcategory} 
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === "all"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {selectedCategory !== "all" && 
                    Array.from(new Set(forecastData
                      .filter(item => item.category === selectedCategory)
                      .map(item => item.subcategory)))
                      .map(subcategory => (
                        <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
              <Select 
                value={selectedSku} 
                onValueChange={setSelectedSku}
                disabled={selectedSubcategory === "all"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="SKU" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SKUs</SelectItem>
                  {selectedSubcategory !== "all" && 
                    Array.from(new Set(forecastData
                      .filter(item => 
                        item.category === selectedCategory && 
                        item.subcategory === selectedSubcategory)
                      .map(item => item.sku)))
                      .map(sku => (
                        <SelectItem key={sku} value={sku}>{sku}</SelectItem>
                      ))
                  }
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
            <TabsTrigger value="validation">Forecast Validation</TabsTrigger>
            <TabsTrigger value="external">External Factors</TabsTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Base Price</label>
                    <Input
                      type="number"
                      value={priceData.basePrice}
                      onChange={(e) => setPriceData(prev => ({
                        ...prev,
                        basePrice: parseFloat(e.target.value)
                      }))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price Elasticity</label>
                    <Input
                      type="number"
                      value={priceData.elasticity}
                      onChange={(e) => setPriceData(prev => ({
                        ...prev,
                        elasticity: parseFloat(e.target.value)
                      }))}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Promotional Price</label>
                    <Input
                      type="number"
                      value={priceData.promotionalPrice || ''}
                      onChange={(e) => setPriceData(prev => ({
                        ...prev,
                        promotionalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                      }))}
                      min="0"
                      step="0.01"
                    />
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

          <TabsContent value="validation">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Forecast Validation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Statistical Tests</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className={`mr-2 ${validationResults.biasTest ? 'text-green-500' : 'text-red-500'}`}>
                        {validationResults.biasTest ? '✓' : '×'}
                      </span>
                      Bias Test
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${validationResults.residualNormality ? 'text-green-500' : 'text-red-500'}`}>
                        {validationResults.residualNormality ? '✓' : '×'}
                      </span>
                      Residual Normality
                    </li>
                    <li className="flex items-center">
                      <span className={`mr-2 ${validationResults.heteroskedasticityTest ? 'text-green-500' : 'text-red-500'}`}>
                        {validationResults.heteroskedasticityTest ? '✓' : '×'}
                      </span>
                      Heteroskedasticity Test
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cross Validation Results</h4>
                  <div className="space-y-2">
                    <p>Train MAPE: {crossValidationResults.trainMetrics.mape.toFixed(2)}%</p>
                    <p>Test MAPE: {crossValidationResults.testMetrics.mape.toFixed(2)}%</p>
                    <p>Validation MAPE: {crossValidationResults.validationMetrics.mape.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="external">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Weather Impact Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Location</label>
                      <div className="flex gap-2">
                        <Input 
                          value={weatherLocation}
                          onChange={(e) => setWeatherLocation(e.target.value)}
                          placeholder="Enter location"
                        />
                        <Button 
                          onClick={async () => {
                            try {
                              const data = await fetchWeatherForecast(weatherLocation);
                              setWeatherData(data);
                            } catch (error) {
                              toast({
                                title: "Error",
                                description: "Failed to fetch weather data",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Fetch Weather
                        </Button>
                      </div>
                    </div>
                    
                    {weatherData && (
                      <div className="space-y-2">
                        <p>Temperature: {weatherData.temperature}°C</p>
                        <p>Humidity: {weatherData.humidity}%</p>
                        <p>Wind Speed: {weatherData.windSpeed} km/h</p>
                        <p>Condition: {weatherData.weatherCondition}</p>
                        {weatherData.alert && (
                          <p className="text-red-500">Alert: {weatherData.alert}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Market Events</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1">Event Type</label>
                        <Select 
                          value={newEvent.type}
                          onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value as MarketEvent['type'] }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {marketEventTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Category</label>
                        <Select 
                          value={newEvent.category}
                          onValueChange={(value) => setNewEvent(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {marketEventCategories.map(category => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Event Name</label>
                      <Input 
                        value={newEvent.name || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter event name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Date</label>
                      <Input 
                        type="date"
                        value={newEvent.date || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Impact (-1 to 1)</label>
                      <Input 
                        type="number"
                        min="-1"
                        max="1"
                        step="0.1"
                        value={newEvent.impact || 0}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, impact: parseFloat(e.target.value) }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Description</label>
                      <textarea 
                        className="w-full p-2 border rounded"
                        value={newEvent.description || ''}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter event description"
                      />
                    </div>

                    <Button 
                      onClick={() => {
                        if (newEvent.name && newEvent.date) {
                          setMarketEvents(prev => [...prev, { 
                            ...newEvent as MarketEvent,
                            id: Math.random().toString(36).substr(2, 9)
                          }]);
                          setNewEvent({
                            type: 'competitor_action',
                            category: 'pricing',
                            impact: 0
                          });
                        }
                      }}
                    >
                      Add Market Event
                    </Button>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Recorded Events</h4>
                    <div className="space-y-2">
                      {marketEvents.map(event => (
                        <div key={event.id} className="p-2 border rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{event.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setMarketEvents(prev => prev.filter(e => e.id !== event.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">{event.date} - {event.type}</p>
                          <p className="text-sm">{event.description}</p>
                          <p className="text-sm font-medium">Impact: {event.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
