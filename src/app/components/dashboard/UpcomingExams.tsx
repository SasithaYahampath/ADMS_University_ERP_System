import { BookOpen, ChevronRight } from 'lucide-react';

interface UpcomingExamsProps {
  exams: any[];
  loading: boolean;
  onNavigate: (view: string) => void;
}

export function UpcomingExams({ exams, loading, onNavigate }: UpcomingExamsProps) {
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-foreground text-base">Upcoming Examinations</h3>
        <button
          onClick={() => onNavigate('examinations')}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>
      {loading ? (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: 'var(--muted)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: 140 }} />
                <div className="h-2.5 rounded-full" style={{ background: 'var(--muted)', width: 90 }} />
              </div>
            </div>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="px-5 py-12 text-center text-muted-foreground text-sm">No upcoming exams scheduled.</div>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {exams.map((exam: any) => (
            <div key={exam.ExamID} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--secondary)' }}>
                <BookOpen size={15} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-sm font-medium truncate">{exam.CourseTitle}</div>
                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.CourseID} · {exam.Hall}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-foreground text-xs font-medium">{exam.ExamDate?.slice(0, 10)}</div>
                <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.ExamTime} · {exam.EnrolledCount} students</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
