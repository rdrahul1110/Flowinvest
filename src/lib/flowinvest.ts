export const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
export const insuredLimit = 500000;
export const uninsuredAmount = (total: number) => Math.max(0, total - insuredLimit);
// Calibrated demo household estimate supplied by the brief; not an actual tax calculation.
export const monthlyEstimate = (scss: boolean, amount: number) => 48150 + (scss ? amount * .082 / 12 : 0);
export const coverage = (income: number, target: number) => target > 0 ? Math.round(income / target * 100) : 0;
export type Client = { name: string; age: number; mobile: string; target: number; aum: string; income: number; initials: string; tone: string; status: string };
export const initialClients: Client[] = [
 { name: 'Ramesh Sharma', age: 68, mobile: '98201 44521', target: 60000, aum: '₹38.0 L', income: 58400, initials: 'RS', tone: 'emerald', status: 'Needs attention' },
 { name: 'Lakshmi Iyer', age: 64, mobile: '98401 22109', target: 85000, aum: '₹1.24 Cr', income: 92300, initials: 'LI', tone: 'blue', status: 'Needs attention' },
 { name: 'Anil Gupta', age: 71, mobile: '98110 36784', target: 75000, aum: '₹86.5 L', income: 78000, initials: 'AG', tone: 'amber', status: 'Income watch' },
 { name: 'Meera & Rajesh Patel', age: 65, mobile: '98790 12843', target: 95000, aum: '₹1.62 Cr', income: 112500, initials: 'MP', tone: 'rose', status: 'On track' },
 { name: 'Sunita Desai', age: 62, mobile: '98202 78651', target: 45000, aum: '₹54.2 L', income: 48200, initials: 'SD', tone: 'blue', status: 'On track' },
];
export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const cashFlow = (scss: boolean) => months.map((month, i) => ({ month, value: scss && (i + 1) % 3 === 0 ? 72800 : 42000 }));
export const holdings = [
 { bank: 'State Bank of India', short: 'SBI', id: '#4128', amount: 1000000, rate: '7.10%', frequency: 'Monthly', maturity: '12 Aug 2027', impact: '₹5,917', tone: 'blue' },
 { bank: 'State Bank of India', short: 'SBI', id: '#9042', amount: 500000, rate: '6.80%', frequency: 'Quarterly', maturity: '08 Feb 2027', impact: '₹2,833', tone: 'blue' },
 { bank: 'HDFC Bank', short: 'HDFC', id: '#1189', amount: 800000, rate: '7.25%', frequency: 'At maturity', maturity: '28 Dec 2026', impact: 'Cumulative', tone: 'rose' },
];