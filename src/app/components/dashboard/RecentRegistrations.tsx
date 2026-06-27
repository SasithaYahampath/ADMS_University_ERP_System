import { ChevronRight } from 'lucide-react';

interface RecentRegistrationsProps {
  students: any[];
  loading: boolean;
  onNavigate: (view: string) => void;
}

export function RecentRegistrations({ students, loading, onNavigate }: RecentRegistrationsProps) {
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-foreground text-base">Recent Registrations</h3>
        <button
          onClick={() => onNavigate('students')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>
      {loading ? (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--muted)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: 140 }} />
                <div className="h-2.5 rounded-full" style={{ background: 'var(--muted)', width: 100 }} />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="px-5 py-12 text-center text-muted-foreground text-sm">No registrations yet.</div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {students.map((s: any) => (
            <div key={s.StudentID} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                {s.AvatarCode}
              </div>
              <div className="flex-1 min-w-0">
                {/* FullName falls back to Name */}
                <div className="text-foreground text-sm font-medium truncate">{s.FullName}</div>
                <div className="text-muted-foreground truncate" style={{ fontSize: 11 }}>{s.Program ?? s.Faculty}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.EnrolledDate?.slice(0, 10)}</div>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-white mt-1"
                  style={{ background: s.Status === 'Active' ? '#10b981' : s.Status === 'Pending' ? '#f59e0b' : '#64748b', fontSize: 10 }}
                >
                  {s.Status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
