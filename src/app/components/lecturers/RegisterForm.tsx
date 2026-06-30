import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { LecturerService, type RegisterLecturerBody } from '../../../services/lecturer';
import { ApiError } from '../../../lib/api';
import { ErrorBanner } from './ErrorBanner';

const EMPTY_REG: RegisterLecturerBody = {
  name: '', email: '', password: '', phone: '', gender: '',
  dob: '', address: '', facultyId: 0, departmentId: 0,
  specialization: '', rank: 'Lecturer', joinedDate: '',
};

export function RegisterForm({ onRegistered }: { onRegistered: () => void }) {
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