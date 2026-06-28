import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ExaminationsService } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { gradeFromScore } from '../../../services/examinations';
import { gradeBadge } from './helpers';

interface Props {
  examId: string;
  onAdded: () => void;
}

export function AddResultRow({ examId, onAdded }: Props) {
  const [studentId, setStudentId] = useState('');
  const [score, setScore]         = useState('');
  const [saving, setSaving]       = useState(false);
  const [err, setErr]             = useState('');

  const preview = score !== '' ? gradeFromScore(Number(score)) : null;

  async function add() {
    if (!studentId || score === '') { setErr('Both student ID and score are required.'); return; }
    setSaving(true); setErr('');
    try {
      await ExaminationsService.upsertResults(examId, { student_id: studentId, score: Number(score) });
      setStudentId(''); setScore('');
      onAdded();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Failed to add result.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded-xl p-4 space-y-3" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Add / Update Result</p>
      {err && <p className="text-xs text-red-600">{err}</p>}
      <div className="flex gap-3 flex-wrap items-end">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Student ID</label>
          <input
            placeholder="STU-2024-4901"
            className="rounded-lg px-3 py-2 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 w-40"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Score (0–100)</label>
          <input
            type="number" min={0} max={100} placeholder="85"
            className="rounded-lg px-3 py-2 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 w-24"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            value={score}
            onChange={e => setScore(e.target.value)}
          />
        </div>
        {preview && (
          <div className="text-sm">
            {gradeBadge(preview.grade)}
            <span className="ml-2 text-muted-foreground text-xs">{preview.gpaPoint.toFixed(1)} pts</span>
          </div>
        )}
        <button
          onClick={add}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add
        </button>
      </div>
    </div>
  );
}