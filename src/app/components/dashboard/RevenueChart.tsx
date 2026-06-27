import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Loader2 } from 'lucide-react';

interface RevenueChartProps {
  data: any[];
  loading: boolean;
  period: '6m' | '12m';
  onPeriodChange: (p: '6m' | '12m') => void;
}

export function RevenueChart({ data, loading, period, onPeriodChange }: RevenueChartProps) {
  return (
    <div className="lg:col-span-2 bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-foreground text-base">Monthly Revenue Trend</h3>
          <p className="text-muted-foreground" style={{ fontSize: 12 }}>Tuition · Hostel · Library · Other</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
          {(['6m', '12m'] as const).map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={{
                background: period === p ? 'var(--card)' : 'transparent',
                color: period === p ? 'var(--foreground)' : 'var(--muted-foreground)',
                boxShadow: period === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[220px]"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No revenue data yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="MonthName" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="TotalRevenue" name="Total Revenue" stroke="#3b5bdb" strokeWidth={2} fill="url(#revGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
