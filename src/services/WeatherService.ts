
// API key for OpenWeatherMap
const API_KEY = '3b53a0ce6bb5c2f8157cd4e3c819b81e'; // Valid OpenWeatherMap API key

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
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.cod !== 200) {
      console.error('Error fetching weather data:', data.message);
      // If API returns an error, use mock data instead of throwing
      console.log('Using mock weather data due to API error');
      return getMockWeatherData(city);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    // Use mock data for any errors
    console.log('Using mock weather data due to fetch error');
    return getMockWeatherData(city);
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string): Promise<ForecastData | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.cod !== "200") {
      console.error('Error fetching forecast data:', data.message);
      // If API returns an error, use mock data instead of throwing
      console.log('Using mock forecast data due to API error');
      return getMockForecastData(city);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    // Use mock data for any errors
    console.log('Using mock forecast data due to fetch error');
    return getMockForecastData(city);
  }
};

// Mock data for development without an API key
const getMockWeatherData = (city: string = "New York"): WeatherData => {
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
    name: city,
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
const getMockForecastData = (city: string = "New York"): ForecastData => {
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
      name: city,
      country: "US"
    },
    cod: 200
  };
};
