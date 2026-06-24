import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Eye, X, Mail, Phone, BookOpen, Award,
  Star, BarChart3, Users, Loader2, AlertTriangle, RefreshCw,
  Trash2, ChevronLeft, ChevronRight, CheckCircle2,GraduationCap
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  LecturerService,
  type Lecturer,
  type LecturerCourse,
  type RegisterLecturerBody,
} from '../../services/lecturer';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarColors = ['#3b5bdb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function rankBadge(rank: string | null) {
  const map: Record<string, string> = {
    'Professor': '#3b5bdb',
    'Associate Professor': '#818cf8',
    'Assistant Professor': '#06b6d4',
    'Lecturer': '#10b981',
  };
  const color = map[rank ?? ''] ?? '#64748b';
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ background: color }}>
      {rank ?? 'Lecturer'}
    </span>
  );
}

function statusBadge(status: string) {
  const active = status === 'Active';
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: active ? '#dcfce7' : '#fef9c3', color: active ? '#15803d' : '#a16207' }}>
      {status}
    </span>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
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

// ─── Lecturer Drawer ──────────────────────────────────────────────────────────

function LecturerDrawer({ lecturer, colorIdx, onClose, onDeleted, isAdmin }: {
  lecturer: Lecturer;
  colorIdx: number;
  onClose: () => void;
  onDeleted: () => void;
  isAdmin: boolean;
}) {
  const [drawerTab, setDrawerTab] = useState<'profile' | 'courses'>('profile');
  const [courses, setCourses]     = useState<LecturerCourse[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    if (drawerTab !== 'courses') return;
    setLoading(true); setError('');
    LecturerService.getCourses(lecturer.LecturerID)
      .then(res => setCourses(res.data))
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load courses.'))
      .finally(() => setLoading(false));
  }, [drawerTab, lecturer.LecturerID]);

  async function handleDelete() {
    if (!confirm(`Delete ${lecturer.Name}? This will also delete their user account.`)) return;
    setDeleting(true);
    try {
      await LecturerService.delete(lecturer.LecturerID);
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete lecturer.');
      setDeleting(false);
    }
  }

  const radarData = [
    { subject: 'Rating',       A: Math.round(((lecturer.Rating ?? 0) / 5) * 100) },
    { subject: 'Publications', A: Math.min(100, Math.round(((lecturer.Publications ?? 0) / 50) * 100)) },
    { subject: 'Status',       A: lecturer.Status === 'Active' ? 100 : 40 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}>
      <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground">Lecturer Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 p-2 border-b shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          {[{ id: 'profile', label: 'Profile' }, { id: 'courses', label: 'Courses' }].map(t => (
            <button key={t.id} onClick={() => setDrawerTab(t.id as typeof drawerTab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: drawerTab === t.id ? 'var(--card)' : 'transparent',
                color:      drawerTab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && <ErrorBanner message={error} />}

          {drawerTab === 'profile' && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: avatarColors[colorIdx % avatarColors.length] }}>
                  {initials(lecturer.Name)}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{lecturer.Name}</div>
                  <div className="text-muted-foreground text-sm">{lecturer.LecturerID}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {rankBadge(lecturer.Rank)}
                    {statusBadge(lecturer.Status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Publications', value: lecturer.Publications ?? '—' },
                  { label: 'Rating',       value: lecturer.Rating ? `${Number(lecturer.Rating).toFixed(1)} / 5.0` : '—' },
                  { label: 'Joined',       value: lecturer.JoinedDate?.slice(0, 10) ?? '—' },
                  { label: 'Department',   value: lecturer.Department },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--muted)' }}>
                    <div className="text-foreground font-bold" style={{ fontSize: 18 }}>{s.value}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {[
                { icon: <Mail size={15} />,     label: 'Email',          value: lecturer.Email },
                { icon: <Phone size={15} />,    label: 'Phone',          value: lecturer.Phone ?? '—' },
                { icon: <BookOpen size={15} />, label: 'Specialization', value: lecturer.Specialization ?? '—' },
                { icon: <Award size={15} />,    label: 'Faculty',        value: lecturer.Faculty },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <span className="text-muted-foreground mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{item.label}</div>
                    <div className="text-foreground text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}

              {isAdmin && (
                <button onClick={handleDelete} disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors mt-2">
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? 'Deleting…' : 'Delete Lecturer'}
                </button>
              )}
            </>
          )}

          {drawerTab === 'courses' && (
            loading ? (
              <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
            ) : courses.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">No courses assigned.</p>
            ) : (
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.CourseID} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                        {c.CourseID}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: c.Status === 'Active' ? '#dcfce7' : '#f1f5f9', color: c.Status === 'Active' ? '#15803d' : '#64748b' }}>
                        {c.Status}
                      </span>
                    </div>
                    <div className="text-foreground text-sm font-medium mt-1">{c.Title}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {c.ScheduleDays} · {c.ScheduleTime} · {c.Room} · {c.Credits} CU · Sem {c.Semester}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

