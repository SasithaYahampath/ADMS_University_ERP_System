import { useState, type FormEvent } from 'react';
import {
  GraduationCap, Mail, Lock, Eye, EyeOff,
  Loader2, AlertTriangle, CheckCircle2, KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/auth';
import { ApiError } from '../../lib/api';

const DEMO_USERS = [
  { role: 'Admin',    email: 'admin@university.edu',    password: 'admin123',    color: '#3b5bdb', bg: '#eef2ff' },
  { role: 'Lecturer', email: 'lecturer@university.edu', password: 'lecturer123', color: '#059669', bg: '#ecfdf5' },
  { role: 'Student',  email: 'student@university.edu',  password: 'student123',  color: '#d97706', bg: '#fffbeb' },
];

const inputCls = "w-full pl-10 pr-4 py-3 rounded-xl text-sm border text-foreground outline-none transition-all";
const inputStyle = { background: 'var(--input-background)', borderColor: 'var(--border)' };

function focusRing(e: React.FocusEvent<HTMLInputElement>) { e.target.style.boxShadow = '0 0 0 3px rgba(59,91,219,0.15)'; }
function blurRing(e: React.FocusEvent<HTMLInputElement>)  { e.target.style.boxShadow = 'none'; }

// ─── Brand panel ──────────────────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
          <GraduationCap size={22} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-tight">UniERP</div>
          <div className="text-indigo-300 text-xs leading-tight">Management System</div>
        </div>
      </div>
      <div className="relative z-10">
        <h1 className="text-white font-bold leading-tight mb-4" style={{ fontSize: 42, lineHeight: 1.15 }}>
          Empowering<br /><span style={{ color: '#a5b4fc' }}>Academic Excellence</span>
        </h1>
        <p className="text-indigo-200 leading-relaxed mb-10" style={{ fontSize: 16, maxWidth: 420 }}>
          Manage students, lecturers, courses, examinations, and finances — all in one
          integrated platform built for modern universities.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[{ value: '4,850+', label: 'Students' }, { value: '342', label: 'Lecturers' }, { value: '186', label: 'Courses' }].map(s => (
            <div key={s.label} className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <div className="text-white font-bold text-2xl">{s.value}</div>
              <div className="text-indigo-300 text-sm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 text-indigo-400 text-xs">© 2026 University ERP · Academic Year 2025–2026</div>
    </div>
  );
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

function SignInForm() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Quick sign-in (demo)</p>
        <div className="flex gap-2">
          {DEMO_USERS.map(d => (
            <button key={d.role} onClick={() => { setEmail(d.email); setPassword(d.password); setError(''); }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all hover:shadow-sm"
              style={{ background: d.bg, color: d.color, borderColor: d.color + '30' }}>
              {d.role}
            </button>
          ))}
        </div>
      </div> */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-muted-foreground text-xs">or sign in manually</span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700"
          style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <AlertTriangle size={14} className="shrink-0" />{error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-foreground font-medium block mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="email" placeholder="you@university.edu" autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusRing} onBlur={blurRing} />
          </div>
        </div>
        <div>
          <label className="text-sm text-foreground font-medium block mb-1.5">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)}
              className={inputCls + ' pr-11'} style={inputStyle} onFocus={focusRing} onBlur={blurRing} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all mt-2"
          style={{
            background: loading ? 'var(--muted)' : 'var(--primary)',
            color:      loading ? 'var(--muted-foreground)' : '#fff',
            boxShadow:  loading ? 'none' : '0 4px 14px rgba(59,91,219,0.35)',
          }}>
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      {/* <div className="p-4 rounded-2xl space-y-2" style={{ background: 'var(--muted)' }}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Role-based access</p>
        {[
          { role: 'Admin',    desc: 'Full system access — all modules',            color: '#3b5bdb' },
          { role: 'Lecturer', desc: 'Courses, attendance, results, own profile',   color: '#059669' },
          { role: 'Student',  desc: 'Own courses, results, payments, and profile', color: '#d97706' },
        ].map(r => (
          <div key={r.role} className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
            <span className="text-xs font-semibold" style={{ color: r.color, minWidth: 56 }}>{r.role}</span>
            <span className="text-xs text-muted-foreground">{r.desc}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
}

// ─── Activate Account ─────────────────────────────────────────────────────────

function ActivateForm() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password)  { setError('Email and password are required.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    if (password.length < 8)   { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await AuthService.activateAccount(email, password);
      setSuccess(res.message ?? 'Account activated! You can now sign in.');
      setEmail(''); setPassword(''); setConfirm('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Activation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
        <KeyRound size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-0.5">First time signing in?</p>
          <p className="text-xs leading-relaxed">
            Student and Lecturer accounts are created by an Admin with no password set.
            Enter your registered email and choose a password to activate your account.
          </p>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700"
          style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <AlertTriangle size={14} className="shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700"
          style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
          <CheckCircle2 size={14} className="shrink-0" />{success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-foreground font-medium block mb-1.5">Registered Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="email" placeholder="your.email@university.edu" autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusRing} onBlur={blurRing} />
          </div>
        </div>
        <div>
          <label className="text-sm text-foreground font-medium block mb-1.5">Set New Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              className={inputCls + ' pr-11'} style={inputStyle} onFocus={focusRing} onBlur={blurRing} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {password && (
            <div className="flex items-center gap-1.5 mt-2">
              {[8, 12, 16].map(len => (
                <div key={len} className="flex-1 h-1 rounded-full transition-colors"
                  style={{ background: password.length >= len ? '#3b5bdb' : 'var(--muted)' }} />
              ))}
              <span className="text-xs text-muted-foreground">
                {password.length < 8 ? 'Too short' : password.length < 12 ? 'Fair' : password.length < 16 ? 'Good' : 'Strong'}
              </span>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-foreground font-medium block mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type={showPw ? 'text' : 'password'} placeholder="Re-enter your password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              className={inputCls} style={inputStyle} onFocus={focusRing} onBlur={blurRing} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{
            background: loading ? 'var(--muted)' : '#059669',
            color:      loading ? 'var(--muted-foreground)' : '#fff',
            boxShadow:  loading ? 'none' : '0 4px 14px rgba(5,150,105,0.35)',
          }}>
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Activating…' : 'Activate Account'}
        </button>
      </form>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LoginPage() {
  const [tab, setTab] = useState<'signin' | 'activate'>('signin');

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <div className="text-foreground font-bold leading-tight">UniERP</div>
              <div className="text-muted-foreground text-xs">Management System</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-foreground font-bold" style={{ fontSize: 28 }}>
              {tab === 'signin' ? 'Welcome back' : 'Activate Account'}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {tab === 'signin'
                ? 'Sign in to your university account'
                : 'Set your password to access the system'}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--muted)' }}>
            {([{ id: 'signin', label: 'Sign In' }, { id: 'activate', label: 'Activate Account' }] as const).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? 'var(--card)' : 'transparent',
                  color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'signin'   && <SignInForm />}
          {tab === 'activate' && <ActivateForm />}
        </div>
      </div>
    </div>
  );
}
