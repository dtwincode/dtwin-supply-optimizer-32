
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useIndustry } from "@/contexts/IndustryContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { industries } from "@/components/guidelines/data/industryData";
import { IndustryType } from "@/contexts/IndustryContext";

interface IndustrySelectionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function IndustrySelectionDialog({ 
  open: controlledOpen, 
  onOpenChange 
}: IndustrySelectionDialogProps) {
  const { selectedIndustry, setSelectedIndustry, isIndustrySelected } = useIndustry();
  const [open, setOpen] = useState(controlledOpen !== undefined ? controlledOpen : !isIndustrySelected);
  const [selectedValue, setSelectedValue] = useState<IndustryType>(selectedIndustry);
  const { language } = useLanguage();

  useEffect(() => {
    // If controlled externally
    if (controlledOpen !== undefined) {
      setOpen(controlledOpen);
    }
    // If not controlled and industry hasn't been selected yet
    else if (controlledOpen === undefined) {
      setOpen(!isIndustrySelected);
    }
  }, [controlledOpen, isIndustrySelected]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = () => {
    setSelectedIndustry(selectedValue);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'ar' ? 'اختر نوع القطاع' : 'Select Your Industry'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ar' 
              ? 'سيتم تخصيص التطبيق وفقًا للقطاع المختار'
              : 'The application will be customized according to your industry'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <RadioGroup 
            value={selectedValue} 
            onValueChange={(value) => setSelectedValue(value as IndustryType)}
            className="grid gap-4"
          >
            {industries.map((industry) => (
              <div key={industry.id} className="flex items-center space-x-2 space-y-0">
                <RadioGroupItem value={industry.id} id={industry.id} />
                <Label htmlFor={industry.id} className="flex-1">
                  {language === 'ar' ? industry.nameAr : industry.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {language === 'ar' ? 'تأكيد' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
