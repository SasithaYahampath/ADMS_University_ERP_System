import {
  Mail, Phone, BookOpen, Building2, MapPin, Calendar, User,
  CheckCircle2, AlertTriangle, TrendingUp, Award,
} from 'lucide-react';
import type { Student, AttendanceRecord } from '../../../services/students';
import type { StudentResult } from '../../../services/examinations';
import { colorFor, statusBadge, gradeColor } from './helpers';

export function StudentProfileContent({
  student,
  attendance,
  loadingAtt,
  results,
  loadingResults,
  resultsError,
}: {
  student: Student;
  attendance: AttendanceRecord[];
  loadingAtt: boolean;
  results: StudentResult[];
  loadingResults: boolean;
  resultsError: string;
}) {
  // Summary stats derived from results
  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.Score, 0) / results.length) : null;
  const bestGrade = results.length ? results.reduce((best, r) => (r.GpaPoint > best.GpaPoint ? r : best)) : null;
  const failCount = results.filter(r => r.GpaPoint === 0).length;
  const avgAtt = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + a.AttendanceRate, 0) / attendance.length)
    : null;
  const belowThreshold = attendance.filter(a => a.AttendanceRate < 75).length;

  return (
    <div className="space-y-5">
      {/* ── Avatar + basic info ── */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
          style={{ background: colorFor(student.StudentID) }}
        >
          {student.AvatarCode}
        </div>
        <div>
          <div className="text-foreground font-semibold text-base">{student.FullName}</div>
          <div className="text-muted-foreground text-sm font-mono">{student.StudentID}</div>
          <div className="mt-1">{statusBadge(student.Status)}</div>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--secondary)' }}>
          <div className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
            {Number(student.GPA).toFixed(2)}
          </div>
          <div className="text-muted-foreground" style={{ fontSize: 10 }}>Cum. GPA</div>
          <div className="text-muted-foreground" style={{ fontSize: 9 }}>
            {student.GPA >= 3.7 ? '1st Class' : student.GPA >= 3.3 ? '2nd Upper' : '2nd Lower'}
          </div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--secondary)' }}>
          <div className="font-bold text-lg" style={{ color: avgScore !== null ? gradeColor(student.GPA) : 'var(--muted-foreground)' }}>
            {avgScore !== null ? `${avgScore}%` : '—'}
          </div>
          <div className="text-muted-foreground" style={{ fontSize: 10 }}>Avg Score</div>
          <div className="text-muted-foreground" style={{ fontSize: 9 }}>
            {results.length} exam{results.length !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--secondary)' }}>
          <div className="font-bold text-lg" style={{ color: avgAtt !== null ? (avgAtt >= 75 ? '#10b981' : '#ef4444') : 'var(--muted-foreground)' }}>
            {avgAtt !== null ? `${avgAtt}%` : '—'}
          </div>
          <div className="text-muted-foreground" style={{ fontSize: 10 }}>Avg Attendance</div>
          <div className="text-muted-foreground" style={{ fontSize: 9 }}>
            {belowThreshold > 0 ? `${belowThreshold} below 75%` : 'All on track'}
          </div>
        </div>
      </div>

      {/* ── Detail rows ── */}
      <div className="grid grid-cols-1 gap-2">
        {[
          { icon: <Mail size={14} />, label: 'Email', value: student.Email },
          { icon: <Phone size={14} />, label: 'Phone', value: student.Phone ?? '—' },
          { icon: <BookOpen size={14} />, label: 'Program', value: student.Program ?? '—' },
          { icon: <Building2 size={14} />, label: 'Faculty', value: student.Faculty },
          { icon: <User size={14} />, label: 'Level', value: `${student.Level}L` },
          { icon: <MapPin size={14} />, label: 'Address', value: student.Address ?? '—' },
          { icon: <Calendar size={14} />, label: 'Enrolled', value: student.EnrolledDate?.slice(0, 10) ?? '—' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--muted)' }}>
            <span className="text-muted-foreground shrink-0">{item.icon}</span>
            <span className="text-muted-foreground shrink-0" style={{ fontSize: 11, minWidth: 56 }}>{item.label}</span>
            <span className="text-foreground text-sm font-medium truncate">{item.value}</span>
          </div>
        ))}
      </div>

      {/* ── Exam Results ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Award size={15} style={{ color: 'var(--primary)' }} />
          <h4 className="text-foreground font-medium">Exam Results</h4>
          {results.length > 0 && (
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}
            >
              {results.length} record{results.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loadingResults ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />
            ))}
          </div>
        ) : resultsError ? (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-red-700" style={{ background: '#fef2f2' }}>
            <AlertTriangle size={14} className="shrink-0" />
            {resultsError}
          </div>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No exam results found.</p>
        ) : (
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.ResultID} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                {/* Grade badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: 'var(--card)',
                    color: gradeColor(r.GpaPoint),
                    border: `2px solid ${gradeColor(r.GpaPoint)}`,
                  }}
                >
                  {r.Grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium truncate">{r.CourseTitle}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>
                    {r.ExamDate?.slice(0, 10)} · {r.CourseID}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold" style={{ color: gradeColor(r.GpaPoint) }}>
                    {r.Score}%
                  </div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{r.GpaPoint} pts</div>
                </div>
              </div>
            ))}

            {/* Best result callout */}
            {bestGrade && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl mt-1" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <TrendingUp size={13} style={{ color: '#10b981' }} className="shrink-0" />
                <span className="text-xs" style={{ color: '#065f46' }}>
                  Best: <strong>{bestGrade.CourseTitle}</strong> — {bestGrade.Score}% ({bestGrade.Grade})
                </span>
              </div>
            )}

            {/* Fail warning */}
            {failCount > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <span className="text-xs text-red-700">
                  {failCount} failed exam{failCount > 1 ? 's' : ''} — consider speaking with your academic advisor.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Course Attendance ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} />
          <h4 className="text-foreground font-medium">Course Attendance</h4>
          {attendance.length > 0 && (
            <span
              className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}
            >
              {attendance.length} course{attendance.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loadingAtt ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'var(--muted)' }} />
            ))}
          </div>
        ) : attendance.length === 0 ? (
          <p className="text-muted-foreground text-sm">No attendance records found.</p>
        ) : (
          <div className="space-y-2">
            {attendance.map(a => (
              <div key={a.CourseCode} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-foreground text-sm font-medium truncate">{a.CourseTitle}</div>
                    {a.AttendanceRate < 75 && (
                      <span className="text-xs font-medium shrink-0 ml-2" style={{ color: '#ef4444' }}>
                        ⚠ At risk
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${a.AttendanceRate}%`,
                          background: a.AttendanceRate >= 90 ? '#10b981' : a.AttendanceRate >= 75 ? '#3b5bdb' : '#ef4444',
                        }}
                      />
                    </div>
                    <div
                      className="text-xs font-semibold shrink-0 w-9 text-right"
                      style={{ color: a.AttendanceRate >= 90 ? '#10b981' : a.AttendanceRate >= 75 ? '#3b5bdb' : '#ef4444' }}
                    >
                      {a.AttendanceRate}%
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-0.5" style={{ fontSize: 10 }}>
                    {a.Present}/{a.TotalSessions} sessions attended
                  </div>
                </div>
              </div>
            ))}

            {/* Attendance warning */}
            {belowThreshold > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <span className="text-xs text-red-700">
                  {belowThreshold} course{belowThreshold > 1 ? 's' : ''} below the 75% attendance threshold. You may be barred from
                  sitting the exam.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
