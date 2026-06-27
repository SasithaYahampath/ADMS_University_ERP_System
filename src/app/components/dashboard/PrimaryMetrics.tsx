import { Users, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { MetricCard } from './MetricCard';

interface PrimaryMetricsProps {
  totalStudents: number | undefined;
  lecturerCount: number | null;
  courseCount: number | null;
  facultyCount: number;
  loading: boolean;
}

export function PrimaryMetrics({
  totalStudents, lecturerCount, courseCount, facultyCount, loading,
}: PrimaryMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Total Students"   value={totalStudents?.toLocaleString() ?? '—'} icon={<Users size={20} />}         color="#3b5bdb" bg="#eef2ff" loading={loading} />
      <MetricCard title="Active Lecturers" value={lecturerCount ?? '—'}                    icon={<GraduationCap size={20} />} color="#0891b2" bg="#e0f2fe" loading={loading} />
      <MetricCard title="Active Courses"   value={courseCount ?? '—'}                      icon={<BookOpen size={20} />}       color="#059669" bg="#ecfdf5" loading={loading} />
      <MetricCard title="Faculties"        value={facultyCount || '—'}                     icon={<Building2 size={20} />}      color="#d97706" bg="#fffbeb" loading={loading} />
    </div>
  );
}
