
import { useState, useCallback } from "react";
import { type WeatherData } from '@/types/weatherAndEvents';

export const useWeatherData = () => {
  const [weatherLocation, setWeatherLocation] = useState<string>("Riyadh");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeatherForecast = useCallback(async () => {
    try {
      console.log("Fetching weather forecast for:", weatherLocation);
      const mockWeatherData: WeatherData = {
        temperature: 25,
        precipitation: 0,
        humidity: 50,
        windSpeed: 10,
        weatherCondition: "sunny"
      };
      setWeatherData(mockWeatherData);
      return mockWeatherData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  }, [weatherLocation]);

  return {
    weatherLocation,
    setWeatherLocation,
    weatherData,
    fetchWeatherForecast
  };
};
