export type Transaction = {
  date: string;
  description: string;
  amount: number;
  myr: number;
  type: 'buy' | 'sell' | 'fee' | 'other';
  reference?: string;
};

export type CSVRow = {
  "Wallet ID"?: string | number;
  Row?: number;
  "Timestamp (UTC)"?: string;
  Description?: string;
  Currency?: string;
  "Balance delta"?: number;
  "Available balance delta"?: number;
  Balance?: number;
  "Available balance"?: number;
  "Cryptocurrency transaction ID"?: string;
  "Cryptocurrency address"?: string;
  "Value currency"?: string;
  "Value amount"?: number;
  Reference?: string;
};

export type YearData = {
  transactions: Transaction[];
  totalAmount: number;
  totalMyr: number;
};

export type YearlyBreakdown = Record<string, YearData>;

export type Metrics = {
  currency: string;
  totalAmount: number;
  totalMyr: number;
  averagePrice: number;
  currentValue: number;
  profit: number;
  roiPercentage: number;
};
