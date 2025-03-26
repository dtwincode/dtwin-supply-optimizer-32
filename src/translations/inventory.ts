import { InventoryTranslations } from './types';

// We'll use the common inventory translations instead
// This file is not needed anymore but keeping it to maintain compatibility
export const inventoryTranslations: InventoryTranslations = {
  ...(require('./common/inventory').inventoryTranslations)
};
