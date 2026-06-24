import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Users, BookOpen, GraduationCap, Building2,
  TrendingUp, AlertCircle, Clock, CheckCircle2,
  ChevronRight, RefreshCw, Loader2,
} from 'lucide-react';
import { StudentsService }     from '../../services/students';
import { LecturerService }     from '../../services/lecturer';
import { CourseService }       from '../../services/course';
import { FinanceService }      from '../../services/finance';
import { ExaminationsService } from '../../services/examinations';
import { ApiError }            from '../../lib/api';

const FACULTY_COLORS = ['#3b5bdb','#818cf8','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6','#ec4899'];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Number(n).toFixed(0)}`;
}

function MetricCard({ title, value, icon, color, bg, loading }: {
  title: string; value: string | number; icon: React.ReactNode;
  color: string; bg: string; loading: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 border shadow-sm flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
      <div className="p-2.5 rounded-xl w-fit" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div className="text-muted-foreground text-sm">{title}</div>
        <div className="text-foreground mt-1" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
          {loading
            ? <div className="rounded-full animate-pulse" style={{ height: 28, width: 100, background: 'var(--muted)' }} />
            : value}
        </div>
      </div>
    </div>
  );
}

interface UniDashboardProps { onNavigate: (view: string) => void; }

export function UniDashboard({ onNavigate }: UniDashboardProps) {
  const [studentStats,   setStudentStats]   = useState<any>(null);
  const [lecturerCount,  setLecturerCount]  = useState<number | null>(null);
  const [courseCount,    setCourseCount]    = useState<number | null>(null);
  const [finance,        setFinance]        = useState<any>(null);
  const [monthly,        setMonthly]        = useState<any[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [upcomingExams,  setUpcomingExams]  = useState<any[]>([]);
  const [examStats,      setExamStats]      = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [chartPeriod, setChartPeriod] = useState<'6m' | '12m'>('12m');

  async function loadAll() {
    setLoading(true); setError('');
    try {
      const [stuStats, lecs, courses, fin, mon, recentStu, exams, exStatsRes] = await Promise.all([
        StudentsService.stats(),
        LecturerService.listLecturers(),
        CourseService.listCourses(),
        FinanceService.summary(),
        FinanceService.monthlyRevenue(),
        StudentsService.list({ pageSize: 5, page: 1 }),
        ExaminationsService.list({ status: 'Scheduled' }),
        ExaminationsService.stats(),
      ]);

      // ── FIX 1: remap overview keys (Total→TotalStudents, Active→ActiveStudents, etc.)
      // ── FIX 2: remap byFaculty field StudentCount→Count
      setStudentStats({
        overview: {
          TotalStudents:     stuStats.data.overview.Total      ?? stuStats.data.overview.TotalStudents,
          ActiveStudents:    stuStats.data.overview.Active     ?? stuStats.data.overview.ActiveStudents,
          PendingStudents:   stuStats.data.overview.Pending    ?? stuStats.data.overview.PendingStudents,
          SuspendedStudents: stuStats.data.overview.Suspended  ?? stuStats.data.overview.SuspendedStudents,
          AvgGPA:            stuStats.data.overview.AvgGPA,
        },
        byFaculty: stuStats.data.byFaculty.map((f: any) => ({
          Faculty: f.Faculty,
          Count:   f.StudentCount ?? f.Count,   // remap StudentCount → Count
        })),
      });

      setLecturerCount(lecs.data.filter((l: any) => l.Status === 'Active').length);
      setCourseCount(courses.data.filter((c: any) => c.status === 'Active').length);
      setFinance(fin.data);
      setMonthly(mon.data.map((m: any) => ({
        ...m,
        TotalRevenue: Number(m.Tuition) + Number(m.Hostel) + Number(m.Library) + Number(m.Other),
      })));

      // ── FIX 3: remap Name→FullName for recent students list
      setRecentStudents(
        recentStu.data.map((s: any) => ({
          ...s,
          FullName: s.FullName ?? s.Name,
        }))
      );

      setUpcomingExams(exams.data.slice(0, 4));
      setExamStats(exStatsRes.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const overview: any    = studentStats?.overview ?? {};
  const byFaculty: any[] = studentStats?.byFaculty ?? [];

  const pieData = byFaculty.map((f: any, i: number) => ({
    name: f.Faculty, value: f.Count, color: FACULTY_COLORS[i % FACULTY_COLORS.length],
  }));

  const chartData = chartPeriod === '6m' ? monthly.slice(-6) : monthly;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025–2026 · Semester II</p>
        </div>
        <button onClick={loadAll} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border text-muted-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={loadAll} className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Students"   value={overview.TotalStudents?.toLocaleString() ?? '—'} icon={<Users size={20} />}        color="#3b5bdb" bg="#eef2ff" loading={loading} />
        <MetricCard title="Active Lecturers" value={lecturerCount ?? '—'}                            icon={<GraduationCap size={20} />} color="#0891b2" bg="#e0f2fe" loading={loading} />
        <MetricCard title="Active Courses"   value={courseCount ?? '—'}                              icon={<BookOpen size={20} />}      color="#059669" bg="#ecfdf5" loading={loading} />
        <MetricCard title="Faculties"        value={byFaculty.length || '—'}                         icon={<Building2 size={20} />}     color="#d97706" bg="#fffbeb" loading={loading} />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Students',       value: overview.ActiveStudents,  icon: <CheckCircle2 size={16} />, color: '#10b981' },
          { label: 'Pending Registrations', value: overview.PendingStudents, icon: <AlertCircle size={16} />,  color: '#f43f5e' },
          { label: 'Upcoming Exams',        value: examStats?.Upcoming,      icon: <Clock size={16} />,        color: '#f59e0b' },
          { label: 'Avg GPA', value: overview.AvgGPA != null ? Number(overview.AvgGPA).toFixed(2) : null, icon: <TrendingUp size={16} />, color: '#3b5bdb' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-xl px-4 py-3 border flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: m.color }}>{m.icon}</span>
            <div>
              <div className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</div>
              <div className="text-foreground font-semibold text-sm">{loading ? '—' : (m.value ?? '—')}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Faculty pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground text-base">Monthly Revenue Trend</h3>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Tuition · Hostel · Library · Other</p>
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
              {(['6m','12m'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                  style={{ background: chartPeriod === p ? 'var(--card)' : 'transparent', color: chartPeriod === p ? 'var(--foreground)' : 'var(--muted-foreground)', boxShadow: chartPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-[220px]"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[220px] text-muted-foreground text-sm">No revenue data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3b5bdb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="MonthName" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="TotalRevenue" name="Total Revenue" stroke="#3b5bdb" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

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
                    {pieData.map((e: any) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Students']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.map((d: any) => {
                  const total = pieData.reduce((a: number, x: any) => a + x.value, 0);
                  const pct   = total > 0 ? Math.round((d.value / total) * 100) : 0;
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
      </div>

      {/* Students per faculty bar + Financial summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground text-base mb-1">Students per Faculty</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Current enrollment by faculty</p>
          {loading ? (
            <div className="flex items-center justify-center h-[200px]"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
          ) : byFaculty.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No data.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byFaculty} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="Faculty" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="Count" name="Students" radius={[6,6,0,0]}>
                  {byFaculty.map((_: any, i: number) => <Cell key={i} fill={FACULTY_COLORS[i % FACULTY_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground text-base">Financial Summary</h3>
            <button onClick={() => onNavigate('finance')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              Full report <ChevronRight size={13} />
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Total Revenue',     value: finance ? fmt(finance.totalRevenue)     : '—', color: '#3b5bdb', bg: '#eef2ff' },
                { label: 'Pending / Overdue', value: finance ? fmt(finance.pendingAmount)    : '—', color: '#ef4444', bg: '#fef2f2' },
                { label: 'Scholarships',      value: finance ? fmt(finance.scholarshipTotal) : '—', color: '#8b5cf6', bg: '#f5f3ff' },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: f.bg }}>
                  <span className="text-sm" style={{ color: f.color }}>{f.label}</span>
                  <span className="font-bold" style={{ color: f.color, fontSize: 18 }}>{f.value}</span>
                </div>
              ))}
              {finance?.revenueByType?.slice(0, 3).map((r: any) => (
                <div key={r.Type} className="flex items-center justify-between text-xs px-1">
                  <span className="text-muted-foreground">{r.Type}</span>
                  <span className="text-foreground font-medium">{fmt(Number(r.Total))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent registrations + Upcoming exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">Recent Registrations</h3>
            <button onClick={() => onNavigate('students')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          {loading ? (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                  <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'var(--muted)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: 140 }} />
                    <div className="h-2.5 rounded-full" style={{ background: 'var(--muted)', width: 100 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : recentStudents.length === 0 ? (
            <div className="px-5 py-12 text-center text-muted-foreground text-sm">No registrations yet.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {recentStudents.map((s: any) => (
                <div key={s.StudentID} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
                    style={{ background: 'var(--primary)' }}>
                    {s.AvatarCode}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* FIX 3: FullName falls back to Name */}
                    <div className="text-foreground text-sm font-medium truncate">{s.FullName}</div>
                    <div className="text-muted-foreground truncate" style={{ fontSize: 11 }}>{s.Program ?? s.Faculty}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.EnrolledDate?.slice(0, 10)}</div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-white mt-1"
                      style={{ background: s.Status === 'Active' ? '#10b981' : s.Status === 'Pending' ? '#f59e0b' : '#64748b', fontSize: 10 }}>
                      {s.Status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">Upcoming Examinations</h3>
            <button onClick={() => onNavigate('examinations')}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>
          {loading ? (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                  <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: 'var(--muted)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: 140 }} />
                    <div className="h-2.5 rounded-full" style={{ background: 'var(--muted)', width: 90 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingExams.length === 0 ? (
            <div className="px-5 py-12 text-center text-muted-foreground text-sm">No upcoming exams scheduled.</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {upcomingExams.map((exam: any) => (
                <div key={exam.ExamID} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--secondary)' }}>
                    <BookOpen size={15} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium truncate">{exam.CourseTitle}</div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.CourseID} · {exam.Hall}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-foreground text-xs font-medium">{exam.ExamDate?.slice(0, 10)}</div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.ExamTime} · {exam.EnrolledCount} students</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
