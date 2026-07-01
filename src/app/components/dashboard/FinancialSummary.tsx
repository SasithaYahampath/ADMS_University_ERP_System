import { ChevronRight } from 'lucide-react';
import { fmt } from '../../../utils/dashboardUtils';

interface FinancialSummaryProps {
  finance: any;
  loading: boolean;
  onNavigate: (view: string) => void;
}

export function FinancialSummary({ finance, loading, onNavigate }: FinancialSummaryProps) {
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground text-base">Financial Summary</h3>
        <button
          onClick={() => onNavigate('finance')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Full report <ChevronRight size={13} />
        </button>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />)}
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { label: 'Total Revenue',     value: finance ? fmt(finance.totalRevenue)     : '—', color: '#3b5bdb', bg: '#eef2ff' },
            { label: 'Pending / Overdue', value: finance ? fmt(finance.pendingAmount)    : '—', color: '#ef4444', bg: '#fef2f2' },
            { label: 'Scholarships',      value: finance ? fmt(finance.scholarshipTotal) : '—', color: '#8b5cf6', bg: '#f5f3ff' },
          ].map(f => (
            <div key={f.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: f.bg }}>
              <span className="text-sm" style={{ color: f.color }}>{f.label}</span>
              <span className="font-bold" style={{ color: f.color, fontSize: 18 }}>{f.value}</span>
            </div>
          ))}
          {finance?.revenueByType?.slice(0, 3).map((r: any) => (
            <div key={r.Type} className="flex items-center justify-between text-xs px-1">
              <span className="text-muted-foreground">{r.Type}</span>
              <span className="text-foreground font-medium">{fmt(Number(r.Total))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
