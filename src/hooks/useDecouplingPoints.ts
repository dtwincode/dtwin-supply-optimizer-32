
import { useState } from 'react';
import { DecouplingNetwork, DecouplingPoint } from '@/types/inventory/decouplingTypes';

export const useDecouplingPoints = () => {
  // Empty placeholder - will be implemented later with actual data
  const [decouplingNetwork, setDecouplingNetwork] = useState<DecouplingNetwork | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    decouplingNetwork,
    loading,
    error
  };
};
