
export const getLevelColor = (level: number) => {
  switch (level) {
    case 0: return 'bg-[#ea384c]'; // Red - Initial
    case 1: return 'bg-[#f59e0b]'; // Orange - Developing
    case 2: return 'bg-[#3b82f6]'; // Blue - Established
    case 3: return 'bg-[#22c55e]'; // Green - Advanced
    case 4: return 'bg-[#9b87f5]'; // Purple - Optimized
    default: return 'bg-gray-200';
  }
};

export const getLevelName = (level: number, isArabic: boolean) => {
  switch (level) {
    case 0: return isArabic ? "أولي" : "Initial";
    case 1: return isArabic ? "نامي" : "Developing";
    case 2: return isArabic ? "مؤسس" : "Established";
    case 3: return isArabic ? "متقدم" : "Advanced";
    case 4: return isArabic ? "محسّن" : "Optimized";
    default: return isArabic ? "غير محدد" : "Undefined";
  }
};
