
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Info, HelpCircle, PieChart, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateDecouplingRecommendation } from '@/utils/decouplingUtils';

interface Factor {
  id: string;
  name: string;
  weight: number;
  score: number;
  description: string;
}

interface LocationData {
  id: string;
  name: string;
  recommendation: {
    score: number;
    factors: Record<string, number>;
    decouplingType: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate' | null;
    confidence: number;
  };
}

export const DecouplingPointRecommendation = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language) || key;
  
  const [locations, setLocations] = useState<LocationData[]>([
    {
      id: 'loc-main-warehouse',
      name: 'Main Warehouse',
      recommendation: { score: 0, factors: {}, decouplingType: null, confidence: 0 }
    },
    {
      id: 'loc-distribution-center',
      name: 'Distribution Center',
      recommendation: { score: 0, factors: {}, decouplingType: null, confidence: 0 }
    },
    {
      id: 'loc-retail-store',
      name: 'Retail Store',
      recommendation: { score: 0, factors: {}, decouplingType: null, confidence: 0 }
    }
  ]);

  const [factors, setFactors] = useState<Factor[]>([
    { 
      id: 'lead_time', 
      name: t('leadTimeFactor'), 
      weight: 5, 
      score: 0,
      description: t('leadTimeFactorDesc')
    },
    { 
      id: 'demand_variability', 
      name: t('demandVariabilityFactor'), 
      weight: 4, 
      score: 0,
      description: t('demandVariabilityFactorDesc')
    },
    { 
      id: 'supply_reliability', 
      name: t('supplyReliabilityFactor'), 
      weight: 3, 
      score: 0,
      description: t('supplyReliabilityFactorDesc')
    },
    { 
      id: 'inventory_cost', 
      name: t('inventoryCostFactor'), 
      weight: 4, 
      score: 0,
      description: t('inventoryCostFactorDesc')
    },
    { 
      id: 'customer_service', 
      name: t('customerServiceFactor'), 
      weight: 5, 
      score: 0,
      description: t('customerServiceFactorDesc')
    }
  ]);

  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFactorWeightChange = (factorId: string, newWeight: number) => {
    setFactors(prev => 
      prev.map(factor => 
        factor.id === factorId ? { ...factor, weight: newWeight } : factor
      )
    );
  };

  const handleFactorScoreChange = (factorId: string, newScore: number) => {
    setFactors(prev => 
      prev.map(factor => 
        factor.id === factorId ? { ...factor, score: newScore } : factor
      )
    );
  };

  const analyzeDecouplingPoints = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const updatedLocations = locations.map(location => {
        const recommendation = calculateDecouplingRecommendation(location.id, factors);
        return {
          ...location,
          recommendation
        };
      });
      
      setLocations(updatedLocations);
      setIsAnalyzing(false);
      
      toast({
        title: t('analysisComplete'),
        description: t('decouplingRecommendationsReady'),
      });
    }, 1500);
  };

  const getRecommendationBadge = (score: number) => {
    if (score >= 80) {
      return <Badge className="bg-green-600">{t('highlyRecommended')}</Badge>;
    } else if (score >= 60) {
      return <Badge className="bg-blue-600">{t('recommended')}</Badge>;
    } else if (score >= 40) {
      return <Badge className="bg-yellow-600">{t('consider')}</Badge>;
    } else {
      return <Badge className="bg-gray-600">{t('notRecommended')}</Badge>;
    }
  };

  const getDecouplingTypeRecommendation = (type: string | null) => {
    if (!type) return null;
    
    const typeMap: Record<string, { color: string, icon: React.ReactNode }> = {
      'strategic': { color: 'bg-purple-100 text-purple-800', icon: <PieChart className="h-3 w-3 mr-1" /> },
      'customer_order': { color: 'bg-blue-100 text-blue-800', icon: <TrendingUp className="h-3 w-3 mr-1" /> },
      'stock_point': { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
      'intermediate': { color: 'bg-amber-100 text-amber-800', icon: <Lightbulb className="h-3 w-3 mr-1" /> }
    };
    
    const { color, icon } = typeMap[type];
    
    return (
      <Badge className={`${color} flex items-center`}>
        {icon}
        {t(type + 'DecouplingPoint')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('decouplingPointRecommendation')}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>{t('decouplingPointRecommendationHelp')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            {t('decouplingPointRecommendationDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-medium mb-4">{t('locationSelection')}</h3>
              <Select 
                value={selectedLocation} 
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectLocation')} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">{t('weightFactors')}</h3>
              <div className="space-y-4">
                {factors.map(factor => (
                  <div key={factor.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">{factor.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                <Info className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{factor.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm">{factor.weight}/10</span>
                    </div>
                    <Slider
                      value={[factor.weight]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleFactorWeightChange(factor.id, value[0])}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedLocation && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-base font-medium mb-4">{t('locationFactorScores')}</h3>
              <div className="space-y-4">
                {factors.map(factor => (
                  <div key={factor.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{factor.name} {t('scoreFor')} {locations.find(l => l.id === selectedLocation)?.name}</span>
                      <span className="text-sm">{factor.score}/100</span>
                    </div>
                    <Slider
                      value={[factor.score]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleFactorScoreChange(factor.id, value[0])}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={analyzeDecouplingPoints}
            disabled={isAnalyzing}
            className="min-w-[120px]"
          >
            {isAnalyzing ? t('analyzing') : t('analyzeDecouplingPoints')}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map(location => (
          <Card key={location.id} className="h-full">
            <CardHeader>
              <CardTitle className="text-base">{location.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{t('recommendationScore')}</span>
                    <span className="text-sm font-bold">{location.recommendation.score}%</span>
                  </div>
                  <Progress value={location.recommendation.score} className="h-2" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm">{t('recommendationStatus')}:</span>
                    {getRecommendationBadge(location.recommendation.score)}
                  </div>
                  
                  {location.recommendation.decouplingType && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('suggestedType')}:</span>
                      {getDecouplingTypeRecommendation(location.recommendation.decouplingType)}
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm">{t('confidence')}:</span>
                    <span className="text-sm font-medium">{location.recommendation.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {location.recommendation.score > 0 && (
                <Button variant="outline" size="sm" className="w-full">
                  {t('viewDetailedAnalysis')}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
