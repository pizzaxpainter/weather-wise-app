import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatTemperature, getWeatherIcon } from '@/utils/weatherUtils';
import { WeatherData } from '@/services/WeatherService';
import { Wind, Droplets, ThermometerSun, ShirtIcon } from 'lucide-react';
import { getOutfitRecommendation } from '@/utils/outfitRecommender';
import OutfitRecommendation from './OutfitRecommendation';
import { useToast } from "@/hooks/use-toast";

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const [showOutfitRecommendation, setShowOutfitRecommendation] = useState(false);
  const { toast } = useToast();

  if (!data) return null;

  // No dt, sunrise, sunset available, so skip time and day/night logic
  // Use the first weather description for icon
  const WeatherIcon = getWeatherIcon(data.weather[0].description, true); // Assume daytime or ignore

  const outfitRecommendation = getOutfitRecommendation(
    data.main.temp,
    data.weather[0].main,
    true // Assume daytime or ignore
  );

  const handleShowOutfit = () => {
    setShowOutfitRecommendation(true);
    toast({
      title: "Outfit Recommended",
      description: "Check out your personalized outfit suggestion based on current weather.",
    });
  };

  const handleHideOutfit = () => setShowOutfitRecommendation(false);

  return (
    <>
      {showOutfitRecommendation && (
        <OutfitRecommendation
          recommendation={outfitRecommendation}
          onClose={handleHideOutfit}
        />
      )}

      <Card className="w-full bg-white/10 border-white/10 text-white mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold flex items-center">
                {data.name}, {data.sys.country}
              </h2>
              {/* No date/time display since dt is missing */}
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
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button
                  onClick={handleShowOutfit}
                  className="bg-white/20 hover:bg-white/30"
                  disabled={showOutfitRecommendation}
                >
                  <ShirtIcon className="w-4 h-4 mr-2" />
                  What to Wear
                </Button>
              </div>
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
    </>
  );
};

export default CurrentWeather;
