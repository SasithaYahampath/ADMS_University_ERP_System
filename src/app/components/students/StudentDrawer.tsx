import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StudentsService, type Student, type AttendanceRecord } from '../../../services/students';
import { ExaminationsService, type StudentResult } from '../../../services/examinations';
import { ApiError } from '../../../lib/api';
import { StudentProfileContent } from '../UniStudents';

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