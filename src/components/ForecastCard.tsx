
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatTemperature, getWeatherIcon } from '@/utils/weatherUtils';
import { GroupedForecast } from '@/utils/weatherUtils';

interface ForecastCardProps {
  forecast: GroupedForecast;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const WeatherIcon = getWeatherIcon(forecast.condition, true);

  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardContent className="p-4">
        <p className="font-bold text-center">{forecast.day.slice(0, 3)}</p>
        <div className="flex justify-center my-2">
          <WeatherIcon className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-sm opacity-80">{forecast.condition}</p>
          <p className="font-semibold mt-1">
            {formatTemperature(forecast.maxTemp, false)}° / {formatTemperature(forecast.minTemp, false)}°
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
