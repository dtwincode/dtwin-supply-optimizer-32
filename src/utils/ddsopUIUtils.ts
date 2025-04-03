
/**
 * Utility functions for DDSOP UI operations
 */

// Formats a value as a percentage
export const formatAsPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

// Formats a number with commas for thousands
export const formatWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculates percentage difference between two values
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return (current - previous) / previous;
};

// Determines if a percentage change is positive or negative
export const isPositiveChange = (change: number, isHigherBetter: boolean = true): boolean => {
  return isHigherBetter ? change > 0 : change < 0;
};

// Returns a color based on performance
export const getPerformanceColor = (performance: "excellent" | "good" | "average" | "poor"): string => {
  switch (performance) {
    case "excellent":
      return "text-green-600";
    case "good":
      return "text-emerald-500";
    case "average":
      return "text-amber-500";
    case "poor":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// Convert camelCase to Title Case
export const camelToTitleCase = (text: string): string => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Format a date string to a readable format
export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Truncate text if it exceeds a certain length
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
