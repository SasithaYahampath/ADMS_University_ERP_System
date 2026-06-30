import { Loader2 } from 'lucide-react';
import type { Lecturer } from '../../../services/lecturer';
import { avatarColors, initials, rankBadge } from './Helpers';
import { ErrorBanner } from './ErrorBanner';

export function AssignmentsTab({
  lecturers, loading, error, onSelect, onRetry,
}: {
  lecturers: Lecturer[];
  loading: boolean;
  error: string;
  onSelect: (lecturer: Lecturer, idx: number) => void;
  onRetry: () => void;
}) {
  const active = lecturers.filter(l => l.Status === 'Active');

  return (
    <>
      {error && <ErrorBanner message={error} onRetry={onRetry} />}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-4">
          {active.map((l, i) => (
            <div key={l.LecturerID} className="bg-card rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: avatarColors[i % avatarColors.length] }}>
                  {initials(l.Name)}
                </div>
                <div>
                  <div className="text-foreground text-sm font-semibold">{l.Name}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.Department} · {l.LecturerID}</div>
                </div>
                <button onClick={() => onSelect(l, i)}
                  className="ml-auto text-xs text-primary hover:underline">
                  View courses →
                </button>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {rankBadge(l.Rank)}
                {l.Specialization && (
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--muted)' }}>
                    {l.Specialization}
                  </span>
                )}
              </div>
            </div>
          ))}
          {active.length === 0 && !loading && (
            <p className="text-center text-muted-foreground text-sm py-12">No active lecturers.</p>
          )}
        </div>
      )}
    </>
  );
}