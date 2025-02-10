
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type MarketEvent, type WeatherData, type PriceAnalysis } from "@/utils/forecasting";
import { marketEventTypes, marketEventCategories } from "@/constants/forecasting";
import { useToast } from "@/hooks/use-toast";

interface ExternalFactorsTabProps {
  weatherLocation: string;
  setWeatherLocation: (location: string) => void;
  weatherData: WeatherData | null;
  fetchWeatherForecast: (location: string) => Promise<WeatherData>;
  marketEvents: MarketEvent[];
  setMarketEvents: (events: MarketEvent[]) => void;
  newEvent: Partial<MarketEvent>;
  setNewEvent: (event: Partial<MarketEvent>) => void;
  priceAnalysis: PriceAnalysis | null;
  addHistoricalPricePoint: (price: number, demand: number) => void;
  calculatePriceAnalysis: () => void;
  historicalPriceData: { price: number; demand: number }[];
}

export const ExternalFactorsTab = ({
  weatherLocation,
  setWeatherLocation,
  weatherData,
  fetchWeatherForecast,
  marketEvents,
  setMarketEvents,
  newEvent,
  setNewEvent,
  priceAnalysis,
  addHistoricalPricePoint,
  calculatePriceAnalysis,
  historicalPriceData
}: ExternalFactorsTabProps) => {
  const { toast } = useToast();

  return (
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
                      toast({
                        title: "Success",
                        description: "Weather data fetched successfully",
                      });
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

        <div>
          <h3 className="text-lg font-semibold mb-4">Price Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Historical Price</label>
                <Input 
                  type="number"
                  placeholder="Enter price"
                  onChange={(e) => {
                    const price = parseFloat(e.target.value);
                    const demand = historicalPriceData.length > 0 
                      ? historicalPriceData[historicalPriceData.length - 1].demand 
                      : 0;
                    if (!isNaN(price)) {
                      addHistoricalPricePoint(price, demand);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Historical Demand</label>
                <Input 
                  type="number"
                  placeholder="Enter demand"
                  onChange={(e) => {
                    const demand = parseFloat(e.target.value);
                    const price = historicalPriceData.length > 0 
                      ? historicalPriceData[historicalPriceData.length - 1].price 
                      : 0;
                    if (!isNaN(demand)) {
                      addHistoricalPricePoint(price, demand);
                    }
                  }}
                />
              </div>
            </div>

            <Button onClick={calculatePriceAnalysis}>
              Analyze Price Sensitivity
            </Button>

            {priceAnalysis && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Price Analysis Results</h4>
                <div className="space-y-2">
                  <p>Price Elasticity: {priceAnalysis.priceElasticity.toFixed(2)}</p>
                  <p>Optimal Price: ${priceAnalysis.optimalPrice.toFixed(2)}</p>
                  <p>Price Range: ${priceAnalysis.priceThresholds.min.toFixed(2)} - ${priceAnalysis.priceThresholds.max.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
