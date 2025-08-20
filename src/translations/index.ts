import { Translations, Translation } from "./types";
import { navigationTranslations } from "./navigation";
import { dashboardTranslations, executiveSummary } from "./common/dashboard";
import { modulesSummaryTranslations } from "./common/modules";
import { uiTranslations } from "./common/ui";
import { chartTranslations } from "./common/charts";
import { inventoryTranslations } from "./common/inventory";
import { paginationTranslations } from "./common/pagination";
import { supplyPlanningTranslations } from "./common/supplyPlanning";
import { financialMetricsTranslations } from "./common/financialMetrics";
import { sustainabilityMetricsTranslations } from "./common/sustainabilityMetrics";
import { logisticsTranslations } from "./common/logistics";
import { ddsopTranslations } from "./common/ddsop";
import { toArabicNumerals } from "./utils";
import { commonTranslations } from "./common";
import { salesTranslations } from "./common/sales";
// import { salesTranslations } from "./sales";
import { marketingTranslations } from "./marketing";
import { generalLogisticsTranslations } from "./common/logistics/general";
import { reportsTranslations } from "./reports";
import { sqlConfigTranslations } from "./sqlConfig";
import { newTicketDialogTranslations } from "./newTicketDialog";
export { toArabicNumerals };
export type { Translation };

export const translations: any = {
  navigation: navigationTranslations,
  common: commonTranslations,
  dashboardMetrics: dashboardTranslations,
  executiveSummary: executiveSummary,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  ddsop: commonTranslations.ddsop,
  supplyPlanning: supplyPlanningTranslations,
  sales: salesTranslations,
  marketing: marketingTranslations,
  // common: chartTranslations,
  logistics: logisticsTranslations,
  forecasting: {},
  inventory: inventoryTranslations,
  reports: reportsTranslations,
  sqlConfig: sqlConfigTranslations,
  tickets: newTicketDialogTranslations,
  settings: {},
  auth: {},
  errors: {},
};

export function getTranslation(key: string, language: "en" | "ar") {
  const keys = key.split(".");
  let current: any = translations;

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key as fallback instead of undefined
    }
    current = current[k];
  }

  return current[language];
}
