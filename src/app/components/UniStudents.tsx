import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentsService, type Student } from '../../services/students';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

import { colorFor, statusBadge } from '../components/students/helpers';
import { ErrorBanner } from '../components/students/ErrorBanner';
import { SkeletonRow } from '../components/students/SkeletonRow';
import { StudentDrawer } from '../components/students/StudentDrawer';
import { MyProfileView } from '../components/students/MyProfileView';
import { AddStudentModal } from '../components/students/AddStudentModal';
import { AttendanceTab } from '../components/students/AttendanceTab';
import { RegistrationTab } from '../components/students/RegistrationTab';

// ─── Main component ───────────────────────────────────────────────────────────

export function UniStudents({ activeTab, onNavigate }: { activeTab: string; onNavigate?: (view: string) => void }) {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student';

  // Students see only their own profile — no table, no admin controls
  if (isStudent) return <MyProfileView />;

  const [tab, setTab] = useState(
    activeTab === 'students-registration' ? 'registration' :
    activeTab === 'students-attendance'   ? 'attendance'   : 'list'
  );

  const [students, setStudents]             = useState<Student[]>([]);
  const [pagination, setPagination]         = useState({ page: 1, pageSize: 8, total: 0, pages: 1 });
  const [search, setSearch]                 = useState('');
  const [filterFaculty, setFilterFaculty]   = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [showModal, setShowModal]           = useState(false);
  const [selected, setSelected]             = useState<Student | null>(null);

  const loadStudents = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const res = await StudentsService.list({
        search:   search || undefined,
        faculty:  filterFaculty || undefined,
        status:   filterStatus  || undefined,
        page,
        pageSize: pagination.pageSize,
      });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [search, filterFaculty, filterStatus, pagination.pageSize]);

  useEffect(() => {
    if (tab === 'list') loadStudents(1);
  }, [tab, search, filterFaculty, filterStatus]);

  return (
    <div className="space-y-6">
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onCreated={() => loadStudents(1)} />}
      {selected  && <StudentDrawer student={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Student Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {pagination.total > 0 ? `${pagination.total} students enrolled` : 'Loading…'} · Academic Year 2025–2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <Download size={15} /> Export
          </button>
          <button onClick={() => onNavigate ? onNavigate('user-management') : setTab('registration')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Register Student
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[{ id: 'list', label: 'All Students' }, { id: 'registration', label: 'Registration' }, { id: 'attendance', label: 'Attendance' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* All Students tab */}
      {tab === 'list' && (
        <>
          {error && <ErrorBanner message={error} onRetry={() => loadStudents(pagination.page)} />}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input placeholder="Search by name, ID, or email…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">All Faculties</option>
              {['Engineering','Medicine','Business','Sciences','Arts','Law'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Active','Pending','Suspended','Graduated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Student','ID','Faculty / Program','Level','GPA','Status',''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : students.length === 0
                      ? <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No students found. Try adjusting your filters.</td></tr>
                      : students.map(s => (
                        <tr key={s.StudentID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                                style={{ background: colorFor(s.StudentID) }}>
                                {s.AvatarCode}
                              </div>
                              <div>
                                <div className="text-foreground text-sm font-medium">{s.FullName}</div>
                                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.Email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{s.StudentID}</td>
                          <td className="px-5 py-3.5">
                            <div className="text-sm text-foreground">{s.Faculty}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.Program ?? '—'}</div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-foreground">{s.Level}L</td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-semibold"
                              style={{ color: s.GPA >= 3.7 ? '#10b981' : s.GPA >= 3.0 ? '#3b5bdb' : '#f59e0b' }}>
                              {Number(s.GPA).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">{statusBadge(s.Status)}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => setSelected(s)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading…' : `Showing ${Math.min((pagination.page-1)*pagination.pageSize+1, pagination.total)}–${Math.min(pagination.page*pagination.pageSize, pagination.total)} of ${pagination.total}`}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => loadStudents(pagination.page - 1)} disabled={pagination.page <= 1 || loading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => loadStudents(p)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: p === pagination.page ? 'var(--primary)' : 'transparent',
                      color:      p === pagination.page ? '#fff' : 'var(--muted-foreground)',
                    }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => loadStudents(pagination.page + 1)} disabled={pagination.page >= pagination.pages || loading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'attendance'   && <AttendanceTab />}
      {tab === 'registration' && <RegistrationTab onNavigate={onNavigate} />}
    </div>
  );
}