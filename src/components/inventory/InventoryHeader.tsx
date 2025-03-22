
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import { TourButton } from "@/components/inventory/InventoryTourGuide";
import { industries } from "@/components/guidelines/data/industryData";

interface InventoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onDecouplingPointDialogOpen: () => void;
  startTour: () => void;
  selectedIndustry?: string;
  onIndustryChange?: (industry: string) => void;
}

export const InventoryHeader = ({
  searchQuery,
  setSearchQuery,
  onDecouplingPointDialogOpen,
  startTour,
  selectedIndustry = "retail",
  onIndustryChange
}: InventoryHeaderProps) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center inventory-header">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            {getTranslation("common.inventory.manageAndTrack", language)}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={startTour}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {language === 'ar' ? 'بدء جولة مرشدة' : 'Start guided tour'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 inventory-filters">
          {onIndustryChange && (
            <Select
              value={selectedIndustry}
              onValueChange={onIndustryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.id}>
                    {language === 'ar' ? industry.nameAr : industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <InventoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Button
            variant="outline"
            onClick={onDecouplingPointDialogOpen}
            className="decoupling-point-button"
          >
            {getTranslation("common.inventory.addDecouplingPoint", language)}
          </Button>
          <TourButton onClick={startTour} />
        </div>
      </div>
    </div>
  );
};
