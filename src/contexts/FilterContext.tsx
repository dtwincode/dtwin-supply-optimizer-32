
import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HierarchyState {
  [level: string]: {
    selected: string;
    values: string[];
  };
}

interface LocationState {
  [level: string]: string;
}

interface FilterContextType {
  getProductHierarchyState: (tab: string) => HierarchyState;
  setProductHierarchyState: (tab: string, state: HierarchyState) => void;
  getLocationState: (tab: string) => LocationState;
  setLocationState: (tab: string, state: LocationState) => void;
  getHierarchyLevels: (tab: string) => string[];
  setHierarchyLevels: (tab: string, levels: string[]) => void;
  getHasActiveHierarchy: (tab: string) => boolean;
  setHasActiveHierarchy: (tab: string, hasActive: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [productHierarchyStates, setProductHierarchyStates] = useState<Record<string, HierarchyState>>({});
  const [locationStates, setLocationStates] = useState<Record<string, LocationState>>({});
  const [hierarchyLevels, setHierarchyLevels] = useState<Record<string, string[]>>({});
  const [hasActiveHierarchies, setHasActiveHierarchies] = useState<Record<string, boolean>>({});

  const getProductHierarchyState = (tab: string) => productHierarchyStates[tab] || {};
  const setProductHierarchyState = (tab: string, state: HierarchyState) => {
    setProductHierarchyStates(prev => ({ ...prev, [tab]: state }));
  };

  const getLocationState = (tab: string) => locationStates[tab] || {};
  const setLocationState = (tab: string, state: LocationState) => {
    setLocationStates(prev => ({ ...prev, [tab]: state }));
  };

  const getHierarchyLevels = (tab: string) => hierarchyLevels[tab] || [];
  const setHierarchyLevels = (tab: string, levels: string[]) => {
    setHierarchyLevels(prev => ({ ...prev, [tab]: levels }));
  };

  const getHasActiveHierarchy = (tab: string) => hasActiveHierarchies[tab] || false;
  const setHasActiveHierarchy = (tab: string, hasActive: boolean) => {
    setHasActiveHierarchies(prev => ({ ...prev, [tab]: hasActive }));
  };

  return (
    <FilterContext.Provider value={{
      getProductHierarchyState,
      setProductHierarchyState,
      getLocationState,
      setLocationState,
      getHierarchyLevels,
      setHierarchyLevels,
      getHasActiveHierarchy,
      setHasActiveHierarchy,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
