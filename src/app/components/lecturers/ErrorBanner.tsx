import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border"
      style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
      <AlertTriangle size={15} className="text-red-500 shrink-0" />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}