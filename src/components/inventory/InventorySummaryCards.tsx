
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Package, Waves, BarChart4, ArrowUpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const InventorySummaryCards = () => {
  const { language, isRTL } = useLanguage();

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

  const cards = [
    {
      title: getTranslation('common.zones.green', language),
      value: "45",
      unit: "SKUs",
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      bgColorClass: "bg-green-50",
      textColorClass: "text-green-700"
    },
    {
      title: getTranslation('common.zones.yellow', language),
      value: "28",
      unit: "SKUs",
      icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
      bgColorClass: "bg-yellow-50",
      textColorClass: "text-yellow-700"
    },
    {
      title: getTranslation('common.zones.red', language),
      value: "12",
      unit: "SKUs",
      icon: <Package className="h-12 w-12 text-red-500" />,
      bgColorClass: "bg-red-50",
      textColorClass: "text-red-700"
    },
    {
      title: getTranslation('common.inventory.netFlowPosition', language),
      value: "105",
      unit: "u",
      icon: <Waves className="h-12 w-12 text-blue-500" />,
      bgColorClass: "bg-blue-50",
      textColorClass: "text-blue-700"
    },
    {
      title: getTranslation('common.inventory.adu', language),
      value: "24.5",
      unit: "u/d",
      icon: <BarChart4 className="h-12 w-12 text-purple-500" />,
      bgColorClass: "bg-purple-50",
      textColorClass: "text-purple-700"
    },
    {
      title: getTranslation('common.inventory.turnover', language),
      value: "4.2",
      unit: "x",
      icon: <ArrowUpCircle className="h-12 w-12 text-indigo-500" />,
      bgColorClass: "bg-indigo-50",
      textColorClass: "text-indigo-700"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={item}>
          <Card className={cn("p-4", card.bgColorClass)}>
            <div className={cn("flex", isRTL ? "flex-row-reverse" : "flex-row", "items-center gap-4")}>
              <div>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className={cn("text-2xl font-bold", card.textColorClass)}>
                  {card.value} <span className="text-base">{card.unit}</span>
                </h3>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InventorySummaryCards;
