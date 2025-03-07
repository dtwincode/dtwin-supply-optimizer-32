
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader, Info } from 'lucide-react';
import { TransportMode, getTransportModes } from '@/services/routeOptimizationService';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { toArabicNumerals } from '@/translations';

export const TransportModeList = () => {
  const [transportModes, setTransportModes] = useState<TransportMode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    const fetchTransportModes = async () => {
      try {
        setLoading(true);
        const modes = await getTransportModes();
        setTransportModes(modes);
      } catch (error) {
        console.error('Error fetching transport modes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportModes();
  }, []);

  const translations = {
    transportModes: {
      en: "Transport Modes",
      ar: "وسائل النقل"
    },
    capacityCost: {
      en: "Capacity & Cost",
      ar: "السعة والتكلفة"
    },
    performanceMetrics: {
      en: "Performance Metrics",
      ar: "مؤشرات الأداء"
    },
    mode: {
      en: "Mode",
      ar: "وسيلة النقل"
    },
    speed: {
      en: "Speed (km/h)",
      ar: "السرعة (كم/س)"
    },
    costPerKm: {
      en: "Cost per km",
      ar: "التكلفة لكل كم"
    },
    capacity: {
      en: "Capacity (kg)",
      ar: "السعة (كغم)"
    },
    volume: {
      en: "Volume (m³)",
      ar: "الحجم (م³)"
    },
    moq: {
      en: "MOQ",
      ar: "الحد الأدنى للطلب"
    },
    maxShipments: {
      en: "Max Shipments",
      ar: "الحد الأقصى للشحنات"
    },
    emissions: {
      en: "Emissions (kg/km)",
      ar: "الانبعاثات (كغم/كم)"
    },
    reliabilityScore: {
      en: "Reliability Score",
      ar: "مؤشر الموثوقية"
    },
    avgLeadTime: {
      en: "Avg Lead Time",
      ar: "متوسط وقت التسليم"
    },
    leadTimeVariability: {
      en: "Lead Time Variability",
      ar: "تفاوت وقت التسليم"
    },
    trackingQuality: {
      en: "Tracking Quality",
      ar: "جودة التتبع"
    },
    damageRate: {
      en: "Damage Rate (%)",
      ar: "نسبة التلف (%)"
    },
    tons: {
      en: "tons",
      ar: "طن"
    },
    minimumOrderQuantity: {
      en: "Minimum Order Quantity",
      ar: "الحد الأدنى لكمية الطلب"
    },
    maxShipmentsTooltip: {
      en: "Maximum shipments per transport",
      ar: "الحد الأقصى للشحنات لكل وسيلة نقل"
    },
    reliabilityTooltip: {
      en: "Reliability score based on on-time delivery performance and carrier reputation. Higher is better.",
      ar: "مؤشر الموثوقية بناءً على أداء التسليم في الوقت المحدد وسمعة الناقل. الأعلى هو الأفضل."
    },
    leadTimeTooltip: {
      en: "Average lead time from order placement to delivery for standard routes.",
      ar: "متوسط الوقت المستغرق من تقديم الطلب إلى التسليم للمسارات القياسية."
    },
    variabilityTooltip: {
      en: "Standard deviation in lead time - lower values indicate more consistent delivery times.",
      ar: "الانحراف المعياري في وقت التسليم - القيم الأدنى تشير إلى أوقات تسليم أكثر اتساقاً."
    }
  };

  const getLocalizedText = (key: string): string => {
    return translations[key as keyof typeof translations]?.[language] || key;
  };

  const formatValue = (value: string | number): string => {
    if (language === 'ar' && typeof value === 'number') {
      return toArabicNumerals(value.toString());
    }
    if (language === 'ar' && typeof value === 'string' && /^[\d.]+$/.test(value)) {
      return toArabicNumerals(value);
    }
    return value.toString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getLocalizedText('transportModes')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getLocalizedText('transportModes')}</CardTitle>
      </CardHeader>
      <CardContent dir={isRTL ? 'rtl' : 'ltr'}>
        <Tabs defaultValue="capacity">
          <TabsList className="mb-4">
            <TabsTrigger value="capacity">{getLocalizedText('capacityCost')}</TabsTrigger>
            <TabsTrigger value="performance">{getLocalizedText('performanceMetrics')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="capacity">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{getLocalizedText('mode')}</TableHead>
                  <TableHead>{getLocalizedText('speed')}</TableHead>
                  <TableHead>{getLocalizedText('costPerKm')}</TableHead>
                  <TableHead>{getLocalizedText('capacity')}</TableHead>
                  <TableHead>{getLocalizedText('volume')}</TableHead>
                  <TableHead>{getLocalizedText('moq')}</TableHead>
                  <TableHead>{getLocalizedText('maxShipments')}</TableHead>
                  <TableHead>{getLocalizedText('emissions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportModes.map((mode) => (
                  <TableRow key={mode.id}>
                    <TableCell className="font-medium">{mode.name}</TableCell>
                    <TableCell>{formatValue(mode.speed_kmh)}</TableCell>
                    <TableCell>
                      {language === 'ar' ? `$${formatValue(mode.cost_per_km.toFixed(2))}` : `$${mode.cost_per_km.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      {formatValue((mode.capacity_kg / 1000).toFixed(1))} {getLocalizedText('tons')}
                    </TableCell>
                    <TableCell>{formatValue(mode.capacity_cbm)} m³</TableCell>
                    <TableCell>
                      {mode.moq ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline">
                                {formatValue(mode.moq)} {mode.moq_units}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getLocalizedText('minimumOrderQuantity')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {mode.max_shipments ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="secondary">
                                {formatValue(mode.max_shipments)}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getLocalizedText('maxShipmentsTooltip')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{formatValue(mode.emissions_kg_per_km.toFixed(1))} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="performance">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{getLocalizedText('mode')}</TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          {getLocalizedText('reliabilityScore')} <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>{getLocalizedText('reliabilityTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          {getLocalizedText('avgLeadTime')} <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>{getLocalizedText('leadTimeTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          {getLocalizedText('leadTimeVariability')} <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80">
                          <p>{getLocalizedText('variabilityTooltip')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead>{getLocalizedText('trackingQuality')}</TableHead>
                  <TableHead>{getLocalizedText('damageRate')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportModes.map((mode) => (
                  <TableRow key={`${mode.id}-performance`}>
                    <TableCell className="font-medium">{mode.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              getReliabilityScore(mode.name) >= 80
                                ? "bg-success"
                                : getReliabilityScore(mode.name) >= 60
                                ? "bg-warning"
                                : "bg-destructive"
                            }`}
                            style={{ width: `${getReliabilityScore(mode.name)}%` }}
                          />
                        </div>
                        <span className="text-sm">{formatValue(getReliabilityScore(mode.name))}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getAverageLeadTime(mode.name)}</TableCell>
                    <TableCell>
                      <Badge variant={getLeadTimeVariabilityVariant(mode.name)}>
                        {language === 'ar' 
                          ? getLocalizedLeadTimeVariability(mode.name) 
                          : getLeadTimeVariability(mode.name)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TrackingQualityBadge mode={mode.name} language={language} />
                    </TableCell>
                    <TableCell>{formatValue(getDamageRate(mode.name))}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions to provide realistic performance data
const getReliabilityScore = (mode: string): number => {
  const scores: Record<string, number> = {
    'Truck (Standard)': 82,
    'Train (Container)': 78,
    'Ship (Container)': 68,
    'Air Freight': 91,
    'Last Mile Delivery': 75
  };
  return scores[mode] || 70; // Default fallback
};

const getAverageLeadTime = (mode: string): string => {
  const leadTimes: Record<string, string> = {
    'Truck (Standard)': '3-5 days',
    'Train (Container)': '7-10 days',
    'Ship (Container)': '20-30 days',
    'Air Freight': '1-2 days',
    'Last Mile Delivery': '1-2 days'
  };
  return leadTimes[mode] || 'Unknown';
};

const getLeadTimeVariability = (mode: string): string => {
  const variability: Record<string, string> = {
    'Truck (Standard)': 'Medium',
    'Train (Container)': 'Medium',
    'Ship (Container)': 'High',
    'Air Freight': 'Low',
    'Last Mile Delivery': 'Medium'
  };
  return variability[mode] || 'Unknown';
};

const getLocalizedLeadTimeVariability = (mode: string): string => {
  const variability = getLeadTimeVariability(mode);
  const variabilityInArabic: Record<string, string> = {
    'Low': 'منخفض',
    'Medium': 'متوسط',
    'High': 'مرتفع',
    'Unknown': 'غير معروف'
  };
  return variabilityInArabic[variability] || variability;
};

const getLeadTimeVariabilityVariant = (mode: string): "default" | "secondary" | "outline" | "destructive" => {
  const variabilityMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    'Low': 'default',
    'Medium': 'secondary',
    'High': 'destructive'
  };
  const variability = getLeadTimeVariability(mode);
  return variabilityMap[variability] || 'outline';
};

const getDamageRate = (mode: string): number => {
  const rates: Record<string, number> = {
    'Truck (Standard)': 1.2,
    'Train (Container)': 0.9,
    'Ship (Container)': 2.1,
    'Air Freight': 0.6,
    'Last Mile Delivery': 2.8
  };
  return rates[mode] || 1.5; // Default fallback
};

interface TrackingQualityBadgeProps {
  mode: string;
  language: 'en' | 'ar';
}

const TrackingQualityBadge = ({ mode, language }: TrackingQualityBadgeProps) => {
  const qualityMap: Record<string, { label: string, labelAr: string, variant: "default" | "secondary" | "outline" | "destructive" }> = {
    'Truck (Standard)': { label: 'Good', labelAr: 'جيد', variant: 'default' },
    'Train (Container)': { label: 'Basic', labelAr: 'أساسي', variant: 'secondary' },
    'Ship (Container)': { label: 'Limited', labelAr: 'محدود', variant: 'outline' },
    'Air Freight': { label: 'Excellent', labelAr: 'ممتاز', variant: 'default' },
    'Last Mile Delivery': { label: 'Good', labelAr: 'جيد', variant: 'default' }
  };
  
  const quality = qualityMap[mode] || { label: 'Unknown', labelAr: 'غير معروف', variant: 'outline' };
  
  return (
    <Badge variant={quality.variant}>
      {language === 'ar' ? quality.labelAr : quality.label}
    </Badge>
  );
};
