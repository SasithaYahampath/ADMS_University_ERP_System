import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { StudentsService, type RegisterStudentBody } from '../../../services/students';
import { ApiError } from '../../../lib/api';

export function AddStudentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<RegisterStudentBody>({
    name: '', email: '', password: '', phone: '', gender: '',
    dob: '', address: '', facultyId: 0, program: '', level: 100,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof RegisterStudentBody, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.name || !form.email || !form.password || !form.facultyId) {
      setError('Name, email, password and faculty are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await StudentsService.register(form);
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Registration failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground">Register New Student</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700" style={{ background: '#fef2f2' }}>
              <AlertTriangle size={14} className="shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
              <input
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Email *</label>
              <input
                type="email"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="john@uni.edu"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Password *</label>
              <input
                type="password"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="Minimum 8 chars"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Phone</label>
              <input
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="+1 555-0000"
                value={form.phone ?? ''}
                onChange={e => set('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Date of Birth</label>
              <input
                type="date"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.dob ?? ''}
                onChange={e => set('dob', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Faculty ID *</label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.facultyId}
                onChange={e => set('facultyId', parseInt(e.target.value))}
              >
                <option value={0}>Select faculty</option>
                {[
                  { id: 1, name: 'Engineering' },
                  { id: 2, name: 'Medicine' },
                  { id: 3, name: 'Business' },
                  { id: 4, name: 'Sciences' },
                  { id: 5, name: 'Arts' },
                  { id: 6, name: 'Law' },
                ].map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Program</label>
              <input
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. BSc Computer Science"
                value={form.program ?? ''}
                onChange={e => set('program', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Level</label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.level}
                onChange={e => set('level', parseInt(e.target.value))}
              >
                {[100, 200, 300, 400, 500, 600].map(l => (
                  <option key={l} value={l}>
                    {l}L
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Gender</label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.gender ?? ''}
                onChange={e => set('gender', e.target.value)}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Address</label>
              <input
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="City, Country"
                value={form.address ?? ''}
                onChange={e => set('address', e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors hover:bg-muted text-foreground"
            style={{ borderColor: 'var(--border)' }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Registering…' : 'Register Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
