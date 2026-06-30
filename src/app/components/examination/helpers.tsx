export function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Scheduled: { bg: '#dbeafe', text: '#1d4ed8' },
    Completed: { bg: '#dcfce7', text: '#15803d' },
    Cancelled: { bg: '#fee2e2', text: '#b91c1c' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

export function gradeBadge(grade: string) {
  const isA = grade.startsWith('A');
  const isB = grade.startsWith('B');
  const isF = grade === 'F';
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: isF ? '#fee2e2' : isA ? '#dcfce7' : isB ? '#dbeafe' : '#fef9c3',
        color:      isF ? '#b91c1c' : isA ? '#15803d' : isB ? '#1d4ed8' : '#a16207',
      }}
    >
      {grade}
    </span>
  );
}