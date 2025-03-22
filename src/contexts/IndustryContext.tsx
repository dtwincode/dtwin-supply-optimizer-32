
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { industries } from '@/components/guidelines/data/industryData';

export type IndustryType = 'retail' | 'groceries' | 'electronics' | 'pharmacy' | 'fmcg';

interface IndustryContextType {
  selectedIndustry: IndustryType;
  setSelectedIndustry: (industry: IndustryType) => void;
  isIndustrySelected: boolean;
}

const IndustryContext = createContext<IndustryContextType>({
  selectedIndustry: 'retail',
  setSelectedIndustry: () => {},
  isIndustrySelected: false,
});

export const IndustryProvider = ({ children }: { children: ReactNode }) => {
  const [selectedIndustry, setSelectedIndustry] = useLocalStorage<IndustryType>('selected-industry', 'retail');
  const [isIndustrySelected, setIsIndustrySelected] = useLocalStorage('industry-configured', false);

  const handleSetIndustry = (industry: IndustryType) => {
    setSelectedIndustry(industry);
    setIsIndustrySelected(true);
  };

  return (
    <IndustryContext.Provider 
      value={{ 
        selectedIndustry, 
        setSelectedIndustry: handleSetIndustry,
        isIndustrySelected 
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => useContext(IndustryContext);
