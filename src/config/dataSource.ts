
/**
 * Data source configuration for the application
 * Controls whether to use Supabase or AWS RDS as the data source
 */
export type DataSource = 'supabase' | 'aws';

// The default data source
export const DEFAULT_DATA_SOURCE: DataSource = 'supabase';

// Set to true when converting from Supabase to AWS RDS
export const IS_MIGRATION_MODE = false;

// Configuration for data sources
export const dataSourceConfig = {
  current: process.env.DATA_SOURCE as DataSource || DEFAULT_DATA_SOURCE,
  
  // AWS RDS connection configuration
  aws: {
    host: process.env.AWS_RDS_HOST || 'your-rds-endpoint.amazonaws.com',
    port: parseInt(process.env.AWS_RDS_PORT || '5432'),
    database: process.env.AWS_RDS_DATABASE || 'dtwin',
    username: process.env.AWS_RDS_USERNAME || 'postgres',
    password: process.env.AWS_RDS_PASSWORD || 'postgres',
    ssl: process.env.AWS_RDS_SSL === 'true',
  },
  
  // Feature flags for each data source
  features: {
    realTimeUpdates: {
      supabase: true,
      aws: false
    },
    caching: {
      supabase: true,
      aws: true
    }
  },
  
  // Set the current data source
  setDataSource: (source: DataSource) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dtwin_data_source', source);
    }
    dataSourceConfig.current = source;
  },
  
  // Get the current data source
  getDataSource: (): DataSource => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dtwin_data_source') as DataSource;
      if (saved) {
        return saved;
      }
    }
    return dataSourceConfig.current;
  }
};

// Hook for switching between data sources
export const useDataSource = () => {
  return {
    current: dataSourceConfig.getDataSource(),
    setDataSource: dataSourceConfig.setDataSource,
    isAws: dataSourceConfig.getDataSource() === 'aws',
    isSupabase: dataSourceConfig.getDataSource() === 'supabase',
    config: dataSourceConfig
  };
};
