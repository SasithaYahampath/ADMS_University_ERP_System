import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Calendar, Clock, MapPin, Users,
  CheckCircle2, X, FileText,
} from 'lucide-react';
import { ExaminationsService, type Exam } from '../../services/examinations';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ErrorBanner }         from '../components/examination/ErrorBanner';
import { SkeletonRows }        from '../components/examination/SkeletonRows';
import { ScheduleForm }        from '../components/examination/ScheduleForm';
import { ResultsPanel }        from '../components/examination/ResultsPanel';
import { StatusChanger }       from '../components/examination/StatusChanger';
import { StudentResultsView }  from '../components/examination/StudentResultsView';
import { statusBadge }         from '../components/examination/helpers';
import { HALLS }               from '../components/examination/types';

export function UniExaminations() {
  const { user } = useAuth();
  const isAdmin    = user?.role === 'Admin';
  const isLecturer = user?.role === 'Lecturer';
  const isStudent  = user?.role === 'Student';

  const defaultTab = isStudent ? 'my-results' : 'schedule';
  const [tab, setTab] = useState<string>(defaultTab);

  const [exams, setExams]     = useState<Exam[]>([]);
  const [stats, setStats]     = useState<{
    TotalExams: number; Upcoming: number; Completed: number;
    Cancelled: number; TotalScheduledSeats: number;
  } | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch]         = useState('');
  const [activeResults, setActiveResults] = useState<Exam | null>(null);

  const loadExams = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [listRes, statsRes] = await Promise.all([
        ExaminationsService.list({ status: filterStatus || undefined }),
        ExaminationsService.stats(),
      ]);
      setExams(listRes.data);
      setStats(statsRes.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load examinations.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    if (tab === 'schedule' || tab === 'halls' || tab === 'results') loadExams();
  }, [tab, filterStatus]);

  const filtered = exams.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.CourseTitle?.toLowerCase().includes(q)
      || e.CourseID?.toLowerCase().includes(q)
      || e.Hall?.toLowerCase().includes(q);
  });

  const tabs = [
    ...(isStudent  ? [{ id: 'my-results', label: 'My Results' }]    : []),
    ...(!isStudent ? [{ id: 'schedule',   label: 'Exam Schedule' }]  : []),
    ...(!isStudent ? [{ id: 'halls',      label: 'Hall Allocation' }]: []),
    ...(!isStudent ? [{ id: 'results',    label: 'Results Entry' }]  : []),
    ...(isAdmin    ? [{ id: 'create',     label: 'Schedule Exam' }]  : []),
  ];

  return (
    <div className="space-y-6">
      {activeResults && (
        <ResultsPanel
          exam={activeResults}
          onClose={() => { setActiveResults(null); loadExams(); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Examination Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Final Examination — Semester II, 2025–2026</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}
          >
            <Plus size={15} /> Schedule Exam
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Exams',     value: stats.TotalExams,           color: '#3b5bdb', bg: '#eef2ff', icon: <FileText size={18} /> },
            { label: 'Upcoming',        value: stats.Upcoming,             color: '#f59e0b', bg: '#fffbeb', icon: <Calendar size={18} /> },
            { label: 'Completed',       value: stats.Completed,            color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={18} /> },
            { label: 'Cancelled',       value: stats.Cancelled,            color: '#ef4444', bg: '#fef2f2', icon: <X size={18} /> },
            { label: 'Scheduled Seats', value: stats.TotalScheduledSeats,  color: '#8b5cf6', bg: '#f5f3ff', icon: <Users size={18} /> },
          ].map(m => (
            <div key={m.label} className="bg-card rounded-2xl p-4 border shadow-sm flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2 rounded-xl shrink-0" style={{ background: m.bg }}>
                <span style={{ color: m.color }}>{m.icon}</span>
              </div>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</div>
                <div className="text-foreground font-bold mt-0.5" style={{ fontSize: 20 }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* My Results */}
      {tab === 'my-results' && user?.studentId && (
        <StudentResultsView studentId={user.studentId} />
      )}

      {/* Exam Schedule */}
      {tab === 'schedule' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                placeholder="Search by course, code, or hall…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Course', 'Date & Time', 'Duration', 'Hall', 'Enrolled / Cap', 'Invigilator', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonRows cols={8} />
                    : filtered.length === 0
                      ? (
                        <tr>
                          <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
                            No examinations found.
                          </td>
                        </tr>
                      )
                      : filtered.map(e => (
                        <tr key={e.ExamID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm font-medium">{e.CourseTitle}</div>
                            <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{e.CourseID}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm">{e.ExamDate?.slice(0, 10)}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{e.ExamTime}</div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.Duration}</td>
                          <td className="px-5 py-3.5 text-sm text-foreground">{e.Hall}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min((e.EnrolledCount / (e.Capacity || 1)) * 100, 100)}%`,
                                    background: 'var(--primary)',
                                  }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{e.EnrolledCount}/{e.Capacity}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.InvigilatorName ?? '—'}</td>
                          <td className="px-5 py-3.5">{statusBadge(e.Status)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setActiveResults(e)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title="View / enter results"
                              >
                                <FileText size={13} />
                              </button>
                              {isAdmin && <StatusChanger exam={e} onChanged={loadExams} />}
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Hall Allocation */}
      {tab === 'halls' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {HALLS.map(hallName => {
              const booked = exams.filter(e => e.Hall === hallName && e.Status === 'Scheduled');
              return (
                <div key={hallName} className="bg-card rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-foreground font-semibold">{hallName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booked.length > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                      {booked.length > 0 ? `${booked.length} booking${booked.length > 1 ? 's' : ''}` : 'Available'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin size={13} />
                    <span>University Campus</span>
                  </div>
                  {booked.length > 0 ? (
                    <div className="space-y-2">
                      {booked.map(b => (
                        <div key={b.ExamID} className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                          <div className="text-xs text-muted-foreground">{b.ExamDate?.slice(0, 10)} · {b.ExamTime}</div>
                          <div className="text-sm text-foreground font-medium mt-0.5">{b.CourseTitle}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Users size={11} />{b.EnrolledCount}/{b.Capacity} students
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No upcoming exams scheduled.</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Results Entry */}
      {tab === 'results' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base">Select a Completed Exam to Enter Results</h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Only exams with status <strong>Completed</strong> accept result entries.
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {loading
                ? <div className="p-8 text-center"><span className="animate-spin text-muted-foreground mx-auto block w-5 h-5 border-2 border-current border-t-transparent rounded-full" /></div>
                : exams.length === 0
                  ? <div className="p-8 text-center text-muted-foreground text-sm">No examinations found.</div>
                  : exams.map(e => (
                    <button
                      key={e.ExamID}
                      onClick={() => setActiveResults(e)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground text-sm font-medium">{e.CourseTitle}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {e.ExamID} · {e.ExamDate?.slice(0, 10)} · {e.Hall}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">{e.EnrolledCount} students</span>
                        {statusBadge(e.Status)}
                      </div>
                    </button>
                  ))
              }
            </div>
          </div>
        </>
      )}

      {/* Schedule Exam */}
      {tab === 'create' && isAdmin && (
        <ScheduleForm onScheduled={() => { loadExams(); setTab('schedule'); }} />
      )}
    </div>
  );
}