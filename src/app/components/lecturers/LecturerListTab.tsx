import { Search, X, Eye, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lecturer } from '../../../services/lecturer';
import { avatarColors, initials, rankBadge, statusBadge } from './Helpers';
import { ErrorBanner } from './ErrorBanner';

const PER_PAGE = 10;

export function LecturerListTab({
  lecturers, filtered, paginated, loading, error, search, page, pages,
  onSearchChange, onPageChange, onSelect, onRetry,
}: {
  lecturers: Lecturer[];
  filtered: Lecturer[];
  paginated: Lecturer[];
  loading: boolean;
  error: string;
  search: string;
  page: number;
  pages: number;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  onSelect: (lecturer: Lecturer, idx: number) => void;
  onRetry: () => void;
}) {
  return (
    <>
      {error && <ErrorBanner message={error} onRetry={onRetry} />}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card max-w-md" style={{ borderColor: 'var(--border)' }}>
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input placeholder="Search by name, ID, or department…"
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          value={search} onChange={e => onSearchChange(e.target.value)} />
        {search && <button onClick={() => onSearchChange('')} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>}
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Lecturer', 'Department', 'Rank', 'Publications', 'Rating', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: j === 0 ? 160 : 80 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : paginated.length === 0
                  ? <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No lecturers found.</td></tr>
                  : paginated.map((l, i) => {
                      const absIdx = (page - 1) * PER_PAGE + i;
                      return (
                        <tr key={l.LecturerID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ background: avatarColors[absIdx % avatarColors.length] }}>
                                {initials(l.Name)}
                              </div>
                              <div>
                                <div className="text-foreground text-sm font-medium">{l.Name}</div>
                                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.Email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-sm text-foreground">{l.Department}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.Faculty}</div>
                          </td>
                          <td className="px-5 py-3.5">{rankBadge(l.Rank)}</td>
                          <td className="px-5 py-3.5 text-sm text-foreground">{l.Publications ?? '—'}</td>
                          <td className="px-5 py-3.5">
                            {l.Rating != null ? (
                              <div className="flex items-center gap-1.5">
                                <Star size={12} fill="#f59e0b" className="text-amber-400" />
                                <span className="text-sm font-semibold text-foreground">{Number(l.Rating).toFixed(1)}</span>
                              </div>
                            ) : <span className="text-muted-foreground text-sm">—</span>}
                          </td>
                          <td className="px-5 py-3.5">{statusBadge(l.Status)}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => onSelect(l, absIdx)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>
        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-sm text-muted-foreground">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => onPageChange(p)}
                  className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: p === page ? 'var(--primary)' : 'transparent', color: p === page ? '#fff' : 'var(--muted-foreground)' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => onPageChange(Math.min(pages, page + 1))} disabled={page === pages}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { PER_PAGE };