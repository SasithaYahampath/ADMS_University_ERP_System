import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface SecondaryMetricsProps {
  activeStudents: number | undefined;
  pendingStudents: number | undefined;
  upcomingExamsCount: number | undefined;
  avgGPA: number | string | null | undefined;
  loading: boolean;
}

export function SecondaryMetrics({
  activeStudents, pendingStudents, upcomingExamsCount, avgGPA, loading,
}: SecondaryMetricsProps) {
  const items = [
    { label: 'Active Students',       value: activeStudents,  icon: <CheckCircle2 size={16} />, color: '#10b981' },
    { label: 'Pending Registrations', value: pendingStudents, icon: <AlertCircle size={16} />,  color: '#f43f5e' },
    { label: 'Upcoming Exams',        value: upcomingExamsCount, icon: <Clock size={16} />,      color: '#f59e0b' },
    {
      label: 'Avg GPA',
      value: avgGPA != null ? Number(avgGPA).toFixed(2) : null,
      icon: <TrendingUp size={16} />,
      color: '#3b5bdb',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(m => (
        <div key={m.label} className="bg-card rounded-xl px-4 py-3 border flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: m.color }}>{m.icon}</span>
          <div>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</div>
            <div className="text-foreground font-semibold text-sm">{loading ? '—' : (m.value ?? '—')}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
