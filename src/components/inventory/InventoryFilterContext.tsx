import React, { createContext, useContext, useState } from "react";

interface InventoryFilter {
  productId: string | null;
  locationId: string | null;
  channelId: string | null;
  decouplingOnly: boolean;
}

interface InventoryFilterContextType {
  filters: InventoryFilter;
  setFilters: (filters: InventoryFilter) => void;
}

const InventoryFilterContext = createContext<InventoryFilterContextType | undefined>(undefined);

export const InventoryFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<InventoryFilter>({
    productId: null,
    locationId: null,
    channelId: null,
    decouplingOnly: false,
  });

  return (
    <InventoryFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </InventoryFilterContext.Provider>
  );
};

export const useInventoryFilter = () => {
  const context = useContext(InventoryFilterContext);
  if (!context) {
    throw new Error("useInventoryFilter must be used within InventoryFilterProvider");
  }
  return context;
};
