
import { BufferFactorConfig } from "@/types/inventory";

// Temporary fix to provide a default buffer configuration
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  // Return a default configuration
  return {
    id: 'default',
    shortLeadTimeFactor: 0.7,
    mediumLeadTimeFactor: 1.0,
    longLeadTimeFactor: 1.3,
    shortLeadTimeThreshold: 7,
    mediumLeadTimeThreshold: 14,
    replenishmentTimeFactor: 1.0,
    greenZoneFactor: 0.7,
    isActive: true,
    metadata: {}
  };
};
