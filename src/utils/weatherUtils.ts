
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudSun, 
  Cloudy, 
  Moon,
  Sun, 
  Umbrella,
  Zap
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// Convert temperature from Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

// Format temperature to display
export const formatTemperature = (temp: number, showUnit = true): string => {
  return `${Math.round(temp)}${showUnit ? '°C' : ''}`;
};

// Format date to day name (e.g., "Monday")
export const formatToDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Format date to short day name (e.g., "Mon")
export const formatToShortDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Format time (e.g., "3:00 PM")
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Convert meter/sec to km/hr
export const msToKmh = (ms: number): number => {
  return ms * 3.6;
};

// Get weather icon based on weather condition and day/night
export const getWeatherIcon = (condition: string, isDay: boolean): LucideIcon => {
  const lowercaseCondition = condition.toLowerCase();

  if (lowercaseCondition.includes('thunderstorm')) {
    return Zap;
  } else if (lowercaseCondition.includes('drizzle') || lowercaseCondition.includes('rain')) {
    return CloudRain;
  } else if (lowercaseCondition.includes('snow')) {
    return CloudSnow;
  } else if (lowercaseCondition.includes('clear')) {
    return isDay ? Sun : Moon;
  } else if (lowercaseCondition.includes('clouds')) {
    if (lowercaseCondition.includes('few') || lowercaseCondition.includes('scattered')) {
      return isDay ? CloudSun : Cloudy;
    } else {
      return Cloud;
    }
  } else if (lowercaseCondition.includes('mist') || 
             lowercaseCondition.includes('fog') || 
             lowercaseCondition.includes('haze')) {
    return Cloud;
  } else {
    return isDay ? Sun : Moon;
  }
};

// Check if it's daytime based on sunrise and sunset
export const isDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt > sunrise && dt < sunset;
};

// Group forecast data by day
export interface GroupedForecast {
  date: string;
  day: string;
  icon: string;
  condition: string;
  minTemp: number;
  maxTemp: number;
  forecasts: any[];
}

export const groupForecastByDay = (forecastList: any[]): GroupedForecast[] => {
  const grouped: { [key: string]: any } = {};
  
  forecastList.forEach(forecast => {
    const date = new Date(forecast.dt * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    if (!grouped[dateStr]) {
      grouped[dateStr] = {
        date: dateStr,
        day: formatToDay(date),
        forecasts: [],
        minTemp: Infinity,
        maxTemp: -Infinity,
        icon: '',
        condition: ''
      };
    }
    
    grouped[dateStr].forecasts.push(forecast);
    grouped[dateStr].minTemp = Math.min(grouped[dateStr].minTemp, forecast.main.temp_min);
    grouped[dateStr].maxTemp = Math.max(grouped[dateStr].maxTemp, forecast.main.temp_max);
    
    // Use noon forecast for the day's weather icon if possible
    const hour = date.getHours();
    if (hour >= 11 && hour <= 13 || !grouped[dateStr].icon) {
      grouped[dateStr].icon = forecast.weather[0].icon;
      grouped[dateStr].condition = forecast.weather[0].main;
    }
  });
  
  return Object.values(grouped);
};

// Get background color class based on weather condition and time
export const getBackgroundClass = (condition: string, isDay: boolean): string => {
  const lowercaseCondition = condition.toLowerCase();
  
  if (lowercaseCondition.includes('thunderstorm')) {
    // Deep purple to dark gray
    return 'bg-gradient-to-b from-purple-800 via-gray-800 to-gray-900';
  } else if (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle')) {
    // Strong blue-gray to slate
    return 'bg-gradient-to-b from-blue-800 via-blue-700 to-slate-900';
  } else if (lowercaseCondition.includes('snow')) {
    // Blue-gray to indigo, not white!
    return 'bg-gradient-to-b from-blue-300 via-indigo-500 to-indigo-800';
  } else if (lowercaseCondition.includes('clear')) {
    return isDay
      // Vivid blue to sky, not pale!
      ? 'bg-gradient-to-b from-blue-700 via-blue-500 to-blue-300'
      // Deep navy to blue for night
      : 'bg-gradient-to-b from-gray-900 via-blue-900 to-blue-700';
  } else if (lowercaseCondition.includes('clouds')) {
    return isDay
      // Muted blue-gray for clouds, but not too light
      ? 'bg-gradient-to-b from-gray-400 via-gray-500 to-blue-700'
      // Night: deeper grays
      : 'bg-gradient-to-b from-gray-800 via-gray-700 to-blue-900';
  } else {
    // Default: neutral but readable
    return isDay
      ? 'bg-gradient-to-b from-gray-300 via-blue-400 to-blue-700'
      : 'bg-gradient-to-b from-gray-900 via-gray-800 to-blue-900';
  }
};
