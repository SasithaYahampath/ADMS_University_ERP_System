import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface FacultyDistributionProps {
  pieData: { name: string; value: number; color: string }[];
  loading: boolean;
}

export function FacultyDistribution({ pieData, loading }: FacultyDistributionProps) {
  const total = pieData.reduce((a, x) => a + x.value, 0);

  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <h3 className="text-foreground text-base mb-1">Faculty Distribution</h3>
      <p className="text-muted-foreground mb-3" style={{ fontSize: 12 }}>Students by faculty</p>
      {loading ? (
        <div className="flex items-center justify-center h-[160px]"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
      ) : pieData.length === 0 ? (
        <div className="flex items-center justify-center h-[160px] text-muted-foreground text-sm">No data.</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map(e => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Students']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-foreground font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
