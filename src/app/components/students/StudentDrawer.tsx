import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StudentsService, type Student, type AttendanceRecord } from '../../../services/students';
import { ExaminationsService, type StudentResult } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';

export function StudentDrawer({ student, onClose }: { student: Student; onClose: () => void }) {
  const [attendance, setAttendance]           = useState<AttendanceRecord[]>([]);
  const [loadingAtt, setLoadingAtt]           = useState(true);
  const [results, setResults]                 = useState<StudentResult[]>([]);
  const [loadingResults, setLoadingResults]   = useState(true);
  const [resultsError, setResultsError]       = useState('');

  useEffect(() => {
    StudentsService.getAttendance(student.StudentID)
      .then(r => setAttendance(r.data))
      .catch(() => {})
      .finally(() => setLoadingAtt(false));

    ExaminationsService.getResultsByStudent(student.StudentID)
      .then(r => setResults(r.data))
      .catch(e => setResultsError(e instanceof ApiError ? e.message : 'Failed to load results.'))
      .finally(() => setLoadingResults(false));
  }, [student.StudentID]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground">Student Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <StudentProfileContent
            student={student}
            attendance={attendance}
            loadingAtt={loadingAtt}
            results={results}
            loadingResults={loadingResults}
            resultsError={resultsError}
          />
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString();
}

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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Full Name</div>
          <div className="text-foreground font-medium">{student.FullName}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Student ID</div>
          <div className="text-foreground font-mono">{student.StudentID}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Faculty</div>
          <div className="text-foreground">{student.Faculty}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Program</div>
          <div className="text-foreground">{student.Program ?? '-'}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Level</div>
          <div className="text-foreground">{student.Level}L</div>
        </div>
        <div>
          <div className="text-muted-foreground">GPA</div>
          <div className="text-foreground font-semibold">{Number(student.GPA).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Email</div>
          <div className="text-foreground">{student.Email}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Enrolled</div>
          <div className="text-foreground">{formatDate(student.EnrolledDate)}</div>
        </div>
      </div>

      <section className="space-y-3">
        <h4 className="text-foreground text-sm font-semibold">Attendance</h4>
        {loadingAtt ? (
          <div className="text-sm text-muted-foreground">Loading attendance...</div>
        ) : attendance.length === 0 ? (
          <div className="text-sm text-muted-foreground">No attendance records.</div>
        ) : (
          <div className="space-y-2">
            {attendance.map((row) => (
              <div
                key={row.CourseCode}
                className="rounded-lg border p-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm text-foreground font-medium">{row.CourseTitle}</div>
                    <div className="text-xs text-muted-foreground">{row.CourseCode}</div>
                  </div>
                  <div className="text-sm text-foreground font-semibold">{row.AttendanceRate}%</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Present {row.Present} / {row.TotalSessions} sessions
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h4 className="text-foreground text-sm font-semibold">Exam Results</h4>
        {loadingResults ? (
          <div className="text-sm text-muted-foreground">Loading exam results...</div>
        ) : resultsError ? (
          <div className="text-sm text-red-600">{resultsError}</div>
        ) : results.length === 0 ? (
          <div className="text-sm text-muted-foreground">No exam results.</div>
        ) : (
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.ResultID}
                className="rounded-lg border p-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-foreground font-medium">{result.CourseTitle}</div>
                  <div className="text-sm font-semibold text-foreground">{result.Grade}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Score {result.Score} | GPA Point {result.GpaPoint.toFixed(1)} | {formatDate(result.ExamDate)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}