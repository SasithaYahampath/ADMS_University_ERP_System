import { useState } from 'react';
import {
  UserPlus, KeyRound, User, Eye, EyeOff,
  Loader2, CheckCircle2, AlertTriangle, Shield,
} from 'lucide-react';
import { AuthService } from '../../services/auth';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
      <CheckCircle2 size={14} className="shrink-0" />{message}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700" style={{ background: '#fef2f2' }}>
      <AlertTriangle size={14} className="shrink-0" />{message}
    </div>
  );
}

const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30";
const inputStyle = { background: 'var(--input-background)', borderColor: 'var(--border)' };

// ─── Create Admin Account ─────────────────────────────────────────────────────

function CreateAdminForm() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [phone,    setPhone]    = useState('');
  const [gender,   setGender]   = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  async function submit() {
    if (!name || !email || !password) {
      setError('Name, email and password are required.'); return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.'); return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await AuthService.registerAdmin({
        name,
        email,
        password,
        phone:  phone  || undefined,
        gender: gender || undefined,
      });
      setSuccess(`Admin account created successfully. User ID: ${res.userId}`);
      setName(''); setEmail(''); setPassword(''); setConfirm(''); setPhone(''); setGender('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create admin account.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl shrink-0" style={{ background: '#eef2ff' }}>
          <Shield size={20} style={{ color: '#3b5bdb' }} />
        </div>
        <div>
          <h3 className="text-foreground text-base">Create Admin Account</h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Creates a new user with <strong>Admin</strong> role via{' '}
            <code className="text-xs bg-muted px-1 rounded">POST /auth/register-admin</code>
          </p>
        </div>
      </div>

      {error   && <ErrorBanner   message={error} />}
      {success && <SuccessBanner message={success} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full name */}
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
          <input placeholder="e.g. Dr. Jane Smith" value={name}
            onChange={e => setName(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-foreground block mb-1.5">Email Address *</label>
          <input type="email" placeholder="admin@university.edu" value={email}
            onChange={e => setEmail(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-foreground block mb-1.5">Phone</label>
          <input placeholder="+1 555-0000" value={phone}
            onChange={e => setPhone(e.target.value)} className={inputCls} style={inputStyle} />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-foreground block mb-1.5">Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)} className={inputCls} style={inputStyle}>
            <option value="">— Optional —</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Spacer */}
        <div />

        {/* Password */}
        <div>
          <label className="text-sm text-foreground block mb-1.5">Password *</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputCls + ' pr-10'} style={inputStyle} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="text-sm text-foreground block mb-1.5">Confirm Password *</label>
          <input type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={confirm}
            onChange={e => setConfirm(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Password strength hint */}
      {password && (
        <div className="flex items-center gap-2">
          {[8, 12, 16].map(len => (
            <div key={len} className="flex-1 h-1 rounded-full transition-colors"
              style={{ background: password.length >= len ? '#3b5bdb' : 'var(--muted)' }} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {password.length < 8 ? 'Too short' : password.length < 12 ? 'Fair' : password.length < 16 ? 'Good' : 'Strong'}
          </span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => { setName(''); setEmail(''); setPassword(''); setConfirm(''); setPhone(''); setGender(''); setError(''); setSuccess(''); }}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          Reset
        </button>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-colors"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Creating…' : 'Create Admin Account'}
        </button>
      </div>
    </div>
  );
}

// ─── Change Password ──────────────────────────────────────────────────────────

function ChangePasswordForm() {
  const [current,  setCurrent]  = useState('');
  const [newPw,    setNewPw]    = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  async function submit() {
    if (!current || !newPw) { setError('All fields are required.'); return; }
    if (newPw !== confirm)   { setError('New passwords do not match.'); return; }
    if (newPw.length < 8)    { setError('New password must be at least 8 characters.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await AuthService.changePassword(current, newPw);
      setSuccess(res.message ?? 'Password changed successfully.');
      setCurrent(''); setNewPw(''); setConfirm('');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-5" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl shrink-0" style={{ background: '#ecfdf5' }}>
          <KeyRound size={20} style={{ color: '#059669' }} />
        </div>
        <div>
          <h3 className="text-foreground text-base">Change Password</h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Updates your own password via{' '}
            <code className="text-xs bg-muted px-1 rounded">POST /auth/change-password</code>
          </p>
        </div>
      </div>

      {error   && <ErrorBanner   message={error} />}
      {success && <SuccessBanner message={success} />}

      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm text-foreground block mb-1.5">Current Password *</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="Your current password"
              value={current} onChange={e => setCurrent(e.target.value)}
              className={inputCls + ' pr-10'} style={inputStyle} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">New Password *</label>
          <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
            value={newPw} onChange={e => setNewPw(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Confirm New Password *</label>
          <input type={showPw ? 'text' : 'password'} placeholder="Re-enter new password"
            value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} style={inputStyle} />
        </div>
      </div>

      <button onClick={submit} disabled={saving}
        className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
        style={{ background: '#059669', opacity: saving ? 0.7 : 1 }}>
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </div>
  );
}

// ─── My Profile ───────────────────────────────────────────────────────────────

function MyProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-5" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl shrink-0" style={{ background: '#fffbeb' }}>
          <User size={20} style={{ color: '#d97706' }} />
        </div>
        <div>
          <h3 className="text-foreground text-base">My Profile</h3>
          <p className="text-muted-foreground text-sm mt-0.5">Your current session details</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
          style={{ background: 'var(--primary)' }}>
          {user.avatarCode}
        </div>
        <div>
          <div className="text-foreground font-semibold">{user.name}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ background: user.role === 'Admin' ? '#3b5bdb' : user.role === 'Lecturer' ? '#059669' : '#d97706' }}>
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'User ID',      value: user.userId },
          { label: 'Role',         value: user.role },
          ...(user.studentId  ? [{ label: 'Student ID',  value: user.studentId }]  : []),
          ...(user.lecturerId ? [{ label: 'Lecturer ID', value: user.lecturerId }] : []),
        ].map(row => (
          <div key={row.label} className="rounded-xl px-4 py-3" style={{ background: 'var(--muted)' }}>
            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{row.label}</div>
            <div className="text-foreground text-sm font-medium mt-0.5">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function UniSettings() {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';

  const tabs = [
    { id: 'profile',  label: 'My Profile' },
    { id: 'password', label: 'Change Password' },
    ...(isAdmin ? [{ id: 'create-admin', label: 'Create Admin' }] : []),
  ];

  const [tab, setTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account and system settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {tabs.map(t => (
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

      {tab === 'profile'      && <MyProfile />}
      {tab === 'password'     && <ChangePasswordForm />}
      {tab === 'create-admin' && isAdmin && <CreateAdminForm />}
    </div>
  );
}
