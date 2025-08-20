import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  CloudLightning,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import {
  fetchWeatherForecast,
  WeatherData,
  calculateWeatherImpact,
} from "@/utils/forecasting/weather";

interface WeatherLocation {
  name: string;
  impact: "high" | "medium" | "low";
  weather: WeatherData | null;
  delayRisk: number;
}

export const WeatherImpactAnalysis: React.FC = () => {
  const { language } = useLanguage();
  const [locations, setLocations] = useState<WeatherLocation[]>([
    { name: "Riyadh", impact: "low", weather: null, delayRisk: 5 },
    { name: "Jeddah", impact: "medium", weather: null, delayRisk: 25 },
    { name: "Dammam", impact: "low", weather: null, delayRisk: 10 },
    { name: "Mecca", impact: "low", weather: null, delayRisk: 8 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const updatedLocations = await Promise.all(
          locations.map(async (loc) => {
            try {
              const weather = await fetchWeatherForecast(loc.name);
              const impact =
                weather.weatherCondition.includes("rain") ||
                weather.weatherCondition.includes("storm")
                  ? "medium"
                  : weather.temperature > 40
                    ? "high"
                    : "low";

              return {
                ...loc,
                impact: impact as "high" | "medium" | "low",
                weather,
                delayRisk: calculateRisk(weather),
              };
            } catch (err) {
              console.error(`Error fetching weather for ${loc.name}:`, err);
              return loc;
            }
          })
        );
        setLocations(updatedLocations);
      } catch (error) {
        console.error("Error loading weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, []);

  const calculateRisk = (weather: WeatherData) => {
    if (!weather) return 0;

    let risk = 0;

    // Base risk from weather condition
    if (weather.weatherCondition.includes("rain")) risk += 20;
    if (
      weather.weatherCondition.includes("storm") ||
      weather.weatherCondition.includes("thunder")
    )
      risk += 40;
    if (weather.weatherCondition.includes("snow")) risk += 50;
    if (weather.weatherCondition.includes("fog")) risk += 30;

    // Wind impact
    if (weather.windSpeed > 30) risk += 25;
    else if (weather.windSpeed > 20) risk += 15;
    else if (weather.windSpeed > 10) risk += 5;

    // Temperature extremes
    if (weather.temperature > 45) risk += 20;
    else if (weather.temperature > 40) risk += 10;
    else if (weather.temperature < 0) risk += 15;

    return Math.min(risk, 100);
  };

  const getWeatherIcon = (weather: WeatherData | null) => {
    if (!weather) return <Cloud className="h-6 w-6" />;

    if (weather.weatherCondition.includes("rain")) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    } else if (
      weather.weatherCondition.includes("clear") ||
      weather.weatherCondition.includes("sun")
    ) {
      return <Sun className="h-6 w-6 text-amber-500" />;
    } else if (
      weather.weatherCondition.includes("storm") ||
      weather.weatherCondition.includes("thunder")
    ) {
      return <CloudLightning className="h-6 w-6 text-purple-500" />;
    } else if (weather.windSpeed > 20) {
      return <Wind className="h-6 w-6 text-cyan-500" />;
    } else {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">
          {getTranslation("logistics.weatherImpact", language) ||
            "Weather Impact Analysis"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locations.some((loc) => loc.delayRisk > 20) && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              {getTranslation("logistics.weatherAlert", language) ||
                "Weather conditions may affect deliveries in some regions"}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <div
              key={location.name}
              className="flex items-start space-x-4 p-4 border rounded-lg"
            >
              <div className="p-3 bg-gray-100 rounded-full">
                {getWeatherIcon(location.weather)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{location.name}</h3>
                  <Badge className={getImpactColor(location.impact)}>
                    {location.impact.charAt(0).toUpperCase() +
                      location.impact.slice(1)}{" "}
                    Impact
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {location.weather
                    ? `${location.weather.weatherCondition}, ${location.weather.temperature}°C`
                    : "Loading weather data..."}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Delay Risk</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        location.delayRisk > 50
                          ? "bg-red-600"
                          : location.delayRisk > 25
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${location.delayRisk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
