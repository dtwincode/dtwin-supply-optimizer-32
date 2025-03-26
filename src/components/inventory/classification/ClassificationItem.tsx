
import { ClassificationBadge } from "./ClassificationBadge";
import { cn } from "@/lib/utils";

interface ClassificationItemProps {
  title: string;
  level: 'high' | 'medium' | 'low';
  type: 'leadTime' | 'variability' | 'criticality';
}

export function ClassificationItem({ title, level, type }: ClassificationItemProps) {
  // Get the appropriate color for the indicator based on the type and level
  const getIndicatorColor = () => {
    if (type === 'criticality') {
      // For criticality, high is important (red), low is less important (green)
      return level === 'high' ? 'bg-red-400' : 
             level === 'medium' ? 'bg-yellow-400' : 
             'bg-green-400';
    } else if (type === 'leadTime') {
      // For lead time, long (high) is bad (red), short (low) is good (green)
      return level === 'high' ? 'bg-red-400' : 
             level === 'medium' ? 'bg-yellow-400' : 
             'bg-green-400';
    } else {
      // For variability, high is bad (red), low is good (green)
      return level === 'high' ? 'bg-red-400' : 
             level === 'medium' ? 'bg-yellow-400' : 
             'bg-green-400';
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white p-2 rounded-md shadow-sm">
      <div className={cn("h-6 w-0.5 rounded-full", getIndicatorColor())} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">{title}</span>
          <ClassificationBadge level={level} type={type} label={level} />
        </div>
      </div>
    </div>
  );
}