const EMPTY_REG: RegisterLecturerBody = {
  name: '', email: '', password: '', phone: '', gender: '',
  dob: '', address: '', facultyId: 0, departmentId: 0,
  specialization: '', rank: 'Lecturer', joinedDate: '',
};

function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
  const [form, setForm]     = useState<RegisterLecturerBody>(EMPTY_REG);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  function field(key: keyof RegisterLecturerBody) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function submit() {
    if (!form.name || !form.email || !form.password || !form.facultyId || !form.departmentId) {
      setError('Name, email, password, faculty ID and department ID are required.'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await LecturerService.register({
        ...form,
        facultyId:    Number(form.facultyId),
        departmentId: Number(form.departmentId),
      });
      setSuccess(`Lecturer registered! ID: ${res.lecturerId}`);
      setForm(EMPTY_REG);
      onRegistered();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to register lecturer.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30";
  const inputStyle = { background: 'var(--input-background)', borderColor: 'var(--border)' };

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
      <div>
        <h3 className="text-foreground text-base">Register New Lecturer</h3>
        <p className="text-muted-foreground text-sm mt-0.5">Submits to <code className="text-xs bg-muted px-1 rounded">POST /api/lecturers</code></p>
      </div>
      {error   && <ErrorBanner message={error} />}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={14} className="shrink-0" />{success}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
          <input placeholder="e.g. Dr. Sarah Chen" value={form.name} onChange={field('name')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Email *</label>
          <input type="email" placeholder="s.chen@uni.edu" value={form.email} onChange={field('email')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Password *</label>
          <input type="password" placeholder="Min. 8 characters" value={form.password} onChange={field('password')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Faculty ID *</label>
          <input type="number" placeholder="e.g. 1" value={form.facultyId || ''} onChange={field('facultyId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Department ID *</label>
          <input type="number" placeholder="e.g. 3" value={form.departmentId || ''} onChange={field('departmentId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Rank</label>
          <select value={form.rank} onChange={field('rank')} className={inputCls} style={inputStyle}>
            {['Lecturer','Assistant Professor','Associate Professor','Professor'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Gender</label>
          <select value={form.gender} onChange={field('gender')} className={inputCls} style={inputStyle}>
            <option value="">— Optional —</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Phone</label>
          <input placeholder="+1 555-0000" value={form.phone} onChange={field('phone')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Date of Birth</label>
          <input type="date" value={form.dob} onChange={field('dob')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Join Date</label>
          <input type="date" value={form.joinedDate} onChange={field('joinedDate')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Specialization</label>
          <input placeholder="e.g. Structural Engineering" value={form.specialization} onChange={field('specialization')} className={inputCls} style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Address</label>
          <input placeholder="Street, City, Country" value={form.address} onChange={field('address')} className={inputCls} style={inputStyle} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => setForm(EMPTY_REG)} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          Reset
        </button>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Registering…' : 'Register Lecturer'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PER_PAGE = 10;

export function UniLecturers({ activeTab, onNavigate }: { activeTab: string; onNavigate?: (view: string) => void }) {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';

  const [tab, setTab]             = useState(activeTab === 'lecturers-assignments' ? 'assignments' : 'list');
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<{ lecturer: Lecturer; idx: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await LecturerService.listLecturers();
      setLecturers(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load lecturers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'list' || tab === 'assignments' || tab === 'analytics') load();
  }, [tab]);

  const filtered = lecturers.filter(l => {
    const q = search.toLowerCase();
    return !q || l.Name.toLowerCase().includes(q) || l.LecturerID.toLowerCase().includes(q) || l.Department.toLowerCase().includes(q);
  });

  const pages     = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPublications = lecturers.reduce((a, l) => a + (Number(l.Publications) || 0), 0);
  const avgRating = lecturers.length
    ? (lecturers.reduce((a, l) => a + (Number(l.Rating) || 0), 0) / lecturers.filter(l => l.Rating).length).toFixed(2)
    : '—';
  const professorCount = lecturers.filter(l => l.Rank === 'Professor').length;

  const leaderboard = [...lecturers].sort((a, b) => (Number(b.Rating) || 0) - (Number(a.Rating) || 0)).slice(0, 8);

  return (
    <div className="space-y-6">
      {selected && (
        <LecturerDrawer
          lecturer={selected.lecturer}
          colorIdx={selected.idx}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onDeleted={() => { load(); setSelected(null); }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Lecturer Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading ? 'Loading…' : `${lecturers.length} lecturers · ${professorCount} professors`}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => onNavigate ? onNavigate('user-management') : setTab('register')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Add Lecturer
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Lecturers',   value: loading ? '—' : lecturers.length,       icon: <Users size={18} />,    color: '#3b5bdb', bg: '#eef2ff' },
          { label: 'Professors',        value: loading ? '—' : professorCount,          icon: <Award size={18} />,    color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Avg Student Rating',value: loading ? '—' : avgRating,              icon: <Star size={18} />,     color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Publications',value: loading ? '—' : totalPublications.toLocaleString(), icon: <BarChart3 size={18} />, color: '#10b981', bg: '#ecfdf5' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 18 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit flex-wrap" style={{ background: 'var(--muted)' }}>
        {[
          { id: 'list',        label: 'All Lecturers' },
          { id: 'assignments', label: 'Assignments' },
          { id: 'analytics',   label: 'Analytics' },
          ...(isAdmin ? [{ id: 'register', label: 'Register' }] : []),
        ].map(t => (
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

      {/* ── All Lecturers ── */}
      {tab === 'list' && (
        <>
          {error && <ErrorBanner message={error} onRetry={load} />}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card max-w-md" style={{ borderColor: 'var(--border)' }}>
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input placeholder="Search by name, ID, or department…"
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            {search && <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>}
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
                                <button onClick={() => setSelected({ lecturer: l, idx: absIdx })}
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
            {/* Pagination */}
            {!loading && pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="text-sm text-muted-foreground">
                  {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-40">
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                      style={{ background: p === page ? 'var(--primary)' : 'transparent', color: p === page ? '#fff' : 'var(--muted-foreground)' }}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-40">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Assignments ── */}
      {tab === 'assignments' && (
        <>
          {error && <ErrorBanner message={error} onRetry={load} />}
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-4">
              {lecturers.filter(l => l.Status === 'Active').map((l, i) => (
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
                    <button onClick={() => setSelected({ lecturer: l, idx: i })}
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
              {lecturers.filter(l => l.Status === 'Active').length === 0 && !loading && (
                <p className="text-center text-muted-foreground text-sm py-12">No active lecturers.</p>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Analytics ── */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top rated radar for top lecturer */}
          {leaderboard[0] && (
            <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base mb-1">Performance Radar — {leaderboard[0].Name}</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Top rated lecturer</p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={[
                  { subject: 'Rating',       A: Math.round(((Number(leaderboard[0].Rating) || 0) / 5) * 100) },
                  { subject: 'Publications', A: Math.min(100, Math.round(((Number(leaderboard[0].Publications) || 0) / 50) * 100)) },
                  { subject: 'Active',       A: leaderboard[0].Status === 'Active' ? 100 : 30 },
                ]}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Radar dataKey="A" stroke="#3b5bdb" fill="#3b5bdb" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base mb-4">Rating Leaderboard</h3>
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((l, i) => (
                  <div key={l.LecturerID} className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: avatarColors[i % avatarColors.length] }}>
                      {initials(l.Name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground font-medium truncate">{l.Name}</div>
                      <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.Department}</div>
                    </div>
                    {l.Rating != null && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star size={12} fill="#f59e0b" className="text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{Number(l.Rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">No data available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Register ── */}
      {tab === 'register' && isAdmin && (
        <div className="bg-card rounded-2xl border p-8 shadow-sm flex flex-col items-center text-center gap-5"
          style={{ borderColor: 'var(--border)' }}>
          <div className="p-4 rounded-2xl" style={{ background: '#ecfdf5' }}>
            <GraduationCap size={32} style={{ color: '#059669' }} />
          </div>
          <div>
            <h3 className="text-foreground text-base">Lecturer registration has moved</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-md leading-relaxed">
              Lecturer accounts must be created in two steps: first create a <strong className="text-foreground">User Account</strong>,
              then register them as a <strong className="text-foreground">Lecturer</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl w-full max-w-sm text-left" style={{ background: 'var(--muted)' }}>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-foreground">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--primary)' }}>1</span>
                Create user account (name, email, role = Lecturer)
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--primary)' }}>2</span>
                Register as Lecturer (faculty, department, rank)
              </div>
            </div>
          </div>
          {onNavigate && (
            <button onClick={() => onNavigate('user-management')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--primary)' }}>
              Go to User Management →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
