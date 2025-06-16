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

  const WeatherIcon = getWeatherIcon(data.weather[0].description, true);

  const outfitRecommendation = getOutfitRecommendation(
    data.main.temp,
    data.weather[0].main,
    true
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
              <p className="text-xl mb-4">
                Feels like {formatTemperature(data.main.feels_like)}
              </p>

              {/* Transparent, shiny/shimmery button */}
              <div className="flex justify-center md:justify-end">
              <Button
                onClick={handleShowOutfit}
                disabled={showOutfitRecommendation}
                className="
                  relative group
                  border border-white/60
                  bg-transparent
                  text-white
                  font-semibold
                  px-8 py-4
                  rounded-xl
                  overflow-hidden
                  transition-transform duration-300
                  hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-white/70
                  shadow-md
                "
              >
                <div className="flex items-center gap-3 relative z-10">
                  <ShirtIcon className="w-6 h-6" />
                  <span className="text-shadow">What to Wear</span>
                </div>
                {/* Shimmer effect */}
                <span
                  className="
                    absolute top-0 left-[-75%] h-full w-1/3
                    bg-gradient-to-r from-transparent via-white/60 to-transparent
                    opacity-0 group-hover:opacity-100
                    group-hover:left-[120%]
                    transition-all duration-700 delay-200
                    rotate-12
                    pointer-events-none
                    z-0
                  "
                />
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

      {/* Add this global style once in your app (e.g., index.css) */}
      <style>
        {`
          .text-shadow {
            text-shadow: 0 2px 6px rgba(0,0,0,0.6);
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2.5s infinite;
          }
        `}
      </style>
    </>
  );
};

export default CurrentWeather;
