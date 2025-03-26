
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, HelpCircle } from "lucide-react";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export interface DecouplingPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: string;
  existingPoint?: DecouplingPoint;
  onSuccess: () => void;
}

export const DecouplingPointDialog: React.FC<DecouplingPointDialogProps> = ({
  open,
  onOpenChange,
  locationId,
  existingPoint,
  onSuccess,
}) => {
  const { language } = useLanguage();
  const { createDecouplingPoint, updateDecouplingPoint } = useDecouplingPoints();
  const [type, setType] = useState<DecouplingPoint['type']>('stock_point');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bufferProfileId, setBufferProfileId] = useState('default-profile');
  const [activeTab, setActiveTab] = useState('basic');
  const [leadTimeAdjustment, setLeadTimeAdjustment] = useState(0);
  const [variabilityFactor, setVariabilityFactor] = useState(1.0);
  const [enableDynamicAdjustment, setEnableDynamicAdjustment] = useState(false);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(0);
  const [replenishmentStrategy, setReplenishmentStrategy] = useState<DecouplingPoint['replenishmentStrategy']>('min-max');

  useEffect(() => {
    if (existingPoint) {
      setType(existingPoint.type);
      setDescription(existingPoint.description || '');
      setBufferProfileId(existingPoint.bufferProfileId);
      setLeadTimeAdjustment(existingPoint.leadTimeAdjustment || 0);
      setVariabilityFactor(existingPoint.variabilityFactor || 1.0);
      setEnableDynamicAdjustment(existingPoint.enableDynamicAdjustment || false);
      setMinimumOrderQuantity(existingPoint.minimumOrderQuantity || 0);
      setReplenishmentStrategy(existingPoint.replenishmentStrategy || 'min-max');
    } else {
      // Default values for new decoupling point
      setType('stock_point');
      setDescription('');
      setBufferProfileId('default-profile');
      setLeadTimeAdjustment(0);
      setVariabilityFactor(1.0);
      setEnableDynamicAdjustment(false);
      setMinimumOrderQuantity(0);
      setReplenishmentStrategy('min-max');
    }
  }, [existingPoint, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const pointData = {
        locationId,
        type,
        description,
        bufferProfileId,
        leadTimeAdjustment,
        variabilityFactor,
        enableDynamicAdjustment,
        minimumOrderQuantity,
        replenishmentStrategy,
      };
      
      let result;
      if (existingPoint) {
        result = await updateDecouplingPoint({
          id: existingPoint.id,
          ...pointData,
        });
      } else {
        result = await createDecouplingPoint(pointData);
      }
      
      if (result.success) {
        onSuccess();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error saving decoupling point:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeDescription = (type: DecouplingPoint['type']) => {
    switch (type) {
      case 'strategic':
        return language === 'ar' 
          ? "نقطة فصل استراتيجية تستخدم للمخزون الاستراتيجي وتخطيط المدى الطويل"
          : "Strategic decoupling point used for strategic inventory and long-term planning";
      case 'customer_order':
        return language === 'ar'
          ? "نقطة فصل طلب العميل تفصل بين عمليات التدفق المدفوعة بالتنبؤ والعمليات المدفوعة بالطلب"
          : "Customer order decoupling point separates forecast-driven flow from order-driven operations";
      case 'stock_point':
        return language === 'ar'
          ? "نقطة مخزون حيث يتم الاحتفاظ بالمنتجات لفصل العمليات المختلفة"
          : "Stock point where products are held to decouple different operations";
      case 'intermediate':
        return language === 'ar'
          ? "نقطة فصل وسيطة تفصل بين مراحل الإنتاج أو النقل" 
          : "Intermediate decoupling point separating production or transportation stages";
      default:
        return '';
    }
  };

  const getVariabilityDescription = (value: number): string => {
    if (value <= 0.7) return language === 'ar' ? "منخفض: للمنتجات ذات الطلب المستقر والمتوقع" : "Low: For products with stable, predictable demand";
    if (value <= 1.0) return language === 'ar' ? "متوسط: للمنتجات ذات التغير المعتدل في الطلب" : "Medium: For products with moderate demand variability";
    if (value <= 1.5) return language === 'ar' ? "عالي: للمنتجات ذات التغير الكبير في الطلب" : "High: For products with significant demand variability";
    return language === 'ar' ? "عالي جدًا: للمنتجات ذات الطلب غير المتوقع بشكل كبير" : "Very High: For products with highly unpredictable demand";
  };

  const getVariabilityColor = (value: number): string => {
    if (value <= 0.7) return "bg-green-100 text-green-800";
    if (value <= 1.0) return "bg-blue-100 text-blue-800";
    if (value <= 1.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getReplenishmentStrategyDescription = (strategy: DecouplingPoint['replenishmentStrategy']): string => {
    switch (strategy) {
      case 'min-max':
        return language === 'ar' 
          ? "ضبط المخزون بين الحد الأدنى والأقصى: نهج متوازن لإدارة المخزون"
          : "Maintains inventory between minimum and maximum levels: balanced approach";
      case 'top-of-green':
        return language === 'ar'
          ? "إعادة الملء إلى أعلى المنطقة الخضراء: مناسب للمنتجات ذات الاستقرار العالي"
          : "Replenishes to top of green zone: ideal for stable items with consistent demand";
      case 'top-of-yellow':
        return language === 'ar' 
          ? "إعادة الملء إلى أعلى المنطقة الصفراء: للمنتجات الحساسة للتكلفة"
          : "Replenishes to top of yellow zone: best for cost-sensitive or space-constrained items";
      default:
        return "";
    }
  };

  const getLeadTimeDescription = (value: number): string => {
    if (value < 0) return language === 'ar' ? "تسريع: تخفيض وقت التوريد للتعويض" : "Accelerated: reduces lead time to compensate";
    if (value === 0) return language === 'ar' ? "قياسي: استخدام وقت ا��توريد الفعلي" : "Standard: using actual lead time";
    if (value <= 2) return language === 'ar' ? "مخزون احتياطي: إضافة هامش صغير" : "Safety buffer: adding a small margin";
    if (value <= 5) return language === 'ar' ? "متوسط: زيادة وقت التوريد لاحتياط إضافي" : "Medium buffer: increasing lead time for additional safety";
    return language === 'ar' ? "احتياطي كبير: زيادة كبيرة في وقت التوريد للحالات غير المتوقعة" : "Large buffer: significant increase for unpredictable situations";
  };

  const getLeadTimeColor = (value: number): string => {
    if (value < 0) return "bg-yellow-100 text-yellow-800";
    if (value === 0) return "bg-green-100 text-green-800";
    if (value <= 2) return "bg-blue-100 text-blue-800";
    if (value <= 5) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingPoint 
              ? getTranslation('common.edit', language) + ' ' + getTranslation('common.inventory.decouplingPoint', language)
              : getTranslation('common.inventory.addDecouplingPoint', language)
            }
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">{language === 'ar' ? "أساسي" : "Basic"}</TabsTrigger>
            <TabsTrigger value="advanced">{language === 'ar' ? "متقدم" : "Advanced"}</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="locationId">{getTranslation('common.inventory.locationId', language)}</Label>
                <Input id="locationId" value={locationId} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{getTranslation('common.inventory.type', language)}</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as DecouplingPoint['type'])}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock_point">Stock Point</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="customer_order">Customer Order</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                  </SelectContent>
                </Select>
                
                {type && (
                  <Alert variant="default" className="mt-2">
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription className="text-xs ml-2">
                      {getTypeDescription(type)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">{getTranslation('common.inventory.description', language)}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={language === 'ar' ? "أدخل وصفاً لنقطة الفصل" : "Enter a description for the decoupling point"}
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bufferProfile">
                    {getTranslation('common.inventory.bufferZones', language)}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {language === 'ar' 
                            ? "ملفات تعريف المخزون تحدد كيفية حساب مناطق المخزون المؤقت"
                            : "Buffer profiles determine how buffer zones are calculated"
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={bufferProfileId}
                  onValueChange={setBufferProfileId}
                >
                  <SelectTrigger id="bufferProfile" className="bg-white">
                    <SelectValue placeholder="Select buffer profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default-profile">Default Profile</SelectItem>
                    <SelectItem value="high-variability">High Variability</SelectItem>
                    <SelectItem value="low-variability">Low Variability</SelectItem>
                    <SelectItem value="custom">Custom Profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="replenishmentStrategy">
                    {language === 'ar' ? "استراتيجية إعادة التزويد" : "Replenishment Strategy"}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {language === 'ar' 
                            ? "تحدد هذه الاستراتيجية كيفية إعادة تزويد المخزون بناءً على مستويات المناطق"
                            : "Determines how inventory is replenished based on buffer zone levels"
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={replenishmentStrategy}
                  onValueChange={(value) => setReplenishmentStrategy(value as DecouplingPoint['replenishmentStrategy'])}
                >
                  <SelectTrigger id="replenishmentStrategy" className="bg-white">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min-max">Min-Max</SelectItem>
                    <SelectItem value="top-of-green">Top of Green</SelectItem>
                    <SelectItem value="top-of-yellow">Top of Yellow</SelectItem>
                  </SelectContent>
                </Select>
                
                {replenishmentStrategy && (
                  <Alert variant="default" className="mt-2 bg-blue-50 border-blue-200">
                    <InfoIcon className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs ml-2 text-blue-700">
                      {getReplenishmentStrategyDescription(replenishmentStrategy)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="leadTimeAdjustment">
                    {language === 'ar' ? "تعديل وقت التسليم (بالأيام)" : "Lead Time Adjustment (days)"}
                  </Label>
                  <span className="text-sm font-medium">{leadTimeAdjustment}</span>
                </div>
                
                <div className="py-2">
                  <Slider
                    id="leadTimeAdjustment"
                    min={-3}
                    max={10}
                    step={1}
                    value={[leadTimeAdjustment]}
                    onValueChange={(value) => setLeadTimeAdjustment(value[0])}
                  />
                </div>
                
                <div className={`text-sm p-2 rounded-md ${getLeadTimeColor(leadTimeAdjustment)}`}>
                  {getLeadTimeDescription(leadTimeAdjustment)}
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? "يضبط وقت التوريد المستخدم في حسابات المخزون المؤقت (القيم السالبة تقلل وقت التوريد)"
                    : "Adjusts lead time used in buffer calculations (negative values reduce lead time)"
                  }
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="variabilityFactor">
                    {language === 'ar' ? "عامل التغير" : "Variability Factor"}
                  </Label>
                  <span className="text-sm font-medium">{variabilityFactor.toFixed(1)}</span>
                </div>
                
                <div className="py-2">
                  <Slider
                    id="variabilityFactor"
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[variabilityFactor]}
                    onValueChange={(value) => setVariabilityFactor(value[0])}
                  />
                </div>
                
                <div className={`text-sm p-2 rounded-md ${getVariabilityColor(variabilityFactor)}`}>
                  {getVariabilityDescription(variabilityFactor)}
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? "يؤثر على حجم المنطقة الحمراء (مخزون الأمان). القيم الأعلى تعني مخزون أمان أكبر."
                    : "Affects the red zone size (safety stock). Higher values mean larger safety stock."
                  }
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="minimumOrderQuantity">
                    {language === 'ar' ? "الحد الأدنى لكمية الطلب" : "Minimum Order Quantity"}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {language === 'ar' 
                            ? "الحد الأدنى لكمية الطلب لكل أمر شراء. استخدم 0 للسماح بأي كمية."
                            : "Minimum quantity for each purchase order. Use 0 to allow any quantity."
                          }
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    id="minimumOrderQuantity"
                    min={0}
                    max={100}
                    step={5}
                    value={[minimumOrderQuantity]}
                    onValueChange={(value) => setMinimumOrderQuantity(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={minimumOrderQuantity}
                    onChange={(e) => setMinimumOrderQuantity(Number(e.target.value))}
                    className="w-20 bg-white"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {language === 'ar' 
                    ? minimumOrderQuantity === 0 
                      ? "لا توجد قيود على كمية الطلب" 
                      : `سيتم تقريب الطلبات إلى مضاعفات ${minimumOrderQuantity}`
                    : minimumOrderQuantity === 0 
                      ? "No restrictions on order quantity" 
                      : `Orders will be rounded up to multiples of ${minimumOrderQuantity}`
                  }
                </div>
              </div>
              
              <div className="space-y-2 bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="enableDynamicAdjustment" 
                    checked={enableDynamicAdjustment}
                    onCheckedChange={(checked) => setEnableDynamicAdjustment(checked as boolean)}
                  />
                  <Label htmlFor="enableDynamicAdjustment" className="text-sm font-medium">
                    {language === 'ar' ? "تمكين التعديل الديناميكي" : "Enable Dynamic Adjustment"}
                  </Label>
                </div>
                
                <div className="text-xs text-muted-foreground pl-6">
                  {language === 'ar' 
                    ? "يسمح بتعديل المخزون المؤقت تلقائيًا استنادًا إلى تغيرات الطلب والموسمية واتجاهات السوق"
                    : "Allows buffer zones to automatically adjust based on demand changes, seasonality, and market trends"
                  }
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {getTranslation('common.cancel', language)}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 
                  (language === 'ar' ? "جاري الحفظ..." : "Saving...") : 
                  getTranslation('common.save', language)
                }
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
