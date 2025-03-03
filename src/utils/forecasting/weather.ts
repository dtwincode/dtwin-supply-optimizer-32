
// Weather data interfaces
export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert?: string;
  location?: string;
  timestamp?: string;
}

export interface WeatherPattern {
  location: string;
  date: string;
  forecast: WeatherData;
  historicalAverage?: WeatherData;
  impactScore: number;
}

export const calculateWeatherImpact = (weatherData: WeatherData, productCategory: string): number => {
  let impactScore = 0;
  
  switch (productCategory.toLowerCase()) {
    case 'beverages':
      impactScore += (weatherData.temperature - 20) * 0.05;
      break;
    case 'winter clothing':
      impactScore -= weatherData.temperature * 0.03;
      break;
    case 'electronics':
      if (weatherData.humidity > 80) impactScore -= 0.2;
      break;
    default:
      if (weatherData.weatherCondition === 'rainy') impactScore -= 0.1;
      if (weatherData.weatherCondition === 'sunny') impactScore += 0.1;
  }
  
  return Math.max(-1, Math.min(1, impactScore));
};

export const fetchWeatherForecast = async (location: string): Promise<WeatherData> => {
  try {
    // Using OpenWeatherMap API which has generous free tier
    const apiKey = "ad8e39f50f0c5a59747c8d1a3a242f25"; // Free API key for demo purposes
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Weather API response:", data);
    
    // Map the OpenWeatherMap response to our WeatherData interface
    return {
      temperature: data.main.temp,
      precipitation: data.rain ? data.rain["1h"] || 0 : 0,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherCondition: data.weather[0].description,
      alert: data.alerts ? data.alerts[0]?.description : null,
      location: data.name,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
