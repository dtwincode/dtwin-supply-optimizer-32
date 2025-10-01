
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { HelpCircle, Save } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const WhatIfScenarios = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [priceChange, setPriceChange] = useState([0]);
  const [marketingIncrease, setMarketingIncrease] = useState([0]);
  const [distributionExpansion, setDistributionExpansion] = useState([0]);
  const [scenarioName, setScenarioName] = useState("");
  const [savedScenarios, setSavedScenarios] = useState<Array<{
    name: string,
    price: number,
    marketing: number,
    distribution: number,
    impact: number
  }>>([]);

  // Generate chart data based on what-if parameters
  const generateChartData = () => {
    const baselineData = [100, 105, 110, 108, 112, 115];
    const data: Array<{ month: number; baseline: number; scenario: number }> = [];

    for (let i = 0; i < 6; i++) {
      // Simple simulation calculations
      const priceImpact = baselineData[i] * (priceChange[0] * -0.012); // Price elasticity
      const marketingImpact = baselineData[i] * (marketingIncrease[0] * 0.007); // Marketing efficiency
      const distributionImpact = baselineData[i] * (distributionExpansion[0] * 0.005); // Distribution reach
      
      const scenarioValue = baselineData[i] + priceImpact + marketingImpact + distributionImpact;
      
      data.push({
        month: i + 1,
        baseline: baselineData[i],
        scenario: Math.round(scenarioValue)
      });
    }
    
    return data;
  };

  const calculateImpact = () => {
    // Improved calculation with more accurate elasticity factors
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

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your scenario",
        variant: "destructive"
      });
      return;
    }

    const newScenario = {
      name: scenarioName,
      price: priceChange[0],
      marketing: marketingIncrease[0],
      distribution: distributionExpansion[0],
      impact: Number(calculateImpact())
    };

    setSavedScenarios([...savedScenarios, newScenario]);
    setScenarioName("");
    
    toast({
      title: "Success",
      description: `Scenario "${scenarioName}" saved successfully`
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-5 border p-3 rounded-md bg-card">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Scenario name"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="px-2 py-1 text-sm border rounded flex-1"
          />
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleSaveScenario}
            className="flex items-center gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="price-slider" className="text-xs">
                  {language === 'ar' ? 'تغيير السعر (٪)' : 'Price Change (%)'}
                </Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[250px]">
                        {language === 'ar' 
                          ? 'تغيير في سعر المنتج. تغيير إيجابي = زيادة السعر'
                          : 'Change in product price. Positive = price increase. Generally has negative impact on demand (elasticity).'}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{priceChange[0]}%</span>
            </div>
            <Slider 
              id="price-slider"
              min={-20} 
              max={20} 
              step={1} 
              value={priceChange} 
              onValueChange={setPriceChange} 
              className="py-1.5"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="marketing-slider" className="text-xs">
                  {language === 'ar' ? 'زيادة التسويق (٪)' : 'Marketing Increase (%)'}
                </Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[250px]">
                        {language === 'ar' 
                          ? 'زيادة في ميزانية التسويق. عادة ما يؤدي إلى تأثير إيجابي على الطلب، مع تناقص العوائد'
                          : 'Increase in marketing budget. Usually has positive impact on demand, with diminishing returns.'}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{marketingIncrease[0]}%</span>
            </div>
            <Slider 
              id="marketing-slider"
              min={0} 
              max={50} 
              step={5} 
              value={marketingIncrease} 
              onValueChange={setMarketingIncrease}
              className="py-1.5"
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <Label htmlFor="distribution-slider" className="text-xs">
                  {language === 'ar' ? 'توسع التوزيع (٪)' : 'Distribution Expansion (%)'}
                </Label>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-[250px]">
                        {language === 'ar' 
                          ? 'توسع في قنوات التوزيع أو المواقع. يؤثر على وصول المنتج وتوفره'
                          : 'Expansion in distribution channels or locations. Affects product reach and availability.'}
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{distributionExpansion[0]}%</span>
            </div>
            <Slider 
              id="distribution-slider"
              min={0} 
              max={30} 
              step={5} 
              value={distributionExpansion} 
              onValueChange={setDistributionExpansion}
              className="py-1.5"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-xs font-medium">
              {language === 'ar' ? 'تأثير متوقع على المبيعات' : 'Expected Sales Impact'}:
            </span>
            <span className={`text-xs font-bold ${Number(calculateImpact()) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {calculateImpact()}%
            </span>
          </div>
          <Button 
            onClick={handleRunScenario} 
            className="w-full text-xs py-1 h-7"
            size="sm"
          >
            {language === 'ar' ? 'تشغيل السيناريو' : 'Run Scenario'}
          </Button>
        </div>
      </div>

      <div className="h-[140px] border rounded-md p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={generateChartData()} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `M${value}`}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ fontSize: '10px' }}
              formatter={(value) => [`${value} units`, '']}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#8884d8" dot={{ r: 2 }} />
            <Line type="monotone" dataKey="scenario" name="Scenario" stroke="#82ca9d" dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {savedScenarios.length > 0 && (
        <div className="border rounded-md p-2">
          <h4 className="text-xs font-medium mb-2">{language === 'ar' ? 'السيناريوهات المحفوظة' : 'Saved Scenarios'}</h4>
          <div className="space-y-1 max-h-[120px] overflow-y-auto">
            {savedScenarios.map((scenario, index) => (
              <Card key={index} className="p-2 text-xs flex justify-between items-center">
                <div>
                  <span className="font-medium">{scenario.name}</span>
                  <div className="text-[10px] text-muted-foreground">
                    P: {scenario.price}% | M: {scenario.marketing}% | D: {scenario.distribution}%
                  </div>
                </div>
                <span className={`text-xs font-semibold ${scenario.impact >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {scenario.impact}%
                </span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
