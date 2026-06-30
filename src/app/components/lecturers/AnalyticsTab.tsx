import { Loader2, Star } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Lecturer } from '../../../services/lecturer';
import { avatarColors, initials } from './Helpers';

export function AnalyticsTab({ lecturers, loading }: { lecturers: Lecturer[]; loading: boolean }) {
  const leaderboard = [...lecturers].sort((a, b) => (Number(b.Rating) || 0) - (Number(a.Rating) || 0)).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {leaderboard[0] && (
        <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground text-base mb-1">Performance Radar — {leaderboard[0].Name}</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Top rated lecturer</p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={[
              { subject: 'Rating',       A: Math.round(((Number(leaderboard[0].Rating) || 0) / 5) * 100) },
              { subject: 'Publications', A: Math.min(100, Math.round(((Number(leaderboard[0].Publications) || 0) / 50) * 100)) },
              { subject: 'Active',       A: leaderboard[0].Status === 'Active' ? 100 : 30 },
            ]}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <Radar dataKey="A" stroke="#3b5bdb" fill="#3b5bdb" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-foreground text-base mb-4">Rating Leaderboard</h3>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((l, i) => (
              <div key={l.LecturerID} className="flex items-center gap-3">
                <div className="w-6 text-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: avatarColors[i % avatarColors.length] }}>
                  {initials(l.Name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground font-medium truncate">{l.Name}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.Department}</div>
                </div>
                {l.Rating != null && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={12} fill="#f59e0b" className="text-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{Number(l.Rating).toFixed(1)}</span>
                  </div>
                )}
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}