
/**
 * Converts Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩)
 */
export const toArabicNumerals = (input: string | number): string => {
  const westernArabic = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const easternArabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  const inputStr = input.toString();
  let result = '';
  
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    const index = westernArabic.indexOf(char);
    
    if (index !== -1) {
      result += easternArabic[index];
    } else {
      result += char;
    }
  }
  
  return result;
};
