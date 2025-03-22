
import React from "react";
import { Activity, AlertCircle, CheckCircle, Clock, Target } from "lucide-react";

interface MetricIconRendererProps {
  metricId: string;
  status: string;
}

export const MetricIconRenderer: React.FC<MetricIconRendererProps> = ({ metricId, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'danger':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const className = `h-5 w-5 ${getStatusColor()}`;

  switch (metricId) {
    case 'flow-index':
      return <Activity className={className} />;
    case 'tactical-cycle':
      return <CheckCircle className={className} />;
    case 'demand-signal':
      return <AlertCircle className={className} />;
    case 'execution-variance':
      return <Target className={className} />;
    case 'adaptive-response':
      return <Clock className={className} />;
    default:
      return <Activity className={className} />;
  }
};
