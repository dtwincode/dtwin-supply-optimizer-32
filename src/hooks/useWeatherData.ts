
import { useState } from "react";
import { type WeatherData } from '@/types/weatherAndEvents';

export const useWeatherData = () => {
  const [weatherLocation, setWeatherLocation] = useState("Riyadh");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const fetchWeatherForecast = async () => {
    try {
      console.log("Fetching weather forecast for:", weatherLocation);
      return {
        temperature: 25,
        precipitation: 0,
        humidity: 50,
        windSpeed: 10,
        weatherCondition: "sunny"
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };

  return {
    weatherLocation,
    setWeatherLocation,
    weatherData,
    fetchWeatherForecast
  };
};
