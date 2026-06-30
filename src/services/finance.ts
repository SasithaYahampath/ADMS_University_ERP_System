import { request, qs } from '../lib/api';

// ─── Shapes (matching controller / SP output columns) ─────────────────────────

export interface Payment {
  PaymentID: string;
  StudentID: string;
  StudentName: string;
  Amount: number;
  Type: 'Tuition' | 'Hostel' | 'Library' | 'Other';
  Semester: string | null;
  PaymentDate: string | null;
  Method: string | null;
  Status: 'Paid' | 'Pending' | 'Overdue';
  TotalCount?: number;
}

export interface Scholarship {
  ScholarshipID: number;
  Name: string;
  StudentID: string;
  StudentName: string;
  Faculty?: string;   // from sp_GetScholarshipsList join
  GPA?: number;       // from sp_GetScholarshipsList join
  Amount: number;
  Type: 'Merit' | 'Need-Based' | 'Research';
  Status: 'Active' | 'Inactive' | 'Expired';
}

export interface FinanceSummary {
  totalRevenue: number;
  pendingAmount: number;
  scholarshipTotal: number;
  statusCounts: Array<{ Status: string; Count: number }>;
  // sp_GetFinanceSummaryDashboard rs[4]: SELECT Type, SUM(Amount) AS Total
  revenueByType: Array<{ Type: string; Total: number }>;
}

export interface MonthlyRevenue {
  Month: number;
  MonthName: string;
  Tuition: number;
  Hostel: number;
  Library: number;
  Other: number;
  TotalRevenue?: number; // computed client-side: Tuition + Hostel + Library + Other
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreatePaymentBody {
  student_id: string;
  amount: number;
  type: string;
  semester: string;
  payment_date?: string;
  method?: string;
  status?: string;
}

export interface UpdatePaymentBody {
  status?: string;
  method?: string;
  payment_date?: string;
  amount?: number;
}

export interface CreateScholarshipBody {
  name: string;
  student_id: string;
  amount: number;
  type: string;
  status?: string;
}

export interface UpdateScholarshipBody {
  name?: string;
  amount?: number;
  status?: string;
  type?: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const FinanceService = {

  // ── Dashboard ──────────────────────────────────────────────────────────────

  // GET /api/finance/summary
  summary(): Promise<{ success: boolean; data: FinanceSummary }> {
    return request('/finance/summary');
  },

  // GET /api/finance/revenue/monthly?year=2026
  monthlyRevenue(year?: number): Promise<{ success: boolean; data: MonthlyRevenue[] }> {
    return request(`/finance/revenue/monthly${qs({ year })}`);
  },

  // ── Payments ───────────────────────────────────────────────────────────────

  // GET /api/finance/payments?status=&type=&semester=&search=&page=&limit=
  listPayments(params?: {
    status?: string;
    type?: string;
    semester?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: Payment[]; pagination: Pagination }> {
    return request(`/finance/payments${qs(params ?? {})}`);
  },

  // GET /api/finance/payments/:paymentId
  getPayment(paymentId: string): Promise<{ success: boolean; data: Payment }> {
    return request(`/finance/payments/${paymentId}`);
  },

  // POST /api/finance/payments
  createPayment(body: CreatePaymentBody): Promise<{ success: boolean; message: string; paymentId: string }> {
    return request('/finance/payments', { method: 'POST', body: JSON.stringify(body) });
  },

  // PATCH /api/finance/payments/:paymentId
  updatePayment(paymentId: string, body: UpdatePaymentBody): Promise<{ success: boolean; message: string }> {
    return request(`/finance/payments/${paymentId}`, { method: 'PATCH', body: JSON.stringify(body) });
  },

  // DELETE /api/finance/payments/:paymentId
  deletePayment(paymentId: string): Promise<{ success: boolean; message: string }> {
    return request(`/finance/payments/${paymentId}`, { method: 'DELETE' });
  },

  // ── Scholarships ───────────────────────────────────────────────────────────

  // GET /api/finance/scholarships?type=&status=
  listScholarships(params?: {
    type?: string;
    status?: string;
  }): Promise<{ success: boolean; data: Scholarship[] }> {
    return request(`/finance/scholarships${qs(params ?? {})}`);
  },

  // GET /api/finance/scholarships/:scholarshipId
  getScholarship(id: number): Promise<{ success: boolean; data: Scholarship }> {
    return request(`/finance/scholarships/${id}`);
  },

  // POST /api/finance/scholarships
  createScholarship(body: CreateScholarshipBody): Promise<{ success: boolean; message: string; scholarshipId: number }> {
    return request('/finance/scholarships', { method: 'POST', body: JSON.stringify(body) });
  },

  // PATCH /api/finance/scholarships/:scholarshipId
  updateScholarship(id: number, body: UpdateScholarshipBody): Promise<{ success: boolean; message: string }> {
    return request(`/finance/scholarships/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
  },

  // DELETE /api/finance/scholarships/:scholarshipId
  deleteScholarship(id: number): Promise<{ success: boolean; message: string }> {
    return request(`/finance/scholarships/${id}`, { method: 'DELETE' });
  },

  // ── Per-student ────────────────────────────────────────────────────────────

  // GET /api/finance/student/:studentId/payments
  studentPayments(studentId: string): Promise<{ success: boolean; data: Payment[] }> {
    return request(`/finance/student/${studentId}/payments`);
  },

  // GET /api/finance/student/:studentId/scholarships
  studentScholarships(studentId: string): Promise<{ success: boolean; data: Scholarship[] }> {
    return request(`/finance/student/${studentId}/scholarships`);
  },
};
