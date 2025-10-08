/**
 * Buffer status utilities for DDMRP
 */

export type BufferStatus = 'RED' | 'YELLOW' | 'GREEN' | 'BLUE';

/**
 * Get color class for buffer status badge
 */
export const getBufferStatusColor = (status: string): string => {
  switch (status?.toUpperCase()) {
    case 'RED':
      return 'bg-destructive text-destructive-foreground';
    case 'YELLOW':
      return 'bg-yellow-500 dark:bg-yellow-600 text-white';
    case 'GREEN':
      return 'bg-green-600 dark:bg-green-700 text-white';
    case 'BLUE':
      return 'bg-blue-600 dark:bg-blue-700 text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get HSL color for buffer status (for charts)
 */
export const getBufferStatusHSL = (status: string): string => {
  switch (status?.toUpperCase()) {
    case 'RED':
      return 'hsl(0 84% 60%)';
    case 'YELLOW':
      return 'hsl(48 96% 53%)';
    case 'GREEN':
      return 'hsl(142 71% 45%)';
    case 'BLUE':
      return 'hsl(221 83% 53%)';
    default:
      return 'hsl(var(--muted))';
  }
};

/**
 * Get buffer status severity level
 */
export const getBufferStatusSeverity = (status: string): 'critical' | 'high' | 'medium' | 'low' => {
  switch (status?.toUpperCase()) {
    case 'RED':
      return 'critical';
    case 'YELLOW':
      return 'high';
    case 'GREEN':
      return 'medium';
    case 'BLUE':
      return 'low';
    default:
      return 'medium';
  }
};

/**
 * Determine buffer status from NFP and thresholds
 */
export const determineBufferStatus = (nfp: number, tor: number, toy: number, tog: number): BufferStatus => {
  if (nfp < tor) return 'RED';
  if (nfp < toy) return 'YELLOW';
  if (nfp > tog) return 'BLUE';
  return 'GREEN';
};

/**
 * Check if buffer is in breach (below TOY)
 */
export const isBufferBreach = (nfp: number, toy: number): boolean => {
  return nfp < toy;
};

/**
 * Check if buffer is critical (below TOR)
 */
export const isBufferCritical = (nfp: number, tor: number): boolean => {
  return nfp < tor;
};

/**
 * Check if buffer has excess (above TOG)
 */
export const hasBufferExcess = (nfp: number, tog: number): boolean => {
  return nfp > tog;
};

/**
 * Calculate buffer zone sizes
 */
export const calculateBufferZones = (item: any) => {
  return {
    redZone: item.tor || 0,
    yellowZone: (item.toy || 0) - (item.tor || 0),
    greenZone: (item.tog || 0) - (item.toy || 0),
    total: item.tog || 0,
  };
};

/**
 * Get breach type from NFP and thresholds
 */
export const getBreachType = (nfp: number, tor: number, toy: number, tog: number): string | null => {
  if (nfp < tor) return 'BELOW_TOR';
  if (nfp < toy) return 'BELOW_TOY';
  if (nfp > tog) return 'ABOVE_TOG';
  return null;
};

/**
 * Format buffer status for display
 */
export const formatBufferStatus = (status: string): string => {
  return status?.toUpperCase() || 'UNKNOWN';
};
