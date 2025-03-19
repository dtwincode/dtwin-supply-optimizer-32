/**
 * Converts Western Arabic (Hindi) numerals to Eastern Arabic numerals
 * @param num - Number or string to convert
 * @returns String with Arabic numerals
 */
export function toArabicNumerals(num: number | string): string {
  const numStr = num.toString();
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return numStr.replace(/[0-9]/g, (d) => {
    return arabicDigits[parseInt(d)];
  });
}

// Other utility functions can be added here
