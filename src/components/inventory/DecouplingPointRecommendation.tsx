
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export const DecouplingPointRecommendation = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language);
  
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [factorWeights, setFactorWeights] = useState({
    leadTime: 5,
    demandVariability: 5,
    supplyReliability: 5,
    inventoryCost: 5,
    customerService: 5
  });

  const handleWeightChange = (factor: string, value: number[]) => {
    setFactorWeights(prev => ({
      ...prev,
      [factor]: value[0]
    }));
  };

  const handleAnalyze = () => {
    if (!selectedLocation) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const locations = [
    { id: 'loc1', name: 'Main Warehouse' },
    { id: 'loc2', name: 'Distribution Center A' },
    { id: 'loc3', name: 'Retail Store B' },
    { id: 'loc4', name: 'Manufacturing Plant' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('decouplingPointRecommendation')}</CardTitle>
        <CardDescription>
          {t('decouplingPointRecommendationDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">{t('decouplingPointRecommendationHelp')}</p>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('locationSelection')}</h3>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full">
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
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('weightFactors')}</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{t('leadTimeFactor')}</label>
                <span className="text-sm">{factorWeights.leadTime}</span>
              </div>
              <Slider
                value={[factorWeights.leadTime]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('leadTime', value)}
              />
              <p className="text-xs text-muted-foreground">{t('leadTimeFactorDesc')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{t('demandVariabilityFactor')}</label>
                <span className="text-sm">{factorWeights.demandVariability}</span>
              </div>
              <Slider
                value={[factorWeights.demandVariability]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('demandVariability', value)}
              />
              <p className="text-xs text-muted-foreground">{t('demandVariabilityFactorDesc')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{t('supplyReliabilityFactor')}</label>
                <span className="text-sm">{factorWeights.supplyReliability}</span>
              </div>
              <Slider
                value={[factorWeights.supplyReliability]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('supplyReliability', value)}
              />
              <p className="text-xs text-muted-foreground">{t('supplyReliabilityFactorDesc')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{t('inventoryCostFactor')}</label>
                <span className="text-sm">{factorWeights.inventoryCost}</span>
              </div>
              <Slider
                value={[factorWeights.inventoryCost]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('inventoryCost', value)}
              />
              <p className="text-xs text-muted-foreground">{t('inventoryCostFactorDesc')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{t('customerServiceFactor')}</label>
                <span className="text-sm">{factorWeights.customerService}</span>
              </div>
              <Slider
                value={[factorWeights.customerService]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('customerService', value)}
              />
              <p className="text-xs text-muted-foreground">{t('customerServiceFactorDesc')}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            className="w-full" 
            disabled={!selectedLocation || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('analyzing')}
              </>
            ) : (
              t('analyzeDecouplingPoints')
            )}
          </Button>
        </div>
        
        {analysisComplete && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">{t('analysisComplete')}</h3>
            <p className="text-sm text-muted-foreground">{t('decouplingRecommendationsReady')}</p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{t('scoreFor')}: Distribution Center A</h4>
                  <div className="text-sm font-medium text-green-600">{t('highlyRecommended')}</div>
                </div>
                
                <div className="space-y-1 mb-3">
                  <div className="text-sm">
                    {t('recommendationScore')}: 87/100
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('suggestedType')}:</span> 
                    <span className="ml-1 font-medium">Customer Order Point</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('confidence')}:</span>
                    <span className="ml-1 font-medium">High (82%)</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Button variant="outline" size="sm">{t('viewDetailedAnalysis')}</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
