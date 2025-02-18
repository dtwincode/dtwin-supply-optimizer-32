
import { Truck, Clock, PackageCheck, AlertOctagon } from 'lucide-react';
import { LogisticsMetricsCard } from './LogisticsMetricsCard';

export const LogisticsMetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <LogisticsMetricsCard
        icon={Truck}
        label="In Transit"
        value={25}
        bgColor="bg-primary-50"
        textColor="text-primary-500"
      />
      <LogisticsMetricsCard
        icon={Clock}
        label="Processing"
        value={18}
        bgColor="bg-warning-50"
        textColor="text-warning-500"
      />
      <LogisticsMetricsCard
        icon={PackageCheck}
        label="Delivered"
        value={42}
        bgColor="bg-success-50"
        textColor="text-success-500"
      />
      <LogisticsMetricsCard
        icon={AlertOctagon}
        label="Delayed"
        value={7}
        bgColor="bg-danger-50"
        textColor="text-danger-500"
      />
    </div>
  );
};
