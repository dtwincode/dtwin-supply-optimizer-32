
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
      icon: <DollarSign className="h-3.5 w-3.5 text-primary" />,
      progress: 89.4,
      color: "bg-primary",
    },
    {
      title: language === 'ar' ? 'دقة التنبؤ' : 'Forecast Accuracy',
      value: '92.1%',
      description: language === 'ar' ? 'متوسط 3 أشهر' : '3-month average',
      trend: 'up',
      trendValue: '1.8%',
      icon: <Activity className="h-3.5 w-3.5 text-blue-500" />,
      progress: 92.1,
      color: "bg-blue-500",
    },
    {
      title: language === 'ar' ? 'معدل الإرجاع' : 'Return Rate',
      value: '3.2%',
      description: language === 'ar' ? 'من المبيعات' : 'of sales',
      trend: 'down',
      trendValue: '0.5%',
      icon: <Package className="h-3.5 w-3.5 text-orange-500" />,
      progress: 3.2,
      color: "bg-orange-500",
      isInverted: true,
    }
  ];

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-2 w-full pb-1">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="p-2 border min-w-[140px] flex-1 overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center mb-1">
            <div className="bg-gray-50 rounded-full p-1 mr-1.5">
              {metric.icon}
            </div>
            <div>
              <h3 className="text-[10px] font-medium leading-tight">{metric.title}</h3>
              <p className="text-[8px] text-muted-foreground leading-tight">{metric.description}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold">{metric.value}</span>
              <div className={cn(
                "flex items-center text-[8px] font-medium",
                metric.isInverted 
                  ? (metric.trend === 'up' ? "text-red-500" : "text-green-500")
                  : (metric.trend === 'up' ? "text-green-500" : "text-red-500")
              )}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-0.5 h-2 w-2" />
                ) : (
                  <TrendingDown className="mr-0.5 h-2 w-2" />
                )}
                {metric.trendValue}
              </div>
            </div>
            
            <Progress 
              value={metric.isInverted ? 100 - metric.progress : metric.progress} 
              className={cn("h-0.5 rounded-full", `bg-gray-100 [&>div]:${metric.color}`)}
            />
            
            <p className="text-[8px] text-muted-foreground text-right">
              {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
