
import { Info, TrendingUp } from "lucide-react";
import { ClassificationBadge } from "./ClassificationBadge";
import { cn } from "@/lib/utils";

interface ClassificationItemProps {
  title: string;
  level: 'high' | 'medium' | 'low';
  type: 'leadTime' | 'variability' | 'criticality';
  icon?: React.ReactNode;
}

export function ClassificationItem({ title, level, type, icon }: ClassificationItemProps) {
  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className={cn("h-8 w-1 rounded-full", 
        level === 'high' ? 'bg-red-400' : 
        level === 'medium' ? 'bg-yellow-400' : 
        'bg-green-400')} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{title}</span>
          <ClassificationBadge level={level} type={type} label={level} />
        </div>
      </div>
    </div>
  );
}
