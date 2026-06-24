import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconColor: string;
}

export function MetricCard({ title, value, change, trend, icon: Icon, iconColor }: MetricCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="mb-2">{value}</h3>
          <p className={`text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
