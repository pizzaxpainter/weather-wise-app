
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import Forecast from './Forecast';
import { getCurrentWeather, getForecast, WeatherData, ForecastData } from '@/services/WeatherService';
import { getBackgroundClass } from '@/utils/weatherUtils';
import { useToast } from "@/hooks/use-toast";
import { MapPin } from 'lucide-react';
import { Button } from './ui/button';

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>('New York');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [geolocating, setGeolocating] = useState<boolean>(false);
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
        
        toast({
          title: "Updated",
          description: `Weather data for ${weather.name} has been updated.`,
        });
      }
      
      if (forecast) {
        setForecastData(forecast);
      }
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: error.message || "Unable to fetch weather data. Please try again.",
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

  const detectUserLocation = () => {
    setGeolocating(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      setGeolocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Get city name from coordinates using reverse geocoding
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          
          const data = await response.json();
          console.log("Geocoding response:", data);
          
          // Extract city name
          const detectedCity = data.city || data.locality || data.principalSubdivision;
          
          if (detectedCity) {
            setCity(detectedCity);
            await fetchWeatherData();
            toast({
              title: "Location detected",
              description: `Weather for ${detectedCity}`,
            });
          } else {
            toast({
              title: "Location detection failed",
              description: "Could not determine your city. Please search manually.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error detecting location:', error);
          toast({
            title: "Error",
            description: "Failed to detect your location. Please try again.",
            variant: "destructive"
          });
        } finally {
          setGeolocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to access your location. Please check your settings.",
          variant: "destructive"
        });
        setGeolocating(false);
      },
      { timeout: 15000, enableHighAccuracy: true }
    );
  };

  return (
    <div className={`min-h-screen ${backgroundClass} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">WeatherWise</h1>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-8">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
          <Button 
            onClick={detectUserLocation} 
            disabled={geolocating || loading}
            className="w-full md:w-auto bg-white/20 hover:bg-white/30">
            <MapPin className="h-4 w-4 mr-2" />
            {geolocating ? 'Detecting...' : 'Use My Location'}
          </Button>
        </div>
        
        {loading || geolocating ? (
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
