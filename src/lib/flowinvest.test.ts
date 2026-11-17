import { describe, expect, it } from 'vitest';
import { monthlyEstimate, uninsuredAmount, coverage, cashFlow } from './flowinvest';
describe('FlowInvest demo rules', () => {
 it('applies the ₹5 lakh DICGC limit to ₹15 lakh SBI deposits', () => expect(uninsuredAmount(1500000)).toBe(1000000));
 it('estimates ₹58,400 with ₹15 lakh SCSS at 8.2%', () => expect(monthlyEstimate(true,1500000)).toBe(58400));
 it('updates income when SCSS is removed or its amount changes', () => { expect(monthlyEstimate(false,1500000)).toBe(48150); expect(monthlyEstimate(true,3000000)).toBe(68650); });
 it('covers 97% of a ₹60,000 monthly target', () => expect(coverage(58400,60000)).toBe(97));
 it('shows ₹72,800 quarterly spikes and ₹42,000 normal months', () => { expect(cashFlow(true).map(x=>x.value)).toEqual([42000,42000,72800,42000,42000,72800,42000,42000,72800,42000,42000,72800]); });
});