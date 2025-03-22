
import React from "react";
import { ForecastingDateRange } from "../ForecastingDateRange";

interface ForecastingHeaderDateRangeProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

export const ForecastingHeaderDateRange: React.FC<ForecastingHeaderDateRangeProps> = ({
  onDateRangeChange
}) => {
  return (
    <ForecastingDateRange 
      fromDate={new Date()} 
      toDate={new Date()} 
      setFromDate={(date) => onDateRangeChange(date, new Date())}
      setToDate={(date) => onDateRangeChange(new Date(), date)}
    />
  );
};
