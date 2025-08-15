
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
    <Card className="bg-white dark:bg-card shadow-lg border border-border rounded-lg p-6">
      <h4 className="font-bold text-xl text-foreground mb-6 flex items-center">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        {getTranslation('common.dashboardMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">{getTranslation('common.dashboardMetrics.totalSKUs', language)}</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{formatNumber(1234)}</p>
              <div className="flex items-center text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+5.2%</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">{getTranslation('common.dashboardMetrics.bufferPenetration', language)}</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{formatPercentage(78)}</p>
              <div className="flex items-center text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+3.4%</span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-amber-500 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold">{getTranslation('common.dashboardMetrics.orderStatus', language)}</p>
              <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{formatPercentage(92)}</p>
              <div className="flex items-center text-sm text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="font-medium">-1.2%</span>
              </div>
            </div>
            <div className="bg-amber-500 p-3 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">{getTranslation('common.dashboardMetrics.flowIndex', language)}</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatNumber(4.2)}x</p>
              <div className="flex items-center text-sm text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+0.3x</span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl shadow-lg">
              <ArrowUpDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DashboardMetrics;
