import { useState, useEffect, useCallback } from 'react';
import { LecturerService }     from '../../../services/lecturer';
import { CourseService }       from '../../../services/course';
import { StudentsService }     from '../../../services/students';
import { FinanceService }      from '../../../services/finance';
import { ExaminationsService } from '../../../services/examinations';
import { ApiError }            from '../../../lib/api';

export function useUniDashboardData() {
  const [studentStats,   setStudentStats]   = useState<any>(null);
  const [lecturerCount,  setLecturerCount]  = useState<number | null>(null);
  const [courseCount,    setCourseCount]    = useState<number | null>(null);
  const [finance,        setFinance]        = useState<any>(null);
  const [monthly,        setMonthly]        = useState<any[]>([]);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [upcomingExams,  setUpcomingExams]  = useState<any[]>([]);
  const [examStats,      setExamStats]      = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [stuStats, lecs, courses, fin, mon, recentStu, exams, exStatsRes] = await Promise.all([
        StudentsService.stats(),
        LecturerService.listLecturers(),
        CourseService.listCourses(),
        FinanceService.summary(),
        FinanceService.monthlyRevenue(),
        StudentsService.list({ pageSize: 5, page: 1 }),
        ExaminationsService.list({ status: 'Scheduled' }),
        ExaminationsService.stats(),
      ]);

      // remap overview keys (Total→TotalStudents, Active→ActiveStudents, etc.)
      // remap byFaculty field StudentCount→Count
      setStudentStats({
        // overview: {
        //   TotalStudents:     stuStats.data.overview.Total      ?? stuStats.data.overview.TotalStudents,
        //   ActiveStudents:    stuStats.data.overview.Active     ?? stuStats.data.overview.ActiveStudents,
        //   PendingStudents:   stuStats.data.overview.Pending    ?? stuStats.data.overview.PendingStudents,
        //   SuspendedStudents: stuStats.data.overview.Suspended  ?? stuStats.data.overview.SuspendedStudents,
        //   AvgGPA:            stuStats.data.overview.AvgGPA,
        // },
        byFaculty: stuStats.data.byFaculty.map((f: any) => ({
          Faculty: f.Faculty,
          Count:   f.StudentCount ?? f.Count, // remap StudentCount → Count
        })),
      });

      setLecturerCount(lecs.data.filter((l: any) => l.Status === 'Active').length);
      setCourseCount(courses.data.filter((c: any) => c.status === 'Active').length);
      setFinance(fin.data);
      setMonthly(mon.data.map((m: any) => ({
        ...m,
        TotalRevenue: Number(m.Tuition) + Number(m.Hostel) + Number(m.Library) + Number(m.Other),
      })));

      // remap Name→FullName for recent students list
      setRecentStudents(
        recentStu.data.map((s: any) => ({
          ...s,
          FullName: s.FullName ?? s.Name,
        }))
      );

      setUpcomingExams(exams.data.slice(0, 4));
      setExamStats(exStatsRes.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  return {
    studentStats, lecturerCount, courseCount, finance, monthly,
    recentStudents, upcomingExams, examStats, loading, error,
    reload: loadAll,
  };
}
