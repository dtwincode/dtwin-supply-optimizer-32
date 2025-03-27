
// Move SKUClassifications to classification directory
// This file is a placeholder as we don't have the original content
import React from "react";
import { SKUClassification } from "../types";
import { SKUCard } from "./SKUCard";

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export const SKUClassifications: React.FC<SKUClassificationsProps> = ({ classifications }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classifications.map((classification, index) => (
        <SKUCard
          key={classification.sku}
          sku={classification.sku}
          classification={classification.classification}
          lastUpdated={classification.lastUpdated}
          index={index}
        />
      ))}
    </div>
  );
};
