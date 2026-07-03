export function modeBadge(mode: string) {
  const map: Record<string, { bg: string; text: string }> = {
    "In-person": { bg: "#dcfce7", text: "#15803d" },
    Online: { bg: "#dbeafe", text: "#1d4ed8" },
    Hybrid: { bg: "#fef9c3", text: "#a16207" },
  };
  const c = map[mode] ?? { bg: "#f1f5f9", text: "#64748b" };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      {mode}
    </span>
  );
}