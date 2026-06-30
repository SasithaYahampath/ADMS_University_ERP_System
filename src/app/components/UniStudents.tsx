import { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Download, Eye, X,
  Mail, Phone, BookOpen, Building2, MapPin, Calendar, User,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock,
  AlertTriangle, RefreshCw, Loader2, Users, TrendingUp, Award, GraduationCap
} from 'lucide-react';
import {
  StudentsService,
  type Student,
  type AttendanceRecord,
  type RegisterStudentBody,
} from '../../services/students';
import { ExaminationsService, type StudentResult } from '../../services/examinations';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarColors = ['#3b5bdb','#818cf8','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6','#ec4899'];

function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return avatarColors[Math.abs(h) % avatarColors.length];
}

function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Active:    { bg: '#dcfce7', text: '#15803d' },
    Pending:   { bg: '#fef9c3', text: '#a16207' },
    Suspended: { bg: '#fee2e2', text: '#b91c1c' },
    Graduated: { bg: '#dbeafe', text: '#1d4ed8' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

const gradeColor = (gpa: number) =>
  gpa >= 3.7 ? '#10b981' : gpa >= 3.0 ? '#3b5bdb' : '#f59e0b';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
      <AlertTriangle size={16} className="text-red-500 shrink-0" />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      <button onClick={onRetry} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: i === 0 ? 160 : i === 6 ? 48 : 80 }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Shared profile content (used by both drawer + student self-view) ─────────

