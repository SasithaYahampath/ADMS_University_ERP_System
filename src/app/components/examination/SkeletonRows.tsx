interface Props {
  cols: number;
  rows?: number;
}

export function SkeletonRows({ cols, rows = 5 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div
                className="h-3 rounded-full"
                style={{ background: 'var(--muted)', width: j === 0 ? 160 : 80 }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}