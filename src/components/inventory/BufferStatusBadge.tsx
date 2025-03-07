
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

interface BufferStatusBadgeProps {
  status: "green" | "yellow" | "red";
}

export const BufferStatusBadge = ({ status }: BufferStatusBadgeProps) => {
  const { language } = useLanguage();
  
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

  // Make sure we're using the correct translation path
  const getStatusText = () => {
    // Using zones from common.zones
    return getTranslation(`common.zones.${status}`, language);
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}>
      {getStatusText()}
    </span>
  );
};
