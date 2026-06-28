import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ExaminationsService, type StudentResult } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { ErrorBanner } from './ErrorBanner';
import { gradeBadge } from './helpers';

interface Props {
  studentId: string;
}

export function StudentResultsView({ studentId }: Props) {
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
          { label: 'Exams Taken',    value: results.length },
          { label: 'Cumulative GPA', value: cgpa },
          { label: 'Distinctions',   value: results.filter(r => r.Grade.startsWith('A')).length },
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
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.ExamDate?.slice(0, 10)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${r.Score}%`,
                            background: r.Score >= 70 ? '#10b981' : r.Score >= 50 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{r.Score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">{gradeBadge(r.Grade)}</td>
                  <td
                    className="px-5 py-3.5 text-sm font-semibold"
                    style={{ color: Number(r.GpaPoint) >= 3.5 ? '#10b981' : Number(r.GpaPoint) >= 2.0 ? '#3b5bdb' : '#ef4444' }}
                  >
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