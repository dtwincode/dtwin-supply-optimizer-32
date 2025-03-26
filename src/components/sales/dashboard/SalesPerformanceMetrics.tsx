
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const SalesPerformanceMetrics = () => {
  const { language } = useLanguage();

  const metrics = [
    {
      title: language === 'ar' ? 'أداء المبيعات' : 'Sales Performance',
      value: '89.4%',
      description: language === 'ar' ? 'من الهدف' : 'of target',
      trend: 'up',
      trendValue: '2.3%',
      icon: <DollarSign className="h-4 w-4 text-primary" />,
      progress: 89.4,
      color: "bg-primary",
    },
    {
      title: language === 'ar' ? 'دقة التنبؤ' : 'Forecast Accuracy',
      value: '92.1%',
      description: language === 'ar' ? 'متوسط 3 أشهر' : '3-month average',
      trend: 'up',
      trendValue: '1.8%',
      icon: <Activity className="h-4 w-4 text-blue-500" />,
      progress: 92.1,
      color: "bg-blue-500",
    },
    {
      title: language === 'ar' ? 'معدل الإرجاع' : 'Return Rate',
      value: '3.2%',
      description: language === 'ar' ? 'من المبيعات' : 'of sales',
      trend: 'down',
      trendValue: '0.5%',
      icon: <Package className="h-4 w-4 text-orange-500" />,
      progress: 3.2,
      color: "bg-orange-500",
      isInverted: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="p-3 border overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-1.5">
            <div className="bg-gray-50 rounded-full p-1.5 mr-2">
              {metric.icon}
            </div>
            <div>
              <h3 className="text-xs font-medium">{metric.title}</h3>
              <p className="text-[10px] text-muted-foreground">{metric.description}</p>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold">{metric.value}</span>
              <div className={cn(
                "flex items-center text-[10px] font-medium",
                metric.isInverted 
                  ? (metric.trend === 'up' ? "text-red-500" : "text-green-500")
                  : (metric.trend === 'up' ? "text-green-500" : "text-red-500")
              )}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-0.5 h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="mr-0.5 h-2.5 w-2.5" />
                )}
                {metric.trendValue}
              </div>
            </div>
            
            <Progress 
              value={metric.isInverted ? 100 - metric.progress : metric.progress} 
              className={cn("h-1 rounded-full", `bg-gray-100 [&>div]:${metric.color}`)}
            />
            
            <p className="text-[10px] text-muted-foreground text-right">
              {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
