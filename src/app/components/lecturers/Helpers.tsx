export const avatarColors = ['#3b5bdb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function rankBadge(rank: string | null) {
  const map: Record<string, string> = {
    'Professor': '#3b5bdb',
    'Associate Professor': '#818cf8',
    'Assistant Professor': '#06b6d4',
    'Lecturer': '#10b981',
  };
  const color = map[rank ?? ''] ?? '#64748b';
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ background: color }}>
      {rank ?? 'Lecturer'}
    </span>
  );
}

export function statusBadge(status: string) {
  const active = status === 'Active';
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: active ? '#dcfce7' : '#fef9c3', color: active ? '#15803d' : '#a16207' }}>
      {status}
    </span>
  );
}