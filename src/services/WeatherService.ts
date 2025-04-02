
// API key for OpenWeatherMap
const API_KEY = ''; // You would need to get your own API key

// Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Interface for weather data
export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  cod: number;
  message?: string;
}

// Interface for forecast data
export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
      pressure: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
  cod: number;
  message?: string;
}

// Get current weather by city name
export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    if (!API_KEY) {
      console.warn("No API key provided for weather service");
      return getMockWeatherData();
    }

    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod !== 200) {
      throw new Error(data.message || 'Failed to fetch weather data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return getMockWeatherData();
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string): Promise<ForecastData | null> => {
  try {
    if (!API_KEY) {
      console.warn("No API key provided for weather service");
      return getMockForecastData();
    }
    
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod !== "200") {
      throw new Error(data.message || 'Failed to fetch forecast data');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return getMockForecastData();
  }
};

// Mock data for development without an API key
const getMockWeatherData = (): WeatherData => {
  return {
    main: {
      temp: 22.5,
      feels_like: 23.2,
      temp_min: 21.0,
      temp_max: 24.8,
      humidity: 65,
      pressure: 1012
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d"
      }
    ],
    wind: {
      speed: 3.6,
      deg: 220
    },
    name: "New York",
    dt: Date.now() / 1000,
    sys: {
      country: "US",
      sunrise: Date.now() / 1000 - 3600,
      sunset: Date.now() / 1000 + 3600
    },
    cod: 200
  };
};

// Mock forecast data
const getMockForecastData = (): ForecastData => {
  const list = [];
  const now = Date.now();
  
  // Create 5 days forecast with 3-hour intervals
  for (let i = 0; i < 40; i++) {
    list.push({
      dt: now / 1000 + i * 3 * 3600,
      main: {
        temp: 20 + Math.random() * 10,
        feels_like: 21 + Math.random() * 10,
        temp_min: 19 + Math.random() * 5,
        temp_max: 24 + Math.random() * 5,
        humidity: 60 + Math.random() * 20,
        pressure: 1010 + Math.random() * 10
      },
      weather: [
        {
          id: i % 5 === 0 ? 500 : 800,
          main: i % 5 === 0 ? "Rain" : "Clear",
          description: i % 5 === 0 ? "light rain" : "clear sky",
          icon: i % 5 === 0 ? "10d" : "01d"
        }
      ],
      wind: {
        speed: 3 + Math.random() * 5,
        deg: Math.random() * 360
      },
      dt_txt: new Date(now + i * 3 * 3600 * 1000).toISOString()
    });
  }
  
  return {
    list,
    city: {
      name: "New York",
      country: "US"
    },
    cod: 200
  };
};
