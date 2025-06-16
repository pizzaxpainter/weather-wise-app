
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OutfitRecommendation as OutfitRecommendationType } from '@/utils/outfitRecommender';
import { Shirt, ShoppingBag, Package, Star } from 'lucide-react';

interface OutfitRecommendationProps {
  recommendation: OutfitRecommendationType | null;
  onClose: () => void;
}

const OutfitRecommendation: React.FC<OutfitRecommendationProps> = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  return (
    <Card className="w-full bg-white/10 border-white/10 text-white mb-6 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Outfit Recommendation</CardTitle>
          <CardDescription className="text-white/70">Based on current weather</CardDescription>
        </div>
        <button 
          onClick={onClose} 
          className="rounded-full p-1 hover:bg-white/10 transition-colors"
          aria-label="Close recommendation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shirt className="w-5 h-5 opacity-70" />
              <span className="font-medium">Top:</span>
              <span>{recommendation.topWear}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 opacity-70" />
              <span className="font-medium">Bottom:</span>
              <span>{recommendation.bottomWear}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 opacity-70" />
              <span className="font-medium">Footwear:</span>
              <span>{recommendation.footwear}</span>
            </div>
          </div>
          
          <div>
            {recommendation.accessories.length > 0 && (
              <div className="mb-2">
                <span className="font-medium">Accessories:</span>
                <ul className="list-disc ml-5">
                  {recommendation.accessories.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {recommendation.advice && (
              <div className="flex items-start gap-2 mt-3 bg-white/10 p-2 rounded">
                <Star className="w-5 h-5 text-yellow-300 mt-0.5" />
                <p className="text-sm">{recommendation.advice}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitRecommendation;
