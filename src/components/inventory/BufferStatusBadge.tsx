
import { Badge } from "@/components/ui/badge";

interface BufferStatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
}

export function BufferStatusBadge({ status }: BufferStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'green':
        return {
          label: 'OK',
          className: 'bg-green-100 text-green-800 hover:bg-green-100'
        };
      case 'yellow':
        return {
          label: 'Warning',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        };
      case 'red':
        return {
          label: 'Critical',
          className: 'bg-red-100 text-red-800 hover:bg-red-100'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        };
    }
  };

  const { label, className } = getStatusConfig();

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}
