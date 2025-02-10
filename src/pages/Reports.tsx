
import DashboardLayout from "@/components/DashboardLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Card } from "@/components/ui/card";

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports</h1>
        </div>
        <Card className="p-6">
          <ReportGenerator />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
