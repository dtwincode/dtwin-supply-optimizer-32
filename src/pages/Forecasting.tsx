
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { ForecastingContainer } from "@/components/forecasting/ForecastingContainer";
import { Separator } from "@/components/ui/separator";

const Forecasting = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Demand Forecasting</h1>
          <p className="text-muted-foreground mt-2">
            Analyze, predict, and optimize your demand forecasts with advanced analytics
          </p>
          <Separator className="my-6" />
        </div>
        <ForecastingContainer />
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
