import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConfigCache {
  [key: string]: number;
}

let configCache: ConfigCache | null = null;
let cachePromise: Promise<ConfigCache> | null = null;

const fetchConfig = async (): Promise<ConfigCache> => {
  if (configCache) return configCache;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_config')
        .select('config_key, config_value');

      if (error) throw error;

      const cache: ConfigCache = {};
      data?.forEach((item) => {
        cache[item.config_key] = item.config_value;
      });

      configCache = cache;
      return cache;
    } catch (error) {
      console.error('Error fetching inventory config:', error);
      return {};
    } finally {
      cachePromise = null;
    }
  })();

  return cachePromise;
};

export function useInventoryConfig() {
  const [config, setConfig] = useState<ConfigCache>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    const configData = await fetchConfig();
    setConfig(configData);
    setIsLoading(false);
  };

  const getConfig = (key: string, defaultValue: number = 10): number => {
    return config[key] ?? defaultValue;
  };

  return { config, getConfig, isLoading, reloadConfig: loadConfig };
}
