
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataSource, dataSourceConfig } from '@/config/dataSource';

interface DataSourceContextType {
  dataSource: DataSource;
  setDataSource: (source: DataSource) => void;
  isAws: boolean;
  isSupabase: boolean;
}

const DataSourceContext = createContext<DataSourceContextType>({
  dataSource: 'supabase',
  setDataSource: () => {},
  isAws: false,
  isSupabase: true
});

export const useDataSourceContext = () => useContext(DataSourceContext);

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataSource, setDataSourceState] = useState<DataSource>(dataSourceConfig.getDataSource());

  const setDataSource = (source: DataSource) => {
    dataSourceConfig.setDataSource(source);
    setDataSourceState(source);
  };

  // Initialize from localStorage if available
  useEffect(() => {
    const savedSource = localStorage.getItem('dtwin_data_source') as DataSource;
    if (savedSource) {
      setDataSourceState(savedSource);
    }
  }, []);

  const value = {
    dataSource,
    setDataSource,
    isAws: dataSource === 'aws',
    isSupabase: dataSource === 'supabase'
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};
