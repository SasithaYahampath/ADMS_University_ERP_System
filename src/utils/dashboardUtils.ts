export const FACULTY_COLORS = [
  '#3b5bdb', '#818cf8', '#06b6d4', '#10b981',
  '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899',
];

export function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Number(n).toFixed(0)}`;
}
