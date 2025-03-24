
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

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

  useEffect(() => {
    if (existingPoint) {
      setType(existingPoint.type);
      setDescription(existingPoint.description || '');
      setBufferProfileId(existingPoint.bufferProfileId);
    } else {
      // Default values for new decoupling point
      setType('stock_point');
      setDescription('');
      setBufferProfileId('default-profile');
    }
  }, [existingPoint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const pointData = {
        locationId,
        type,
        description,
        bufferProfileId,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingPoint 
              ? getTranslation('common.edit', language) + ' ' + getTranslation('common.inventory.decouplingPoint', language)
              : getTranslation('common.inventory.addDecouplingPoint', language)
            }
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="bufferProfile">{getTranslation('common.inventory.bufferZones', language)}</Label>
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
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
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
      </DialogContent>
    </Dialog>
  );
};
