export interface StockPosition {
  name: string;
  buyPrice: number;
  quantity: number;
  cmp: number;
  currentValue: number;
  investmentAmount: number;
}

export interface TeamData {
  rank: number;
  teamName: string;
  plPercentage: number | null;
  totalInvestment?: number;
  currentNav?: number;
  stocks: StockPosition[];
  change?: number; // Optional daily change for UI flair
  avatar?: string;
}

export enum SortOption {
  HIGHEST = 'HIGHEST',
  LOWEST = 'LOWEST'
}

export interface SheetConfig {
  url: string;
  teamColumn: string;
  plColumn: string;
}