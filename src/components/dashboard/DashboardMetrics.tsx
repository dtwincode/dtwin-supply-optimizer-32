
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
    <Card className="bg-card shadow-[var(--shadow-card)] border-border p-6">
      <h4 className="font-bold text-xl text-card-foreground mb-6 flex items-center">
        <div className="bg-primary/10 p-2 rounded-lg mr-3">
          <Package className="h-6 w-6 text-primary" />
        </div>
        {getTranslation('common.dashboardMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-l-4 border-l-primary rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-primary font-semibold">{getTranslation('common.dashboardMetrics.totalSKUs', language)}</p>
              <p className="text-3xl font-bold text-card-foreground">{formatNumber(1234)}</p>
              <div className="flex items-center text-sm text-success bg-success/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+5.2%</span>
              </div>
            </div>
            <div className="bg-primary p-3 rounded-xl shadow-lg">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/5 to-success/10 p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-l-4 border-l-success rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-success font-semibold">{getTranslation('common.dashboardMetrics.bufferPenetration', language)}</p>
              <p className="text-3xl font-bold text-card-foreground">{formatPercentage(78)}</p>
              <div className="flex items-center text-sm text-success bg-success/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+3.4%</span>
              </div>
            </div>
            <div className="bg-success p-3 rounded-xl shadow-lg">
              <ShieldAlert className="h-6 w-6 text-success-foreground" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-l-4 border-l-warning rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-warning font-semibold">{getTranslation('common.dashboardMetrics.orderStatus', language)}</p>
              <p className="text-3xl font-bold text-card-foreground">{formatPercentage(92)}</p>
              <div className="flex items-center text-sm text-danger bg-danger/10 px-2 py-1 rounded-full">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="font-medium">-1.2%</span>
              </div>
            </div>
            <div className="bg-warning p-3 rounded-xl shadow-lg">
              <Zap className="h-6 w-6 text-warning-foreground" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-l-4 border-l-accent rounded-xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-accent-foreground font-semibold">{getTranslation('common.dashboardMetrics.flowIndex', language)}</p>
              <p className="text-3xl font-bold text-card-foreground">{formatNumber(4.2)}x</p>
              <div className="flex items-center text-sm text-success bg-success/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">+0.3x</span>
              </div>
            </div>
            <div className="bg-accent p-3 rounded-xl shadow-lg">
              <ArrowUpDown className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default DashboardMetrics;
