
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import { getCurrentWeather, getForecast, WeatherData, ForecastData } from '@/services/WeatherService';
import { getBackgroundClass } from '@/utils/weatherUtils';
import { useToast } from "@/hooks/use-toast";

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>('New York');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [backgroundClass, setBackgroundClass] = useState<string>('bg-gradient-to-b from-day-clear to-blue-300');
  const { toast } = useToast();

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    if (!city) return;

    setLoading(true);
    try {
      const weather = await getCurrentWeather(city);
      const forecast = await getForecast(city);
      
      if (weather) {
        setWeatherData(weather);
        // Set background based on weather condition and time
        const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
        setBackgroundClass(getBackgroundClass(weather.weather[0].main, isDay));
      }
      
      if (forecast) {
        setForecastData(forecast);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchCity: string) => {
    setCity(searchCity);
    fetchWeatherData();
  };

  return (
    <div className={`min-h-screen ${backgroundClass} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">WeatherWise</h1>
        
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {weatherData && <CurrentWeather data={weatherData} />}
            {forecastData && <Forecast data={forecastData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
