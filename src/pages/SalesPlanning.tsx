
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SalesPlan } from "@/types/sales";
import { SalesPlanForm } from "@/components/sales/SalesPlanForm";
import { SalesPlanFilter } from "@/components/sales/SalesPlanFilter";
import { SalesPlanTable } from "@/components/sales/SalesPlanTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const SalesPlanning = () => {
  const [planType, setPlanType] = useState<"top-down" | "bottom-up">("top-down");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [salesPlans, setSalesPlans] = useState<SalesPlan[]>([]);
  const { language } = useLanguage();

  const handleSavePlan = (newPlan: SalesPlan) => {
    setSalesPlans(prev => [...prev, newPlan]);
  };

  const filteredSalesPlans = salesPlans.filter((plan) => {
    const matchesSearch = 
      plan.productHierarchy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.productHierarchy.subcategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.location.city?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || plan.productHierarchy.category === selectedCategory;
    const matchesRegion = !selectedRegion || plan.location.region === selectedRegion;
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(plan.status);

    return matchesSearch && matchesCategory && matchesRegion && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'تخطيط وإدارة المبيعات'
                  : 'Plan and manage sales activities'}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant={planType === "top-down" ? "default" : "outline"}
                onClick={() => setPlanType("top-down")}
                className="gap-2"
              >
                <ArrowDown className="h-4 w-4" />
                {getTranslation('sales.topDown', language)}
              </Button>
              <Button
                variant={planType === "bottom-up" ? "default" : "outline"}
                onClick={() => setPlanType("bottom-up")}
                className="gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                {getTranslation('sales.bottomUp', language)}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {getTranslation('sales.newPlan', language)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{getTranslation('sales.newPlan', language)}</DialogTitle>
                  </DialogHeader>
                  <SalesPlanForm 
                    onClose={() => setIsDialogOpen(false)} 
                    onSave={handleSavePlan}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <SalesPlanFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
            />

            <SalesPlanTable salesPlans={filteredSalesPlans} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesPlanning;
