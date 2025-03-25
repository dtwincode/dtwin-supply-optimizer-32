
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

interface DecouplingPointDialogProps {
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
  const { createPoint, updatePoint } = useDecouplingPoints();
  const [type, setType] = useState<DecouplingPoint['type']>('stock_point');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bufferProfileId, setBufferProfileId] = useState('default-profile');
  const [activeTab, setActiveTab] = useState('basic');
  const [leadTimeAdjustment, setLeadTimeAdjustment] = useState(0);
  const [variabilityFactor, setVariabilityFactor] = useState(1.0);
  const [enableDynamicAdjustment, setEnableDynamicAdjustment] = useState(false);
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(0);
  const [replenishmentStrategy, setReplenishmentStrategy] = useState('min-max');

  useEffect(() => {
    if (existingPoint) {
      setType(existingPoint.type);
      setDescription(existingPoint.description || '');
      setBufferProfileId(existingPoint.bufferProfileId);
      // If the existingPoint had additional properties, we would set them here
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
        result = await updatePoint({
          id: existingPoint.id,
          ...pointData,
        });
      } else {
        result = await createPoint(pointData);
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
                  <Label htmlFor="bufferProfile">{getTranslation('common.inventory.bufferZones', language)}</Label>
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
                  <SelectTrigger id="bufferProfile">
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
                <Label htmlFor="replenishmentStrategy">
                  {language === 'ar' ? "استراتيجية إعادة التزويد" : "Replenishment Strategy"}
                </Label>
                <Select
                  value={replenishmentStrategy}
                  onValueChange={setReplenishmentStrategy}
                >
                  <SelectTrigger id="replenishmentStrategy">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min-max">Min-Max</SelectItem>
                    <SelectItem value="top-of-green">Top of Green</SelectItem>
                    <SelectItem value="top-of-yellow">Top of Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leadTimeAdjustment">
                  {language === 'ar' ? "تعديل وقت التسليم (بالأيام)" : "Lead Time Adjustment (days)"}
                </Label>
                <Input
                  id="leadTimeAdjustment"
                  type="number"
                  value={leadTimeAdjustment}
                  onChange={(e) => setLeadTimeAdjustment(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="variabilityFactor">
                  {language === 'ar' ? "عامل التغير" : "Variability Factor"}
                </Label>
                <Input
                  id="variabilityFactor"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="3.0"
                  value={variabilityFactor}
                  onChange={(e) => setVariabilityFactor(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumOrderQuantity">
                  {language === 'ar' ? "الحد الأدنى لكمية الطلب" : "Minimum Order Quantity"}
                </Label>
                <Input
                  id="minimumOrderQuantity"
                  type="number"
                  min="0"
                  value={minimumOrderQuantity}
                  onChange={(e) => setMinimumOrderQuantity(Number(e.target.value))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enableDynamicAdjustment" 
                  checked={enableDynamicAdjustment}
                  onCheckedChange={(checked) => setEnableDynamicAdjustment(checked as boolean)}
                />
                <Label htmlFor="enableDynamicAdjustment" className="text-sm">
                  {language === 'ar' ? "تمكين التعديل الديناميكي" : "Enable Dynamic Adjustment"}
                </Label>
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
