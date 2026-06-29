import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { FinanceService, type CreateScholarshipBody } from '../../../services/finance';
import { ApiError } from '../../../lib/api';
import { ErrorBanner } from '../../../utils/financeUtils';

export function CreateScholarshipForm() {
  const [form, setForm] = useState<CreateScholarshipBody>({ name: '', student_id: '', amount: 0, type: 'Merit', status: 'Active' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit() {
    if (!form.name || !form.student_id || !form.amount) {
      setError('Name, student ID and amount are required.'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await FinanceService.createScholarship(form);
      setSuccess(`Scholarship awarded! ID: ${res.scholarshipId}`);
      setForm({ name:'', student_id:'', amount:0, type:'Merit', status:'Active' });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to award scholarship.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
      <div>
        <h3 className="text-foreground text-base">Award Scholarship</h3>
        <p className="text-muted-foreground text-sm mt-0.5">Submits to <code className="text-xs bg-muted px-1 rounded">POST /api/finance/scholarships</code></p>
      </div>
      {error && <ErrorBanner message={error} />}
      {success && <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700 bg-green-50"><CheckCircle2 size={14} />{success}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Scholarship Name *</label>
          <input placeholder="e.g. Vice-Chancellor Merit Award" className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none bg-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Student ID *</label>
          <input placeholder="STU-2024-4901" className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none bg-input" value={form.student_id} onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Amount ($) *</label>
          <input type="number" className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none bg-input" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Type *</label>
          <select className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none bg-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            {['Merit','Need-Based','Research'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Status</label>
          <select className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none bg-input" value={form.status ?? 'Active'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Active','Inactive'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => setForm({ name:'', student_id:'', amount:0, type:'Merit', status:'Active' })} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted">Reset</button>
        <button onClick={submit} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2" style={{ background: 'var(--primary)' }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Awarding…' : 'Award Scholarship'}
        </button>
      </div>
    </div>
  );
}