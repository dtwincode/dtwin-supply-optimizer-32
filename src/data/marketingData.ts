
interface MarketingPlan {
  id: string;
  name: string;
  promotionType: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  location: {
    region: string;
    city?: string;
    store?: string;
  };
  budget?: number;
  expectedROI?: number;
}

export const marketingPlansData: MarketingPlan[] = [
  {
    id: "1",
    name: "Spring Electronics Sale",
    promotionType: "seasonal-sale",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    status: "active",
    location: {
      region: "Central Region",
      city: "Riyadh",
      store: "Main Mall Store"
    },
    budget: 150000,
    expectedROI: 2.5
  },
  {
    id: "2",
    name: "Back to School Campaign",
    promotionType: "themed-promotion",
    startDate: "2024-08-15",
    endDate: "2024-09-15",
    status: "draft",
    location: {
      region: "Western Region",
      city: "Jeddah",
      store: "City Center"
    },
    budget: 200000,
    expectedROI: 3.0
  },
  {
    id: "3",
    name: "Year End Clearance",
    promotionType: "clearance",
    startDate: "2024-12-15",
    endDate: "2024-12-31",
    status: "draft",
    location: {
      region: "Eastern Region",
      city: "Dammam"
    },
    budget: 300000,
    expectedROI: 2.8
  }
];

