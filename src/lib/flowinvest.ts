export const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
export const insuredLimit = 500000;
export const uninsuredAmount = (total: number) => Math.max(0, total - insuredLimit);

export const monthlyEstimate = (scss: boolean, amount: number) => 48150 + (scss ? (amount * 0.082) / 12 : 0);
export const coverage = (income: number, target: number) => (target > 0 ? Math.round((income / target) * 100) : 0);

export type BankAccount = {
  id: string;
  bank: string;
  last4: string;
  label: string;
};

export type Client = {
  name: string;
  age: number;
  mobile: string;
  target: number;
  aum: string;
  income: number;
  initials: string;
  tone: string;
  status: string;
  isSurplus?: boolean;
  accounts?: BankAccount[];
};

export const defaultAccounts: BankAccount[] = [
  { id: 'sbi-4410', bank: 'SBI', last4: '4410', label: 'SBI ••••4410' },
  { id: 'hdfc-8821', bank: 'HDFC', last4: '8821', label: 'HDFC ••••8821' },
  { id: 'icici-1904', bank: 'ICICI', last4: '1904', label: 'ICICI ••••1904' },
];

export const initialClients: Client[] = [
  { name: 'Ramesh Sharma', age: 68, mobile: '98201 44521', target: 60000, aum: '₹38.0 L', income: 58400, initials: 'RS', tone: 'emerald', status: 'Needs attention', accounts: defaultAccounts },
  { name: 'Lakshmi Iyer', age: 64, mobile: '98401 22109', target: 85000, aum: '₹1.24 Cr', income: 92300, initials: 'LI', tone: 'blue', status: 'Needs attention', accounts: defaultAccounts },
  { name: 'Anil Gupta', age: 71, mobile: '98110 36784', target: 75000, aum: '₹86.5 L', income: 78000, initials: 'AG', tone: 'amber', status: 'Income watch', accounts: defaultAccounts },
  { name: 'Meera & Rajesh Patel', age: 65, mobile: '98790 12843', target: 95000, aum: '₹1.62 Cr', income: 112500, initials: 'MP', tone: 'rose', status: 'On track', accounts: defaultAccounts },
  { name: 'Sunita Desai', age: 62, mobile: '98202 78651', target: 45000, aum: '₹54.2 L', income: 48200, initials: 'SD', tone: 'blue', status: 'On track', isSurplus: true, accounts: defaultAccounts },
];

export type MonthFlow = {
  month: string;
  value: number;
  gross: number;
  tds: number;
  isQuarterly: boolean;
  sources: string;
};

export const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

