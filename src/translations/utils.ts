
/**
 * Convert numbers in a string to Arabic numerals
 * This is used for Arabic language display
 */
export const toArabicNumerals = (str: string | number): string => {
  if (typeof str === 'number') {
    str = str.toString();
  }
  
  return str.replace(/[0-9]/g, (d) => {
    return String.fromCharCode(1632 + parseInt(d, 10));
  });
};

/**
 * Other utility functions for translations can be added here
 */
