import { Award, Trash2 } from 'lucide-react';
import { useScholarships } from '../../../utils/useScholarships';
import { fmt, scholarshipBadge, SkeletonRows, ErrorBanner } from '../../../utils/financeUtils';

export function ScholarshipsTable({ isAdmin }: { isAdmin: boolean }) {
  const { scholarships, loading, error, filterType, setFilterType, filterStatus, setFilterStatus, loadScholarships, deleteScholarship } = useScholarships();

  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} onRetry={loadScholarships} />}
      <div className="flex gap-3">
        <select className="rounded-xl px-3 py-2.5 text-sm border bg-card outline-none" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['Merit','Need-Based','Research'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="rounded-xl px-3 py-2.5 text-sm border bg-card outline-none" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {['Active','Inactive','Expired'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Scholarship','Recipient','Faculty','GPA','Amount','Type','Status', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                  <th key={h as string} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <SkeletonRows cols={isAdmin ? 8 : 7} /> : scholarships.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">No scholarships found.</td></tr>
              ) : scholarships.map(s => (
                <tr key={s.ScholarshipID} className="border-t hover:bg-muted/30">
                  <td className="px-5 py-3.5 flex items-center gap-2"><Award size={14} className="text-primary" /><span className="text-sm font-medium">{s.Name}</span></td>
                  <td className="px-5 py-3.5"><div className="text-sm">{s.StudentName}</div><div className="text-xs font-mono text-muted-foreground">{s.StudentID}</div></td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.Faculty ?? '—'}</td>
                  <td className="px-5 py-3.5"><span className="text-sm font-semibold" style={{ color: Number(s.GPA) >= 3.7 ? '#10b981' : Number(s.GPA) >= 3.0 ? '#3b5bdb' : '#f59e0b' }}>{s.GPA != null ? Number(s.GPA).toFixed(2) : '—'}</span></td>
                  <td className="px-5 py-3.5 text-sm font-semibold">{fmt(Number(s.Amount))}</td>
                  <td className="px-5 py-3.5"><span className="px-2 py-0.5 rounded-full text-xs bg-muted">{s.Type}</span></td>
                  <td className="px-5 py-3.5">{scholarshipBadge(s.Status)}</td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <button onClick={() => deleteScholarship(s.ScholarshipID)} className="p-1.5 rounded-lg hover:bg-muted text-red-500"><Trash2 size={13} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}