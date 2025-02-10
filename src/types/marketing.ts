
export type PromotionType = 'black-friday' | 'holiday-season' | 'summer-sale' | 'spring-sale' | 'custom';

export interface MarketingPlan {
  id: string;
  name: string;
  description: string;
  promotionType: PromotionType;
  startDate: string;
  endDate: string;
  products: {
    sku: string;
    targetQuantity: number;
    discountPercentage: number;
  }[];
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}
