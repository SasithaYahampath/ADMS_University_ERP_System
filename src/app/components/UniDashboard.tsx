import { useState } from 'react';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useUniDashboardData } from './dashboard/useUniDashboardData';
import { FACULTY_COLORS } from '../../utils/dashboardUtils';
import { PrimaryMetrics } from './dashboard/PrimaryMetrics';
import { SecondaryMetrics } from './dashboard/SecondaryMetrics';
import { RevenueChart } from './dashboard/RevenueChart';
import { FacultyDistribution } from './dashboard/FacultyDistribution';
import { FacultyBarChart } from './dashboard/FacultyBarChart';
import { FinancialSummary } from './dashboard/FinancialSummary';
import { RecentRegistrations } from './dashboard/RecentRegistrations';
import { UpcomingExams } from './dashboard/UpcomingExams';

interface UniDashboardProps { onNavigate: (view: string) => void; }

export function UniDashboard({ onNavigate }: UniDashboardProps) {
  const {
    studentStats, lecturerCount, courseCount, finance, monthly,
    recentStudents, upcomingExams, examStats, loading, error, reload,
  } = useUniDashboardData();

  const [chartPeriod, setChartPeriod] = useState<'6m' | '12m'>('12m');

  const overview: any    = studentStats?.overview ?? {};
  const byFaculty: any[] = studentStats?.byFaculty ?? [];

  const pieData = byFaculty.map((f: any, i: number) => ({
    name: f.Faculty,
    value: f.Count,
    color: FACULTY_COLORS[i % FACULTY_COLORS.length],
  }));

  const chartData = chartPeriod === '6m' ? monthly.slice(-6) : monthly;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025–2026 · Semester II</p>
        </div>
        <button
          onClick={reload}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border text-muted-foreground hover:bg-muted transition-colors"
          style={{ borderColor: 'var(--border)' }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
          <AlertCircle size={15} className="text-red-500 shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button onClick={reload} className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      <PrimaryMetrics
        totalStudents={overview.TotalStudents}
        lecturerCount={lecturerCount}
        courseCount={courseCount}
        facultyCount={byFaculty.length}
        loading={loading}
      />

      <SecondaryMetrics
        activeStudents={overview.ActiveStudents}
        pendingStudents={overview.PendingStudents}
        upcomingExamsCount={examStats?.Upcoming}
        avgGPA={overview.AvgGPA}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={chartData} loading={loading} period={chartPeriod} onPeriodChange={setChartPeriod} />
        <FacultyDistribution pieData={pieData} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FacultyBarChart byFaculty={byFaculty} loading={loading} />
        <FinancialSummary finance={finance} loading={loading} onNavigate={onNavigate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRegistrations students={recentStudents} loading={loading} onNavigate={onNavigate} />
        <UpcomingExams exams={upcomingExams} loading={loading} onNavigate={onNavigate} />
      </div>

    </div>
  );
}