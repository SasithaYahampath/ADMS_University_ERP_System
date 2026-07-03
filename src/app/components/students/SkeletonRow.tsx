export function SkeletonRow() {
  return (
    <tr className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: i === 0 ? 160 : i === 6 ? 48 : 80 }} />
        </td>
      ))}
    </tr>
  );
}
