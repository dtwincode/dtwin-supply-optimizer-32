
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

export const WhatIfScenarios = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [priceChange, setPriceChange] = useState([0]);
  const [marketingIncrease, setMarketingIncrease] = useState([0]);
  const [distributionExpansion, setDistributionExpansion] = useState([0]);

  const calculateImpact = () => {
    // Simple calculation for demo purposes
    const priceElasticity = -1.2; // Negative elasticity: price up, demand down
    const marketingEfficiency = 0.7; // Marketing efficiency factor
    const distributionReach = 0.5; // Distribution reach factor
    
    const priceImpact = priceChange[0] * priceElasticity;
    const marketingImpact = marketingIncrease[0] * marketingEfficiency;
    const distributionImpact = distributionExpansion[0] * distributionReach;
    
    const totalImpact = priceImpact + marketingImpact + distributionImpact;
    
    return totalImpact.toFixed(1);
  };

  const handleRunScenario = () => {
    const impact = calculateImpact();
    const direction = Number(impact) >= 0 ? 'increase' : 'decrease';
    const absImpact = Math.abs(Number(impact));
    
    toast({
      title: language === 'ar' ? 'نتائج السيناريو' : 'Scenario Results',
      description: language === 'ar' 
        ? `سيؤدي هذا إلى ${direction === 'increase' ? 'زيادة' : 'انخفاض'} المبيعات بنسبة ${absImpact}٪`
        : `This would ${direction} sales by ${absImpact}%`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="price-slider">
            {language === 'ar' ? 'تغيير السعر (٪)' : 'Price Change (%)'}
          </Label>
          <span className="text-sm font-medium">{priceChange[0]}%</span>
        </div>
        <Slider 
          id="price-slider"
          min={-20} 
          max={20} 
          step={1} 
          value={priceChange} 
          onValueChange={setPriceChange} 
          className="py-4"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="marketing-slider">
            {language === 'ar' ? 'زيادة التسويق (٪)' : 'Marketing Increase (%)'}
          </Label>
          <span className="text-sm font-medium">{marketingIncrease[0]}%</span>
        </div>
        <Slider 
          id="marketing-slider"
          min={0} 
          max={50} 
          step={5} 
          value={marketingIncrease} 
          onValueChange={setMarketingIncrease}
          className="py-4"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="distribution-slider">
            {language === 'ar' ? 'توسع التوزيع (٪)' : 'Distribution Expansion (%)'}
          </Label>
          <span className="text-sm font-medium">{distributionExpansion[0]}%</span>
        </div>
        <Slider 
          id="distribution-slider"
          min={0} 
          max={30} 
          step={5} 
          value={distributionExpansion} 
          onValueChange={setDistributionExpansion}
          className="py-4"
        />
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center pb-2">
          <span className="text-sm font-medium">
            {language === 'ar' ? 'تأثير متوقع على المبيعات' : 'Expected Sales Impact'}:
          </span>
          <span className={`text-sm font-bold ${Number(calculateImpact()) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {calculateImpact()}%
          </span>
        </div>
        <Button 
          onClick={handleRunScenario} 
          className="w-full"
        >
          {language === 'ar' ? 'تشغيل السيناريو' : 'Run Scenario'}
        </Button>
      </div>
    </div>
  );
};
