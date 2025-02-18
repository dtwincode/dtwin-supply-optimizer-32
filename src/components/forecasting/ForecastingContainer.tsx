import React, { Dispatch, SetStateAction } from 'react';
import { ForecastingTabs } from './ForecastingTabs';

interface ForecastingContainerProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const ForecastingContainer: React.FC<ForecastingContainerProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex flex-col w-full">
      <ForecastingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
