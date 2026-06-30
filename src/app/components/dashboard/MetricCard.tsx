import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  loading: boolean;
}

export function MetricCard({ title, value, icon, color, bg, loading }: MetricCardProps) {
  return (
    <div className="bg-card rounded-2xl p-5 border shadow-sm flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
      <div className="p-2.5 rounded-xl w-fit" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div className="text-muted-foreground text-sm">{title}</div>
        <div className="text-foreground mt-1" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>
          {loading
            ? <div className="rounded-full animate-pulse" style={{ height: 28, width: 100, background: 'var(--muted)' }} />
            : value}
        </div>
      </div>
    </div>
  );
}
