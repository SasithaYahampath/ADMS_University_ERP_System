import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertTriangle, Save, Trash2 } from 'lucide-react';
import { ExaminationsService, gradeFromScore, type Exam, type ExamResult, type ResultEntry } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { ErrorBanner } from './ErrorBanner';
import { AddResultRow } from './AddResultRow';
import { statusBadge, gradeBadge } from './helpers';

interface Props {
  exam: Exam;
  onClose: () => void;
}

export function ResultsPanel({ exam, onClose }: Props) {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin' || user?.role === 'Lecturer';

  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [scores, setScores]   = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveErr, setSaveErr] = useState('');

  const isCompleted = exam.Status === 'Completed';

  function buildScores(data: ExamResult[]) {
    const s: Record<string, string> = {};
    data.forEach(r => { s[r.StudentID] = String(r.Score); });
    return s;
  }

  async function reload() {
    const updated = await ExaminationsService.getResultsByExam(exam.ExamID);
    setResults(updated.data);
    setScores(buildScores(updated.data));
  }

  useEffect(() => {
    setLoading(true);
    ExaminationsService.getResultsByExam(exam.ExamID)
      .then(r => { setResults(r.data); setScores(buildScores(r.data)); })
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
      await reload();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl border max-h-[90vh] flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground">{exam.CourseTitle}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">
              {exam.ExamID} · {exam.ExamDate?.slice(0, 10)} · {exam.Hall}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {statusBadge(exam.Status)}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
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
          {error    && <ErrorBanner message={error} />}
          {saveMsg  && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 size={14} className="shrink-0" />{saveMsg}
            </div>
          )}
          {saveErr  && <ErrorBanner message={saveErr} />}

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
                            <input
                              type="number" min={0} max={100} placeholder="0–100"
                              className="w-20 rounded-lg px-2 py-1.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-center"
                              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                              value={scoreVal}
                              onChange={e => setScores(s => ({ ...s, [r.StudentID]: e.target.value }))}
                            />
                          ) : (
                            <span className="text-sm font-semibold text-foreground">{r.Score}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">{preview ? gradeBadge(preview.grade) : gradeBadge(r.Grade)}</td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {preview ? preview.gpaPoint.toFixed(1) : r.GpaPoint}
                        </td>
                        {canEdit && isCompleted && (
                          <td className="px-4 py-3">
                            <button
                              onClick={() => removeResult(r.StudentID)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"
                            >
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

          {canEdit && isCompleted && (
            <AddResultRow examId={exam.ExamID} onAdded={reload} />
          )}
        </div>

        {/* Footer */}
        {canEdit && isCompleted && results.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-muted-foreground">
              Grades are calculated automatically from score. GPA points update in the student record.
            </p>
            <button
              onClick={saveScores}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Saving…' : 'Save All Scores'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}