export interface Provider {
  id: string;
  name: string;
  logo: string;
  googleRating: number;
  minMonthlyPrice: {
    regular: number;
    discounted: number;
  };
  maxDownloadSpeed: number;
  networkType: string[];
  supportedLanguages: string[];
  supportHours: {
    from: string;
    to: string;
  };
  supportChannels: string[];
  description?: string;
} 