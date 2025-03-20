
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">{getTranslation('dashboardMetrics.totalSKUs', language)}</p>
            <p className="text-2xl font-semibold">{formatNumber(1234)}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5.2% {getTranslation('common.fromLastMonth', language)}</span>
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded-full">
            <Package className="h-5 w-5 text-primary" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-success-500">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">{getTranslation('dashboardMetrics.bufferPenetration', language)}</p>
            <p className="text-2xl font-semibold">{formatPercentage(78)}</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+3.4% {getTranslation('common.fromLastWeek', language)}</span>
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded-full">
            <ShieldAlert className="h-5 w-5 text-success-500" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-warning-500">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">{getTranslation('dashboardMetrics.orderStatus', language)}</p>
            <p className="text-2xl font-semibold">{formatPercentage(92)}</p>
            <div className="flex items-center text-xs text-amber-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>-1.2% {getTranslation('common.fromLastWeek', language)}</span>
            </div>
          </div>
          <div className="bg-amber-50 p-2 rounded-full">
            <Zap className="h-5 w-5 text-warning-500" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-danger-500">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-500 font-medium">{getTranslation('dashboardMetrics.flowIndex', language)}</p>
            <p className="text-2xl font-semibold">{formatNumber(4.2)}x</p>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+0.3x {getTranslation('common.fromLastMonth', language)}</span>
            </div>
          </div>
          <div className="bg-red-50 p-2 rounded-full">
            <ArrowUpDown className="h-5 w-5 text-danger-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
