import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { FACULTY_COLORS } from '../../../utils/dashboardUtils';

interface FacultyBarChartProps {
  byFaculty: any[];
  loading: boolean;
}

export function FacultyBarChart({ byFaculty, loading }: FacultyBarChartProps) {
  return (
    <div className="lg:col-span-2 bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
      <h3 className="text-foreground text-base mb-1">Students per Faculty</h3>
      <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Current enrollment by faculty</p>
      {loading ? (
        <div className="flex items-center justify-center h-[200px]"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
      ) : byFaculty.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No data.</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byFaculty} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="Faculty" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="Count" name="Students" radius={[6, 6, 0, 0]}>
              {byFaculty.map((_, i) => <Cell key={i} fill={FACULTY_COLORS[i % FACULTY_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
