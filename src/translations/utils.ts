
// Helper function to convert numbers to Arabic numerals
export const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

// Helper function to format currency with SAR (Saudi Riyal)
export const formatRiyalCurrency = (amount: number, language: 'en' | 'ar'): string => {
  const formattedAmount = amount.toFixed(2);
  return language === 'ar' 
    ? `${toArabicNumerals(formattedAmount)} ريال` 
    : `${formattedAmount} ريال`;
};
