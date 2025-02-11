
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, addWeeks } from "date-fns";

interface ForecastDistributionTabProps {
  forecastTableData: any[];
}

export const ForecastDistributionTab = ({
  forecastTableData
}: ForecastDistributionTabProps) => {
  // Transform the data to include proper dates and SKU info
  const startDate = new Date();
  const enhancedData = forecastTableData.map((row, index) => ({
    ...row,
    week: format(addWeeks(startDate, index), 'MMM dd, yyyy'),
    sku: "IPH-12", // Default SKU for demonstration
    category: "Electronics",
    subcategory: "Smartphones"
  }));

  return <ForecastTable data={enhancedData} />;
};
