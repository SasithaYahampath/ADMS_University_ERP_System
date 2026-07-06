import { useState } from "react";
import { CourseService ,Course} from "../../services/course";
import { ErrorBanner } from "./courses/ErrorBanner";
import { ApiError } from "../../lib/api";
import { Plus,X,Loader2 } from "lucide-react";


// ─── Enroll Student Modal ─────────────────────────────────────────────────────

function EnrollStudentModal({ course, onClose, onEnrolled }: {
  course: Course;
  onClose: () => void;
  onEnrolled: () => void;
}) {
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester]   = useState(1);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit() {
    if (!studentId.trim()) {
      setError('Student ID is required.'); return;
    }
    setSaving(true); setError('');
    try {
      await CourseService.enrollStudent(studentId.trim(), course.CourseID, semester);
      onEnrolled();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to enroll student.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border shadow-xl w-full max-w-md mx-4"
        style={{ borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-xs text-muted-foreground font-mono">{course.CourseID}</p>
            <h3 className="text-foreground text-sm font-semibold">Enroll a student</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && <ErrorBanner message={error} />}

          {/* Student ID */}
          <div>
            <label className="text-sm text-foreground block mb-1.5">Student ID</label>
            <input
              placeholder="e.g. STU-2023-001"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            />
          </div>

          {/* Semester */}
          <div>
            <label className="text-sm text-foreground block mb-1.5">Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
              style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {saving ? 'Enrolling…' : 'Enroll student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}