
/**
 * UI utility functions for DDSOP module
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";

/**
 * Format a number as percentage
 */
export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Render a variance badge with appropriate styling based on value
 */
export const renderVarianceBadge = (value: number) => {
  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const formattedValue = `${isNegative ? '-' : '+'}${formatPercentage(absValue)}`;
  
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" = "default";
  
  if (absValue >= 0.2) {
    badgeVariant = isNegative ? "destructive" : "success";
  } else if (absValue >= 0.1) {
    badgeVariant = "warning";
  } else {
    badgeVariant = "info";
  }
  
  return (
    <Badge variant={badgeVariant} className={cn("text-xs", isNegative && "opacity-90")}>
      {formattedValue}
    </Badge>
  );
};

/**
 * Get status text based on variance
 */
export const getStatusFromVariance = (variance: number): string => {
  const absVariance = Math.abs(variance);
  
  if (absVariance >= 0.2) {
    return variance < 0 ? "Significant Underperformance" : "Significant Overperformance";
  } else if (absVariance >= 0.1) {
    return variance < 0 ? "Moderate Underperformance" : "Moderate Overperformance";
  } else {
    return "On Target";
  }
};
