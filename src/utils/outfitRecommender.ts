
// Define types for outfit recommendations
export interface OutfitRecommendation {
  topWear: string;
  bottomWear: string;
  footwear: string;
  accessories: string[];
  advice: string;
}

/**
 * Generate outfit recommendations based on weather conditions
 * @param temperature The current temperature in Celsius
 * @param weatherCondition The current weather condition (Clear, Rain, etc.)
 * @param isDay Whether it is currently daytime
 * @returns Outfit recommendations
 */
export const getOutfitRecommendation = (
  temperature: number,
  weatherCondition: string,
  isDay: boolean
): OutfitRecommendation => {
  const condition = weatherCondition.toLowerCase();
  let recommendation: OutfitRecommendation = {
    topWear: '',
    bottomWear: '',
    footwear: '',
    accessories: [],
    advice: '',
  };

  // Temperature-based recommendations
  if (temperature < 0) {
    recommendation.topWear = "Heavy winter coat with sweater or thermal";
    recommendation.bottomWear = "Insulated pants or jeans with thermal underwear";
    recommendation.footwear = "Insulated winter boots";
    recommendation.accessories = ["Scarf", "Gloves", "Beanie or winter hat"];
    recommendation.advice = "Layer up! Multiple thin layers trap heat better than one thick layer.";
  } else if (temperature < 10) {
    recommendation.topWear = "Winter coat or jacket with long sleeve shirt";
    recommendation.bottomWear = "Warm pants or jeans";
    recommendation.footwear = "Closed shoes or boots";
    recommendation.accessories = ["Light scarf", "Gloves"];
    recommendation.advice = "It's cold outside. Make sure to wear a proper jacket.";
  } else if (temperature < 20) {
    recommendation.topWear = "Light jacket or sweater";
    recommendation.bottomWear = "Jeans or casual pants";
    recommendation.footwear = "Sneakers or loafers";
    recommendation.accessories = ["Light scarf (optional)"];
    recommendation.advice = "Perfect weather for layering. Bring a light jacket that can be removed if it gets warm.";
  } else if (temperature < 30) {
    recommendation.topWear = "T-shirt or short sleeve shirt";
    recommendation.bottomWear = "Light pants or shorts";
    recommendation.footwear = "Sneakers or sandals";
    recommendation.accessories = [];
    recommendation.advice = "Comfortable weather. Light, breathable fabrics are ideal.";
  } else {
    recommendation.topWear = "Light, breathable shirt or tank top";
    recommendation.bottomWear = "Shorts or light skirt";
    recommendation.footwear = "Sandals or light shoes";
    recommendation.accessories = ["Hat"];
    recommendation.advice = "It's hot! Wear light-colored, loose-fitting clothing to stay cool.";
  }

  // Weather condition overrides
  if (condition.includes('rain') || condition.includes('drizzle')) {
    recommendation.topWear = "Waterproof jacket or raincoat" + (temperature < 15 ? " with layers" : "");
    recommendation.footwear = "Waterproof boots or shoes";
    recommendation.accessories.push("Umbrella");
    recommendation.advice += " Don't forget your umbrella and waterproof footwear!";
  } else if (condition.includes('snow')) {
    recommendation.topWear = "Waterproof and insulated coat";
    recommendation.bottomWear = "Waterproof pants";
    recommendation.footwear = "Waterproof winter boots with grip";
    recommendation.accessories.push("Waterproof gloves");
    recommendation.advice += " Wear waterproof clothing and footwear with good traction.";
  } else if (condition.includes('clear') && isDay && temperature > 15) {
    recommendation.accessories.push("Sunglasses", "Sunscreen");
    recommendation.advice += " Don't forget sun protection!";
  }

  return recommendation;
};
