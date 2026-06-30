import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { ExaminationsService, type Exam } from '../../../services/examinations';

interface Props {
  exam: Exam;
  onChanged: () => void;
}

type ExamStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export function StatusChanger({ exam, onChanged }: Props) {
  const [open, setOpen]     = useState(false);
  const [saving, setSaving] = useState(false);

  const statuses = (['Scheduled', 'Completed', 'Cancelled'] as ExamStatus[]).filter(s => s !== exam.Status);

  async function change(status: ExamStatus) {
    setOpen(false); setSaving(true);
    try {
      await ExaminationsService.updateStatus(exam.ExamID, status);
      onChanged();
    } catch { /* parent reloads on next fetch */ }
    finally { setSaving(false); }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={saving}
        className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
      >
        {saving ? <Loader2 size={13} className="animate-spin" /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-36 bg-card rounded-xl border shadow-lg z-20 py-1"
          style={{ borderColor: 'var(--border)' }}
        >
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => change(s)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors text-foreground"
            >
              → {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}