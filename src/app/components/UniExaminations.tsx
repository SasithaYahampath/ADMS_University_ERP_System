import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Calendar, Clock, MapPin, Users,
  CheckCircle2, AlertTriangle, FileText, X, Loader2,
  RefreshCw, Edit2, Trash2, ChevronDown, Save
} from 'lucide-react';
import {
  ExaminationsService,
  gradeFromScore,
  type Exam,
  type ExamResult,
  type StudentResult,
  type CreateExamBody,
  type ResultEntry,
} from '../../services/examinations';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Scheduled: { bg: '#dbeafe', text: '#1d4ed8' },
    Completed: { bg: '#dcfce7', text: '#15803d' },
    Cancelled: { bg: '#fee2e2', text: '#b91c1c' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function gradeBadge(grade: string) {
  const isA = grade.startsWith('A');
  const isB = grade.startsWith('B');
  const isF = grade === 'F';
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: isF ? '#fee2e2' : isA ? '#dcfce7' : isB ? '#dbeafe' : '#fef9c3',
        color:      isF ? '#b91c1c' : isA ? '#15803d' : isB ? '#1d4ed8' : '#a16207',
      }}>
      {grade}
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
        <button onClick={onRetry}
          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}

function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: j === 0 ? 160 : 80 }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Schedule Exam form ───────────────────────────────────────────────────────

const HALLS = ['Hall A', 'Hall B', 'Hall C', 'Hall D', 'Moot Court', 'Lab A201', 'Lab B102'];
const DURATIONS = ['1 hr', '1.5 hrs', '2 hrs', '2.5 hrs', '3 hrs', '3.5 hrs'];

