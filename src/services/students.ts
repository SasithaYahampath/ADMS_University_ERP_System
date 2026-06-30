import { request, qs } from "../lib/api";

// ─── Response shapes (mirroring the controller) ─────────────────────────────

export interface Student {
  StudentID: string;
  FullName: string;
  Email: string;
  Phone: string | null;
  Gender: string | null;
  DOB: string | null;
  Address: string | null;
  AvatarCode: string;
  Faculty: string;
  FacultyID: number;
  Department: string | null;
  DepartmentID: number | null;
  Program: string | null;
  Level: number;
  GPA: number;
  Status: string;
  EnrolledDate: string;
  TotalCount?: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

export interface StudentListResponse {
  success: boolean;
  data: Student[];
  pagination: Pagination;
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
}

export interface StudentStats {
  success: boolean;
  data: {
    overview: {
      TotalStudents: number;
      ActiveStudents: number;
      PendingStudents: number;
      SuspendedStudents: number;
      AvgGPA: number;
    };
    byFaculty: Array<{ Faculty: string; Count: number }>;
  };
}

export interface StudentSummary {
  success: boolean;
  data: {
    profile: Student;
    activeEnrollments: { Count: number; TotalCredits: number };
    attendance: {
      TotalSessions: number;
      Present: number;
      AttendanceRate: number;
    };
    payments: { TotalPaid: number; TotalPending: number; TotalOverdue: number };
  };
}

export interface Enrollment {
  EnrollmentID: number;
  CourseID: string;
  CourseTitle: string;
  Credits: number;
  Semester: number;
  EnrolledDate: string;
  Status: string;
}

export interface AttendanceRecord {
  CourseCode: string;
  CourseTitle: string;
  TotalSessions: number;
  Present: number;
  Absent: number;
  AttendanceRate: number;
}

export interface Result {
  ExamID: string;
  CourseCode: string;
  CourseTitle: string;
  Score: number;
  Grade: string;
  GpaPoint: number;
  ExamDate: string;
}

export interface Payment {
  PaymentID: string;
  Amount: number;
  Type: string;
  Semester: string | null;
  PaymentDate: string | null;
  Method: string | null;
  Status: string;
}

export interface Scholarship {
  ScholarshipID: number;
  Name: string;
  Amount: number;
  Type: string;
  Status: string;
}

// ─── Register form body ──────────────────────────────────────────────────────

export interface RegisterStudentBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  avatarCode?: string;
  facultyId: number;
  departmentId?: number;
  program?: string;
  level?: number;
  enrolledDate?: string;
}

export interface UpdateStudentBody {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  avatarCode?: string;
  facultyId?: number;
  departmentId?: number;
  program?: string;
  level?: number;
  status?: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const StudentsService = {
  // GET /api/students
  list(params?: {
    search?: string;
    faculty?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<StudentListResponse> {
    return request(`/students${qs(params ?? {})}`);
  },

  // GET /api/students/stats
  stats(): Promise<StudentStats> {
    return request("/students/stats");
  },

  // GET /api/students/:id
  getById(id: string): Promise<SingleStudentResponse> {
    return request(`/students/${id}`);
  },
  // services/students.ts
  getByUserId(userId: number): Promise<SingleStudentResponse> {
    return request(`/students/by-user/${userId}`);
  },
  // GET /api/students/:id/summary
  summary(id: string): Promise<StudentSummary> {
    return request(`/students/${id}/summary`);
  },

  // POST /api/students
  register(
    body: RegisterStudentBody,
  ): Promise<{ success: boolean; message: string; studentId: string }> {
    return request("/students", { method: "POST", body: JSON.stringify(body) });
  },

  // PATCH /api/students/:id
  update(
    id: string,
    body: UpdateStudentBody,
  ): Promise<{ success: boolean; message: string }> {
    return request(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  // DELETE /api/students/:id
  remove(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/students/${id}`, { method: "DELETE" });
  },

  // GET /api/students/:id/enrollments?semester=2
  getEnrollments(
    id: string,
    semester?: number,
  ): Promise<{ success: boolean; data: Enrollment[] }> {
    return request(`/students/${id}/enrollments${qs({ semester })}`);
  },

  // POST /api/students/:id/enrollments
  enroll(
    id: string,
    courseId: string,
    semester: number,
  ): Promise<{ success: boolean; enrollmentId: number }> {
    return request(`/students/${id}/enrollments`, {
      method: "POST",
      body: JSON.stringify({ courseId, semester }),
    });
  },

  // DELETE /api/students/:id/enrollments
  dropEnrollment(
    id: string,
    courseId: string,
    semester: number,
  ): Promise<{ success: boolean; message: string }> {
    return request(`/students/${id}/enrollments`, {
      method: "DELETE",
      body: JSON.stringify({ courseId, semester }),
    });
  },

  // GET /api/students/:id/attendance?semester=2
  getAttendance(
    id: string,
    semester?: number,
  ): Promise<{ success: boolean; data: AttendanceRecord[] }> {
    return request(`/students/${id}/attendance${qs({ semester })}`);
  },

  // POST /api/attendance  (misc route)
  markAttendance(body: {
    enrollmentId: number;
    sessionDate: string;
    status: "Present" | "Absent" | "Late";
  }): Promise<{ success: boolean; message: string }> {
    return request("/attendance", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // GET /api/students/:id/results
  getResults(id: string): Promise<{ success: boolean; data: Result[] }> {
    return request(`/students/${id}/results`);
  },

  // POST /api/results  (misc route)
  upsertResult(body: {
    examId: string;
    studentId: string;
    score: number;
    grade?: string;
    gpaPoint?: number;
  }): Promise<{ success: boolean; message: string }> {
    return request("/results", { method: "POST", body: JSON.stringify(body) });
  },

  // GET /api/students/:id/payments?status=Pending
  getPayments(
    id: string,
    status?: string,
  ): Promise<{ success: boolean; data: Payment[] }> {
    return request(`/students/${id}/payments${qs({ status })}`);
  },

  // POST /api/students/:id/payments
  createPayment(
    id: string,
    body: {
      amount: number;
      type: string;
      semester?: string;
      paymentDate?: string;
      method?: string;
      status?: string;
    },
  ): Promise<{ success: boolean; paymentId: string }> {
    return request(`/students/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // PATCH /api/payments/:paymentId  (misc route)
  updatePaymentStatus(
    paymentId: string,
    body: {
      status: string;
      paymentDate?: string;
      method?: string;
    },
  ): Promise<{ success: boolean; message: string }> {
    return request(`/payments/${paymentId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  // GET /api/students/:id/scholarships
  getScholarships(
    id: string,
  ): Promise<{ success: boolean; data: Scholarship[] }> {
    return request(`/students/${id}/scholarships`);
  },

  // POST /api/students/:id/scholarships
  addScholarship(
    id: string,
    body: {
      name: string;
      amount?: number;
      type?: string;
      status?: string;
    },
  ): Promise<{ success: boolean; scholarshipId: number }> {
    return request(`/students/${id}/scholarships`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};
