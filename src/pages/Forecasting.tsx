
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingContainer } from "@/components/forecasting/ForecastingContainer";

const Forecasting = () => {
  return (
    <DashboardLayout>
      <ForecastingContainer />
    </DashboardLayout>
  );
};

export default Forecasting;
