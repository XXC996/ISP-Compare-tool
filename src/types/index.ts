export interface ISPPlan {
  id: string;
  provider: string;
  name?: string;
  price?: number;
  speed: {
    download: number;
    upload: number;
  };
  data: string; // "Unlimited" or size in GB
  contract: number; // Length in months, 0 for no contract
  features?: string[];
  rating: number;
  // Extended fields used in EnhancedPlanCard component
  logoSrc: string;
  type: string;
  promoPrice?: number | string;
  typicalSpeed: number;
  setupFee: number;
  modem: string;
  yearCost: string | number;
  reviewCount: number;
  support: string;
  languages: string;
  rrpPrice: number | string;
  discountPrice: number | string;
  typicalEveningSpeed?: string;
  downloadUpload?: string;
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

export interface PlanData {
  rrpPrice: number | string;
  discountPrice: number | string;
  typicalEveningSpeed: string;
  maxSpeed: string;
  downloadUpload: string;
  data: string;
  setupFee: number;
  contractLength: number;
  modemIncluded: boolean;
  promoPrice?: number | string;
}

export interface ISPPlans {
  "12M": PlanData;
  "25M": PlanData;
  "50M": PlanData;
  "100M": PlanData;
  "100/40M": PlanData;
  "250M": PlanData;
  "500M": PlanData;
  "1000M": PlanData;
  [key: string]: PlanData;
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
  planTypes: string[];
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