
export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  weatherCondition: string;
  alert?: string;
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
  const apiKey = 'YOUR_WEATHER_API_KEY';
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    
    return {
      temperature: data.current.temp_c,
      precipitation: data.current.precip_mm,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      weatherCondition: data.current.condition.text,
      alert: data.alerts?.alert[0]?.desc
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
