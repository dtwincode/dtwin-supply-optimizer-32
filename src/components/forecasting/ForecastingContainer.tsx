
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

  return (
    <div>
      <ForecastingHeader />
      <ForecastingDateRange />
      <ForecastMetricsCards />
      <ForecastingTabs />
    </div>
  );
};

export default ForecastingContainer;
