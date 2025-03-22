
import { ClassificationBadge } from "./ClassificationBadge";
import { cn } from "@/lib/utils";

interface ClassificationItemProps {
  title: string;
  level: 'high' | 'medium' | 'low';
  type: 'leadTime' | 'variability' | 'criticality';
}

export function ClassificationItem({ title, level, type }: ClassificationItemProps) {
  return (
    <div className="flex items-center gap-1 bg-white p-2 rounded-md shadow-sm">
      <div className={cn("h-6 w-0.5 rounded-full", 
        level === 'high' ? 'bg-red-400' : 
        level === 'medium' ? 'bg-yellow-400' : 
        'bg-green-400')} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">{title}</span>
          <ClassificationBadge level={level} type={type} label={level} />
        </div>
      </div>
    </div>
  );
}
