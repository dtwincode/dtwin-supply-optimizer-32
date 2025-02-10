
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Package, Waves } from "lucide-react";

const InventorySummaryCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-success-50 rounded-full">
            <CheckCircle className="h-6 w-6 text-success-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Green Zone</p>
            <p className="text-2xl font-semibold">45 SKUs</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-warning-50 rounded-full">
            <AlertTriangle className="h-6 w-6 text-warning-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Yellow Zone</p>
            <p className="text-2xl font-semibold">28 SKUs</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-danger-50 rounded-full">
            <Package className="h-6 w-6 text-danger-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Red Zone</p>
            <p className="text-2xl font-semibold">12 SKUs</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-50 rounded-full">
            <Waves className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Flow Position</p>
            <p className="text-2xl font-semibold">105 units</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InventorySummaryCards;
