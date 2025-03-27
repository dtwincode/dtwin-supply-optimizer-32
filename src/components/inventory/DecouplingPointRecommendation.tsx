import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

// Mock locations for the demo
const mockLocations = [
  { id: "loc-main-warehouse", name: "Main Warehouse" },
  { id: "loc-distribution-center", name: "Distribution Center" },
  { id: "loc-retail-store", name: "Retail Store" }
];

// Mock data for demonstration purposes
const generateScores = () => {
  return {
    leadTime: Math.random() * 10,
    demandVariability: Math.random() * 10,
    supplyReliability: Math.random() * 10,
    inventoryCost: Math.random() * 10,
    customerService: Math.random() * 10
  };
};

type WeightFactors = {
  leadTime: number;
  demandVariability: number;
  supplyReliability: number;
  inventoryCost: number;
  customerService: number;
};

const getRecommendationData = (locationId: string, weights: WeightFactors) => {
  // In a real application, this would call an API or perform actual calculations
  const mockScores = generateScores();
  
  // Calculate weighted score (this is simplified for demo)
  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);
  let weightedScore = 0;
  
  Object.keys(weights).forEach(key => {
    const keyAsFactorName = key as keyof typeof mockScores;
    // Get the score from mockScores
    const score = mockScores[keyAsFactorName] || 0;
    // Get the weight as a number
    const weight = weights[key as keyof WeightFactors];
    // Calculate weighted score with proper number types
    weightedScore += (score * weight);
  });
  
  const normalizedScore = (weightedScore / totalWeight) / 10 * 100;
  
  // Determine recommendation status based on score
  let status;
  if (normalizedScore > 80) status = "highlyRecommended";
  else if (normalizedScore > 60) status = "recommended";
  else if (normalizedScore > 40) status = "consider";
  else status = "notRecommended";
  
  // Determine suggested type based on various factors (simplified)
  const types = ['strategic', 'customer_order', 'stock_point', 'intermediate'];
  const typeIndex = Math.floor(Math.random() * types.length);
  
  const confidence = Math.round(Math.min(normalizedScore + Math.random() * 20, 100));
  
  return {
    score: Math.round(normalizedScore),
    status,
    suggestedType: types[typeIndex],
    confidence,
    factors: Object.keys(mockScores).map(key => ({
      name: key,
      score: mockScores[key as keyof typeof mockScores] || 0
    }))
  };
};