export const cashFlowDetailed = (scss: boolean): MonthFlow[] => [
  { month: 'Dec', value: scss ? 72800 : 42000, gross: 80800, tds: 8000, isQuarterly: true, sources: 'SBI, HDFC, Post Office SCSS' },
  { month: 'Jan', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Feb', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Mar', value: scss ? 72800 : 42000, gross: 80800, tds: 8000, isQuarterly: true, sources: 'SBI, HDFC, Post Office SCSS (HDFC cuts ₹8,000 TDS in Mar)' },
  { month: 'Apr', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'May', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Jun', value: scss ? 72800 : 42000, gross: 72800, tds: 0, isQuarterly: true, sources: 'SBI, HDFC, Post Office SCSS' },
  { month: 'Jul', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Aug', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Sep', value: scss ? 72800 : 42000, gross: 72800, tds: 0, isQuarterly: true, sources: 'SBI, HDFC, Post Office SCSS' },
  { month: 'Oct', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
  { month: 'Nov', value: 42000, gross: 42000, tds: 0, isQuarterly: false, sources: 'SBI Monthly, HDFC' },
];

export type Holding = {
  bank: string;
  short: string;
  id: string;
  amount: number;
  rate: string;
  frequency: string;
  maturity: string;
  impact: string;
  tone: string;
  isMaturingSoon: boolean;
  destinationAccount: string;
  type?: string;
  rating?: string;
  isDowngraded?: boolean;
  downgradeDetails?: {
    agency: string;
    from: string;
    to: string;
    outlook: string;
    reason: string;
    date: string;
  };
};

export const sharmaHoldings: Holding[] = [
  { bank: 'Canara Bank', short: 'CAN', id: '#8812', amount: 500000, rate: '8.00%', frequency: 'Monthly', maturity: '18 Dec 2026', impact: '₹3,333', tone: 'amber', isMaturingSoon: true, destinationAccount: 'SBI ••••4410', type: 'Fixed deposit', rating: 'AAA Safe' },
  { bank: 'State Bank of India', short: 'SBI', id: '#4128', amount: 1000000, rate: '7.10%', frequency: 'Monthly', maturity: '12 Aug 2027', impact: '₹5,917', tone: 'blue', isMaturingSoon: false, destinationAccount: 'SBI ••••4410', type: 'Fixed deposit', rating: 'Sovereign' },
  { bank: 'State Bank of India', short: 'SBI', id: '#9042', amount: 500000, rate: '6.80%', frequency: 'Quarterly', maturity: '08 Feb 2027', impact: '₹2,833', tone: 'blue', isMaturingSoon: false, destinationAccount: 'SBI ••••4410', type: 'Fixed deposit', rating: 'Sovereign' },
  { bank: 'HDFC Bank', short: 'HDFC', id: '#1189', amount: 800000, rate: '7.25%', frequency: 'At maturity', maturity: '28 Dec 2026', impact: 'Cumulative', tone: 'rose', isMaturingSoon: false, destinationAccount: 'HDFC ••••8821', type: 'Fixed deposit', rating: 'AAA Safe' },
];

export const iyerHoldings: Holding[] = [
  {
    bank: 'ABC Finance Ltd',
    short: 'ABC',
    id: '#BOND-9901',
    amount: 1500000,
    rate: '8.40%',
    frequency: 'Monthly',
    maturity: '15 May 2028',
    impact: '₹10,500',
    tone: 'rose',
    isMaturingSoon: false,
    destinationAccount: 'HDFC ••••8821',
    type: 'Corporate bond',
    rating: 'CRISIL AA- ⬇ (was AAA)',
    isDowngraded: true,
    downgradeDetails: {
      agency: 'CRISIL Ratings',
      from: 'AAA (Stable)',
      to: 'AA- (Negative)',
      outlook: 'Negative Outlook',
      reason: 'Elevated asset quality pressure in retail and MSME loan portfolio, coupled with rising cost of wholesale funds.',
      date: '14 Nov 2026',
    },
  },
  { bank: 'State Bank of India', short: 'SBI', id: '#4128', amount: 3000000, rate: '7.10%', frequency: 'Monthly', maturity: '12 Aug 2027', impact: '₹17,750', tone: 'blue', isMaturingSoon: false, destinationAccount: 'SBI ••••4410', type: 'Fixed deposit', rating: 'Sovereign' },
  { bank: 'HDFC Bank', short: 'HDFC', id: '#1189', amount: 4000000, rate: '7.25%', frequency: 'Quarterly', maturity: '28 Oct 2027', impact: '₹24,167', tone: 'emerald', isMaturingSoon: false, destinationAccount: 'HDFC ••••8821', type: 'Fixed deposit', rating: 'AAA Safe' },
  { bank: 'ICICI Bank', short: 'ICICI', id: '#2204', amount: 3900000, rate: '7.30%', frequency: 'Monthly', maturity: '10 Nov 2028', impact: '₹23,725', tone: 'blue', isMaturingSoon: false, destinationAccount: 'HDFC ••••8821', type: 'Fixed deposit', rating: 'AAA Safe' },
];

export const getHoldingsForClient = (clientName: string): Holding[] => {
  if (clientName === 'Lakshmi Iyer') {
    return iyerHoldings;
  }
  return sharmaHoldings;
};

export const holdings: Holding[] = sharmaHoldings;
