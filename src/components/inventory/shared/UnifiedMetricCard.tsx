import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  status?: "healthy" | "warning" | "critical" | "neutral";
  subtitle?: string;
  benchmark?: string;
  sparklineData?: number[];
  className?: string;
}

/**
 * Unified metric card component for all inventory KPIs
 * Replaces: EnhancedMetricCard, AdvancedKPIDashboard cards, DDMRPPerformanceDashboard cards
 */
export function UnifiedMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  status = "neutral",
  subtitle,
  benchmark,
  sparklineData,
  className,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.value > 0) return "text-green-600 dark:text-green-500";
    if (trend.value < 0) return "text-red-600 dark:text-red-500";
    return "text-muted-foreground";
  };

  const getStatusBorderColor = () => {
    switch (status) {
      case "healthy":
        return "border-l-4 border-l-green-500";
      case "warning":
        return "border-l-4 border-l-orange-500";
      case "critical":
        return "border-l-4 border-l-red-500";
      default:
        return "";
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case "healthy":
        return "bg-green-50/50 dark:bg-green-950/20";
      case "warning":
        return "bg-orange-50/50 dark:bg-orange-950/20";
      case "critical":
        return "bg-red-50/50 dark:bg-red-950/20";
      default:
        return "";
    }
  };

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-shadow animate-fade-in",
        getStatusBorderColor(),
        getStatusBgColor(),
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {title}
          </CardTitle>
          {status !== "neutral" && (
            <Badge
              variant={
                status === "healthy"
                  ? "default"
                  : status === "warning"
                  ? "secondary"
                  : "destructive"
              }
              className="h-5 text-xs"
            >
              {status}
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {trend?.label && (
          <p className="text-xs text-muted-foreground">{trend.label}</p>
        )}

        {benchmark && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">{benchmark}</span>
          </p>
        )}

        {sparklineData && sparklineData.length > 0 && (
          <div className="h-8 flex items-end gap-0.5 mt-2">
            {sparklineData.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-primary/20 rounded-sm transition-all hover:bg-primary/40"
                style={{
                  height: `${(val / Math.max(...sparklineData)) * 100}%`,
                  minHeight: "2px",
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
