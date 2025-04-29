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
  rrpPrice: number | string;
  discountPrice: number | string;
  typicalEveningSpeed: string;
  downloadUpload: string;
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

export interface ISPPlans {
  "12M": ISPPlan;
  "25M": ISPPlan;
  "50M": ISPPlan;
  "100M": ISPPlan;
  "100/40M": ISPPlan;
  "250M": ISPPlan;
  "500M": ISPPlan;
  "1000M": ISPPlan;
  [key: string]: ISPPlan;
}

export interface OperationHours {
  sales: string;
  customerService: string;
  technicalSupport: string;
  closedDays: string;
}

export interface SupportChannels {
  phone: boolean | string;
  liveChat: boolean | string;
  email: boolean | string;
  socialMedia: string;
  other: string;
}

export interface NetworkTypes {
  nbn: boolean;
  opticomm: boolean;
  redtrain: boolean;
  supa: boolean;
}

export interface GoogleReviews {
  score: number | string;
  count: number | string;
}

export interface ISPProvider {
  id: string;
  name: string;
  logo: string;
  googleReviews: GoogleReviews;
  supportedLanguages: string[];
  operationHours: OperationHours;
  supportChannels: SupportChannels;
  networkTypes: NetworkTypes;
  plans: ISPPlans;
}

export interface Filters {
  speedTier: string;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  language: string[];
  networkType: string[];
  supportHours: {
    type: string;
    value: string;
  };
  supportChannel: string[];
}

export interface PlanCardProps {
  provider: ISPProvider;
  selectedSpeed: string;
  useDiscountPrice?: boolean;
  showDetails?: boolean;
}

export interface ISPTableProps {
  providers: ISPProvider[];
  filters: Filters;
  sortBy: string;
  useDiscountPrice: boolean;
}

export interface ComparisonProps {
  selectedProviders: ISPProvider[];
  selectedSpeed: string;
  useDiscountPrice: boolean;
}

export interface FilterProps {
  onFilterChange: (filters: Filters) => void;
  onSortChange: (sortBy: string) => void;
  onPriceTypeChange: (useDiscountPrice: boolean) => void;
}

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
} 