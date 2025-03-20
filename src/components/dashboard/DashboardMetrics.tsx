
import { Card } from "@/components/ui/card";
import { Package, ShieldAlert, Zap, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
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
    <Card className="p-3">
      <h4 className="font-display text-md font-semibold mb-2 px-2">
        {getTranslation('dashboardMetrics.title', language) || "Key Metrics"}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 font-medium">{getTranslation('dashboardMetrics.totalSKUs', language)}</p>
              <p className="text-lg font-semibold">{formatNumber(1234)}</p>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                <span>+5.2%</span>
              </div>
            </div>
            <div className="bg-blue-50 p-1.5 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-success-500">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 font-medium">{getTranslation('dashboardMetrics.bufferPenetration', language)}</p>
              <p className="text-lg font-semibold">{formatPercentage(78)}</p>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                <span>+3.4%</span>
              </div>
            </div>
            <div className="bg-green-50 p-1.5 rounded-full">
              <ShieldAlert className="h-4 w-4 text-success-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-warning-500">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 font-medium">{getTranslation('dashboardMetrics.orderStatus', language)}</p>
              <p className="text-lg font-semibold">{formatPercentage(92)}</p>
              <div className="flex items-center text-xs text-amber-600">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                <span>-1.2%</span>
              </div>
            </div>
            <div className="bg-amber-50 p-1.5 rounded-full">
              <Zap className="h-4 w-4 text-warning-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-danger-500">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500 font-medium">{getTranslation('dashboardMetrics.flowIndex', language)}</p>
              <p className="text-lg font-semibold">{formatNumber(4.2)}x</p>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                <span>+0.3x</span>
              </div>
            </div>
            <div className="bg-red-50 p-1.5 rounded-full">
              <ArrowUpDown className="h-4 w-4 text-danger-500" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DashboardMetrics;
