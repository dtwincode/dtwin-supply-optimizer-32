
import React, { createContext, useContext, useState } from 'react';

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
  getHierarchyLevels: (tab: string, type: 'product' | 'location') => string[];
  setHierarchyLevels: (tab: string, type: 'product' | 'location', levels: string[]) => void;
  getHasActiveHierarchy: (tab: string, type: 'product' | 'location') => boolean;
  setHasActiveHierarchy: (tab: string, type: 'product' | 'location', hasActive: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [productHierarchyStates, setProductHierarchyStates] = useState<Record<string, HierarchyState>>({});
  const [locationStates, setLocationStates] = useState<Record<string, LocationState>>({});
  const [productHierarchyLevels, setProductHierarchyLevelsState] = useState<Record<string, string[]>>({});
  const [locationHierarchyLevels, setLocationHierarchyLevelsState] = useState<Record<string, string[]>>({});
  const [productActiveHierarchies, setProductActiveHierarchies] = useState<Record<string, boolean>>({});
  const [locationActiveHierarchies, setLocationActiveHierarchies] = useState<Record<string, boolean>>({});

  const getProductHierarchyState = (tab: string) => productHierarchyStates[tab] || {};
  const setProductHierarchyState = (tab: string, state: HierarchyState) => {
    setProductHierarchyStates(prev => ({ ...prev, [tab]: state }));
  };

  const getLocationState = (tab: string) => locationStates[tab] || {};
  const setLocationState = (tab: string, state: LocationState) => {
    setLocationStates(prev => ({ ...prev, [tab]: state }));
  };

  const getHierarchyLevels = (tab: string, type: 'product' | 'location') => {
    if (type === 'product') {
      return productHierarchyLevels[tab] || [];
    }
    return locationHierarchyLevels[tab] || [];
  };

  const setHierarchyLevels = (tab: string, type: 'product' | 'location', levels: string[]) => {
    if (type === 'product') {
      setProductHierarchyLevelsState(prev => ({ ...prev, [tab]: levels }));
    } else {
      setLocationHierarchyLevelsState(prev => ({ ...prev, [tab]: levels }));
    }
  };

  const getHasActiveHierarchy = (tab: string, type: 'product' | 'location') => {
    if (type === 'product') {
      return productActiveHierarchies[tab] || false;
    }
    return locationActiveHierarchies[tab] || false;
  };

  const setHasActiveHierarchy = (tab: string, type: 'product' | 'location', hasActive: boolean) => {
    if (type === 'product') {
      setProductActiveHierarchies(prev => ({ ...prev, [tab]: hasActive }));
    } else {
      setLocationActiveHierarchies(prev => ({ ...prev, [tab]: hasActive }));
    }
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