function ScheduleForm({ onScheduled }: { onScheduled: () => void }) {
  const [form, setForm] = useState<CreateExamBody>({
    course_id: '', exam_date: '', exam_time: '', duration: '2 hrs',
    hall: '', capacity: 100, invigilator_id: '', status: 'Scheduled',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const set = <K extends keyof CreateExamBody>(k: K, v: CreateExamBody[K]) =>
    setForm(f => ({ ...f, [k]: v }));

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
      setForm({ course_id:'', exam_date:'', exam_time:'', duration:'2 hrs', hall:'', capacity:100, invigilator_id:'', status:'Scheduled' });
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

      {error   && <ErrorBanner message={error} />}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
          <CheckCircle2 size={14} className="shrink-0" />{success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-sm text-foreground block mb-1.5">Course ID *</label>
          <input placeholder="e.g. CS401"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.course_id} onChange={e => set('course_id', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Exam Date *</label>
          <input type="date"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.exam_date} onChange={e => set('exam_date', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Start Time *</label>
          <input type="time"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.exam_time} onChange={e => set('exam_time', e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Duration *</label>
          <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.duration} onChange={e => set('duration', e.target.value)}>
            {DURATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Hall *</label>
          <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.hall} onChange={e => set('hall', e.target.value)}>
            <option value="">Select hall</option>
            {HALLS.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Seat Capacity</label>
          <input type="number" min={1}
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.capacity} onChange={e => set('capacity', parseInt(e.target.value) || 0)} />
        </div>
        <div>
          <label className="text-sm text-foreground block mb-1.5">Invigilator ID</label>
          <input placeholder="e.g. LEC-001"
            className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
            style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            value={form.invigilator_id ?? ''} onChange={e => set('invigilator_id', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => setForm({ course_id:'', exam_date:'', exam_time:'', duration:'2 hrs', hall:'', capacity:100, invigilator_id:'', status:'Scheduled' })}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          Reset
        </button>
        <button onClick={submit} disabled={saving}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-colors"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? 'Scheduling…' : 'Schedule Exam'}
        </button>
      </div>
    </div>
  );
}

// ─── Results entry panel ──────────────────────────────────────────────────────

function ResultsPanel({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin' || user?.role === 'Lecturer';

  const [results, setResults]   = useState<ExamResult[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [scores, setScores]     = useState<Record<string, string>>({});
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState('');
  const [saveErr, setSaveErr]   = useState('');

  useEffect(() => {
    setLoading(true);
    ExaminationsService.getResultsByExam(exam.ExamID)
      .then(r => {
        setResults(r.data);
        // pre-fill score inputs with existing scores
        const s: Record<string, string> = {};
        r.data.forEach(res => { s[res.StudentID] = String(res.Score); });
        setScores(s);
      })
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load results.'))
      .finally(() => setLoading(false));
  }, [exam.ExamID]);

  async function saveScores() {
    const entries: ResultEntry[] = Object.entries(scores)
      .filter(([, v]) => v !== '')
      .map(([student_id, score]) => ({ student_id, score: Number(score) }));

    if (!entries.length) { setSaveErr('No scores entered.'); return; }

    setSaving(true); setSaveMsg(''); setSaveErr('');
    try {
      const res = await ExaminationsService.upsertResults(exam.ExamID, entries);
      setSaveMsg(res.message);
      // Reload results
      const updated = await ExaminationsService.getResultsByExam(exam.ExamID);
      setResults(updated.data);
    } catch (e) {
      setSaveErr(e instanceof ApiError ? e.message : 'Failed to save results.');
    } finally {
      setSaving(false);
    }
  }

  async function removeResult(studentId: string) {
    try {
      await ExaminationsService.deleteResult(exam.ExamID, studentId);
      setResults(r => r.filter(x => x.StudentID !== studentId));
      setScores(s => { const n = { ...s }; delete n[studentId]; return n; });
    } catch (e) {
      setSaveErr(e instanceof ApiError ? e.message : 'Failed to delete result.');
    }
  }

  const isCompleted = exam.Status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl border max-h-[90vh] flex flex-col"
        style={{ borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground">{exam.CourseTitle}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              {exam.ExamID} · {exam.ExamDate?.slice(0,10)} · {exam.Hall}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(exam.Status)}
            <button onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isCompleted && canEdit && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-amber-700"
              style={{ background: '#fffbeb', border: '1px solid #fcd34d' }}>
              <AlertTriangle size={14} className="shrink-0" />
              Results can only be entered once the exam status is set to <strong>Completed</strong>.
            </div>
          )}
          {error && <ErrorBanner message={error} />}
          {saveMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 size={14} className="shrink-0" />{saveMsg}
            </div>
          )}
          {saveErr && <ErrorBanner message={saveErr} />}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {isCompleted && canEdit
                ? 'No results entered yet. Add student IDs and scores below.'
                : 'No results found for this examination.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Student', 'ID', 'Score', 'Grade', 'GPA Pts', canEdit && isCompleted ? 'Action' : ''].filter(Boolean).map(h => (
                      <th key={h as string} className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => {
                    const scoreVal = scores[r.StudentID] ?? String(r.Score);
                    const preview  = scoreVal !== '' ? gradeFromScore(Number(scoreVal)) : null;
                    return (
                      <tr key={r.ResultID} className="border-t hover:bg-muted/20" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{r.StudentName}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.StudentID}</td>
                        <td className="px-4 py-3">
                          {canEdit && isCompleted ? (
                            <input type="number" min={0} max={100} placeholder="0–100"
                              className="w-20 rounded-lg px-2 py-1.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-center"
                              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                              value={scoreVal}
                              onChange={e => setScores(s => ({ ...s, [r.StudentID]: e.target.value }))} />
                          ) : (
                            <span className="text-sm font-semibold text-foreground">{r.Score}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {preview ? gradeBadge(preview.grade) : gradeBadge(r.Grade)}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {preview ? preview.gpaPoint.toFixed(1) : r.GpaPoint}
                        </td>
                        {canEdit && isCompleted && (
                          <td className="px-4 py-3">
                            <button onClick={() => removeResult(r.StudentID)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-red-500">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Add new result row — admin/lecturer + completed exam */}
          {canEdit && isCompleted && (
            <AddResultRow examId={exam.ExamID}
              onAdded={() => {
                ExaminationsService.getResultsByExam(exam.ExamID).then(r => {
                  setResults(r.data);
                  const s: Record<string, string> = {};
                  r.data.forEach(res => { s[res.StudentID] = String(res.Score); });
                  setScores(s);
                });
              }} />
          )}
        </div>

        {/* Footer */}
        {canEdit && isCompleted && results.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-muted-foreground">
              Grades are calculated automatically from score. GPA points update in the student record.
            </p>
            <button onClick={saveScores} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving…' : 'Save All Scores'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AddResultRow({ examId, onAdded }: { examId: string; onAdded: () => void }) {
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
          <input placeholder="STU-2024-4901"
            className="rounded-lg px-3 py-2 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 w-40"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            value={studentId} onChange={e => setStudentId(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Score (0–100)</label>
          <input type="number" min={0} max={100} placeholder="85"
            className="rounded-lg px-3 py-2 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 w-24"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            value={score} onChange={e => setScore(e.target.value)} />
        </div>
        {preview && (
          <div className="text-sm">
            {gradeBadge(preview.grade)}
            <span className="ml-2 text-muted-foreground text-xs">{preview.gpaPoint.toFixed(1)} pts</span>
          </div>
        )}
        <button onClick={add} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Status dropdown ──────────────────────────────────────────────────────────

function StatusChanger({ exam, onChanged }: { exam: Exam; onChanged: () => void }) {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);

  const statuses = (['Scheduled', 'Completed', 'Cancelled'] as const).filter(s => s !== exam.Status);

  async function change(status: 'Scheduled' | 'Completed' | 'Cancelled') {
    setOpen(false);
    setSaving(true);
    try {
      await ExaminationsService.updateStatus(exam.ExamID, status);
      onChanged();
    } catch { /* ignore — parent will show error on reload */ }
    finally { setSaving(false); }
  }

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(v => !v)} disabled={saving}
        className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
        {saving ? <Loader2 size={13} className="animate-spin" /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-card rounded-xl border shadow-lg z-20 py-1"
          style={{ borderColor: 'var(--border)' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => change(s)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors text-foreground">
              → {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Student Results View ─────────────────────────────────────────────────────

function StudentResultsView({ studentId }: { studentId: string }) {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    ExaminationsService.getResultsByStudent(studentId)
      .then(r => setResults(r.data))
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load results.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={24} className="animate-spin text-muted-foreground" />
    </div>
  );
  if (error) return <ErrorBanner message={error} />;

  const cgpa = results.length
    ? (results.reduce((a, r) => a + Number(r.GpaPoint), 0) / results.length).toFixed(2)
    : '—';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Exams Taken', value: results.length },
          { label: 'Cumulative GPA', value: cgpa },
          { label: 'Distinctions', value: results.filter(r => r.Grade.startsWith('A')).length },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border p-4 text-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="text-foreground font-bold" style={{ fontSize: 24, color: 'var(--primary)' }}>{s.value}</div>
            <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)' }}>
                {['Course', 'Exam Date', 'Score', 'Grade', 'GPA Points'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.ResultID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-5 py-3.5">
                    <div className="text-foreground text-sm font-medium">{r.CourseTitle}</div>
                    <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{r.CourseID}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.ExamDate?.slice(0,10)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${r.Score}%`, background: r.Score >= 70 ? '#10b981' : r.Score >= 50 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{r.Score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{gradeBadge(r.Grade)}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: Number(r.GpaPoint) >= 3.5 ? '#10b981' : Number(r.GpaPoint) >= 2.0 ? '#3b5bdb' : '#ef4444' }}>
                    {Number(r.GpaPoint).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UniExaminations() {
  const { user } = useAuth();
  const isAdmin    = user?.role === 'Admin';
  const isLecturer = user?.role === 'Lecturer';
  const isStudent  = user?.role === 'Student';

  const defaultTab = isStudent ? 'my-results' : 'schedule';
  const [tab, setTab] = useState<string>(defaultTab);

  const [exams, setExams]       = useState<Exam[]>([]);
  const [stats, setStats]       = useState<{ TotalExams:number; Upcoming:number; Completed:number; Cancelled:number; TotalScheduledSeats:number } | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch]     = useState('');
  const [activeResults, setActiveResults] = useState<Exam | null>(null);

  const loadExams = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [listRes, statsRes] = await Promise.all([
        ExaminationsService.list({ status: filterStatus || undefined }),
        ExaminationsService.stats(),
      ]);
      setExams(listRes.data);
      setStats(statsRes.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load examinations.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    if (tab === 'schedule' || tab === 'halls' || tab === 'results') loadExams();
  }, [tab, filterStatus]);

  const filtered = exams.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.CourseTitle?.toLowerCase().includes(q) || e.CourseID?.toLowerCase().includes(q) || e.Hall?.toLowerCase().includes(q);
  });

  const tabs = [
    ...(isStudent  ? [{ id: 'my-results', label: 'My Results' }]  : []),
    ...(!isStudent ? [{ id: 'schedule',   label: 'Exam Schedule' }] : []),
    ...(!isStudent ? [{ id: 'halls',      label: 'Hall Allocation' }] : []),
    ...(!isStudent ? [{ id: 'results',    label: 'Results Entry' }] : []),
    ...(isAdmin    ? [{ id: 'create',     label: 'Schedule Exam' }] : []),
  ];

  return (
    <div className="space-y-6">
      {activeResults && (
        <ResultsPanel exam={activeResults} onClose={() => { setActiveResults(null); loadExams(); }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Examination Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Final Examination — Semester II, 2025–2026</p>
        </div>
        {isAdmin && (
          <button onClick={() => setTab('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Schedule Exam
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Exams',    value: stats.TotalExams,          color: '#3b5bdb', bg: '#eef2ff',  icon: <FileText size={18} /> },
            { label: 'Upcoming',       value: stats.Upcoming,            color: '#f59e0b', bg: '#fffbeb',  icon: <Calendar size={18} /> },
            { label: 'Completed',      value: stats.Completed,           color: '#10b981', bg: '#ecfdf5',  icon: <CheckCircle2 size={18} /> },
            { label: 'Cancelled',      value: stats.Cancelled,           color: '#ef4444', bg: '#fef2f2',  icon: <X size={18} /> },
            { label: 'Scheduled Seats',value: stats.TotalScheduledSeats, color: '#8b5cf6', bg: '#f5f3ff',  icon: <Users size={18} /> },
          ].map(m => (
            <div key={m.label} className="bg-card rounded-2xl p-4 border shadow-sm flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2 rounded-xl shrink-0" style={{ background: m.bg }}>
                <span style={{ color: m.color }}>{m.icon}</span>
              </div>
              <div>
                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</div>
                <div className="text-foreground font-bold mt-0.5" style={{ fontSize: 20 }}>{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* ── My Results (Student) ── */}
      {tab === 'my-results' && user?.studentId && (
        <StudentResultsView studentId={user.studentId} />
      )}

      {/* ── Exam Schedule ── */}
      {tab === 'schedule' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input placeholder="Search by course, code, or hall…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Scheduled', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Course', 'Date & Time', 'Duration', 'Hall', 'Enrolled / Cap', 'Invigilator', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonRows cols={8} />
                    : filtered.length === 0
                      ? (
                        <tr><td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
                          No examinations found.
                        </td></tr>
                      )
                      : filtered.map(e => (
                        <tr key={e.ExamID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm font-medium">{e.CourseTitle}</div>
                            <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{e.CourseID}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm">{e.ExamDate?.slice(0,10)}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{e.ExamTime}</div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.Duration}</td>
                          <td className="px-5 py-3.5 text-sm text-foreground">{e.Hall}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                                <div className="h-full rounded-full"
                                  style={{ width: `${Math.min((e.EnrolledCount / (e.Capacity || 1)) * 100, 100)}%`, background: 'var(--primary)' }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{e.EnrolledCount}/{e.Capacity}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.InvigilatorName ?? '—'}</td>
                          <td className="px-5 py-3.5">{statusBadge(e.Status)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setActiveResults(e)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title="View / enter results">
                                <FileText size={13} />
                              </button>
                              {isAdmin && <StatusChanger exam={e} onChanged={loadExams} />}
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Hall Allocation ── */}
      {tab === 'halls' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {HALLS.map(hallName => {
              const booked = exams.filter(e => e.Hall === hallName && e.Status === 'Scheduled');
              return (
                <div key={hallName} className="bg-card rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-foreground font-semibold">{hallName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booked.length > 0 ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                      {booked.length > 0 ? `${booked.length} booking${booked.length > 1 ? 's' : ''}` : 'Available'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin size={13} />
                    <span>University Campus</span>
                  </div>
                  {booked.length > 0 ? (
                    <div className="space-y-2">
                      {booked.map(b => (
                        <div key={b.ExamID} className="p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                          <div className="text-xs text-muted-foreground">{b.ExamDate?.slice(0,10)} · {b.ExamTime}</div>
                          <div className="text-sm text-foreground font-medium mt-0.5">{b.CourseTitle}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Users size={11} />{b.EnrolledCount}/{b.Capacity} students
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No upcoming exams scheduled.</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Results Entry ── */}
      {tab === 'results' && (
        <>
          {error && <ErrorBanner message={error} onRetry={loadExams} />}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base">Select a Completed Exam to Enter Results</h3>
              <p className="text-muted-foreground text-xs mt-0.5">
                Only exams with status <strong>Completed</strong> accept result entries.
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {loading
                ? <div className="p-8 text-center"><Loader2 size={20} className="animate-spin text-muted-foreground mx-auto" /></div>
                : exams.length === 0
                  ? <div className="p-8 text-center text-muted-foreground text-sm">No examinations found.</div>
                  : exams.map(e => (
                    <button key={e.ExamID}
                      onClick={() => setActiveResults(e)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors text-left">
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground text-sm font-medium">{e.CourseTitle}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">
                          {e.ExamID} · {e.ExamDate?.slice(0,10)} · {e.Hall}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">{e.EnrolledCount} students</span>
                        {statusBadge(e.Status)}
                      </div>
                    </button>
                  ))
              }
            </div>
          </div>
        </>
      )}

      {/* ── Schedule Exam ── */}
      {tab === 'create' && isAdmin && (
        <ScheduleForm onScheduled={() => { loadExams(); setTab('schedule'); }} />
      )}
    </div>
  );
}
