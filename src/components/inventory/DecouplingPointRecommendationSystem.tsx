
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Label } from '@/components/ui/label';
import { ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Location {
  id: string;
  name: string;
  factors: {
    leadTime: number;
    demandVariability: number;
    supplyReliability: number;
    inventoryCost: number;
    customerService: number;
  };
}

interface RecommendationResult {
  locationId: string;
  score: number;
  suggestedType: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  confidence: 'high' | 'medium' | 'low';
  status: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended';
  analysis: {
    leadTime: { score: number; comment: string };
    demandVariability: { score: number; comment: string };
    supplyReliability: { score: number; comment: string };
    inventoryCost: { score: number; comment: string };
    customerService: { score: number; comment: string };
  };
}

const mockLocations: Location[] = [
  {
    id: 'loc-main-warehouse',
    name: 'Main Warehouse',
    factors: {
      leadTime: 8.5,
      demandVariability: 3.2,
      supplyReliability: 9.1,
      inventoryCost: 7.4,
      customerService: 6.8
    }
  },
  {
    id: 'loc-distribution-center',
    name: 'Distribution Center',
    factors: {
      leadTime: 6.4,
      demandVariability: 5.7,
      supplyReliability: 7.8,
      inventoryCost: 6.2,
      customerService: 8.9
    }
  },
  {
    id: 'loc-retail-store',
    name: 'Retail Store',
    factors: {
      leadTime: 2.3,
      demandVariability: 7.6,
      supplyReliability: 5.4,
      inventoryCost: 3.8,
      customerService: 9.2
    }
  }
];

export const DecouplingPointRecommendationSystem = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language);
  
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [weights, setWeights] = useState({
    leadTime: 1,
    demandVariability: 1,
    supplyReliability: 1,
    inventoryCost: 1,
    customerService: 1
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [activeTab, setActiveTab] = useState('factors');
  
  const handleWeightChange = (factor: keyof typeof weights, value: number) => {
    setWeights(prev => ({ ...prev, [factor]: value }));
  };
  
  const analyzeDecouplingPoint = () => {
    if (!selectedLocation) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis with timeout
    setTimeout(() => {
      const location = mockLocations.find(l => l.id === selectedLocation);
      
      if (!location) {
        setIsAnalyzing(false);
        return;
      }
      
      // Calculate weighted scores
      const leadTimeScore = location.factors.leadTime * weights.leadTime;
      const demandVariabilityScore = location.factors.demandVariability * weights.demandVariability;
      const supplyReliabilityScore = location.factors.supplyReliability * weights.supplyReliability;
      const inventoryCostScore = location.factors.inventoryCost * weights.inventoryCost;
      const customerServiceScore = location.factors.customerService * weights.customerService;
      
      const totalWeight = weights.leadTime + weights.demandVariability + weights.supplyReliability + 
                          weights.inventoryCost + weights.customerService;
      
      const totalScore = (leadTimeScore + demandVariabilityScore + supplyReliabilityScore + 
                         inventoryCostScore + customerServiceScore) / totalWeight;
      
      // Determine suggested type based on scores
      let suggestedType: RecommendationResult['suggestedType'] = 'stock_point';
      if (leadTimeScore > 7 && supplyReliabilityScore > 8) {
        suggestedType = 'strategic';
      } else if (customerServiceScore > 8 && demandVariabilityScore < 5) {
        suggestedType = 'customer_order';
      } else if (inventoryCostScore < 5 && demandVariabilityScore > 7) {
        suggestedType = 'intermediate';
      }
      
      // Determine confidence level
      let confidence: RecommendationResult['confidence'] = 'medium';
      const variance = Math.abs(leadTimeScore - demandVariabilityScore) + 
                      Math.abs(supplyReliabilityScore - inventoryCostScore) + 
                      Math.abs(customerServiceScore - leadTimeScore);
      
      if (variance < 10) confidence = 'high';
      if (variance > 20) confidence = 'low';
      
      // Determine recommendation status
      let status: RecommendationResult['status'] = 'recommended';
      if (totalScore > 8) {
        status = 'highly_recommended';
      } else if (totalScore > 6) {
        status = 'recommended';
      } else if (totalScore > 4) {
        status = 'consider';
      } else {
        status = 'not_recommended';
      }
      
      // Generate analysis
      const result: RecommendationResult = {
        locationId: location.id,
        score: Math.round(totalScore * 10) / 10,
        suggestedType,
        confidence,
        status,
        analysis: {
          leadTime: { 
            score: location.factors.leadTime,
            comment: getLeadTimeComment(location.factors.leadTime)
          },
          demandVariability: {
            score: location.factors.demandVariability,
            comment: getDemandVariabilityComment(location.factors.demandVariability)
          },
          supplyReliability: {
            score: location.factors.supplyReliability,
            comment: getSupplyReliabilityComment(location.factors.supplyReliability)
          },
          inventoryCost: {
            score: location.factors.inventoryCost,
            comment: getInventoryCostComment(location.factors.inventoryCost)
          },
          customerService: {
            score: location.factors.customerService,
            comment: getCustomerServiceComment(location.factors.customerService)
          }
        }
      };
      
      setResult(result);
      setIsAnalyzing(false);
      setActiveTab('results');
    }, 2000);
  };
  
  const getLeadTimeComment = (score: number): string => {
    if (score > 8) return language === 'ar' ? "وقت توريد طويل يتطلب مخزونًا إضافيًا" : "Long lead time requires additional buffer";
    if (score > 5) return language === 'ar' ? "وقت توريد متوسط، مناسب لنقطة فصل" : "Medium lead time, suitable for decoupling";
    return language === 'ar' ? "وقت توريد قصير، قد لا يستفيد من نقطة الفصل" : "Short lead time, may not benefit from decoupling";
  };
  
  const getDemandVariabilityComment = (score: number): string => {
    if (score > 8) return language === 'ar' ? "تقلب طلب مرتفع، مما يتطلب مخزونًا احتياطيًا كبيرًا" : "High demand variability requiring significant buffer";
    if (score > 5) return language === 'ar' ? "تقلب متوسط، يمكن معالجته بنقطة فصل جيدة التصميم" : "Medium variability, manageable with well-designed decoupling";
    return language === 'ar' ? "تقلب منخفض، قد تكون نقطة الفصل أقل أهمية" : "Low variability, decoupling may be less critical";
  };
  
  const getSupplyReliabilityComment = (score: number): string => {
    if (score > 8) return language === 'ar' ? "موثوقية عالية، أقل حاجة لنقطة فصل استراتيجية" : "High reliability, less need for strategic decoupling";
    if (score > 5) return language === 'ar' ? "موثوقية متوسطة، قد تستفيد من نقطة فصل" : "Medium reliability, may benefit from decoupling";
    return language === 'ar' ? "موثوقية منخفضة، نقطة الفصل موصى بها بشدة" : "Low reliability, decoupling highly recommended";
  };
  
  const getInventoryCostComment = (score: number): string => {
    if (score > 8) return language === 'ar' ? "تكلفة مخزون عالية، كن حذرًا بشأن نقاط الفصل الإضافية" : "High inventory cost, be cautious about additional decoupling";
    if (score > 5) return language === 'ar' ? "تكلفة مخزون متوسطة، توازن بين المنافع والتكاليف" : "Medium inventory cost, balance benefits and costs";
    return language === 'ar' ? "تكلفة مخزون منخفضة، فرصة جيدة لنقطة فصل" : "Low inventory cost, good opportunity for decoupling";
  };
  
  const getCustomerServiceComment = (score: number): string => {
    if (score > 8) return language === 'ar' ? "توقعات خدمة عملاء عالية، قد تتطلب نقطة فصل استراتيجية" : "High customer service expectations, may require strategic decoupling";
    if (score > 5) return language === 'ar' ? "توقعات خدمة متوسطة، ضع في اعتبارك نقطة فصل طلب العملاء" : "Medium service expectations, consider customer order decoupling";
    return language === 'ar' ? "توقعات خدمة منخفضة، قد تكون نقطة الفصل أقل أهمية" : "Lower service expectations, decoupling may be less critical";
  };
  
  const getStatusColor = (status: RecommendationResult['status']) => {
    switch (status) {
      case 'highly_recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consider': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_recommended': return 'bg-red-100 text-red-800 border-red-200';
    }
  };
  
  const getStatusLabel = (status: RecommendationResult['status']) => {
    switch (status) {
      case 'highly_recommended': return t('highlyRecommended');
      case 'recommended': return t('recommended');
      case 'consider': return t('consider');
      case 'not_recommended': return t('notRecommended');
    }
  };
  
  const getConfidenceColor = (confidence: RecommendationResult['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('decouplingPointRecommendation')}</CardTitle>
        <CardDescription>{t('decouplingPointRecommendationDesc')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="factors">{language === 'ar' ? "العوامل والأوزان" : "Factors & Weights"}</TabsTrigger>
            <TabsTrigger value="results" disabled={!result && !isAnalyzing}>
              {language === 'ar' ? "النتائج" : "Results"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="factors" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  {t('locationSelection')}
                </Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectLocation')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-medium">{t('weightFactors')}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {language === 'ar' 
                          ? "ضبط أهمية كل عامل في تحليل نقطة الفصل الموصى بها. القيم العالية تعني أن العامل أكثر أهمية." 
                          : "Adjust the importance of each factor in the decoupling point recommendation analysis. Higher values mean the factor is more important."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="space-y-5 mt-4">
                  {/* Lead Time Factor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="leadTimeFactor" className="text-sm">
                        {t('leadTimeFactor')}
                      </Label>
                      <span className="text-sm font-medium">{weights.leadTime}</span>
                    </div>
                    <Slider
                      id="leadTimeFactor"
                      min={0}
                      max={5}
                      step={1}
                      value={[weights.leadTime]}
                      onValueChange={([value]) => handleWeightChange('leadTime', value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('leadTimeFactorDesc')}</p>
                  </div>
                  
                  {/* Demand Variability Factor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="demandVariabilityFactor" className="text-sm">
                        {t('demandVariabilityFactor')}
                      </Label>
                      <span className="text-sm font-medium">{weights.demandVariability}</span>
                    </div>
                    <Slider
                      id="demandVariabilityFactor"
                      min={0}
                      max={5}
                      step={1}
                      value={[weights.demandVariability]}
                      onValueChange={([value]) => handleWeightChange('demandVariability', value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('demandVariabilityFactorDesc')}</p>
                  </div>
                  
                  {/* Supply Reliability Factor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="supplyReliabilityFactor" className="text-sm">
                        {t('supplyReliabilityFactor')}
                      </Label>
                      <span className="text-sm font-medium">{weights.supplyReliability}</span>
                    </div>
                    <Slider
                      id="supplyReliabilityFactor"
                      min={0}
                      max={5}
                      step={1}
                      value={[weights.supplyReliability]}
                      onValueChange={([value]) => handleWeightChange('supplyReliability', value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('supplyReliabilityFactorDesc')}</p>
                  </div>
                  
                  {/* Inventory Cost Factor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="inventoryCostFactor" className="text-sm">
                        {t('inventoryCostFactor')}
                      </Label>
                      <span className="text-sm font-medium">{weights.inventoryCost}</span>
                    </div>
                    <Slider
                      id="inventoryCostFactor"
                      min={0}
                      max={5}
                      step={1}
                      value={[weights.inventoryCost]}
                      onValueChange={([value]) => handleWeightChange('inventoryCost', value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('inventoryCostFactorDesc')}</p>
                  </div>
                  
                  {/* Customer Service Factor */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="customerServiceFactor" className="text-sm">
                        {t('customerServiceFactor')}
                      </Label>
                      <span className="text-sm font-medium">{weights.customerService}</span>
                    </div>
                    <Slider
                      id="customerServiceFactor"
                      min={0}
                      max={5}
                      step={1}
                      value={[weights.customerService]}
                      onValueChange={([value]) => handleWeightChange('customerService', value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('customerServiceFactorDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={analyzeDecouplingPoint}
                disabled={!selectedLocation || isAnalyzing}
                className="w-full md:w-auto"
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
          </TabsContent>
          
          <TabsContent value="results" className="pt-4">
            {isAnalyzing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>{t('analyzing')}</p>
                <Progress value={45} className="w-[60%]" />
              </div>
            ) : result ? (
              <div className="space-y-6">
                <Alert className={`${getStatusColor(result.status)} border`}>
                  <AlertTitle className="text-base flex items-center gap-2">
                    {getStatusLabel(result.status)}
                    <Badge className={getConfidenceColor(result.confidence)}>
                      {result.confidence === 'high' 
                        ? language === 'ar' ? 'ثقة عالية' : 'High confidence'
                        : result.confidence === 'medium'
                          ? language === 'ar' ? 'ثقة متوسطة' : 'Medium confidence'
                          : language === 'ar' ? 'ثقة منخفضة' : 'Low confidence'}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    {language === 'ar'
                      ? `توصية لـ ${mockLocations.find(l => l.id === result.locationId)?.name} مع درجة ${result.score}/10`
                      : `Recommendation for ${mockLocations.find(l => l.id === result.locationId)?.name} with score ${result.score}/10`}
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-base font-medium">{t('suggestedType')}</h3>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="font-medium text-blue-800">
                        {t(`${result.suggestedType}DecouplingPoint`)}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        {language === 'ar'
                          ? 'مبني على تحليل بيانات الموقع وعوامل الترجيح'
                          : 'Based on location data analysis and weighting factors'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-base font-medium">{t('recommendationScore')}</h3>
                    <div className="flex items-center gap-4">
                      <div className={`h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold ${
                        result.score > 8 ? 'bg-green-100 text-green-800' :
                        result.score > 6 ? 'bg-blue-100 text-blue-800' :
                        result.score > 4 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.score}/10
                      </div>
                      <div className="flex-1">
                        <Progress value={result.score * 10} className="mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {result.score > 8 
                            ? language === 'ar' ? 'ممتاز للغاية' : 'Excellent fit'
                            : result.score > 6
                              ? language === 'ar' ? 'مناسب جيد' : 'Good fit'
                              : result.score > 4
                                ? language === 'ar' ? 'مناسب معتدل' : 'Moderate fit'
                                : language === 'ar' ? 'قد لا يكون مناسبًا' : 'May not be suitable'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-medium">{t('locationFactorScores')}</h3>
                  <div className="space-y-4">
                    {Object.entries(result.analysis).map(([factor, analysis]) => (
                      <div key={factor} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{t(`${factor}Factor`)}</span>
                          <Badge variant="outline">{analysis.score}/10</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{analysis.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('factors')}>
                    {language === 'ar' ? 'تعديل العوامل' : 'Adjust Factors'}
                  </Button>
                  <Button variant="default">
                    {t('viewDetailedAnalysis')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                {language === 'ar' 
                  ? 'الرجاء اختيار موقع وتعديل الأوزان ثم تحليل نقطة الفصل'
                  : 'Please select a location, adjust weights, and run the analysis'}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