export const DecouplingPointRecommendation = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  
  const [weights, setWeights] = useState<WeightFactors>({
    leadTime: 7,
    demandVariability: 5,
    supplyReliability: 6,
    inventoryCost: 5,
    customerService: 8
  });
  
  const handleWeightChange = (name: keyof WeightFactors, value: number[]) => {
    setWeights(prev => ({ ...prev, [name]: value[0] }));
  };
  
  const runAnalysis = () => {
    if (!selectedLocation) {
      toast({
        title: getTranslation("common.error", language),
        description: language === 'ar' 
          ? "يرجى تحديد موقع للتحليل" 
          : "Please select a location to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate analysis delay
    setTimeout(() => {
      const result = getRecommendationData(selectedLocation, weights);
      setRecommendation(result);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: getTranslation("inventory.analysisComplete", language),
        description: getTranslation("inventory.decouplingRecommendationsReady", language)
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Location selection card */}
        <Card>
          <CardHeader>
            <CardTitle>{getTranslation("inventory.locationSelection", language)}</CardTitle>
            <CardDescription>
              {getTranslation("inventory.selectLocation", language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? "اختر موقعًا" : "Select a location"} />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {/* Weight factors card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{getTranslation("inventory.weightFactors", language)}</CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? "قم بتعيين الأهمية النسبية لكل عامل في تحليلك"
                : "Set the relative importance of each factor in your analysis"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {getTranslation("inventory.leadTimeFactor", language)}
                    </label>
                    <span className="text-sm text-muted-foreground">{weights.leadTime}</span>
                  </div>
                  <Slider 
                    value={[weights.leadTime]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleWeightChange('leadTime', value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {getTranslation("inventory.leadTimeFactorDesc", language)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {getTranslation("inventory.demandVariabilityFactor", language)}
                    </label>
                    <span className="text-sm text-muted-foreground">{weights.demandVariability}</span>
                  </div>
                  <Slider 
                    value={[weights.demandVariability]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleWeightChange('demandVariability', value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {getTranslation("inventory.demandVariabilityFactorDesc", language)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {getTranslation("inventory.supplyReliabilityFactor", language)}
                    </label>
                    <span className="text-sm text-muted-foreground">{weights.supplyReliability}</span>
                  </div>
                  <Slider 
                    value={[weights.supplyReliability]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleWeightChange('supplyReliability', value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {getTranslation("inventory.supplyReliabilityFactorDesc", language)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {getTranslation("inventory.inventoryCostFactor", language)}
                    </label>
                    <span className="text-sm text-muted-foreground">{weights.inventoryCost}</span>
                  </div>
                  <Slider 
                    value={[weights.inventoryCost]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleWeightChange('inventoryCost', value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {getTranslation("inventory.inventoryCostFactorDesc", language)}
                  </p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      {getTranslation("inventory.customerServiceFactor", language)}
                    </label>
                    <span className="text-sm text-muted-foreground">{weights.customerService}</span>
                  </div>
                  <Slider 
                    value={[weights.customerService]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleWeightChange('customerService', value)} 
                  />
                  <p className="text-xs text-muted-foreground">
                    {getTranslation("inventory.customerServiceFactorDesc", language)}
                  </p>
                </div>
              </div>
            </div>
            
            <Button onClick={runAnalysis} disabled={isAnalyzing || !selectedLocation} className="w-full">
              {isAnalyzing 
                ? getTranslation("inventory.analyzing", language) 
                : getTranslation("inventory.analyzeDecouplingPoints", language)}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {analysisComplete && recommendation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{getTranslation("inventory.recommendationScore", language)}</CardTitle>
              <CardDescription>
                {getTranslation("inventory.scoreFor", language)} {
                  mockLocations.find(loc => loc.id === selectedLocation)?.name
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-muted">
                  <div className="text-4xl font-bold">{recommendation.score}%</div>
                  <svg 
                    className="absolute top-0 left-0" 
                    width="160" height="160" 
                    viewBox="0 0 160 160"
                  >
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="12" 
                    />
                    <circle 
                      cx="80" cy="80" r="70" 
                      fill="none" 
                      stroke={
                        recommendation.status === "highlyRecommended" ? "#22c55e" :
                        recommendation.status === "recommended" ? "#3b82f6" :
                        recommendation.status === "consider" ? "#f59e0b" :
                        "#ef4444"
                      } 
                      strokeWidth="12" 
                      strokeDasharray={`${recommendation.score * 4.4} 440`}
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{getTranslation("inventory.recommendationStatus", language)}</span>
                  <span className={
                    recommendation.status === "highlyRecommended" ? "text-green-600" :
                    recommendation.status === "recommended" ? "text-blue-600" :
                    recommendation.status === "consider" ? "text-amber-600" :
                    "text-red-600"
                  }>
                    {getTranslation(`inventory.${recommendation.status}`, language)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{getTranslation("inventory.suggestedType", language)}</span>
                  <span>
                    {getTranslation(`inventory.${recommendation.suggestedType}DecouplingPoint`, language)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{getTranslation("inventory.confidence", language)}</span>
                  <span>{recommendation.confidence}%</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={() => {}}>
                {getTranslation("inventory.viewDetailedAnalysis", language)}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{getTranslation("inventory.locationFactorScores", language)}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? "كيف يؤدي هذا الموقع في كل عامل من عوامل التقييم"
                  : "How this location performs on each evaluation factor"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={recommendation.factors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tickFormatter={(value) => {
                      const shortNames = {
                        'leadTime': getTranslation("inventory.leadTimeFactor", language),
                        'demandVariability': getTranslation("inventory.demandVariabilityFactor", language),
                        'supplyReliability': getTranslation("inventory.supplyReliabilityFactor", language),
                        'inventoryCost': getTranslation("inventory.inventoryCostFactor", language),
                        'customerService': getTranslation("inventory.customerServiceFactor", language)
                      };
                      // @ts-ignore - this is simplified for the demo
                      return shortNames[value] || value;
                    }}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="score" 
                    fill="#3b82f6" 
                    name={getTranslation("inventory.score", language)} 
                  />
                </BarChart>
              </ResponsiveContainer>
              
              <Alert className="mt-4">
                <AlertDescription>
                  {getTranslation("inventory.decouplingPointRecommendationHelp", language)}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
