
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
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      progress: 89.4,
      color: "bg-primary",
    },
    {
      title: language === 'ar' ? 'دقة التنبؤ' : 'Forecast Accuracy',
      value: '92.1%',
      description: language === 'ar' ? 'متوسط 3 أشهر' : '3-month average',
      trend: 'up',
      trendValue: '1.8%',
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      progress: 92.1,
      color: "bg-blue-500",
    },
    {
      title: language === 'ar' ? 'معدل الإرجاع' : 'Return Rate',
      value: '3.2%',
      description: language === 'ar' ? 'من المبيعات' : 'of sales',
      trend: 'down',
      trendValue: '0.5%',
      icon: <Package className="h-5 w-5 text-orange-500" />,
      progress: 3.2,
      color: "bg-orange-500",
      isInverted: true,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="p-4 border overflow-hidden relative hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex items-center mb-2">
            <div className={cn(
              "p-2 rounded-full mr-3",
              metric.trend === 'up' ? 
                (metric.isInverted ? "bg-red-100" : "bg-green-100") : 
                (metric.isInverted ? "bg-green-100" : "bg-red-100")
            )}>
              {metric.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium">{metric.title}</h3>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{metric.value}</span>
              <div className="ml-auto flex items-center text-xs">
                {metric.trend === 'up' ? (
                  <TrendingUp className={cn(
                    "mr-1 h-3 w-3", 
                    metric.isInverted ? "text-red-500" : "text-green-500"
                  )} />
                ) : (
                  <TrendingDown className={cn(
                    "mr-1 h-3 w-3", 
                    metric.isInverted ? "text-green-500" : "text-red-500"
                  )} />
                )}
                <span className={cn(
                  metric.isInverted 
                    ? (metric.trend === 'up' ? "text-red-500" : "text-green-500")
                    : (metric.trend === 'up' ? "text-green-500" : "text-red-500")
                )}>
                  {metric.trendValue}
                </span>
              </div>
            </div>
            
            <Progress 
              value={metric.isInverted ? 100 - metric.progress : metric.progress} 
              className="h-1.5 rounded-full" 
            />
            
            <p className="text-xs text-muted-foreground text-right">
              {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
            </p>
          </div>
          
          {/* Decorative gradient element */}
          <div className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ background: `radial-gradient(circle, ${metric.isInverted ? '#ef4444' : '#22c55e'} 0%, transparent 70%)` }}></div>
        </Card>
      ))}
    </div>
  );
};
