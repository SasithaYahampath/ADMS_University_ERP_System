import { useState, useEffect } from 'react';
import { X, Mail, Phone, BookOpen, Award, Loader2, Trash2 } from 'lucide-react';
import { LecturerService, type Lecturer, type LecturerCourse } from '../../../services/lecturer';
import { ApiError } from '../../../lib/api';
import { avatarColors, initials, rankBadge, statusBadge } from './Helpers';
import { ErrorBanner } from "./ErrorBanner";

export function LecturerDrawer({ lecturer, colorIdx, onClose, onDeleted, isAdmin }: {
  lecturer: Lecturer;
  colorIdx: number;
  onClose: () => void;
  onDeleted: () => void;
  isAdmin: boolean;
}) {
  const [drawerTab, setDrawerTab] = useState<'profile' | 'courses'>('profile');
  const [courses, setCourses]     = useState<LecturerCourse[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    if (drawerTab !== 'courses') return;
    setLoading(true); setError('');
    LecturerService.getCourses(lecturer.LecturerID)
      .then(res => setCourses(res.data))
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load courses.'))
      .finally(() => setLoading(false));
  }, [drawerTab, lecturer.LecturerID]);

  async function handleDelete() {
    if (!confirm(`Delete ${lecturer.Name}? This will also delete their user account.`)) return;
    setDeleting(true);
    try {
      await LecturerService.delete(lecturer.LecturerID);
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to delete lecturer.');
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}>
      <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground">Lecturer Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X size={18} /></button>
        </div>

        <div className="flex gap-1 p-2 border-b shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          {[{ id: 'profile', label: 'Profile' }, { id: 'courses', label: 'Courses' }].map(t => (
            <button key={t.id} onClick={() => setDrawerTab(t.id as typeof drawerTab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: drawerTab === t.id ? 'var(--card)' : 'transparent',
                color:      drawerTab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && <ErrorBanner message={error} />}

          {drawerTab === 'profile' && (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: avatarColors[colorIdx % avatarColors.length] }}>
                  {initials(lecturer.Name)}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{lecturer.Name}</div>
                  <div className="text-muted-foreground text-sm">{lecturer.LecturerID}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {rankBadge(lecturer.Rank)}
                    {statusBadge(lecturer.Status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Publications', value: lecturer.Publications ?? '—' },
                  { label: 'Rating',       value: lecturer.Rating ? `${Number(lecturer.Rating).toFixed(1)} / 5.0` : '—' },
                  { label: 'Joined',       value: lecturer.JoinedDate?.slice(0, 10) ?? '—' },
                  { label: 'Department',   value: lecturer.Department },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--muted)' }}>
                    <div className="text-foreground font-bold" style={{ fontSize: 18 }}>{s.value}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {[
                { icon: <Mail size={15} />,     label: 'Email',          value: lecturer.Email },
                { icon: <Phone size={15} />,    label: 'Phone',          value: lecturer.Phone ?? '—' },
                { icon: <BookOpen size={15} />, label: 'Specialization', value: lecturer.Specialization ?? '—' },
                { icon: <Award size={15} />,    label: 'Faculty',        value: lecturer.Faculty },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <span className="text-muted-foreground mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{item.label}</div>
                    <div className="text-foreground text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}

              {isAdmin && (
                <button onClick={handleDelete} disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors mt-2">
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? 'Deleting…' : 'Delete Lecturer'}
                </button>
              )}
            </>
          )}

          {drawerTab === 'courses' && (
            loading ? (
              <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
            ) : courses.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-12">No courses assigned.</p>
            ) : (
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.CourseID} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
                        {c.CourseID}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: c.Status === 'Active' ? '#dcfce7' : '#f1f5f9', color: c.Status === 'Active' ? '#15803d' : '#64748b' }}>
                        {c.Status}
                      </span>
                    </div>
                    <div className="text-foreground text-sm font-medium mt-1">{c.Title}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {c.ScheduleDays} · {c.ScheduleTime} · {c.Room} · {c.Credits} CU · Sem {c.Semester}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}