import { useState } from "react";
import { DistributionQuantitiesTable } from "../components/distribution/DistributionQuantitiesTable";
import { ImpactAnalysis } from "../components/distribution/ImpactAnalysis";
import { DistributionCharts } from "../components/distribution/DistributionCharts";
import { DistributionCalendar } from "../components/distribution/DistributionCalendar";
import { DisaggregationRulesDialog } from "../components/distribution/DisaggregationRulesDialog";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface DisaggregationRule {
  id: string;
  name: string;
  type: 'even' | 'weighted' | 'historical' | 'custom';
  weightingFactor?: number;
  customPattern?: number[];
  daysOfWeek?: {
    [key: string]: number;  // Monday: 1.2, Tuesday: 0.8, etc.
  };
  constraints?: {
    minDaily?: number;
    maxDaily?: number;
    minWeekly?: number;
    maxWeekly?: number;
  };
}

interface DistributionData {
  id: string;
  sku: string;
  category: string;
  currentStock: number;
  minQuantity: number;
  optimalQuantity: number;
  maxQuantity: number;
  leadTime: number;
  safetyStock: number;
  forecastAccuracy: number;
  serviceLevel: number;
  lastUpdated: string;
  disaggregationRuleId?: string;
  manualOverrides?: {
    [date: string]: number;
  };
}