function StudentProfileContent({ student, attendance, loadingAtt, results, loadingResults, resultsError }: {
  student: Student;
  attendance: AttendanceRecord[];
  loadingAtt: boolean;
  results: StudentResult[];
  loadingResults: boolean;
  resultsError: string;
}) {
  // Summary stats derived from results
  const avgScore   = results.length ? Math.round(results.reduce((s, r) => s + r.Score, 0) / results.length) : null;
  const bestGrade  = results.length ? results.reduce((best, r) => r.GpaPoint > best.GpaPoint ? r : best) : null;
  const failCount  = results.filter(r => r.GpaPoint === 0).length;
  const avgAtt     = attendance.length
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
          { icon: <Mail size={14} />,      label: 'Email',    value: student.Email },
          { icon: <Phone size={14} />,     label: 'Phone',    value: student.Phone ?? '—' },
          { icon: <BookOpen size={14} />,  label: 'Program',  value: student.Program ?? '—' },
          { icon: <Building2 size={14} />, label: 'Faculty',  value: student.Faculty },
          { icon: <User size={14} />,      label: 'Level',    value: `${student.Level}L` },
          { icon: <MapPin size={14} />,    label: 'Address',  value: student.Address ?? '—' },
          { icon: <Calendar size={14} />,  label: 'Enrolled', value: student.EnrolledDate?.slice(0, 10) ?? '—' },
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
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
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
            <AlertTriangle size={14} className="shrink-0" />{resultsError}
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
              <div className="flex items-center gap-2 p-2.5 rounded-xl mt-1"
                style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                <TrendingUp size={13} style={{ color: '#10b981' }} className="shrink-0" />
                <span className="text-xs" style={{ color: '#065f46' }}>
                  Best: <strong>{bestGrade.CourseTitle}</strong> — {bestGrade.Score}% ({bestGrade.Grade})
                </span>
              </div>
            )}

            {/* Fail warning */}
            {failCount > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
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
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
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
                      <span className="text-xs font-medium shrink-0 ml-2" style={{ color: '#ef4444' }}>⚠ At risk</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${a.AttendanceRate}%`,
                        background: a.AttendanceRate >= 90 ? '#10b981' : a.AttendanceRate >= 75 ? '#3b5bdb' : '#ef4444',
                      }} />
                    </div>
                    <div className="text-xs font-semibold shrink-0 w-9 text-right"
                      style={{ color: a.AttendanceRate >= 90 ? '#10b981' : a.AttendanceRate >= 75 ? '#3b5bdb' : '#ef4444' }}>
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
              <div className="flex items-center gap-2 p-2.5 rounded-xl"
                style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <AlertTriangle size={13} className="text-red-500 shrink-0" />
                <span className="text-xs text-red-700">
                  {belowThreshold} course{belowThreshold > 1 ? 's' : ''} below the 75% attendance threshold.
                  You may be barred from sitting the exam.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin drawer (slide-in panel) ───────────────────────────────────────────

function StudentDrawer({ student, onClose }: { student: Student; onClose: () => void }) {
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

// ─── Student self-view (full page, shown when role === 'Student') ─────────────

function MyProfileView() {
  const { user } = useAuth();
  const [student, setStudent]                 = useState<Student | null>(null);
  const [attendance, setAttendance]           = useState<AttendanceRecord[]>([]);
  const [loadingAtt, setLoadingAtt]           = useState(true);
  const [results, setResults]                 = useState<StudentResult[]>([]);
  const [loadingResults, setLoadingResults]   = useState(true);
  const [resultsError, setResultsError]       = useState('');
  const [loadingProfile, setLoadingProfile]   = useState(true);
  const [profileError, setProfileError]       = useState('');

  const studentId = user?.studentId;

useEffect(() => {
  // userId is already in the verified JWT via useAuth()
  // DO NOT read from localStorage directly — use the auth context
  // NOTE: the field on AuthUser is `UserID` (capital I/D), not `userId`.
  const userId = user?.userId;  // already decoded from token in AuthContext

  if (!userId) {
    setProfileError('Not authenticated.');
    setLoadingProfile(false);
    return;
  }

  // Fetch student profile by userId
  StudentsService.getByUserId(userId)
    .then(r => {
      setStudent(r.data);
      // Now use the StudentID from the response for attendance + results
      const sid = r.data.StudentID;
      StudentsService.getAttendance(sid)
        .then(a => setAttendance(a.data))
        .catch(() => {})
        .finally(() => setLoadingAtt(false));
      ExaminationsService.getResultsByStudent(sid)
        .then(e => setResults(e.data))
        .catch(e => setResultsError(e instanceof ApiError ? e.message : 'Failed to load results.'))
        .finally(() => setLoadingResults(false));
    })
    .catch(e => setProfileError(e instanceof ApiError ? e.message : 'Failed to load profile.'))
    .finally(() => setLoadingProfile(false));
}, [user?.userId]);

  if (loadingProfile) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--muted)' }} />
        ))}
      </div>
    );
  }

  if (profileError || !student) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="p-4 rounded-2xl" style={{ background: '#fef2f2' }}>
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div>
          <div className="text-foreground font-medium">Could not load your profile</div>
          <div className="text-muted-foreground text-sm mt-1">{profileError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ background: '#eef2ff' }}>
          <GraduationCap size={22} style={{ color: '#3b5bdb' }} />
        </div>
        <div>
          <h1 className="text-foreground">My Academic Profile</h1>
          <p className="text-muted-foreground text-sm">Academic Year 2025–2026</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-card rounded-2xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
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
  );
}

// ─── Register modal ───────────────────────────────────────────────────────────

function AddStudentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<RegisterStudentBody>({
    name: '', email: '', password: '', phone: '', gender: '',
    dob: '', address: '', facultyId: 0, program: '', level: 100,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k: keyof RegisterStudentBody, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.name || !form.email || !form.password || !form.facultyId) {
      setError('Name, email, password and faculty are required.');
      return;
    }
    setSaving(true); setError('');
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
              <AlertTriangle size={14} className="shrink-0" />{error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Email *</label>
              <input type="email" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="john@uni.edu" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Password *</label>
              <input type="password" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="Minimum 8 chars" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Phone</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="+1 555-0000" value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Date of Birth</label>
              <input type="date" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.dob ?? ''} onChange={e => set('dob', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Faculty ID *</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.facultyId} onChange={e => set('facultyId', parseInt(e.target.value))}>
                <option value={0}>Select faculty</option>
                {[{ id:1,name:'Engineering'},{id:2,name:'Medicine'},{id:3,name:'Business'},{id:4,name:'Sciences'},{id:5,name:'Arts'},{id:6,name:'Law'}]
                  .map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Program</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. BSc Computer Science" value={form.program ?? ''} onChange={e => set('program', e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Level</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.level} onChange={e => set('level', parseInt(e.target.value))}>
                {[100,200,300,400,500,600].map(l => <option key={l} value={l}>{l}L</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Gender</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.gender ?? ''} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Address</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="City, Country" value={form.address ?? ''} onChange={e => set('address', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors hover:bg-muted text-foreground"
            style={{ borderColor: 'var(--border)' }}>Cancel</button>
          <button onClick={submit} disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Registering…' : 'Register Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Attendance tab ───────────────────────────────────────────────────────────

function AttendanceTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Average Attendance', value: '—', icon: <CheckCircle2 size={18} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Below 75% Threshold', value: '—', icon: <XCircle size={18} />, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Perfect Attendance', value: '—', icon: <Clock size={18} />, color: '#3b5bdb', bg: '#eef2ff' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-3 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5">{m.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border p-5 shadow-sm text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-muted-foreground text-sm">
          Click <strong className="text-foreground">👁 View</strong> on any student in the <strong className="text-foreground">All Students</strong> tab to see their course-by-course attendance.
        </p>
      </div>
    </div>
  );
}

// ─── Registration tab ─────────────────────────────────────────────────────────

function RegistrationTab({ onNavigate }: { onNavigate?: (view: string) => void }) {
  return (
    <div className="bg-card rounded-2xl border p-8 shadow-sm flex flex-col items-center text-center gap-5" style={{ borderColor: 'var(--border)' }}>
      <div className="p-4 rounded-2xl" style={{ background: '#eef2ff' }}>
        <Users size={32} style={{ color: '#3b5bdb' }} />
      </div>
      <div>
        <h3 className="text-foreground text-base">Student registration has moved</h3>
        <p className="text-muted-foreground text-sm mt-2 max-w-md leading-relaxed">
          Student accounts must be created in two steps: first create a <strong className="text-foreground">User Account</strong>,
          then register them as a <strong className="text-foreground">Student</strong>.
        </p>
      </div>
      <div className="flex items-center gap-3 p-4 rounded-xl w-full max-w-sm text-left" style={{ background: 'var(--muted)' }}>
        <div className="space-y-2 text-sm">
          {['Create user account (name, email, role = Student)', 'Register as Student (faculty, program, level)'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-foreground">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'var(--primary)' }}>{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </div>
      {onNavigate && (
        <button onClick={() => onNavigate('user-management')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}>
          Go to User Management →
        </button>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UniStudents({ activeTab, onNavigate }: { activeTab: string; onNavigate?: (view: string) => void }) {
  const { user } = useAuth();
  const isStudent = user?.role === 'Student';

  // Students see only their own profile — no table, no admin controls
  if (isStudent) return <MyProfileView />;

  const [tab, setTab] = useState(
    activeTab === 'students-registration' ? 'registration' :
    activeTab === 'students-attendance'   ? 'attendance'   : 'list'
  );

  const [students, setStudents]             = useState<Student[]>([]);
  const [pagination, setPagination]         = useState({ page: 1, pageSize: 8, total: 0, pages: 1 });
  const [search, setSearch]                 = useState('');
  const [filterFaculty, setFilterFaculty]   = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState('');
  const [showModal, setShowModal]           = useState(false);
  const [selected, setSelected]             = useState<Student | null>(null);

  const loadStudents = useCallback(async (page = 1) => {
    setLoading(true); setError('');
    try {
      const res = await StudentsService.list({
        search:   search || undefined,
        faculty:  filterFaculty || undefined,
        status:   filterStatus  || undefined,
        page,
        pageSize: pagination.pageSize,
      });
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [search, filterFaculty, filterStatus, pagination.pageSize]);

  useEffect(() => {
    if (tab === 'list') loadStudents(1);
  }, [tab, search, filterFaculty, filterStatus]);

  return (
    <div className="space-y-6">
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onCreated={() => loadStudents(1)} />}
      {selected  && <StudentDrawer student={selected} onClose={() => setSelected(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Student Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {pagination.total > 0 ? `${pagination.total} students enrolled` : 'Loading…'} · Academic Year 2025–2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <Download size={15} /> Export
          </button>
          <button onClick={() => onNavigate ? onNavigate('user-management') : setTab('registration')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Register Student
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[{ id: 'list', label: 'All Students' }, { id: 'registration', label: 'Registration' }, { id: 'attendance', label: 'Attendance' }].map(t => (
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

      {/* All Students tab */}
      {tab === 'list' && (
        <>
          {error && <ErrorBanner message={error} onRetry={() => loadStudents(pagination.page)} />}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input placeholder="Search by name, ID, or email…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)}>
              <option value="">All Faculties</option>
              {['Engineering','Medicine','Business','Sciences','Arts','Law'].map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Active','Pending','Suspended','Graduated'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Student','ID','Faculty / Program','Level','GPA','Status',''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                    : students.length === 0
                      ? <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">No students found. Try adjusting your filters.</td></tr>
                      : students.map(s => (
                        <tr key={s.StudentID} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                                style={{ background: colorFor(s.StudentID) }}>
                                {s.AvatarCode}
                              </div>
                              <div>
                                <div className="text-foreground text-sm font-medium">{s.FullName}</div>
                                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.Email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{s.StudentID}</td>
                          <td className="px-5 py-3.5">
                            <div className="text-sm text-foreground">{s.Faculty}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.Program ?? '—'}</div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-foreground">{s.Level}L</td>
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-semibold"
                              style={{ color: s.GPA >= 3.7 ? '#10b981' : s.GPA >= 3.0 ? '#3b5bdb' : '#f59e0b' }}>
                              {Number(s.GPA).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">{statusBadge(s.Status)}</td>
                          <td className="px-5 py-3.5">
                            <button onClick={() => setSelected(s)}
                              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <Eye size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm text-muted-foreground">
                {loading ? 'Loading…' : `Showing ${Math.min((pagination.page-1)*pagination.pageSize+1, pagination.total)}–${Math.min(pagination.page*pagination.pageSize, pagination.total)} of ${pagination.total}`}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => loadStudents(pagination.page - 1)} disabled={pagination.page <= 1 || loading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => loadStudents(p)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: p === pagination.page ? 'var(--primary)' : 'transparent',
                      color:      p === pagination.page ? '#fff' : 'var(--muted-foreground)',
                    }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => loadStudents(pagination.page + 1)} disabled={pagination.page >= pagination.pages || loading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'attendance'   && <AttendanceTab />}
      {tab === 'registration' && <RegistrationTab onNavigate={onNavigate} />}
    </div>
  );
}