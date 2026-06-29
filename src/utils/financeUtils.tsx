import { CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Number(n).toFixed(2)}`;
}

export function payStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Paid:    { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle2 size={11} /> },
    Pending: { bg: '#fef9c3', text: '#a16207', icon: <Clock size={11} /> },
    Overdue: { bg: '#fee2e2', text: '#b91c1c', icon: <XCircle size={11} /> },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b', icon: null };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      {c.icon}{status}
    </span>
  );
}

export function scholarshipBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Active:   { bg: '#dcfce7', text: '#15803d' },
    Inactive: { bg: '#f1f5f9', text: '#64748b' },
    Expired:  { bg: '#fee2e2', text: '#b91c1c' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>{status}</span>;
}

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border"
      style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
      <AlertTriangle size={15} className="text-red-500 shrink-0" />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}

export function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: j === 0 ? 160 : 80 }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}