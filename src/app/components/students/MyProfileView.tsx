import { useState, useEffect } from 'react';
import { GraduationCap, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { StudentsService, type Student, type AttendanceRecord } from '../../../services/students';
import { ExaminationsService, type StudentResult } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { StudentProfileContent } from '../UniStudents';

export function MyProfileView() {
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