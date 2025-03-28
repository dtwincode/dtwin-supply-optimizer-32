
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForecastingHeader } from './ForecastingHeader';
import { ForecastTable } from './ForecastTable';
import { ModelParametersTuning } from './ModelParametersTuning';
import { ForecastChart } from './ForecastChart';
import { ForecastFilters } from './ForecastFilters';
import { ForecastMetricsCards } from './ForecastMetricsCards';
import { ForecastingTabs } from './ForecastingTabs';
import { DataUploadDialog } from '@/components/settings/DataUploadDialog';
import { ForecastingDateRange } from './ForecastingDateRange';

const ForecastingContainer = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [toDate, setToDate] = useState<Date>(new Date()); // Today
  
  // Mock metrics data for ForecastMetricsCards
  const mockMetrics = {
    accuracy: 92.5,
    bias: 2.1,
    mape: 7.5,
    rmse: 42.3,
    mae: 3.8  // Adding the missing mae property
  };
  
  // Mock handlers for ForecastingHeader
  const handleDateRangeChange = (start: Date, end: Date) => {
    setFromDate(start);
    setToDate(end);
  };
  
  const handleModelChange = (model: string) => {
    console.log('Model changed:', model);
  };
  
  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
  };
  
  const handleParametersChange = (params: any) => {
    console.log('Parameters changed:', params);
  };

  return (
    <div>
      <ForecastingHeader 
        onDateRangeChange={handleDateRangeChange}
        onModelChange={handleModelChange}
        onFiltersChange={handleFiltersChange}
        onParametersChange={handleParametersChange}
      />
      <ForecastingDateRange 
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />
      <ForecastMetricsCards metrics={mockMetrics} />
      <ForecastingTabs />
    </div>
  );
};

export default ForecastingContainer;
