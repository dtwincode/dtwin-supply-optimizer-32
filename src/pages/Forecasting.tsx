import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown } from "lucide-react";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateMetrics,
  calculateConfidenceIntervals,
  decomposeSeasonality,
  generateScenario,
  validateForecast,
  performCrossValidation,
  type WeatherData,
  type MarketEvent,
  fetchWeatherForecast,
  type PriceData,
  type PriceAnalysis,
  calculatePriceImpact,
  analyzePriceSensitivity
} from "@/utils/forecasting";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { ForecastFilters } from "@/components/forecasting/ForecastFilters";
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ScenarioManagement } from "@/components/forecasting/ScenarioManagement";
import { useToast } from "@/hooks/use-toast";
import { DecompositionTab } from "@/components/forecasting/tabs/DecompositionTab";
import { ValidationTab } from "@/components/forecasting/tabs/ValidationTab";
import { ExternalFactorsTab } from "@/components/forecasting/tabs/ExternalFactorsTab";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  forecastData as defaultForecastData,
  forecastingModels as defaultForecastingModels,
  savedScenarios as defaultSavedScenarios,
  regions as defaultRegions,
  cities as defaultCities,
  channelTypes as defaultChannelTypes,
  warehouses as defaultWarehouses
} from "@/constants/forecasting";

const forecastData = defaultForecastData;
const forecastingModels = defaultForecastingModels;
const savedScenarios = defaultSavedScenarios;
const regions = defaultRegions;
const cities = defaultCities;
const channelTypes = defaultChannelTypes;
const warehouses = defaultWarehouses;

const Forecasting = () => {
  const [selectedModel, setSelectedModel] = useState("moving-avg");
  const [horizon, setHorizon] = useState("12w");
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
  const [priceAnalysis, setPriceAnalysis] = useState<PriceAnalysis | null>(null);
  const [historicalPriceData, setHistoricalPriceData] = useState<{ price: number; demand: number }[]>([]);
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
          item.week.toLowerCase().includes(query) ||
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
      ["Week", "Actual", "Forecast", "Variance", "Region", "City", "Channel", "Category", "Subcategory", "SKU"],
      ...filteredData.map(d => [
        d.week,
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

  const handlePriceDataChange = (field: keyof PriceData, value: number) => {
    setPriceData(prev => ({
      ...prev,
      [field]: value
    }));

    setWhatIfParams(prev => ({
      ...prev,
      priceData: {
        ...priceData,
        [field]: value
      }
    }));
  };

  const calculatePriceAnalysis = () => {
    if (historicalPriceData.length > 0) {
      const analysis = analyzePriceSensitivity(historicalPriceData);
      setPriceAnalysis(analysis);
      
      setPriceData(prev => ({
        ...prev,
        elasticity: analysis.priceElasticity
      }));

      toast({
        title: "Price Analysis Updated",
        description: `Optimal price point: ${analysis.optimalPrice.toFixed(2)}`,
      });
    }
  };

  const addHistoricalPricePoint = (price: number, demand: number) => {
    setHistoricalPriceData(prev => [...prev, { price, demand }]);
  };

  const dataWithPriceImpact = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      forecast: priceData.basePrice > 0 
        ? calculatePriceImpact(item.forecast, priceData)
        : item.forecast
    }));
  }, [filteredData, priceData]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">
            Supply Chain Dashboard
          </h1>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Demand Forecasting</h2>
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
                  <SelectItem value="12w">12 Weeks</SelectItem>
                  <SelectItem value="24w">24 Weeks</SelectItem>
                  <SelectItem value="52w">52 Weeks</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <ForecastFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
            selectedWarehouse={selectedWarehouse}
            setSelectedWarehouse={setSelectedWarehouse}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedSku={selectedSku}
            setSelectedSku={setSelectedSku}
            regions={regions}
            cities={cities}
            channelTypes={channelTypes}
            warehouses={warehouses}
            forecastData={forecastData}
          />
        </div>

        <ForecastMetricsCards metrics={metrics} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="forecast">Forecast Analysis</TabsTrigger>
            <TabsTrigger value="decomposition">Pattern Analysis</TabsTrigger>
            <TabsTrigger value="scenarios">What-If Analysis</TabsTrigger>
            <TabsTrigger value="validation">Forecast Validation</TabsTrigger>
            <TabsTrigger value="external">External Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            <ForecastChart
              data={filteredData}
              confidenceIntervals={confidenceIntervals}
            />
          </TabsContent>

          <TabsContent value="decomposition">
            <DecompositionTab
              filteredData={filteredData}
              decomposition={decomposition}
            />
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
                        events: [...prev.events, { week: "", impact: 0 }]
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
                      week: d.week,
                      scenario: whatIfScenario[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
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
            <ValidationTab
              validationResults={validationResults}
              crossValidationResults={crossValidationResults}
            />
          </TabsContent>

          <TabsContent value="external">
            <ExternalFactorsTab
              weatherLocation={weatherLocation}
              setWeatherLocation={setWeatherLocation}
              weatherData={weatherData}
              fetchWeatherForecast={fetchWeatherForecast}
              marketEvents={marketEvents}
              setMarketEvents={setMarketEvents}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              priceAnalysis={priceAnalysis}
              addHistoricalPricePoint={addHistoricalPricePoint}
              calculatePriceAnalysis={calculatePriceAnalysis}
              historicalPriceData={historicalPriceData}
            />
          </TabsContent>
        </Tabs>

        <ScenarioManagement
          scenarioName={scenarioName}
          setScenarioName={setScenarioName}
          savedScenarios={savedScenarios}
          selectedScenario={selectedScenario}
          setSelectedScenario={setSelectedScenario}
        />
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
