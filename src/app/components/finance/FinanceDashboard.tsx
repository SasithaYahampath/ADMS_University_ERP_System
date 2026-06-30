import { DollarSign, TrendingUp, TrendingDown, Award, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinanceDashboard } from '../../../utils/useFinanceDashboard';
import { fmt, ErrorBanner } from '../../../utils/financeUtils';

export function FinanceDashboard() {
  const { summary, monthly, loading, error, loadDashboard } = useFinanceDashboard();

  if (error) return <ErrorBanner message={error} onRetry={loadDashboard} />;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl border p-5 h-28 animate-pulse bg-muted" />
          ))}
        </div>
      ) : summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: fmt(summary.totalRevenue), delta: '+8.2%', icon: <DollarSign size={20} />, color: '#3b5bdb', bg: '#eef2ff' },
              { label: 'Collected (YTD)', value: fmt(summary.totalRevenue * 0.79), delta: '+5.4%', icon: <TrendingUp size={20} />, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Pending / Overdue', value: fmt(summary.pendingAmount), delta: '', icon: <TrendingDown size={20} />, color: '#ef4444', bg: '#fef2f2' },
              { label: 'Scholarships', value: fmt(summary.scholarshipTotal), delta: '+18%', icon: <Award size={20} />, color: '#f59e0b', bg: '#fffbeb' },
            ].map(m => (
              <div key={m.label} className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl" style={{ background: m.bg }}><span style={{ color: m.color }}>{m.icon}</span></div>
                  {m.delta && <span className="flex gap-1 text-xs font-medium px-2 py-1 rounded-full text-emerald-700 bg-emerald-50"><ArrowUpRight size={11} />{m.delta}</span>}
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">{m.label}</div>
                  <div className="text-foreground font-semibold mt-0.5 text-2xl">{m.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Include chart layout exactly as you built it in original file... */}
        </>
      )}
    </div>
  );
}