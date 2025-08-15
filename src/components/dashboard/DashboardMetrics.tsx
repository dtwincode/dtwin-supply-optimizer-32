
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
    <Card className="p-6">
      <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">
        {getTranslation('common.dashboardMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{getTranslation('common.dashboardMetrics.totalSKUs', language)}</p>
              <p className="text-2xl font-bold">{formatNumber(1234)}</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5.2%</span>
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-success-500">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{getTranslation('common.dashboardMetrics.bufferPenetration', language)}</p>
              <p className="text-2xl font-bold">{formatPercentage(78)}</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+3.4%</span>
              </div>
            </div>
            <div className="bg-success-50 p-2 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-success-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-warning-500">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{getTranslation('common.dashboardMetrics.orderStatus', language)}</p>
              <p className="text-2xl font-bold">{formatPercentage(92)}</p>
              <div className="flex items-center text-sm text-warning-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-1.2%</span>
              </div>
            </div>
            <div className="bg-warning-50 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-warning-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-danger-500">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">{getTranslation('common.dashboardMetrics.flowIndex', language)}</p>
              <p className="text-2xl font-bold">{formatNumber(4.2)}x</p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+0.3x</span>
              </div>
            </div>
            <div className="bg-danger-50 p-2 rounded-lg">
              <ArrowUpDown className="h-5 w-5 text-danger-500" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DashboardMetrics;
