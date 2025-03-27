
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Package, Waves, BarChart4, ArrowUpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const InventorySummaryCards = () => {
  const { isRTL } = useLanguage();
  const { t } = useI18n();

  // Animation variants for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const cardStyles = [
    "bg-gradient-to-r from-green-50 to-green-100 border-green-200",
    "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200",
    "bg-gradient-to-r from-red-50 to-red-100 border-red-200",
    "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
    "bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200",
    "bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200"
  ];

  const iconContainerStyles = [
    "bg-green-100 text-green-600",
    "bg-amber-100 text-amber-600", 
    "bg-red-100 text-red-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-indigo-100 text-indigo-600"
  ];

  // Ensure proper spacing in RTL mode
  const flexDirection = isRTL ? "flex-row-reverse" : "flex-row";

  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[0])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[0])}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.zones.green")}</p>
              <p className="text-xl font-bold">45 {t("common.skus")}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[1])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[1])}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.zones.yellow")}</p>
              <p className="text-xl font-bold">28 {t("common.skus")}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[2])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[2])}>
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.zones.red")}</p>
              <p className="text-xl font-bold">12 {t("common.skus")}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[3])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[3])}>
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.inventory.netFlowPosition")}</p>
              <p className="text-xl font-bold">105 u</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[4])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[4])}>
              <BarChart4 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.inventory.adu")}</p>
              <p className="text-xl font-bold">24.5 u/d</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1 lg:col-span-1">
        <Card className={cn("p-4 h-full shadow-sm hover:shadow transition-all duration-300", cardStyles[5])}>
          <div className={`flex items-center ${flexDirection} ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
            <div className={cn("p-2 rounded-full", iconContainerStyles[5])}>
              <ArrowUpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{t("common.inventory.turnover")}</p>
              <p className="text-xl font-bold">4.2x</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InventorySummaryCards;
