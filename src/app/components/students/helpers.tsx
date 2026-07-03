
const avatarColors = ['#3b5bdb','#818cf8','#06b6d4','#10b981','#f59e0b','#f43f5e','#8b5cf6','#ec4899'];

export function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return avatarColors[Math.abs(h) % avatarColors.length];
}

export function statusBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Active:    { bg: '#dcfce7', text: '#15803d' },
    Pending:   { bg: '#fef9c3', text: '#a16207' },
    Suspended: { bg: '#fee2e2', text: '#b91c1c' },
    Graduated: { bg: '#dbeafe', text: '#1d4ed8' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}