import { request, qs } from '../lib/api';

export interface Lecturer {
  LecturerID: string;
  Name: string;
  Email: string;
  Phone: string | null;
  Faculty: string;
  Department: string;
  Specialization: string | null;
  Rank: string | null;
  Rating: number | null;
  Publications: number | null;
  Status: string;
  JoinedDate: string | null;
  // only on getById
  Gender?: string | null;
  DOB?: string | null;
  Address?: string | null;
}

export interface LecturerCourse {
  CourseID: string;
  Title: string;
  Credits: number;
  Semester: number;
  Room: string;
  ScheduleDays: string;
  ScheduleTime: string;
  Status: string;
}

export interface RegisterLecturerBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  avatarCode?: string;
  facultyId: number;
  departmentId: number;
  specialization?: string;
  rank?: string;
  joinedDate?: string;
}

export interface UpdateLecturerBody {
  name?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  avatarCode?: string;
  facultyId?: number;
  departmentId?: number;
  specialization?: string;
  rank?: string;
  status?: string;
}

export const LecturerService = {

  // GET /api/lecturers
  listLecturers(): Promise<{ success: boolean; data: Lecturer[] }> {
    return request('/lecturers');
  },

  // GET /api/lecturers/:id
  getLecturer(id: string): Promise<{ success: boolean; data: Lecturer }> {
    return request(`/lecturers/${id}`);
  },

  // GET /api/lecturers/faculty/:facultyId
  getByFaculty(facultyId: number): Promise<{ success: boolean; data: Lecturer[] }> {
    return request(`/lecturers/faculty/${facultyId}`);
  },

  // GET /api/lecturers/department/:departmentId
  getByDepartment(departmentId: number): Promise<{ success: boolean; data: Lecturer[] }> {
    return request(`/lecturers/department/${departmentId}`);
  },

  // POST /api/lecturers
  register(body: RegisterLecturerBody): Promise<{ success: boolean; message: string; lecturerId: string }> {
    return request('/lecturers', { method: 'POST', body: JSON.stringify(body) });
  },

  // PATCH /api/lecturers/:id
  update(id: string, body: UpdateLecturerBody): Promise<{ success: boolean; message: string }> {
    return request(`/lecturers/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
  },

  // DELETE /api/lecturers/:id
  delete(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/lecturers/${id}`, { method: 'DELETE' });
  },

  // GET /api/lecturers/:id/courses
  getCourses(id: string): Promise<{ success: boolean; data: LecturerCourse[] }> {
    return request(`/lecturers/${id}/courses`);
  },
};
