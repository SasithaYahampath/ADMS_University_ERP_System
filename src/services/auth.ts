import { request } from '../lib/api';

export type UserRole = 'Student' | 'Lecturer' | 'Admin';

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  avatarCode: string;
  studentId: string | null;
  lecturerId: string | null;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  user: AuthUser;
}

export const AuthService = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Refresh token is sent automatically via HttpOnly cookie (credentials: 'include')
  refresh(): Promise<{ success: boolean; accessToken: string }> {
    return request('/auth/refresh', { method: 'POST' });
  },

  logout(): Promise<{ success: boolean }> {
    return request('/auth/logout', { method: 'POST' });
  },

  logoutAll(): Promise<{ success: boolean }> {
    return request('/auth/logout-all', { method: 'POST' });
  },

  getMe(): Promise<{ success: boolean; data: AuthUser }> {
    return request('/auth/me');
  },

  changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // ── User management (Admin only) ─────────────────────────────────────────

  // GET /auth/users?role=
  listUsers(role?: string): Promise<{ success: boolean; data: AuthUser[] }> {
    const q = role ? `?role=${role}` : '';
    return request(`/auth/users${q}`);
  },

  // GET /auth/users/:id
  getUserById(id: number): Promise<{ success: boolean; data: AuthUser & { profile: any } }> {
    return request(`/auth/users/${id}`);
  },

  // POST /auth/users/create — Step 1: create base user (Student|Lecturer)
  createUser(body: {
    name: string;
    email: string;
    role: 'Student' | 'Lecturer';
    phone?: string;
    gender?: string;
    dob?: string;
    address?: string;
  }): Promise<{ success: boolean; message: string; userId: number }> {
    return request('/auth/users/create', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // POST /auth/users/:id/register-student — Step 2a
  registerStudent(userId: number, body: {
    facultyId: number;
    departmentId?: number;
    program?: string;
    level?: string;   // NVarChar(20) in sp_RegisterStudent
  }): Promise<{ success: boolean; message: string; studentId: string }> {
    return request(`/auth/users/${userId}/register-student`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // POST /auth/users/:id/register-lecturer — Step 2b
  registerLecturer(userId: number, body: {
    facultyId: number;
    departmentId: number;
    specialization?: string;
    rank?: string;
  }): Promise<{ success: boolean; message: string; lecturerId: string }> {
    return request(`/auth/users/${userId}/register-lecturer`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // PATCH /auth/users/:id/toggle-active
  toggleUserActive(id: number): Promise<{ success: boolean; message: string; isActive: boolean }> {
    return request(`/auth/users/${id}/toggle-active`, { method: 'PATCH' });
  },

  // POST /auth/activate — activates a pending student/lecturer account
  activateAccount(email: string, password: string): Promise<{ success: boolean; message: string }> {
    return request('/auth/activate', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // POST /auth/register-admin — Admin only
  registerAdmin(body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
  }): Promise<{ success: boolean; message: string; userId: number }> {
    return request('/auth/register-admin', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
