// Weather data interfaces
export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert?: string | null;
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

// Mock weather data for fallback
const getMockWeatherData = (location: string): WeatherData => {
  console.log(`Generating mock weather data for: ${location}`);
  
  // Create realistic mock data based on location
  const mockData: Record<string, WeatherData> = {
    "riyadh": {
      temperature: 38,
      precipitation: 0,
      humidity: 15,
      windSpeed: 12,
      weatherCondition: "clear sky",
      location: "Riyadh",
      timestamp: new Date().toISOString()
    },
    "london": {
      temperature: 18,
      precipitation: 2.1,
      humidity: 75,
      windSpeed: 14,
      weatherCondition: "light rain",
      location: "London",
      timestamp: new Date().toISOString()
    },
    "new york": {
      temperature: 24,
      precipitation: 0,
      humidity: 55,
      windSpeed: 10,
      weatherCondition: "partly cloudy",
      location: "New York",
      timestamp: new Date().toISOString()
    },
    "tokyo": {
      temperature: 26,
      precipitation: 5,
      humidity: 70,
      windSpeed: 8,
      weatherCondition: "rain shower",
      location: "Tokyo",
      timestamp: new Date().toISOString()
    },
    "sydney": {
      temperature: 22,
      precipitation: 0,
      humidity: 65,
      windSpeed: 15,
      weatherCondition: "clear sky",
      location: "Sydney",
      timestamp: new Date().toISOString()
    }
  };
  
  // Default data if specific location not found
  const defaultData: WeatherData = {
    temperature: 25,
    precipitation: 0,
    humidity: 50,
    windSpeed: 10,
    weatherCondition: "clear sky",
    location: location,
    timestamp: new Date().toISOString()
  };
  
  // Try to find exact match first
  const normalizedLocation = location.toLowerCase().trim();
  
  // Look for partial matches if no exact match
  for (const key in mockData) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return {
        ...mockData[key],
        location: location // Use the user-provided location name
      };
    }
  }
  
  return defaultData;
};

export const fetchWeatherForecast = async (location: string): Promise<WeatherData> => {
  try {
    console.log(`Fetching weather data for location: ${location}`);
    
    // Using OpenWeatherMap API which has generous free tier
    const apiKey = "ad8e39f50f0c5a59747c8d1a3a242f25"; // Free API key for demo purposes
    
    // First try with the real API
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Ensure we're not getting cached responses
          // Add a timeout to avoid long waiting times
          signal: AbortSignal.timeout(5000)
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Weather API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Weather API response for", location, ":", data);
      
      // Map the OpenWeatherMap response to our WeatherData interface
      const weatherData: WeatherData = {
        temperature: data.main.temp,
        precipitation: data.rain ? data.rain["1h"] || 0 : 0,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0].description,
        alert: data.alerts ? data.alerts[0]?.description : null,
        location: data.name, // Ensure we use the normalized location name returned by the API
        timestamp: new Date().toISOString()
      };
      
      console.log("Processed weather data:", weatherData);
      return weatherData;
    } catch (apiError) {
      console.warn("API fetch failed, using mock data instead:", apiError);
      // If API call fails, fall back to mock data
      return getMockWeatherData(location);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Still provide mock data even if everything fails
    return getMockWeatherData(location);
  }
};
