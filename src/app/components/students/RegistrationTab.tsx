import { Users } from 'lucide-react';

export function RegistrationTab({ onNavigate }: { onNavigate?: (view: string) => void }) {
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
