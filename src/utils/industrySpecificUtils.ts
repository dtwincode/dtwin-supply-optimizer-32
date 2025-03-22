import { IndustryType } from "@/contexts/IndustryContext";

// Shared industry-specific data configurations
export const getIndustrySpecificData = (industry: IndustryType) => {
  switch (industry) {
    case 'pharmacy':
      return {
        moduleConfigurations: {
          forecasting: {
            additionalFactors: ['Prescription Trends', 'Regulatory Changes', 'Drug Lifecycle Stages'],
            timeFrames: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
            indicators: ['New Prescriptions', 'Refill Rates', 'Doctor Recommendations']
          },
          inventory: {
            criticalMetrics: ['Expiry Date Coverage', 'Cold Chain Compliance', 'Regulatory Status'],
            bufferTypes: ['Standard', 'Temperature-Controlled', 'Regulated'],
            monitoringRequirements: ['Temperature Logs', 'Humidity Control', 'Light Sensitivity']
          },
          supplyPlanning: {
            supplierRequirements: ['GMP Certification', 'FDA Approval', 'Quality Control Standards'],
            orderTypes: ['Regular', 'Rush', 'Controlled Substance'],
            leadTimeFactors: ['Regulatory Clearance', 'Quality Testing', 'Certificate of Analysis']
          },
          salesPlanning: {
            salesChannels: ['Retail Pharmacy', 'Hospital', 'Online', 'Government'],
            customerTypes: ['Individual', 'Hospital', 'Insurance', 'Government'],
            promotionalRestrictions: ['Prescription Only', 'OTC', 'Restricted']
          },
          ddsop: {
            planningHorizons: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
            reviewCycles: ['Daily Safety Stock', 'Weekly Planning', 'Monthly Review'],
            complianceChecks: ['Product Authorization', 'Storage Conditions', 'Handling Requirements']
          },
          logistics: {
            transportRequirements: ['Temperature Control', 'Secure Transport', 'Tracking'],
            storageTypes: ['Ambient', 'Refrigerated', 'Frozen', 'Controlled Substance'],
            handlingRequirements: ['Fragile', 'Do Not Freeze', 'Keep Upright']
          }
        },
        kpis: {
          stockAvailability: 'Critical to maintain high availability for essential medications',
          expiryManagement: 'Monitor and minimize product expirations',
          regulatoryCompliance: 'Ensure all products meet regulatory requirements',
          coldChainIntegrity: 'Maintain temperature requirements throughout supply chain',
          prescriptionTrends: 'Track prescription patterns to anticipate demand changes'
        }
      };
    case 'groceries':
      return {
        moduleConfigurations: {
          forecasting: {
            additionalFactors: ['Seasonality', 'Weather Patterns', 'Local Events'],
            timeFrames: ['Daily', 'Weekly', 'Promotional'],
            indicators: ['Fresh Item Sales', 'Category Trends', 'Product Freshness']
          },
          inventory: {
            criticalMetrics: ['Freshness', 'Expiration Dates', 'Waste Percentage'],
            bufferTypes: ['Standard', 'Perishable', 'Seasonal'],
            monitoringRequirements: ['Temperature Logs', 'Humidity Control', 'Visual Inspection']
          },
          supplyPlanning: {
            supplierRequirements: ['HACCP Certification', 'Local Sourcing', 'Traceability'],
            orderTypes: ['Regular', 'Fresh', 'Promotional'],
            leadTimeFactors: ['Seasonality', 'Transportation', 'Storage Capacity']
          },
          salesPlanning: {
            salesChannels: ['In-Store', 'Online', 'Farmers Markets', 'Delivery Services'],
            customerTypes: ['Individual', 'Restaurants', 'Catering', 'Local Businesses'],
            promotionalRestrictions: ['Limited Time Offers', 'Seasonal Discounts', 'Bundle Deals']
          },
          ddsop: {
            planningHorizons: ['Daily', 'Weekly', 'Monthly', 'Seasonal'],
            reviewCycles: ['Daily Stock Check', 'Weekly Promotions', 'Monthly Planning'],
            complianceChecks: ['Freshness Standards', 'Storage Conditions', 'Handling Requirements']
          },
          logistics: {
            transportRequirements: ['Temperature Control', 'Fast Delivery', 'Traceability'],
            storageTypes: ['Ambient', 'Refrigerated', 'Frozen', 'Dry Storage'],
            handlingRequirements: ['Fragile', 'Perishable', 'Keep Dry']
          }
        },
        kpis: {
          stockAvailability: 'Critical to maintain high availability for fresh and essential items',
          freshnessManagement: 'Monitor and minimize product spoilage',
          wasteReduction: 'Reduce waste through efficient inventory management',
          seasonalDemand: 'Anticipate and meet seasonal demand fluctuations',
          localSourcing: 'Increase local sourcing to support community and reduce transportation costs'
        }
      };
    case 'electronics':
      return {
        moduleConfigurations: {
          forecasting: {
            additionalFactors: ['Product Lifecycle', 'Technology Trends', 'Competitive Releases'],
            timeFrames: ['Weekly', 'Monthly', 'Quarterly', 'Product Lifecycle'],
            indicators: ['New Technology Adoption', 'End-of-Life Products', 'Upgrade Cycles']
          },
          inventory: {
            criticalMetrics: ['Component Availability', 'Obsolescence Risk', 'Warranty Status'],
            bufferTypes: ['Standard', 'Component', 'Finished Goods'],
            monitoringRequirements: ['ESD Control', 'Humidity Control', 'Secure Storage']
          },
          supplyPlanning: {
            supplierRequirements: ['ISO Certification', 'Component Traceability', 'RoHS Compliance'],
            orderTypes: ['Regular', 'Component', 'Pre-Order'],
            leadTimeFactors: ['Component Sourcing', 'Manufacturing', 'Quality Testing']
          },
          salesPlanning: {
            salesChannels: ['Retail Stores', 'Online Marketplace', 'Direct Sales', 'Distributors'],
            customerTypes: ['Individual', 'Businesses', 'Educational Institutions', 'Government'],
            promotionalRestrictions: ['Bundle Deals', 'Trade-In Offers', 'Student Discounts']
          },
          ddsop: {
            planningHorizons: ['Weekly', 'Monthly', 'Quarterly', 'Product Lifecycle'],
            reviewCycles: ['Weekly Component Check', 'Monthly Planning', 'Quarterly Review'],
            complianceChecks: ['RoHS Compliance', 'Warranty Standards', 'Safety Regulations']
          },
          logistics: {
            transportRequirements: ['ESD Protection', 'Secure Transport', 'Tracking'],
            storageTypes: ['Ambient', 'Climate Controlled', 'Secure Storage'],
            handlingRequirements: ['Fragile', 'Handle with Care', 'Avoid Static']
          }
        },
        kpis: {
          componentAvailability: 'Ensure availability of critical components for manufacturing',
          obsolescenceManagement: 'Minimize losses from obsolete inventory',
          warrantyCost: 'Reduce warranty costs through quality control',
          newProductAdoption: 'Track adoption rates of new products',
          upgradeCycle: 'Anticipate and meet upgrade demand'
        }
      };
    case 'fmcg':
      return {
        moduleConfigurations: {
          forecasting: {
            additionalFactors: ['Consumer Trends', 'Promotional Calendar', 'Competitor Activity'],
            timeFrames: ['Daily', 'Weekly', 'Monthly', 'Promotional'],
            indicators: ['Brand Performance', 'Market Share', 'Promotion Effectiveness']
          },
          inventory: {
            criticalMetrics: ['Shelf Life', 'Batch Traceability', 'Distribution Coverage'],
            bufferTypes: ['Standard', 'Promotional', 'Seasonal'],
            monitoringRequirements: ['Temperature Logs', 'Humidity Control', 'Visual Inspection']
          },
          supplyPlanning: {
            supplierRequirements: ['ISO Certification', 'Batch Traceability', 'Quality Control'],
            orderTypes: ['Regular', 'Promotional', 'Seasonal'],
            leadTimeFactors: ['Raw Material Sourcing', 'Manufacturing', 'Distribution']
          },
          salesPlanning: {
            salesChannels: ['Supermarkets', 'Convenience Stores', 'Online Retail', 'Distributors'],
            customerTypes: ['Individual', 'Retail Chains', 'Wholesalers', 'Food Service'],
            promotionalRestrictions: ['Bundle Deals', 'Loyalty Programs', 'Volume Discounts']
          },
          ddsop: {
            planningHorizons: ['Daily', 'Weekly', 'Monthly', 'Promotional'],
            reviewCycles: ['Daily Stock Check', 'Weekly Promotions', 'Monthly Planning'],
            complianceChecks: ['Quality Standards', 'Regulatory Compliance', 'Safety Regulations']
          },
          logistics: {
            transportRequirements: ['Temperature Control', 'Fast Delivery', 'Traceability'],
            storageTypes: ['Ambient', 'Climate Controlled', 'Secure Storage'],
            handlingRequirements: ['Fragile', 'Handle with Care', 'Avoid Contamination']
          }
        },
        kpis: {
          shelfLifeManagement: 'Minimize losses from expired products',
          batchTraceability: 'Ensure traceability of products through the supply chain',
          distributionCoverage: 'Maximize distribution coverage to reach target markets',
          brandPerformance: 'Track brand performance and market share',
          promotionEffectiveness: 'Measure the effectiveness of promotional activities'
        }
      };
    case 'retail':
    default:
      return {
        moduleConfigurations: {
          forecasting: {
            additionalFactors: ['Seasonality', 'Promotions', 'Market Trends'],
            timeFrames: ['Daily', 'Weekly', 'Monthly', 'Seasonal'],
            indicators: ['Foot Traffic', 'Conversion Rate', 'Average Basket Size']
          },
          inventory: {
            criticalMetrics: ['Stock Turnover', 'Inventory Holding Cost', 'Stockout Rate'],
            bufferTypes: ['Standard', 'Promotional', 'Seasonal'],
            monitoringRequirements: ['Stock Levels', 'Reorder Points', 'Demand Forecasts']
          },
          supplyPlanning: {
            supplierRequirements: ['Reliability', 'Lead Time', 'Cost'],
            orderTypes: ['Regular', 'Promotional', 'Seasonal'],
            leadTimeFactors: ['Supplier Lead Time', 'Transportation Time', 'Customs Clearance']
          },
          salesPlanning: {
            salesChannels: ['In-Store', 'Online', 'Catalog', 'Direct Mail'],
            customerTypes: ['Individual', 'Businesses', 'Government', 'Educational Institutions'],
            promotionalRestrictions: ['Limited Time Offers', 'Bundle Deals', 'Clearance Sales']
          },
          ddsop: {
            planningHorizons: ['Daily', 'Weekly', 'Monthly', 'Seasonal'],
            reviewCycles: ['Daily Sales Review', 'Weekly Promotions', 'Monthly Planning'],
            complianceChecks: ['Pricing Standards', 'Promotional Guidelines', 'Safety Regulations']
          },
          logistics: {
            transportRequirements: ['Fast Delivery', 'Secure Transport', 'Tracking'],
            storageTypes: ['Ambient', 'Climate Controlled', 'Secure Storage'],
            handlingRequirements: ['Fragile', 'Handle with Care', 'Avoid Damage']
          }
        },
        kpis: {
          stockTurnover: 'Maximize stock turnover to reduce holding costs',
          inventoryHoldingCost: 'Minimize inventory holding costs',
          stockoutRate: 'Reduce stockout rates to improve customer satisfaction',
          footTraffic: 'Increase foot traffic to drive sales',
          conversionRate: 'Improve conversion rates to maximize revenue'
        }
      };
  }
};

// Get industry-specific KPI descriptions
export const getIndustryKPIDescriptions = (industry: IndustryType) => {
  const data = getIndustrySpecificData(industry);
  return data.kpis;
};

// Get module-specific configurations based on industry
export const getModuleConfigurations = (industry: IndustryType, module: keyof ReturnType<typeof getIndustrySpecificData>['moduleConfigurations']) => {
  const data = getIndustrySpecificData(industry);
  return data.moduleConfigurations[module];
};
