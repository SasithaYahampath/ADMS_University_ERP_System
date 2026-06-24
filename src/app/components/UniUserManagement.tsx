import { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Users, Eye, Search, X, Loader2,
  AlertTriangle, CheckCircle2, RefreshCw, Shield,
  GraduationCap, BookOpen, ChevronRight, ToggleLeft,
  ToggleRight, ArrowLeft,
} from 'lucide-react';
import { AuthService } from '../../services/auth';
import { ApiError } from '../../lib/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30";
const inputStyle = { background: 'var(--input-background)', borderColor: 'var(--border)' };

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700" style={{ background: '#fef2f2' }}>
      <AlertTriangle size={14} className="shrink-0" />{message}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
      <CheckCircle2 size={14} className="shrink-0" />{message}
    </div>
  );
}

function roleBadge(role: string) {
  const map: Record<string, { bg: string; color: string }> = {
    Admin:    { bg: '#eef2ff', color: '#3b5bdb' },
    Lecturer: { bg: '#ecfdf5', color: '#059669' },
    Student:  { bg: '#fffbeb', color: '#d97706' },
  };
  const s = map[role] ?? { bg: '#f1f5f9', color: '#64748b' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.color }}>
      {role}
    </span>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {[1, 2].map(n => (
        <div key={n} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
            style={{
              background: step >= n ? 'var(--primary)' : 'var(--muted)',
              color:      step >= n ? '#fff' : 'var(--muted-foreground)',
            }}>
            {n}
          </div>
          <span className="text-sm" style={{ color: step >= n ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            {n === 1 ? 'Create User Account' : 'Register as Student / Lecturer'}
          </span>
          {n < 2 && <ChevronRight size={14} className="text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Create User ──────────────────────────────────────────────────────

function Step1CreateUser({ onCreated }: {
  onCreated: (userId: number, role: 'Student' | 'Lecturer', name: string) => void;
}) {
  const [form, setForm] = useState({
    name: '', email: '', role: 'Student' as 'Student' | 'Lecturer',
    phone: '', gender: '', dob: '', address: '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function submit() {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await AuthService.createUser({
        name:    form.name,
        email:   form.email,
        role:    form.role,
        phone:   form.phone   || undefined,
        gender:  form.gender  || undefined,
        dob:     form.dob     || undefined,
        address: form.address || undefined,
      });
      onCreated(res.userId, form.role, form.name);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create user account.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      {error && <ErrorBanner message={error} />}

      {/* Role selector */}
      <div>
        <label className="text-sm text-foreground block mb-2">Account Type *</label>
        <div className="grid grid-cols-2 gap-3">
          {(['Student', 'Lecturer'] as const).map(r => (
            <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                borderColor: form.role === r ? 'var(--primary)' : 'var(--border)',
                background:  form.role === r ? 'var(--secondary)' : 'var(--card)',
                boxShadow:   form.role === r ? '0 0 0 2px rgba(59,91,219,0.2)' : 'none',
              }}>
              <div className="p-2 rounded-lg" style={{ background: form.role === r ? 'var(--primary)' : 'var(--muted)' }}>
                {r === 'Student'
                  ? <BookOpen size={16} style={{ color: form.role === r ? '#fff' : 'var(--muted-foreground)' }} />
                  : <GraduationCap size={16} style={{ color: form.role === r ? '#fff' : 'var(--muted-foreground)' }} />
                }
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">{r}</div>
                <div className="text-xs text-muted-foreground">{r === 'Student' ? 'Enroll in courses' : 'Teach courses'}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
          <input placeholder="e.g. John Doe" value={form.name} onChange={field('name')} className={inputCls} style={inputStyle} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Email Address *</label>
          <input type="email" placeholder="john@university.edu" value={form.email} onChange={field('email')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Phone</label>
          <input placeholder="+1 555-0000" value={form.phone} onChange={field('phone')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Gender</label>
          <select value={form.gender} onChange={field('gender')} className={inputCls} style={inputStyle}>
            <option value="">— Optional —</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Date of Birth</label>
          <input type="date" value={form.dob} onChange={field('dob')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Address</label>
          <input placeholder="City, Country" value={form.address} onChange={field('address')} className={inputCls} style={inputStyle} />
        </div>
      </div>

      <div className="p-4 rounded-xl text-sm" style={{ background: 'var(--muted)' }}>
        <p className="text-muted-foreground">
          The account will be created with <strong className="text-foreground">IsActive = 0</strong> and no password.
          The user must visit the <strong className="text-foreground">Activate Account</strong> tab on the login page to set their password.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Creating…' : 'Create User Account →'}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2a: Register as Student ─────────────────────────────────────────────

function Step2Student({ userId, userName, onDone, onBack }: {
  userId: number; userName: string;
  onDone: (msg: string) => void; onBack: () => void;
}) {
  const [form, setForm] = useState({ facultyId: '', departmentId: '', program: '', level: '100' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function submit() {
    if (!form.facultyId) { setError('Faculty ID is required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await AuthService.registerStudent(userId, {
        facultyId:    Number(form.facultyId),
        departmentId: form.departmentId ? Number(form.departmentId) : undefined,
        program:      form.program || undefined,
        level:        form.level,   // sent as string — sp_RegisterStudent takes NVarChar(20)
      });
      onDone(`${userName} registered as Student. Student ID: ${res.studentId}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to register as student.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--secondary)' }}>
        <div className="p-2 rounded-lg" style={{ background: 'var(--primary)' }}>
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <div className="text-foreground text-sm font-medium">{userName}</div>
          <div className="text-muted-foreground text-xs">User ID: {userId} · Registering as Student</div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-foreground block mb-1.5">Faculty ID *</label>
          <input type="number" placeholder="e.g. 1" value={form.facultyId} onChange={field('facultyId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Department ID</label>
          <input type="number" placeholder="e.g. 3 (optional)" value={form.departmentId} onChange={field('departmentId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Program</label>
          <input placeholder="e.g. BSc Computer Science" value={form.program} onChange={field('program')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Level</label>
          <select value={form.level} onChange={field('level')} className={inputCls} style={inputStyle}>
            {[100, 200, 300, 400, 500, 600].map(l => <option key={l} value={l}>Level {l}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Registering…' : 'Register as Student'}
        </button>
      </div>
    </div>
  );
}

// ─── Step 2b: Register as Lecturer ────────────────────────────────────────────

function Step2Lecturer({ userId, userName, onDone, onBack }: {
  userId: number; userName: string;
  onDone: (msg: string) => void; onBack: () => void;
}) {
  const [form, setForm] = useState({ facultyId: '', departmentId: '', specialization: '', rank: 'Lecturer' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function submit() {
    if (!form.facultyId || !form.departmentId) { setError('Faculty ID and Department ID are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await AuthService.registerLecturer(userId, {
        facultyId:      Number(form.facultyId),
        departmentId:   Number(form.departmentId),
        specialization: form.specialization || undefined,
        rank:           form.rank           || undefined,
      });
      onDone(`${userName} registered as Lecturer. Lecturer ID: ${res.lecturerId}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to register as lecturer.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--secondary)' }}>
        <div className="p-2 rounded-lg" style={{ background: '#059669' }}>
          <GraduationCap size={16} className="text-white" />
        </div>
        <div>
          <div className="text-foreground text-sm font-medium">{userName}</div>
          <div className="text-muted-foreground text-xs">User ID: {userId} · Registering as Lecturer</div>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-foreground block mb-1.5">Faculty ID *</label>
          <input type="number" placeholder="e.g. 1" value={form.facultyId} onChange={field('facultyId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Department ID *</label>
          <input type="number" placeholder="e.g. 3" value={form.departmentId} onChange={field('departmentId')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Specialization</label>
          <input placeholder="e.g. Machine Learning" value={form.specialization} onChange={field('specialization')} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Rank</label>
          <select value={form.rank} onChange={field('rank')} className={inputCls} style={inputStyle}>
            {['Lecturer','Assistant Professor','Associate Professor','Professor'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
          style={{ background: '#059669', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Registering…' : 'Register as Lecturer'}
        </button>
      </div>
    </div>
  );
}

// ─── Create User Wizard ───────────────────────────────────────────────────────

function CreateUserWizard({ onComplete }: { onComplete: () => void }) {
  const [step,     setStep]     = useState<1 | 2>(1);
  const [userId,   setUserId]   = useState<number | null>(null);
  const [userRole, setUserRole] = useState<'Student' | 'Lecturer'>('Student');
  const [userName, setUserName] = useState('');
  const [success,  setSuccess]  = useState('');

  function handleUserCreated(id: number, role: 'Student' | 'Lecturer', name: string) {
    setUserId(id); setUserRole(role); setUserName(name); setStep(2);
  }

  function handleDone(msg: string) {
    setSuccess(msg);
    setStep(1); setUserId(null); setUserName('');
    onComplete();
  }

  if (success) {
    return (
      <div className="space-y-4">
        <SuccessBanner message={success} />
        <div className="p-4 rounded-xl text-sm text-muted-foreground" style={{ background: 'var(--muted)' }}>
          The user will need to visit the <strong className="text-foreground">Activate Account</strong> tab
          on the login page to set their password before they can sign in.
        </div>
        <button onClick={() => setSuccess('')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          <UserPlus size={14} /> Register Another User
        </button>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator step={step} />
      {step === 1 && <Step1CreateUser onCreated={handleUserCreated} />}
      {step === 2 && userId && userRole === 'Student' && (
        <Step2Student userId={userId} userName={userName} onDone={handleDone} onBack={() => setStep(1)} />
      )}
      {step === 2 && userId && userRole === 'Lecturer' && (
        <Step2Lecturer userId={userId} userName={userName} onDone={handleDone} onBack={() => setStep(1)} />
      )}
    </div>
  );
}

// ─── Users List ───────────────────────────────────────────────────────────────

function UsersList() {
  const [users,     setUsers]     = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [toggling,  setToggling]  = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await AuthService.listUsers(roleFilter || undefined);
      setUsers(res.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleToggle(userId: number, currentActive: boolean) {
    setToggling(userId);
    try {
      await AuthService.toggleUserActive(userId);
      setUsers(prev => prev.map(u => u.UserID === userId ? { ...u, IsActive: !currentActive } : u));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to toggle user status.');
    } finally {
      setToggling(null);
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.Name?.toLowerCase().includes(q) || u.Email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card"
          style={{ borderColor: 'var(--border)' }}>
          <Search size={15} className="text-muted-foreground shrink-0" />
          <input placeholder="Search by name or email…"
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>}
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
          style={{ borderColor: 'var(--border)' }}>
          <option value="">All Roles</option>
          <option>Admin</option><option>Lecturer</option><option>Student</option>
        </select>
        <button onClick={load} disabled={loading}
          className="px-3 py-2.5 rounded-xl border text-muted-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
        </button>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: j === 0 ? 140 : 80 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                  ? <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground text-sm">No users found.</td></tr>
                  : filtered.map((u: any) => (
                    <tr key={u.UserID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: u.Role === 'Admin' ? '#3b5bdb' : u.Role === 'Lecturer' ? '#059669' : '#d97706' }}>
                            {u.AvatarCode ?? u.Name?.slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-foreground text-sm font-medium">{u.Name}</div>
                            <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>ID: {u.UserID}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{u.Email}</td>
                      <td className="px-5 py-3.5">{roleBadge(u.Role)}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: u.IsActive ? '#dcfce7' : '#fee2e2', color: u.IsActive ? '#15803d' : '#b91c1c' }}>
                          {u.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggle(u.UserID, u.IsActive)}
                          disabled={toggling === u.UserID}
                          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-muted"
                          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                          title={u.IsActive ? 'Deactivate' : 'Activate'}>
                          {toggling === u.UserID
                            ? <Loader2 size={13} className="animate-spin" />
                            : u.IsActive
                              ? <ToggleRight size={15} style={{ color: '#10b981' }} />
                              : <ToggleLeft size={15} style={{ color: '#ef4444' }} />
                          }
                          {u.IsActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-5 py-3 border-t text-xs text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
            {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function UniUserManagement() {
  const [tab, setTab] = useState<'list' | 'create'>('list');

  const tabs = [
    { id: 'list',   label: 'All Users',        icon: <Users size={15} /> },
    { id: 'create', label: 'Register New User', icon: <UserPlus size={15} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Step 1: Create a user account → Step 2: Register as Student or Lecturer
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === 'list' && <UsersList />}

      {tab === 'create' && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <CreateUserWizard onComplete={() => setTab('list')} />
        </div>
      )}
    </div>
  );
}