const StepHeader = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex items-start gap-4 mb-4">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
      {number}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const ForecastDistributionTab = ({ forecastTableData }: { forecastTableData: any[] }) => {
  const [selectedSKU, setSelectedSKU] = useState<string>("SKU001");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [forecastPeriod, setForecastPeriod] = useState<string>("7");
  const [disaggregationRules, setDisaggregationRules] = useState<DisaggregationRule[]>([
    {
      id: "rule1",
      name: "Even Distribution",
      type: "even"
    },
    {
      id: "rule2",
      name: "Weekday Weighted",
      type: "weighted",
      daysOfWeek: {
        Monday: 1.2,
        Tuesday: 1.1,
        Wednesday: 1.0,
        Thursday: 1.1,
        Friday: 1.3,
        Saturday: 0.7,
        Sunday: 0.6
      }
    },
    {
      id: "rule3",
      name: "Custom Pattern",
      type: "custom",
      customPattern: [1, 1.2, 0.8, 1.1, 0.9, 0.7, 0.6]
    }
  ]);

  const [distributionData, setDistributionData] = useState<DistributionData[]>([
    {
      id: "1",
      sku: "SKU001",
      category: "Electronics",
      currentStock: 120,
      minQuantity: 100,
      optimalQuantity: 150,
      maxQuantity: 200,
      leadTime: 14,
      safetyStock: 50,
      forecastAccuracy: 85,
      serviceLevel: 95,
      lastUpdated: "2024-03-25"
    },
    {
      id: "2",
      sku: "SKU002",
      category: "Appliances",
      currentStock: 60,
      minQuantity: 50,
      optimalQuantity: 75,
      maxQuantity: 100,
      leadTime: 21,
      safetyStock: 25,
      forecastAccuracy: 78,
      serviceLevel: 92,
      lastUpdated: "2024-03-25"
    },
    {
      id: "3",
      sku: "SKU003",
      category: "Furniture",
      currentStock: 35,
      minQuantity: 25,
      optimalQuantity: 40,
      maxQuantity: 60,
      leadTime: 30,
      safetyStock: 15,
      forecastAccuracy: 92,
      serviceLevel: 98,
      lastUpdated: "2024-03-25"
    }
  ]);

  const periodOptions = [
    { value: "7", label: "7 days" },
    { value: "14", label: "14 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "180", label: "180 days" },
    { value: "365", label: "365 days" },
  ];

  const applyDisaggregationRule = (sku: string, ruleId: string) => {
    const rule = disaggregationRules.find(r => r.id === ruleId);
    const skuData = distributionData.find(d => d.sku === sku);
    
    if (!rule || !skuData) return;

    const newData = distributionData.map(item => {
      if (item.sku === sku) {
        return {
          ...item,
          disaggregationRuleId: ruleId
        };
      }
      return item;
    });

    setDistributionData(newData);
    toast.success(`Applied ${rule.name} to ${sku}`);
  };

  const handleManualOverride = (sku: string, date: string, quantity: number) => {
    const newData = distributionData.map(item => {
      if (item.sku === sku) {
        return {
          ...item,
          manualOverrides: {
            ...(item.manualOverrides || {}),
            [date]: quantity
          }
        };
      }
      return item;
    });

    setDistributionData(newData);
    toast.success(`Manual override set for ${sku} on ${date}`);
  };

  const generateWeeklyDistribution = (sku: string) => {
    const skuData = distributionData.find(d => d.sku === sku);
    if (!skuData) return [];

    const rule = disaggregationRules.find(r => r.id === skuData.disaggregationRuleId);
    const baseQuantity = skuData.optimalQuantity / 4;

    if (!rule) {
      return Array.from({ length: 4 }).map((_, i) => ({
        week: `Week ${i + 1}`,
        planned: baseQuantity,
        minimum: skuData.minQuantity / 4,
        maximum: skuData.maxQuantity / 4
      }));
    }

    return Array.from({ length: 4 }).map((_, i) => {
      let planned = baseQuantity;

      if (rule.type === 'weighted' && rule.weightingFactor) {
        planned *= rule.weightingFactor;
      } else if (rule.type === 'custom' && rule.customPattern) {
        planned *= rule.customPattern[i % rule.customPattern.length];
      }

      // Apply any manual overrides
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() + i * 7);
      const dateKey = weekStart.toISOString().split('T')[0];
      
      if (skuData.manualOverrides?.[dateKey]) {
        planned = skuData.manualOverrides[dateKey];
      }

      return {
        week: `Week ${i + 1}`,
        planned,
        minimum: skuData.minQuantity / 4,
        maximum: skuData.maxQuantity / 4
      };
    });
  };

  const handleUpdateRules = (newRules: DisaggregationRule[]) => {
    setDisaggregationRules(newRules);
    toast.success("Disaggregation rules updated successfully");
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-start">
          <StepHeader 
            number={1}
            title="Configure Distribution Parameters"
            description="Set the forecast timeline and select products for distribution planning"
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h4 className="text-base font-medium mb-4">Forecast Timeline</h4>
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          <Card className="p-6">
            <h4 className="text-base font-medium mb-4">Product Selection</h4>
            <Select value={selectedSKU} onValueChange={setSelectedSKU}>
              <SelectTrigger>
                <SelectValue placeholder="Select SKU" />
              </SelectTrigger>
              <SelectContent>
                {distributionData.map((item) => (
                  <SelectItem key={item.sku} value={item.sku}>
                    {item.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <StepHeader 
          number={2}
          title="Review Distribution Quantities"
          description="Analyze and adjust distribution quantities across your network"
        />
        
        <DistributionQuantitiesTable
          distributionData={distributionData}
          onUpdateDistributionData={setDistributionData}
          forecastPeriod={forecastPeriod}
        />
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <StepHeader 
          number={3}
          title="Analyze Distribution Impact"
          description="Review and reconcile distribution changes across hierarchy levels"
        />
        
        <ImpactAnalysis
          onReconciliationComplete={() => {
            // Handle reconciliation completion
          }}
          forecastPeriod={forecastPeriod}
        />
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <StepHeader 
          number={4}
          title="Visualize Distribution Plan"
          description="View distribution patterns and trends across your timeline"
        />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <DistributionCharts
            selectedSKU={selectedSKU}
            distributionData={distributionData}
            weeklyDistribution={generateWeeklyDistribution(selectedSKU)}
            onSelectSKU={setSelectedSKU}
            forecastPeriod={forecastPeriod}
          />
          
          <DistributionCalendar
            selectedDate={selectedDate}
            selectedSKU={selectedSKU}
            distributionData={distributionData}
            onSelectDate={setSelectedDate}
            disaggregationRules={disaggregationRules}
            onUpdateRules={handleUpdateRules}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Info className="h-4 w-4" />
        <span>Changes are automatically saved as you make them</span>
      </div>
    </div>
  );
};
