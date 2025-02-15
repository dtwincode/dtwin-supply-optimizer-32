import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { type MarketEvent, type WeatherData, type PriceAnalysis } from '@/types/weatherAndEvents';
import { marketEventTypes, marketEventCategories } from '@/constants/forecasting';
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

  const handleEventUpdate = (field: keyof MarketEvent, value: any) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  return (
    <Card className="p-6 bg-background">
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
                  className="bg-background"
                />
                <Button 
                  onClick={async () => {
                    try {
                      await fetchWeatherForecast(weatherLocation);
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
                  onValueChange={(value: any) => handleEventUpdate('type', value)}>
                  <SelectTrigger className="w-full bg-background">
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
                  onValueChange={(value) => handleEventUpdate('category', value)}>
                  <SelectTrigger className="w-full bg-background">
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

            <div className="space-y-2">
              <label className="block text-sm mb-1">Event Details</label>
              <Input
                placeholder="Event Name"
                value={newEvent.name || ''}
                onChange={(e) => handleEventUpdate('name', e.target.value)}
                className="bg-background"
              />
              <Input
                type="date"
                value={newEvent.date || ''}
                onChange={(e) => handleEventUpdate('date', e.target.value)}
                className="bg-background"
              />
              <Input
                type="number"
                placeholder="Impact (-1 to 1)"
                min="-1"
                max="1"
                step="0.1"
                value={newEvent.impact || 0}
                onChange={(e) => handleEventUpdate('impact', parseFloat(e.target.value))}
                className="bg-background"
              />
              <textarea
                className="w-full p-2 border rounded bg-background"
                placeholder="Description"
                value={newEvent.description || ''}
                onChange={(e) => handleEventUpdate('description', e.target.value)}
              />
            </div>

            <Button 
              onClick={() => {
                if (newEvent.name && newEvent.date) {
                  setMarketEvents([...marketEvents, {
                    ...newEvent as MarketEvent,
                    id: crypto.randomUUID()
                  }]);
                  setNewEvent({});
                  toast({
                    title: "Success",
                    description: "Market event added successfully",
                  });
                } else {
                  toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive",
                  });
                }
              }}
            >
              Add Event
            </Button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Recorded Events</h4>
            <div className="space-y-2">
              {marketEvents.map(event => (
                <div key={event.id} className="p-2 border rounded bg-background">
                  <div className="flex justify-between">
                    <span className="font-medium">{event.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setMarketEvents(marketEvents.filter(e => e.id !== event.id));
                        toast({
                          title: "Success",
                          description: "Event removed successfully",
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.date} - {event.type}</p>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-sm font-medium">Impact: {event.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
