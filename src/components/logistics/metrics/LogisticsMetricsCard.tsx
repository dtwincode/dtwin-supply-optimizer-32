
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LogisticsMetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

export const LogisticsMetricsCard = ({
  icon: Icon,
  label,
  value,
  bgColor,
  textColor
}: LogisticsMetricsCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );
};
