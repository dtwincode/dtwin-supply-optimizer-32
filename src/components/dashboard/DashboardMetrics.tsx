
import { Card } from "@/components/ui/card";
import { Package, ShieldAlert, Zap, ArrowUpDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const DashboardMetrics = () => {
  const { language } = useLanguage();

  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      return toArabicNumerals(num);
    }
    return num.toString();
  };

  const formatPercentage = (percentage: number): string => {
    if (language === 'ar') {
      return `${toArabicNumerals(percentage)}%`;
    }
    return `${percentage}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.totalSKUs', language)}</p>
            <p className="text-3xl font-semibold">{formatNumber(1234)}</p>
          </div>
          <Package className="h-8 w-8 text-primary" />
        </div>
      </Card>
      
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.bufferPenetration', language)}</p>
            <p className="text-3xl font-semibold">{formatPercentage(78)}</p>
          </div>
          <ShieldAlert className="h-8 w-8 text-success-500" />
        </div>
      </Card>
      
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.orderStatus', language)}</p>
            <p className="text-3xl font-semibold">{formatPercentage(92)}</p>
          </div>
          <Zap className="h-8 w-8 text-warning-500" />
        </div>
      </Card>
      
      <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.flowIndex', language)}</p>
            <p className="text-3xl font-semibold">{formatNumber(4.2)}x</p>
          </div>
          <ArrowUpDown className="h-8 w-8 text-danger-500" />
        </div>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
