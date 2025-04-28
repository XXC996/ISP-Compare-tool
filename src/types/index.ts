export interface ISPPlan {
  id: string;
  provider: string;
  name: string;
  price: number;
  speed: {
    download: number;
    upload: number;
  };
  data: string; // "Unlimited" or size in GB
  contract: number; // Length in months, 0 for no contract
  features: string[];
  rating: number;
  // Extended fields used in PlanCard component
  logoSrc: string;
  type: string;
  promoPrice?: string;
  typicalSpeed: number;
  setupFee: number;
  modem: string;
  yearCost: number;
  reviewCount: number;
  support?: string;
  languages?: string;
  locations: string[]; // State/territory codes like NSW, VIC, etc.
  availability: string[]; // Metro, Regional, Rural
}

export interface IspTable {
  id: string;
  speed: number;
  telstra: number;
  tpg: number;
  optus: number;
  abb: number;
  superloop: number;
  ozcom: number;
}

export interface FilterOptions {
  location: string;
  minSpeed: number;
  maxPrice: number;
  minRating: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavItem {
  id: string;
  label: string;
} 