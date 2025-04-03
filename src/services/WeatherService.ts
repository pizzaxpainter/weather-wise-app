// API key for OpenWeatherMap
const API_KEY = '3b53a0ce6bb5c2f8157cd4e3c819b81e'; // Valid OpenWeatherMap API key

// Base URL for OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// LLM API configuration
const LLM_API_URL = 'https://api.openai.com/v1/chat/completions';
const LLM_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key

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
  cod: string | number;
  message?: string;
}

// Interface for clothing recommendations
export interface ClothingRecommendation {
  outfit: string;
  accessories: string[];
  considerations: string;
}

// Get current weather by city name with real-time updates
export const getCurrentWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.cod !== 200) {
      console.error('Error fetching weather data:', data.message);
      throw new Error(`Weather API Error: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    // Only use mock data in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock weather data in development mode');
      return getMockWeatherData(city);
    }
    throw error;
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string): Promise<ForecastData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.cod !== "200" && data.cod !== 200) {
      console.error('Error fetching forecast data:', data.message);
      throw new Error(`Forecast API Error: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    // Only use mock data in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock forecast data in development mode');
      return getMockForecastData(city);
    }
    throw error;
  }
};

// Get clothing recommendations based on weather data using LLM
export const getClothingRecommendations = async (weatherData: WeatherData): Promise<ClothingRecommendation> => {
  try {
    const { temp, humidity } = weatherData.main;
    const { description } = weatherData.weather[0];
    const { speed: windSpeed } = weatherData.wind;
    const isDay = isItDaytime(weatherData.dt, weatherData.sys.sunrise, weatherData.sys.sunset);
    
    // Create a prompt for the LLM with relevant weather information
    const prompt = `
      Based on the following weather conditions:
      - Temperature: ${temp}°C (feels like ${weatherData.main.feels_like}°C)
      - Weather: ${description}
      - Humidity: ${humidity}%
      - Wind speed: ${windSpeed} m/s
      - Time of day: ${isDay ? 'Daytime' : 'Nighttime'}
      
      Provide a brief clothing recommendation in the following JSON format:
      {
        "outfit": "Brief description of appropriate clothing",
        "accessories": ["up to 3 recommended accessories or items"],
        "considerations": "Brief note about special considerations"
      }
    `;

    const response = await fetch(LLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides clothing recommendations based on weather conditions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Error getting LLM recommendations:', data.error);
      return getFallbackRecommendations(weatherData);
    }
    
    // Parse the JSON response from the LLM
    try {
      const content = data.choices[0].message.content;
      // Extract JSON from the response (handling cases where LLM might add context text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      return getFallbackRecommendations(weatherData);
    }
  } catch (error) {
    console.error('Error fetching clothing recommendations:', error);
    return getFallbackRecommendations(weatherData);
  }
};

// Combined function to get weather and clothing recommendations in one call
export const getWeatherWithRecommendations = async (city: string): Promise<{
  weather: WeatherData;
  forecast: ForecastData;
  clothingRecommendation: ClothingRecommendation;
}> => {
  // Use Promise.all to fetch weather and forecast concurrently
  const [weatherData, forecastData] = await Promise.all([
    getCurrentWeather(city),
    getForecast(city)
  ]);
  
  // Once we have weather data, get clothing recommendations
  const clothingRecommendation = await getClothingRecommendations(weatherData);
  
  return {
    weather: weatherData,
    forecast: forecastData,
    clothingRecommendation
  };
};

// Helper function to determine if it's daytime
const isItDaytime = (currentTime: number, sunrise: number, sunset: number): boolean => {
  return currentTime >= sunrise && currentTime <= sunset;
};

// Fallback recommendations when LLM API is unavailable
const getFallbackRecommendations = (weatherData: WeatherData): ClothingRecommendation => {
  const temp = weatherData.main.temp;
  const weatherType = weatherData.weather[0].main.toLowerCase();
  
  // Simple rule-based clothing recommendations
  if (temp < 0) {
    return {
      outfit: "Heavy winter coat with layers",
      accessories: ["Gloves", "Scarf", "Winter hat"],
      considerations: "Dress in multiple layers to trap heat"
    };
  } else if (temp < 10) {
    return {
      outfit: "Winter coat or heavy jacket",
      accessories: ["Light gloves", "Hat", "Scarf"],
      considerations: "Layer clothing for comfort as temperatures may vary"
    };
  } else if (temp < 20) {
    return {
      outfit: "Light jacket or sweater",
      accessories: ["Light scarf", "Closed shoes", "Umbrella if cloudy"],
      considerations: "Consider a light extra layer for evenings"
    };
  } else {
    return {
      outfit: "T-shirt and light pants/shorts",
      accessories: ["Sunglasses", "Hat", "Sunscreen"],
      considerations: weatherType.includes("rain") ? "Take an umbrella" : "Stay hydrated in warm weather"
    };
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
    cod: "200"
  };
};
