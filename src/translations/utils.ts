
/**
 * Converts western numerals (0-9) to Arabic numerals (٠-٩)
 */
export const toArabicNumerals = (number: number | string): string => {
  const western = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return number.toString().replace(/[0-9]/g, match => {
    return arabic[western.indexOf(match)];
  });
};
