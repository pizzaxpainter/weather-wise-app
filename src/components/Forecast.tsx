
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ForecastData } from '@/services/WeatherService';
import { groupForecastByDay } from '@/utils/weatherUtils';
import ForecastCard from './ForecastCard';

interface ForecastProps {
  data: ForecastData | null;
}

const Forecast: React.FC<ForecastProps> = ({ data }) => {
  if (!data || !data.list) return null;

  // Group forecast by day and limit to next 5 days
  const groupedForecast = groupForecastByDay(data.list).slice(0, 5);

  return (
    <Card className="w-full bg-white/10 border-white/10 text-white">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {groupedForecast.map((forecast) => (
            <ForecastCard key={forecast.date} forecast={forecast} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forecast;
