import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Info } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { type MarketEvent, type WeatherData, type PriceAnalysis } from '@/types/weatherAndEvents';
import { marketEventTypes, marketEventCategories } from '@/constants/forecasting';
import { useToast } from "@/hooks/use-toast";
import React from "react";

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
  
  const sliderToImpact = (sliderValue: number): number => {
    return parseFloat(((sliderValue - 50) / 50).toFixed(2));
  };

  const impactToSlider = (impactValue: number): number => {
    return (impactValue * 50) + 50;
  };
  
  const formatImpactAsPercentage = (impact: number | undefined): string => {
    if (impact === undefined) return "0%";
    const percentage = Math.abs(impact * 100);
    return `${percentage.toFixed(0)}%`;
  };
  
  const [sliderValue, setSliderValue] = React.useState<number[]>([newEvent.impact ? impactToSlider(newEvent.impact) : 50]);

  const handleEventUpdate = (field: keyof MarketEvent, value: any) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  React.useEffect(() => {
    if (newEvent.impact !== undefined) {
      setSliderValue([impactToSlider(newEvent.impact)]);
    } else {
      setSliderValue([50]);
    }
  }, [newEvent.impact]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const impactValue = sliderToImpact(value[0]);
    handleEventUpdate('impact', impactValue);
    
    const formattedImpact = formatImpactAsPercentage(impactValue);
    
    if (Math.abs(impactValue) % 0.1 < 0.02) {
      toast({
        title: "Impact Updated",
        description: impactValue < 0 
          ? `Decrease demand by ${formattedImpact}` 
          : impactValue > 0 
            ? `Increase demand by ${formattedImpact}` 
            : "No impact on demand",
        duration: 1500,
      });
    }
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
              
              <div className="space-y-1 mt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Label className="mr-2 font-medium text-base">Expected Impact on Demand</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Adjust the slider to indicate the expected impact:</p>
                          <ul className="list-disc list-inside mt-1 text-xs">
                            <li>Left side (red): Decrease in demand</li>
                            <li>Center: No impact (0%)</li>
                            <li>Right side (green): Increase in demand</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="font-medium text-base">
                    {sliderValue[0] === 50
                      ? "No impact" 
                      : sliderValue[0] < 50
                        ? `${formatImpactAsPercentage(sliderToImpact(sliderValue[0]))} decrease`
                        : `${formatImpactAsPercentage(sliderToImpact(sliderValue[0]))} increase`
                    }
                  </span>
                </div>
                
                <div className="pt-6 px-1 pb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-500 font-medium">-100%</span>
                    <span className="font-medium">No Impact</span>
                    <span className="text-green-500 font-medium">+100%</span>
                  </div>
                  
                  <div className="py-6">
                    <div className="relative group">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-gray-200 to-green-500 opacity-40 h-4"></div>
                      
                      <Slider
                        value={sliderValue}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleSliderChange}
                        aria-label="Impact on demand percentage"
                        className="my-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Textarea
                className="w-full p-2 border rounded bg-background mt-4"
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
                  <p className="text-sm font-medium">
                    Impact: 
                    <span className={event.impact < 0 ? "text-red-500" : event.impact > 0 ? "text-green-500" : ""}>
                      {event.impact === 0 
                        ? " None" 
                        : event.impact < 0 
                          ? ` ${formatImpactAsPercentage(event.impact)} decrease`
                          : ` ${formatImpactAsPercentage(event.impact)} increase`
                      }
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
