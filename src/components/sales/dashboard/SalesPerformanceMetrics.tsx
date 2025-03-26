
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Package, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

export const SalesPerformanceMetrics = () => {
  const { language } = useLanguage();

  const metrics = [
    {
      title: language === 'ar' ? 'أداء المبيعات' : 'Sales Performance',
      value: '89.4%',
      description: language === 'ar' ? 'من الهدف' : 'of target',
      trend: 'up',
      trendValue: '2.3%',
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />
    },
    {
      title: language === 'ar' ? 'دقة التنبؤ' : 'Forecast Accuracy',
      value: '92.1%',
      description: language === 'ar' ? 'متوسط 3 أشهر' : '3-month average',
      trend: 'up',
      trendValue: '1.8%',
      icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />
    },
    {
      title: language === 'ar' ? 'معدل الإرجاع' : 'Return Rate',
      value: '3.2%',
      description: language === 'ar' ? 'من المبيعات' : 'of sales',
      trend: 'down',
      trendValue: '0.5%',
      icon: <Package className="h-5 w-5 text-muted-foreground" />
    }
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            <div className="mt-2 flex items-center text-xs">
              {metric.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {metric.trendValue}
              </span>
              <span className="ml-1 text-muted-foreground">
                {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
