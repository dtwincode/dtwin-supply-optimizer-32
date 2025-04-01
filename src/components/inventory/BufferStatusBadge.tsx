
import { Badge } from "@/components/ui/badge";

interface BufferStatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
}

export function BufferStatusBadge({ status }: BufferStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'green':
        return 'Green Zone';
      case 'yellow':
        return 'Yellow Zone';
      case 'red':
        return 'Red Zone';
      default:
        return 'Unknown';
    }
  };

  return (
    <Badge className={getStatusStyles()} variant="outline">
      {getStatusLabel()}
    </Badge>
  );
}
