
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatTemperature, formatTime, getWeatherIcon, isDaytime } from '@/utils/weatherUtils';
import { WeatherData } from '@/services/WeatherService';
import { Wind, Droplets, ThermometerSun } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  if (!data) return null;

  const isDay = isDaytime(data.dt, data.sys.sunrise, data.sys.sunset);
  const WeatherIcon = getWeatherIcon(data.weather[0].description, isDay);
  const date = new Date(data.dt * 1000);
  const formattedTime = formatTime(date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="w-full bg-white/10 border-white/10 text-white mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold flex items-center">
              {data.name}, {data.sys.country}
            </h2>
            <p className="text-lg opacity-80">{formattedDate} | {formattedTime}</p>
            <div className="flex items-center mt-4">
              <WeatherIcon className="w-12 h-12 mr-2" />
              <div>
                <p className="text-2xl capitalize">{data.weather[0].description}</p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-6xl font-bold">
              {formatTemperature(data.main.temp)}
            </p>
            <p className="text-xl">
              Feels like {formatTemperature(data.main.feels_like)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="flex items-center">
            <ThermometerSun className="w-6 h-6 mr-2" />
            <div>
              <p className="text-sm opacity-80">Min / Max</p>
              <p className="font-semibold">
                {formatTemperature(data.main.temp_min)} / {formatTemperature(data.main.temp_max)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Wind className="w-6 h-6 mr-2" />
            <div>
              <p className="text-sm opacity-80">Wind</p>
              <p className="font-semibold">{data.wind.speed} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Droplets className="w-6 h-6 mr-2" />
            <div>
              <p className="text-sm opacity-80">Humidity</p>
              <p className="font-semibold">{data.main.humidity}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
