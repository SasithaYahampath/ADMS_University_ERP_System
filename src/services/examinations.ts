import { request, qs } from '../lib/api';

// ─── Shapes (matching stored proc output columns exactly) ─────────────────────

export interface Exam {
  ExamID: string;
  CourseID: string;
  CourseTitle: string;
  ExamDate: string;
  ExamTime: string;
  Duration: string;
  Hall: string;
  Capacity: number;
  Status: 'Scheduled' | 'Completed' | 'Cancelled';
  InvigilatorID: string | null;
  InvigilatorName: string | null;
  InvigilatorRank: string | null;
  FacultyName: string;
  DepartmentName: string;
  EnrolledCount: number;
}

export interface ExamStats {
  TotalExams: number;
  Upcoming: number;
  Completed: number;
  Cancelled: number;
  TotalScheduledSeats: number;
}

export interface ExamResult {
  ResultID: number;
  ExamID: string;
  StudentID: string;
  StudentName: string;
  Score: number;
  Grade: string;
  GpaPoint: number;
  ExamDate: string;
  CourseTitle: string;
  CourseID: string;
}

export interface StudentResult {
  ResultID: number;
  ExamID: string;
  Score: number;
  Grade: string;
  GpaPoint: number;
  CourseID: string;
  CourseTitle: string;
  ExamDate: string;
}

export interface CreateExamBody {
  course_id: string;
  exam_date: string;
  exam_time: string;
  duration: string;
  hall: string;
  capacity: number;
  invigilator_id?: string;
  status?: string;
}

export interface UpdateExamBody extends Partial<CreateExamBody> {}

export interface ResultEntry {
  student_id: string;
  score: number;
}

// ─── Grade helper (mirrors gradeFromScore in the controller — for preview) ────

export function gradeFromScore(score: number): { grade: string; gpaPoint: number } {
  if (score >= 90) return { grade: 'A+', gpaPoint: 4.0 };
  if (score >= 85) return { grade: 'A',  gpaPoint: 4.0 };
  if (score >= 80) return { grade: 'A-', gpaPoint: 3.7 };
  if (score >= 75) return { grade: 'B+', gpaPoint: 3.3 };
  if (score >= 70) return { grade: 'B',  gpaPoint: 3.0 };
  if (score >= 65) return { grade: 'B-', gpaPoint: 2.7 };
  if (score >= 60) return { grade: 'C+', gpaPoint: 2.3 };
  if (score >= 55) return { grade: 'C',  gpaPoint: 2.0 };
  if (score >= 50) return { grade: 'C-', gpaPoint: 1.7 };
  return { grade: 'F', gpaPoint: 0.0 };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const ExaminationsService = {
  // GET /api/examinations?status=&course_id=
  list(params?: { status?: string; course_id?: string }): Promise<{ success: boolean; data: Exam[] }> {
    return request(`/examinations${qs(params ?? {})}`);
  },

  // GET /api/examinations/stats
  stats(): Promise<{ success: boolean; data: ExamStats }> {
    return request('/examinations/stats');
  },

  // GET /api/examinations/:exam_id
  getById(examId: string): Promise<{ success: boolean; data: Exam }> {
    return request(`/examinations/${examId}`);
  },

  // POST /api/examinations
  create(body: CreateExamBody): Promise<{ success: boolean; message: string; exam_id: string }> {
    return request('/examinations', { method: 'POST', body: JSON.stringify(body) });
  },

  // PUT /api/examinations/:exam_id
  update(examId: string, body: UpdateExamBody): Promise<{ success: boolean; message: string }> {
    return request(`/examinations/${examId}`, { method: 'PUT', body: JSON.stringify(body) });
  },

  // PATCH /api/examinations/:exam_id/status
  updateStatus(examId: string, status: 'Scheduled' | 'Completed' | 'Cancelled'): Promise<{ success: boolean; message: string }> {
    return request(`/examinations/${examId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },

  // DELETE /api/examinations/:exam_id
  remove(examId: string): Promise<{ success: boolean; message: string }> {
    return request(`/examinations/${examId}`, { method: 'DELETE' });
  },

  // GET /api/examinations/:exam_id/results
  getResultsByExam(examId: string): Promise<{ success: boolean; data: ExamResult[] }> {
    return request(`/examinations/${examId}/results`);
  },

  // POST /api/examinations/:exam_id/results  (single or bulk array)
  upsertResults(examId: string, entries: ResultEntry | ResultEntry[]): Promise<{ success: boolean; message: string }> {
    return request(`/examinations/${examId}/results`, {
      method: 'POST',
      body: JSON.stringify(entries),
    });
  },

  // DELETE /api/examinations/:exam_id/results/:student_id
  deleteResult(examId: string, studentId: string): Promise<{ success: boolean; message: string }> {
    return request(`/examinations/${examId}/results/${studentId}`, { method: 'DELETE' });
  },

  // GET /api/examinations/student/:student_id/results
  getResultsByStudent(studentId: string): Promise<{ success: boolean; data: StudentResult[] }> {
    return request(`/examinations/student/${studentId}/results`);
  },
};
