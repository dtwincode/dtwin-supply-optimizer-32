
import { motion } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SKUClassification } from "@/types/inventory";
import { SKUCard } from "./classification/SKUCard";

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export function SKUClassifications({ classifications }: SKUClassificationsProps) {
  // Animation variants for container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {classifications.map((classItem, index) => (
          <SKUCard 
            key={classItem.sku}
            sku={classItem.sku}
            classification={classItem.classification}
            lastUpdated={classItem.lastUpdated}
            index={index}
          />
        ))}
      </motion.div>
    </TooltipProvider>
  );
}
