
import { ForecastTable } from "@/components/forecasting/ForecastTable";

interface ForecastDistributionTabProps {
  forecastTableData: any[];
}

export const ForecastDistributionTab = ({
  forecastTableData
}: ForecastDistributionTabProps) => {
  return <ForecastTable data={forecastTableData} />;
};
