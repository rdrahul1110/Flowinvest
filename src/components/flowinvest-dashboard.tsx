import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Smartphone,
  Sparkles,
  X,
  Users2,
  TrendingUp,
  AlertCircle,
  Clock,
  Send,
  HelpCircle,
  Building2,
  SlidersHorizontal,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cashFlowDetailed, holdings, money, type Client, type MonthFlow } from '@/lib/flowinvest';

type ComplianceLog = {
  id: string;
  date: string;
  instrument: string;
  rate: string;
  frequency: string;
  rationale: string;
};

type TaxBankRow = {
  bank: string;
  annualInterest: number;
  limit: number;
  status: 'Filed' | 'Pending';
};

export function ClientDashboard({
  client,
  scss,
  amount,
  welcome,
  onDismiss,
  onPreview,
  onBack,
}: {
  client: Client;
  scss: boolean;
  amount: number;
  welcome: boolean;
  onDismiss: () => void;
  onPreview: () => void;
  onBack: () => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const chart = cashFlowDetailed(scss);
  const [selectedMonth, setSelectedMonth] = useState<MonthFlow>(chart[3] as MonthFlow);
  const [isSurplusMode, setIsSurplusMode] = useState(Boolean(client.isSurplus));
  const [gapDrawerOpen, setGapDrawerOpen] = useState(false);
  const [taxDrawerOpen, setTaxDrawerOpen] = useState(false);
  const [holdExitModalOpen, setHoldExitModalOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [reminderToast, setReminderToast] = useState(false);

  // Feature 1: Multi-Bank Account Linkage view toggle
  const [groupByBank, setGroupByBank] = useState(false);

  // Feature 2: SEBI-safe Gap Repair What-If Simulator state
  const [simInstrument, setSimInstrument] = useState<'Senior FD' | 'AAA PSU Bond' | 'Post Office SCSS'>('Senior FD');
  const [simFrequency, setSimFrequency] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const [simYield, setSimYield] = useState<number>(7.45);
  const [simRationale, setSimRationale] = useState<string[]>([
    'Client requires steady monthly cashflow',
    'Preserves sovereign/tier-1 capital safety',
  ]);
  const [complianceLogs, setComplianceLogs] = useState<ComplianceLog[]>([]);

  // Feature 3: Tax & TDS Control state
  const [chartMode, setChartMode] = useState<'net' | 'gross'>('net');
  const [taxBanks, setTaxBanks] = useState<TaxBankRow[]>([
    { bank: 'State Bank of India', annualInterest: 105000, limit: 50000, status: 'Filed' },
    { bank: 'HDFC Bank', annualInterest: 58000, limit: 50000, status: 'Filed' },
    { bank: 'ICICI Bank', annualInterest: 62000, limit: 50000, status: 'Pending' },
  ]);

  const isSharma = client.name === 'Ramesh Sharma';

  const rows = [
    ...holdings,
    ...(scss
      ? [
          {
            bank: 'Post Office SCSS',
            short: 'POST',
            id: '#SCSS',
            amount,
            rate: '8.20%',
            frequency: 'Quarterly',
            maturity: '30 Nov 2029',
            impact: money((amount * 0.082) / 12),
            tone: 'emerald',
            isMaturingSoon: false,
            destinationAccount: 'SBI ••••4410',
          },
        ]
      : []),
  ];

  // Group holdings by receiving bank account for Feature 1
  const groupedByAccount = rows.reduce<Record<string, typeof rows>>((acc, row) => {
    const key = row.destinationAccount || 'SBI ••••4410';
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  const currentTarget = isSurplusMode ? 20000 : client.target;
  const currentIncome = isSurplusMode ? 40000 : client.income;

  // Simulated monthly addition from Canara ₹5L reinvestment
  const simMonthlyIncome = Math.round((500000 * (simYield / 100)) / 12);
  const oldCanaraMonthly = 3333;
  const simDelta = simMonthlyIncome - oldCanaraMonthly;

  function handleSend15H() {
    setReminderToast(true);
    setTimeout(() => setReminderToast(false), 5000);
  }

  function toggleTaxStatus(bankName: string) {
    setTaxBanks((prev) =>
      prev.map((b) =>
        b.bank === bankName ? { ...b, status: b.status === 'Filed' ? 'Pending' : 'Filed' } : b
      )
    );
  }

  function toggleRationale(item: string) {
    setSimRationale((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function handleSaveProposal() {
    const entry: ComplianceLog = {
      id: `LOG-${complianceLogs.length + 1}`,
      date: 'Today',
      instrument: simInstrument,
      rate: `${simYield.toFixed(2)}%`,
      frequency: simFrequency,
      rationale: simRationale.join(' · ') || 'Adviser-reviewed suitability check',
    };
    setComplianceLogs((prev) => [entry, ...prev]);
    setGapDrawerOpen(false);
  }

  const pending15HCount = taxBanks.filter((b) => b.status === 'Pending').length;

  return (
    <>
      <div className="flex items-center justify-between !mb-4">
        <Button variant="ghost" className="back !mb-0" onClick={onBack}>
          <ArrowLeft size={13} /> All clients
        </Button>
        <Button
          variant="outline"
          className="text-xs h-8 border-purple-200 text-purple-700 bg-purple-50/60 hover:bg-purple-100 font-semibold"
          onClick={() => setIsSurplusMode(!isSurplusMode)}
        >
          <TrendingUp size={13} className="mr-1 text-purple-600" />
          {isSurplusMode ? 'Switch to Standard (₹60k Target)' : 'Demo: Surplus Client (₹20k Target)'}
        </Button>
      </div>

      {/* TOAST NOTIFICATION FOR 15H REMINDER */}
      {reminderToast && (
        <div className="p-3 mb-4 rounded-xl bg-blue-600 text-white text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Send size={15} />
            <span>
              <strong>WhatsApp Reminder Dispatched to {client.name}:</strong> "Namaste, please remember to submit Form 15H at ICICI Bank this week to avoid 10% TDS."
            </span>
          </div>
          <Button size="icon" variant="ghost" className="text-white hover:bg-blue-700 h-6 w-6" onClick={() => setReminderToast(false)}>
            <X size={13} />
          </Button>
        </div>
      )}

      {/* WELCOME BANNER AFTER ONBOARDING */}
      {welcome && (
        <div className="welcome">
          <div className="welcome-title">
            <div className="icon-tile">
              <Sparkles size={20} />
            </div>
            <div>
              <strong>{client.name} successfully onboarded!</strong>
              <p>Portfolio synchronized with {rows.length} instruments. First regular paycheck scheduled for: 1 Dec 2026.</p>
            </div>
          </div>
          <div className="welcome-actions">
            <Button variant="outline" onClick={onPreview}>
              <Smartphone size={13} /> Preview December paycheck sheet
            </Button>
            <Button size="icon" variant="ghost" aria-label="Dismiss welcome" onClick={onDismiss}>
              <X size={15} />
            </Button>
          </div>
        </div>
      )}

      {/* CLIENT HEADER */}
      <div className="client-header">
        <div className="client-identity">
          <div className={`avatar ${client.tone}`}>{client.initials}</div>
          <div>
            <div className="eyebrow !mb-2">
              CLIENT HOUSEHOLD <span className="badge neutral">{isSharma ? 'FI–0064' : 'Demo household'}</span>
            </div>
            <h1>
              {client.name} <span>({client.age})</span>
            </h1>
            <p>
              +91 {client.mobile} <span className="mx-2">·</span> Monthly target:{' '}
              <strong className="text-foreground">{money(currentTarget)}/mo</strong>
              <span className="mx-2">·</span> Fixed-Income AUM: <strong className="text-foreground">{client.aum}</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setFamilyModalOpen(true)}>
            <Users2 size={14} className="mr-1 text-primary" /> Family Circle (Son)
          </Button>
          <Button onClick={onPreview}>
            <Smartphone size={14} /> Preview December paycheck <ArrowRight size={13} />
          </Button>
        </div>
      </div>

      {/* 3 RISK & STATUS CARDS */}
      <div className="risk-grid">
        <article className="panel risk-card emerald">
          <div className="icon-tile">
            <ShieldCheck size={19} />
          </div>
          <div>
            <small>Credit health</small>
            <strong>{client.name === 'Lakshmi Iyer' ? 'Credit review needed' : '100% safe (Sovereign / AAA)'}</strong>
          </div>
        </article>

        {/* CLICKABLE FORM 15H APRIL TAX TRACKER (FEATURE 3) */}
        <article
          className="panel risk-card info cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => setTaxDrawerOpen(true)}
        >
          <div className="icon-tile blue">
            <FileCheck2 size={19} />
          </div>
          <div className="flex-1">
            <small>Tax / Form 15H (April) · Click to manage</small>
            <div className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>
                {taxBanks.map((b, idx) => (
                  <span key={b.bank}>
                    {idx > 0 && ' · '}
                    <span className={b.status === 'Pending' ? 'text-amber-600 font-extrabold' : ''}>
                      {b.bank.split(' ')[0]} {b.status === 'Filed' ? '✔' : '⏳ Due'}
                    </span>
                  </span>
                ))}
              </span>
              <span className="text-[10px] font-bold text-blue-700 underline ml-2">
                {pending15HCount > 0 ? `${pending15HCount} due` : 'All filed'}
              </span>
            </div>
          </div>
        </article>

        {/* SURPLUS OR BUFFER STATUS */}
        <article className={`panel risk-card ${isSurplusMode ? 'emerald' : 'warning'}`}>
          <div className={`icon-tile ${isSurplusMode ? 'emerald' : 'amber'}`}>
            <TrendingUp size={19} />
          </div>
          <div>
            <small>{isSurplusMode ? 'Surplus wealth allocation' : 'Quarterly buffer pool'}</small>
            <strong>{isSurplusMode ? '💰 +₹20,000/mo unallocated in savings' : '₹38,400 accumulated buffer'}</strong>
          </div>
        </article>
      </div>

      {/* KPI METRICS GRID */}
      <div className="kpi-grid">
        <article className="panel kpi">
          <div className="kpi-top">
            Total fixed-income portfolio <Landmark size={16} />
          </div>
          <div className="kpi-value">{client.aum}</div>
          <div className="kpi-foot">{rows.length} active holdings · 3 institutions</div>
        </article>
        <article className="panel kpi">
          <div className="kpi-top">
            Average monthly paycheck <Smartphone size={16} />
          </div>
          <div className="kpi-value text-primary">{money(currentIncome)}</div>
          <div className="kpi-foot">Net household cash in bank</div>
        </article>
        <article className="panel kpi">
          <div className="kpi-top">
            Monthly expense coverage <CheckCircle2 size={16} />
          </div>
          <div className="kpi-value">{Math.round((currentIncome / currentTarget) * 100)}%</div>
          <div className="kpi-foot">Against {money(currentTarget)} monthly target</div>
        </article>
        <article className="panel kpi">
          <div className="kpi-top">
            Next deposit maturity <CalendarDays size={16} />
          </div>
          <div className="kpi-value">
            18 Dec <span className="text-[14px] font-medium text-muted-foreground">2026</span>
          </div>
          <div className="kpi-foot text-amber-600 font-semibold">Canara Bank · ₹5.0 L principal</div>
        </article>
      </div>

      {/* 12-MONTH NET PAYCHECK CASH-FLOW FORECAST */}
      <section className="panel cash-panel">
        <div className="cash-panel-top">
          <div>
            <h2>12-month {chartMode === 'net' ? 'net' : 'gross'} paycheck forecast</h2>
            <p>
              {chartMode === 'net'
                ? 'Net cash landing in bank accounts after pre-factored TDS. Click any month for source breakdown.'
                : 'Gross interest earned before TDS deductions. Toggle back to Net to see actual bank credits.'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-secondary rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                type="button"
                className={`px-2.5 py-1 rounded-md transition-colors ${chartMode === 'net' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setChartMode('net')}
              >
                Net in Bank
              </button>
              <button
                type="button"
                className={`px-2.5 py-1 rounded-md transition-colors ${chartMode === 'gross' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                onClick={() => setChartMode('gross')}
              >
                Gross Interest
              </button>
            </div>
            <div className="legend">
              <span>
                <i />Monthly paycheck
              </span>
              <span>
                <i className="target" />Expense target ({money(currentTarget)})
              </span>
            </div>
          </div>
        </div>

        <div className="cash-chart">
          <div className="chart-y">
            <span>₹80,000</span>
            <span>₹60,000</span>
            <span>₹40,000</span>
            <span>₹20,000</span>
            <span>₹0</span>
          </div>
          <div className="chart-bars">
            {chart.map((m, i) => {
              const displayValue = chartMode === 'net' ? m.value : m.gross;
              const simulatedValue = gapDrawerOpen ? Math.max(0, displayValue + simDelta) : displayValue;
              return (
                <div
                  className={`chart-col cursor-pointer ${selectedMonth.month === m.month ? 'ring-2 ring-primary/40 rounded-t-lg bg-accent/20' : ''}`}
                  key={m.month}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setSelectedMonth(m)}
                >
                  {hover === i && (
                    <span className="chart-tooltip">
                      {money(displayValue)} ({chartMode === 'net' ? 'Net' : 'Gross'})
                    </span>
                  )}
                  {gapDrawerOpen && simDelta !== 0 && (
                    <div
                      className="chart-bar-ghost"
                      style={{ height: `${Math.min(100, (simulatedValue / 80000) * 85)}%` }}
                    />
                  )}
                  <button
                    type="button"
                    className={`chart-bar !p-0 !rounded-b-none ${m.isQuarterly ? 'quarter' : ''}`}
                    style={{ height: `${Math.min(100, (displayValue / 80000) * 85)}%` }}
                    aria-label={`${m.month}: ${money(displayValue)}`}
                  />
                  <small className={selectedMonth.month === m.month ? 'font-bold text-primary' : ''}>{m.month}</small>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE MONTH DETAIL STRIP */}
        <div className="mt-4 p-3.5 rounded-xl bg-accent/30 border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground font-black flex items-center justify-center text-[10px]">
              {selectedMonth.month}
            </div>
            <div>
              <strong className="text-foreground">{selectedMonth.month} 2027 Breakdown (Selected)</strong>
              <div className="text-muted-foreground text-[11px]">{selectedMonth.sources}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold">Gross Interest</span>
              <span className="font-bold text-foreground">{money(selectedMonth.gross)}</span>
            </div>
            <div>
              <span className="text-[10px] text-warning block font-semibold">Pre-Factored TDS</span>
              <span className="font-bold text-warning">{selectedMonth.tds > 0 ? `- ${money(selectedMonth.tds)}` : '₹0'}</span>
            </div>
            <div>
              <span className="text-[10px] text-primary block font-semibold">Net in Bank</span>
              <span className="font-black text-primary text-sm">{money(selectedMonth.value)}</span>
            </div>
          </div>
        </div>

        <div className="cash-footer">
          <span>
            Regular months <strong>₹42,000</strong>
          </span>
          <span>
            Quarterly payout months <strong>{scss ? '₹72,800' : '₹42,000'}</strong> <span className="text-primary font-bold">(+₹12.8k buffer covers lean months)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} /> Pre-factored TDS schedule
          </span>
        </div>
      </section>

      {/* ACTIVE HOLDINGS & MULTI-BANK LINKAGE WORKBENCH */}
      <section>
        <div className="section-heading">
          <h2 className="section-title">
            Active holdings <span className="count">{rows.length}</span>
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={groupByBank ? 'default' : 'outline'}
              className="text-xs h-7"
              onClick={() => setGroupByBank(!groupByBank)}
            >
              <Building2 size={12} className="mr-1" /> {groupByBank ? 'All Holdings' : 'By Receiving Bank'}
            </Button>
            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setHoldExitModalOpen(true)}>
              <HelpCircle size={12} className="mr-1 text-primary" /> Bond "Hold vs. Exit" Tool
            </Button>
            <span className="badge">
              <CheckCircle2 size={11} /> Live synchronized
            </span>
          </div>
        </div>

        {!groupByBank ? (
          <div className="panel table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>INSTITUTION</th>
                  <th>TYPE</th>
                  <th>PRINCIPAL</th>
                  <th>RATE</th>
                  <th>PAYOUT</th>
                  <th>CREDITS TO</th>
                  <th>MATURITY</th>
                  <th>NET MONTHLY IMPACT</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((h) => (
                  <tr key={h.id} className={h.isMaturingSoon ? 'bg-amber-500/10' : ''}>
                    <td>
                      <div className="holding-bank">
                        <div className={`bank-logo ${h.tone}`}>{h.short}</div>
                        <div>
                          <strong>{h.bank}</strong>
                          <div className="text-muted-foreground text-[9px] mt-0.5">
                            {h.id === '#SCSS' ? 'Government backed' : `Deposit ${h.id}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge neutral">{h.id === '#SCSS' ? 'SCSS' : 'Fixed deposit'}</span>
                    </td>
                    <td>
                      <strong>{money(h.amount)}</strong>
                    </td>
                    <td>{h.rate}</td>
                    <td>{h.frequency}</td>
                    <td>
                      <span className="account-chip">{h.destinationAccount}</span>
                    </td>
                    <td>
                      <span className={h.isMaturingSoon ? 'text-warning font-bold flex items-center gap-1' : ''}>
                        {h.isMaturingSoon && <Clock size={11} />}
                        {h.maturity}
                      </span>
                    </td>
                    <td className="text-primary font-semibold">{h.impact}</td>
                    <td>
                      {h.isMaturingSoon ? (
                        <Button size="sm" className="h-6 text-[10px] px-2 bg-amber-600 hover:bg-amber-700 text-white font-bold" onClick={() => setGapDrawerOpen(true)}>
                          Fix Gap
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groupedByAccount).map(([account, items]) => {
              const totalPrincipal = items.reduce((sum, x) => sum + x.amount, 0);
              return (
                <div key={account} className="panel p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-primary" />
                      <strong className="text-sm text-foreground">{account}</strong>
                    </div>
                    <span className="badge neutral">{items.length} deposits · {money(totalPrincipal)}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1">
                        <div>
                          <strong className="text-foreground">{item.bank}</strong>
                          <span className="text-muted-foreground ml-1.5">({item.rate} · {item.frequency})</span>
                        </div>
                        <span className="font-semibold text-primary">{item.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SEBI COMPLIANCE DIARY LOGS (IF ANY SAVED FROM SIMULATOR) */}
      {complianceLogs.length > 0 && (
        <section className="panel p-4 mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ClipboardCheck size={15} className="text-primary" />
            SEBI Adviser Decision-Support Log ({complianceLogs.length})
          </div>
          <div className="space-y-2">
            {complianceLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-secondary/50 border border-border text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <strong className="text-foreground">{log.instrument} @ {log.rate} ({log.frequency})</strong>
                  <div className="text-[11px] text-muted-foreground">{log.rationale}</div>
                </div>
                <span className="badge">{log.date} · Adviser Signed</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BOND PANIC DEFENSE CALLOUT */}
      <div className="p-4 rounded-xl bg-accent/40 border border-border flex items-center justify-between text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-3">
          <AlertCircle size={18} className="text-primary flex-shrink-0" />
          <div>
            <strong className="text-foreground">Client's NHAI 7.35% Bond shows a -5.8% paper loss on their screen?</strong>
            <p className="mt-0.5">Market interest rate swings do not impact sovereign principal or coupons. Use our Hold vs. Exit analysis to reassure the client.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs font-semibold" onClick={() => setHoldExitModalOpen(true)}>
          Open Hold vs. Exit Card
        </Button>
      </div>

      {/* FEATURE 2: SEBI-SAFE GAP REPAIR WHAT-IF SIMULATOR */}
      <Dialog open={gapDrawerOpen} onOpenChange={setGapDrawerOpen}>
        <DialogContent className="detail-dialog max-w-lg">
          <DialogTitle className="flex items-center gap-2">
            <SlidersHorizontal size={17} className="text-primary" />
            Maturity Gap What-If Simulator
          </DialogTitle>
          <DialogDescription>
            Canara Bank ₹5.0 Lakh maturing in 25 days (18 Dec 2026) · Adviser Decision-Support
          </DialogDescription>

          <div className="space-y-3.5 text-xs mt-2">
            <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-900 font-medium">
              <strong>Current Income Gap:</strong> Old rate 8.00% paid ₹3,333/mo. Standard renewal at 7.10% creates a <strong>-₹375/month deficit</strong>.
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1.5">1. Instrument Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Senior FD', 'AAA PSU Bond', 'Post Office SCSS'] as const).map((inst) => (
                  <button
                    key={inst}
                    type="button"
                    className={`p-2 rounded-lg border text-center font-semibold transition-colors ${
                      simInstrument === inst ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                    }`}
                    onClick={() => {
                      setSimInstrument(inst);
                      if (inst === 'Senior FD') setSimYield(7.45);
                      if (inst === 'AAA PSU Bond') setSimYield(7.65);
                      if (inst === 'Post Office SCSS') setSimYield(8.2);
                    }}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-foreground block mb-1.5">2. Payout Frequency</label>
                <div className="flex gap-2">
                  {(['Monthly', 'Quarterly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      className={`flex-1 p-2 rounded-lg border font-semibold ${
                        simFrequency === freq ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                      }`}
                      onClick={() => setSimFrequency(freq)}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1.5">
                  3. Expected Yield: <span className="text-primary">{simYield.toFixed(2)}%</span>
                </label>
                <input
                  type="range"
                  min="7.0"
                  max="8.2"
                  step="0.05"
                  value={simYield}
                  onChange={(e) => setSimYield(parseFloat(e.target.value))}
                  className="w-full accent-primary mt-2"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-accent/40 border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground block">Simulated Monthly Paycheck</span>
                <strong className="text-sm text-foreground">{money(simMonthlyIncome)} / mo</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">vs. Old Canara FD</span>
                <strong className={`text-sm ${simDelta >= 0 ? 'text-primary' : 'text-amber-600'}`}>
                  {simDelta >= 0 ? `+${money(simDelta)}` : money(simDelta)} / mo
                </strong>
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1.5">4. SEBI Adviser Rationale (Required)</label>
              <div className="space-y-1.5">
                {[
                  'Client requires steady monthly cashflow',
                  'Preserves sovereign/tier-1 capital safety',
                  'Matches client liquidity horizon (3-5 yrs)',
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer text-[11px] text-foreground">
                    <input
                      type="checkbox"
                      checked={simRationale.includes(item)}
                      onChange={() => toggleRationale(item)}
                      className="accent-primary"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full mt-2" onClick={handleSaveProposal}>
              Save Proposal to SEBI Advice Diary
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FEATURE 3: TAX & FORM 15H CONTROL DRAWER */}
      <Dialog open={taxDrawerOpen} onOpenChange={setTaxDrawerOpen}>
        <DialogContent className="detail-dialog max-w-lg">
          <DialogTitle className="flex items-center gap-2">
            <FileCheck2 size={17} className="text-blue-600" />
            Tax & Form 15H Control Center (FY 2026–27)
          </DialogTitle>
          <DialogDescription>
            Senior citizen TDS threshold is ₹50,000 per bank. Track 15H filings to prevent 10% TDS deductions.
          </DialogDescription>

          <div className="space-y-3 text-xs mt-2">
            {taxBanks.map((b) => {
              const pct = Math.min(100, Math.round((b.annualInterest / b.limit) * 100));
              return (
                <div key={b.bank} className="p-3 rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-foreground text-sm">{b.bank}</strong>
                      <div className="text-[11px] text-muted-foreground">
                        Est. Annual Interest: <strong>{money(b.annualInterest)}</strong> / ₹50,000 limit
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleTaxStatus(b.bank)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        b.status === 'Filed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status === 'Filed' ? '✔ 15H Filed' : '⏳ Pending (Click to mark)'}
                    </button>
                  </div>
                  <div className="tds-bar-track">
                    <div
                      className={`tds-bar-fill ${b.status === 'Pending' ? 'warning' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setTaxDrawerOpen(false);
                  handleSend15H();
                }}
              >
                <Send size={13} className="mr-1.5" /> Send 15H WhatsApp Reminder
              </Button>
              <Button className="flex-1" onClick={() => setTaxDrawerOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: BOND "HOLD VS EXIT" ANALYSIS */}
      <Dialog open={holdExitModalOpen} onOpenChange={setHoldExitModalOpen}>
        <DialogContent className="detail-dialog max-w-xl">
          <DialogTitle>Bond "Hold vs. Exit" Decision Engine</DialogTitle>
          <DialogDescription>NHAI 7.35% 2031 Sovereign Bond (Client Paper Loss Analysis)</DialogDescription>
          <div className="space-y-3 text-xs mt-2">
            <div className="p-3 rounded-lg bg-secondary text-muted-foreground">
              Market yields rose from 7.0% to 7.8%, causing the quoted market price to drop to ₹9.42 Lakh (-5.8%). The National Highways Authority of India is 100% backed by the Central Government.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border-2 border-primary bg-primary/5 space-y-1.5">
                <span className="font-bold text-primary uppercase text-[10px] block">Option A: Hold to Maturity</span>
                <p className="text-foreground text-[11px]">
                  • Full ₹10,00,000 face value returned at maturity.<br />
                  • ₹73,500 annual coupon arrives uninterrupted.<br />
                  • Zero credit default risk.
                </p>
                <div className="text-primary font-black text-[11px] pt-1">✔ Strongly Recommended</div>
              </div>

              <div className="p-3 rounded-xl border border-danger/30 bg-danger/5 space-y-1.5">
                <span className="font-bold text-destructive uppercase text-[10px] block">Option B: Panic Sell Today</span>
                <p className="text-foreground text-[11px]">
                  • Receives ₹9,42,000 (locks in ₹58k loss).<br />
                  • Reinvesting at 7.2% permanently lowers monthly cash.<br />
                  • Irreversible wealth destruction.
                </p>
                <div className="text-destructive font-bold text-[11px] pt-1">✖ Value Destroying</div>
              </div>
            </div>

            <Button className="w-full mt-3" onClick={() => { setHoldExitModalOpen(false); alert('1-Page Client Calming Note generated!'); }}>
              Download 1-Page Explanation Note for Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: NRI FAMILY CIRCLE PREVIEW */}
      <Dialog open={familyModalOpen} onOpenChange={setFamilyModalOpen}>
        <DialogContent className="detail-dialog max-w-md">
          <DialogTitle>Family Circle Preview (Son in Dallas)</DialogTitle>
          <DialogDescription>What Rahul Sharma sees on his phone in Dallas, USA</DialogDescription>
          <div className="space-y-3 text-xs mt-2">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Parents' Retirement Cash Flow</span>
                <span className="badge">100% Safe</span>
              </div>
              <div className="text-2xl font-black text-primary">₹1,56,800</div>
              <div className="text-[11px] text-muted-foreground">Next 3 months of payouts safely scheduled with ₹38,400 reserve buffer.</div>
            </div>

            <div className="p-3 rounded-lg bg-secondary text-muted-foreground text-[11px]">
              🔒 <strong>Privacy Guarded:</strong> All bank account numbers, PAN details, and withdrawal permissions are strictly masked.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://flowinvest.in/circle/sharma-89a7"
                className="w-full px-2 py-1.5 text-xs bg-secondary rounded border border-border font-mono select-all"
              />
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => alert('Co-Pilot Link Copied!')}>
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
