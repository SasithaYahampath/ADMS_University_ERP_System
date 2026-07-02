import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AttendanceTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Average Attendance', value: '—', icon: <CheckCircle2 size={18} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Below 75% Threshold', value: '—', icon: <XCircle size={18} />, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Perfect Attendance', value: '—', icon: <Clock size={18} />, color: '#3b5bdb', bg: '#eef2ff' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-3 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5">{m.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border p-5 shadow-sm text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-muted-foreground text-sm">
          Click <strong className="text-foreground">👁 View</strong> on any student in the <strong className="text-foreground">All Students</strong> tab to see their course-by-course attendance.
        </p>
      </div>
    </div>
  );
}