
export interface Industry {
  id: string;
  name: string;
  nameAr: string;
  maturityData: MaturityCategory[];
}

export interface MaturityCategory {
  name: string;
  nameAr: string;
  score: number;
  subcategories: MaturitySubcategory[];
}

export interface MaturitySubcategory {
  name: string;
  nameAr: string;
  level: number;
  description: string;
  descriptionAr: string;
}
