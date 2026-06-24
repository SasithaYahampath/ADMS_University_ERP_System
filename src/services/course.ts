import { request, qs } from "../lib/api";

export interface Course {
  CourseID: string;
  title: string;
  credits: number;
  level: number;
  semester: number;
  room: string;
  ScheduleDays: string;
  ScheduleTime: string;
  description: string;
  status: "Active" | "Inactive";
  mode: "In-person" | "Online" | "Hybrid";
  // from JOIN faculties
  FacultyName: string;
  // from JOIN departments
  DepartmentName: string;
  // from LEFT JOIN lecturers / users
  LecturerID: string | null;
  LecturerName: string | null;
  rank: string | null;
  // only on getById
  FacultyID?: string;
  DepartmentID?: string;
  specialization?: string | null;
}

export interface CourseEnrollment {
  EnrollmentID: number;
  StudentID: string;
  name: string;
  program: string;
  level: number;
  semester: string;
  EnrolledDate: string;
}

export interface CourseExam {
  ExamID: string;
  ExamDate: string;
  ExamTime: string;
  duration: number;
  hall: string;
  capacity: number;
  status: string;
  name: string | null; // invigilator name
}

export interface CourseStats {
  enrollmentCount: number;
  scheduledExams: number;
  completedExams: number;
  averageScore: number | null;
}

export interface CreateCourseBody {
  CourseID: string;
  title: string;
  FacultyID: string;
  DepartmentID: string;
  credits: number;
  level: number;
  semester: number;
  LecturerID?: string;
  room: string;
  scheduleDays: string;
  scheduleTime: string;
  description: string;
  status: string;
  mode: string;
}
export interface EnrolledCourse extends Course {
  EnrollmentID: number;
  EnrolledDate: string;
}

export type UpdateCourseBody = CreateCourseBody;

export const CourseService = {
  // GET /api/courses
  listCourses(params?: {
    facultyId?: string;
    departmentId?: string;
    status?: string;
    mode?: string;
    search?: string;
  }): Promise<{ success: boolean; data: Course[] }> {
    return request(`/courses${qs(params ?? {})}`);
  },

  // GET /api/courses/:id
  getCourse(id: string): Promise<{ success: boolean; data: Course }> {
    return request(`/courses/${id}`);
  },

  // GET /api/courses/:id/enrollments
  getEnrollments(
    id: string,
  ): Promise<{ success: boolean; data: CourseEnrollment[] }> {
    return request(`/courses/${id}/enrollments`);
  },

  // GET /api/courses/:id/exams
  getExams(id: string): Promise<{ success: boolean; data: CourseExam[] }> {
    return request(`/courses/${id}/exams`);
  },

  // GET /api/courses/:id/stats
  getStats(id: string): Promise<{ success: boolean; data: CourseStats }> {
    return request(`/courses/${id}/stats`);
  },

  // POST /api/courses
  createCourse(
    body: CreateCourseBody,
  ): Promise<{ success: boolean; message: string }> {
    return request("/courses", { method: "POST", body: JSON.stringify(body) });
  },

  // PUT /api/courses/:id
  updateCourse(
    id: string,
    body: UpdateCourseBody,
  ): Promise<{ success: boolean; message: string }> {
    return request(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  // DELETE /api/courses/:id
  deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/courses/${id}`, { method: "DELETE" });
  },
  // POST /api/users/:id/student-enrollment
  enrollStudent(
    studentId: string,
    courseId: string,
    semester: number,
  ): Promise<{ success: boolean; message: string; enrollmentId: number }> {
    return request(`/users/${studentId}/student-enrollment`, {
      method: "POST",
      body: JSON.stringify({ courseId, semester }),
    });
  },

  // GET /api/users/:id/enrollments
  getMyEnrollments(
    userId: number,
    semester?: number,
  ): Promise<{ success: boolean; data: EnrolledCourse[] }> {
    return request(
      `/students/${userId}/enrollments`,
    );
  },
};
