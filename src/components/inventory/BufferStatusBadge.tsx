
import { useI18n } from "@/contexts/I18nContext";

interface BufferStatusBadgeProps {
  status: "green" | "yellow" | "red";
}

export const BufferStatusBadge = ({ status }: BufferStatusBadgeProps) => {
  const { t } = useI18n();
  
  const getStatusClasses = () => {
    switch (status) {
      case "green":
        return "bg-success-50 text-success-700";
      case "yellow":
        return "bg-warning-50 text-warning-700";
      case "red":
        return "bg-danger-50 text-danger-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = () => {
    return t(`common.zones.${status}`);
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}>
      {getStatusText()}
    </span>
  );
};
