import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { ExaminationsService, type CreateExamBody } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { ErrorBanner } from './ErrorBanner';
import { HALLS, DURATIONS } from './types';

interface Props {
  onScheduled: () => void;
}

export function ScheduleForm({ onScheduled }: Props) {
  const [form, setForm] = useState<CreateExamBody>({
    course_id: '', exam_date: '', exam_time: '', duration: '2 hrs',
    hall: '', capacity: 100, invigilator_id: '', status: 'Scheduled',
  });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const set = <K extends keyof CreateExamBody>(k: K, v: CreateExamBody[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const reset = () =>
    setForm({ course_id: '', exam_date: '', exam_time: '', duration: '2 hrs', hall: '', capacity: 100, invigilator_id: '', status: 'Scheduled' });

  async function submit() {
    if (!form.course_id || !form.exam_date || !form.exam_time || !form.hall) {
      setError('Course, date, time and hall are required.'); return;
    }
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await ExaminationsService.create({
        ...form,
        invigilator_id: form.invigilator_id || undefined,
      });
      setSuccess(`Exam scheduled! ID: ${res.exam_id}`);
      reset();
      onScheduled();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to schedule exam.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
      <div>
        <h3 className="text-foreground text-base">Schedule New Examination</h3>
        <p className="text-muted-foreground text-sm mt-0.5">
          Submits to <code className="text-xs bg-muted px-1 rounded">POST /api/examinations</code> — hall conflicts are checked server-side.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={14} className="shrink-0" />{success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Course ID *</label>
          <input
            placeholder="e.g. CS401"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.course_id}
            onChange={e => set('course_id', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Exam Date *</label>
          <input
            type="date"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.exam_date}
            onChange={e => set('exam_date', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Start Time *</label>
          <input
            type="time"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.exam_time}
            onChange={e => set('exam_time', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Duration *</label>
          <select
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.duration}
            onChange={e => set('duration', e.target.value)}
          >
            {DURATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Hall *</label>
          <select
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.hall}
            onChange={e => set('hall', e.target.value)}
          >
            <option value="">Select hall</option>
            {HALLS.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Seat Capacity</label>
          <input
            type="number" min={1}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.capacity}
            onChange={e => set('capacity', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Invigilator ID</label>
          <input
            placeholder="e.g. LEC-001"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.invigilator_id ?? ''}
            onChange={e => set('invigilator_id', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={reset}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}
        >
          Reset
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-colors"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Scheduling…' : 'Schedule Exam'}
        </button>
      </div>
    </div>
  );
}