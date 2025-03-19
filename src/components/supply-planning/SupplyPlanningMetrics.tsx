
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const SupplyPlanningMetrics = () => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-6 border-dtwin-medium/20 bg-gradient-to-br from-white to-dtwin-light/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-dtwin-light/10 rounded-bl-full"></div>
        <h3 className="text-sm font-medium text-muted-foreground">
          {getTranslation("supplyPlanning.avgLeadTime", language)}
        </h3>
        <p className="text-sm text-muted-foreground/80">
          {getTranslation("supplyPlanning.acrossAllSuppliers", language)}
        </p>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-4xl font-bold">14.2</span>
          <span className="text-sm">{getTranslation("supplyPlanning.days", language)}</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-red-500">
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>1.3 {getTranslation("supplyPlanning.days", language)} {getTranslation("supplyPlanning.fromLastMonth", language)}</span>
        </div>
      </Card>
      
      <Card className="p-6 border-dtwin-medium/20 bg-gradient-to-br from-white to-dtwin-light/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-dtwin-light/10 rounded-bl-full"></div>
        <h3 className="text-sm font-medium text-muted-foreground">
          {getTranslation("supplyPlanning.leadTimeVariability", language)}
        </h3>
        <p className="text-sm text-muted-foreground/80">
          {getTranslation("supplyPlanning.standardDeviation", language)}
        </p>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-4xl font-bold">±3.5</span>
          <span className="text-sm">{getTranslation("supplyPlanning.days", language)}</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-red-500">
          <ArrowDown className="h-3 w-3 mr-1" />
          <span>0.2 {getTranslation("supplyPlanning.days", language)} {getTranslation("supplyPlanning.fromLastMonth", language)}</span>
        </div>
      </Card>
      
      <Card className="p-6 border-dtwin-medium/20 bg-gradient-to-br from-white to-dtwin-light/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-dtwin-light/10 rounded-bl-full"></div>
        <h3 className="text-sm font-medium text-muted-foreground">
          {getTranslation("supplyPlanning.leadTimeReliability", language)}
        </h3>
        <p className="text-sm text-muted-foreground/80">
          {getTranslation("supplyPlanning.ordersOnTime", language)}
        </p>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-4xl font-bold">82%</span>
        </div>
        <div className="mt-2 flex items-center text-sm text-green-500">
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>+3% {getTranslation("supplyPlanning.fromLastMonth", language)}</span>
        </div>
      </Card>
    </div>
  );
};
