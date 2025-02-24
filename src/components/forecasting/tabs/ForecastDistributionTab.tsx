import { useState } from "react";
import { DistributionQuantitiesTable } from "../components/distribution/DistributionQuantitiesTable";
import { ImpactAnalysis } from "../components/distribution/ImpactAnalysis";
import { DistributionCharts } from "../components/distribution/DistributionCharts";
import { DistributionCalendar } from "../components/distribution/DistributionCalendar";

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
}

export const ForecastDistributionTab = ({ forecastTableData }: { forecastTableData: any[] }) => {
  const [selectedSKU, setSelectedSKU] = useState<string>("SKU001");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const generateWeeklyDistribution = (sku: string) => {
    const skuData = distributionData.find(d => d.sku === sku);
    if (!skuData) return [];

    return Array.from({ length: 4 }).map((_, i) => ({
      week: `Week ${i + 1}`,
      planned: skuData.optimalQuantity / 4,
      minimum: skuData.minQuantity / 4,
      maximum: skuData.maxQuantity / 4
    }));
  };

  const handleUpdateDistributionData = (newData: DistributionData[]) => {
    setDistributionData(newData);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <DistributionQuantitiesTable
        distributionData={distributionData}
        onUpdateDistributionData={handleUpdateDistributionData}
      />

      <ImpactAnalysis
        onReconciliationComplete={() => {
          // Handle reconciliation completion
        }}
      />

      <DistributionCharts
        selectedSKU={selectedSKU}
        distributionData={distributionData}
        weeklyDistribution={generateWeeklyDistribution(selectedSKU)}
        onSelectSKU={setSelectedSKU}
      />

      <DistributionCalendar
        selectedDate={selectedDate}
        selectedSKU={selectedSKU}
        distributionData={distributionData}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
};
