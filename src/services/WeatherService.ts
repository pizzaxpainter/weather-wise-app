const API_KEY = '81f72b66aa3fa7fb237f495849d61683';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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
  sys: {
    country: string;
  };
  cod: number;
  message?: string;
}

export interface ForecastData {
  list: Array<{
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
  }>;
  city: {
    name: string;
    country: string;
  };
  cod: number;
  message?: string;
}

export const getCityInfo = (city: string): { countryCode: string } => {
  const cityMapping: { [key: string]: { countryCode: string } } = {
    'Singapore': { countryCode: 'SG' },
    'New York': { countryCode: 'US' },
    'London': { countryCode: 'GB' },
    'Tokyo': { countryCode: 'JP' },
    'Paris': { countryCode: 'FR' },
    'Sydney': { countryCode: 'AU' },
    'Berlin': { countryCode: 'DE' },
    'Moscow': { countryCode: 'RU' },
    'Beijing': { countryCode: 'CN' },
    'Dubai': { countryCode: 'AE' },
    'Delhi': { countryCode: 'IN' },
    'Jakarta': { countryCode: 'ID' },
    'Bangkok': { countryCode: 'TH' },
    'Hanoi': { countryCode: 'VN' },
    'Manila': { countryCode: 'PH' },
    'Kuala Lumpur': { countryCode: 'MY' },
    'Ho Chi Minh City': { countryCode: 'VN' },    
  };

  return cityMapping[city] || { countryCode: 'SG' };
};

const getCityTemperatureRange = (city: string): { avg: number; min: number; max: number } => {
  const tempMapping: { [key: string]: { avg: number; min: number; max: number } } = {
    'Singapore': { avg: 32, min: 28, max: 34 },
    'New York': { avg: 22, min: 18, max: 26 },
    'London': { avg: 18, min: 14, max: 22 },
    'Tokyo': { avg: 25, min: 21, max: 28 },
    'Paris': { avg: 20, min: 16, max: 24 },
    'Sydney': { avg: 26, min: 22, max: 30 },
    'Berlin': { avg: 19, min: 15, max: 23 },
    'Moscow': { avg: 15, min: 10, max: 20 },
    'Beijing': { avg: 27, min: 23, max: 31 },
    'Dubai': { avg: 36, min: 32, max: 40 },
  };

  return tempMapping[city] || { avg: 22, min: 18, max: 26 };
};

export const getCurrentWeather = async (city: string): Promise<WeatherData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    if (data.cod !== 200) {
      console.error('Error fetching weather data:', data.message);
      return getMockWeatherData(city);
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return getMockWeatherData(city);
  }
};

export const getForecast = async (city: string): Promise<ForecastData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    if (data.cod !== "200") {
      console.error('Error fetching forecast:', data.message);
      return getMockForecastData(city);
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return getMockForecastData(city);
  }
};

export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    if (data.cod !== 200) {
      console.error('Error fetching coordinates weather:', data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    const data = await response.json();
    if (data.cod !== "200") {
      console.error('Error fetching coordinates forecast:', data.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const getMockWeatherData = (city: string): WeatherData => {
  const { countryCode } = getCityInfo(city);
  const tempRange = getCityTemperatureRange(city);

  return {
    main: {
      temp: tempRange.avg,
      feels_like: tempRange.avg + (Math.random() * 2 - 1),
      temp_min: tempRange.min,
      temp_max: tempRange.max,
      humidity: 65,
      pressure: 1012
    },
    weather: [{
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d"
    }],
    wind: {
      speed: 3.6,
      deg: 220
    },
    name: city,
    sys: {
      country: countryCode
    },
    cod: 200
  };
};

const getMockForecastData = (city: string): ForecastData => {
  const list = [];
  const { countryCode } = getCityInfo(city);
  const tempRange = getCityTemperatureRange(city);

  for (let i = 0; i < 40; i++) {
    const dayNumber = Math.floor(i / 8);
    const isRainy = city === 'Singapore' ? (dayNumber === 0 || dayNumber === 2) : (i % 5 === 0);

    list.push({
      main: {
        temp: tempRange.min + Math.random() * (tempRange.max - tempRange.min),
        feels_like: tempRange.min + Math.random() * (tempRange.max - tempRange.min) + 1,
        temp_min: tempRange.min - Math.random() * 2,
        temp_max: tempRange.max + Math.random() * 2,
        humidity: 60 + Math.random() * 20,
        pressure: 1010 + Math.random() * 10
      },
      weather: [{
        id: isRainy ? 500 : 800,
        main: isRainy ? "Rain" : "Clear",
        description: isRainy ? "light rain" : "clear sky",
        icon: isRainy ? "10d" : "01d"
      }],
      wind: {
        speed: 3 + Math.random() * 5,
        deg: Math.random() * 360
      }
    });
  }

  return {
    list,
    city: {
      name: city,
      country: countryCode
    },
    cod: 200
  };
};