import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Award,
  Search, Plus, Download, Trash2, Edit2,
  CheckCircle2, Clock, XCircle, AlertTriangle,
  ArrowUpRight, RefreshCw, Loader2, X, Save,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  FinanceService,
  type Payment,
  type Scholarship,
  type FinanceSummary,
  type MonthlyRevenue,
  type CreatePaymentBody,
  type CreateScholarshipBody,
} from '../../services/finance';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${Number(n).toFixed(2)}`;
}

function payStatusBadge(status: string) {
  const map: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    Paid:    { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle2 size={11} /> },
    Pending: { bg: '#fef9c3', text: '#a16207', icon: <Clock size={11} /> },
    Overdue: { bg: '#fee2e2', text: '#b91c1c', icon: <XCircle size={11} /> },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b', icon: null };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}>
      {c.icon}{status}
    </span>
  );
}

function scholarshipBadge(status: string) {
  const map: Record<string, { bg: string; text: string }> = {
    Active:   { bg: '#dcfce7', text: '#15803d' },
    Inactive: { bg: '#f1f5f9', text: '#64748b' },
    Expired:  { bg: '#fee2e2', text: '#b91c1c' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={c}>{status}</span>;
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border"
      style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
      <AlertTriangle size={15} className="text-red-500 shrink-0" />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium">
          <RefreshCw size={12} /> Retry
        </button>
      )}
    </div>
  );
}

function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--border)' }}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-4">
              <div className="h-3 rounded-full" style={{ background: 'var(--muted)', width: j === 0 ? 160 : 80 }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Update Payment Modal ─────────────────────────────────────────────────────

function UpdatePaymentModal({ payment, onClose, onUpdated }: {
  payment: Payment;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus]       = useState(payment.Status);
  const [method, setMethod]       = useState(payment.Method ?? '');
  const [payDate, setPayDate]     = useState(payment.PaymentDate?.slice(0, 10) ?? '');
  const [amount, setAmount]       = useState(String(payment.Amount));
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  async function save() {
    setSaving(true); setError('');
    try {
      await FinanceService.updatePayment(payment.PaymentID, {
        status,
        method:       method || undefined,
        payment_date: payDate || undefined,
        amount:       Number(amount) || undefined,
      });
      onUpdated();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update payment.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground">Update Payment</h3>
            <p className="text-muted-foreground text-xs">{payment.PaymentID}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && <ErrorBanner message={error} />}
          <div>
            <label className="text-sm text-foreground block mb-1.5">Amount ($)</label>
            <input type="number" min={0}
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
              value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Status</label>
            <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
              value={status} onChange={e => setStatus(e.target.value as Payment['Status'])}>
              {['Paid', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Payment Method</label>
            <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
              value={method} onChange={e => setMethod(e.target.value)}>
              <option value="">— Select —</option>
              {['Bank Transfer', 'Online Portal', 'Cash', 'Card', 'Mobile Money'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-foreground block mb-1.5">Payment Date</label>
            <input type="date"
              className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
              value={payDate} onChange={e => setPayDate(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium border text-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            Cancel
          </button>
          <button onClick={save} disabled={saving}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2"
            style={{ background: 'var(--primary)', opacity: saving ? 0.7 : 1 }}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Student Finance View ─────────────────────────────────────────────────────

function StudentFinanceView({ studentId }: { studentId: string }) {
  const [payments, setPayments]         = useState<Payment[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      FinanceService.studentPayments(studentId),
      FinanceService.studentScholarships(studentId),
    ])
      .then(([p, s]) => { setPayments(p.data); setScholarships(s.data); })
      .catch(e => setError(e instanceof ApiError ? e.message : 'Failed to load finance data.'))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={24} className="animate-spin text-muted-foreground" />
    </div>
  );
  if (error) return <ErrorBanner message={error} />;

  const totalPaid    = payments.filter(p => p.Status === 'Paid').reduce((a, p) => a + Number(p.Amount), 0);
  const totalPending = payments.filter(p => p.Status !== 'Paid').reduce((a, p) => a + Number(p.Amount), 0);
  const totalScholarship = scholarships.filter(s => s.Status === 'Active').reduce((a, s) => a + Number(s.Amount), 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Paid',        value: fmt(totalPaid),        color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={18} /> },
          { label: 'Pending / Overdue', value: fmt(totalPending),     color: '#ef4444', bg: '#fef2f2', icon: <Clock size={18} /> },
          { label: 'Scholarships',      value: fmt(totalScholarship), color: '#8b5cf6', bg: '#f5f3ff', icon: <Award size={18} /> },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4"
            style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-bold mt-0.5" style={{ fontSize: 20 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment history */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground text-base">My Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Payment ID', 'Type', 'Semester', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.PaymentID} className="border-t hover:bg-muted/30 transition-colors"
                    style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{p.PaymentID}</td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{p.Type}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Semester ?? '—'}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{fmt(Number(p.Amount))}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.PaymentDate?.slice(0, 10) ?? '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Method ?? '—'}</td>
                    <td className="px-5 py-3.5">{payStatusBadge(p.Status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Scholarships */}
      {scholarships.length > 0 && (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">My Scholarships</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {scholarships.map(s => (
              <div key={s.ScholarshipID} className="flex items-center gap-4 px-5 py-4">
                <div className="p-2.5 rounded-xl" style={{ background: '#f5f3ff' }}>
                  <Award size={16} style={{ color: '#8b5cf6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium">{s.Name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{s.Type}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-foreground font-bold">{fmt(Number(s.Amount))}</div>
                  <div className="mt-1">{scholarshipBadge(s.Status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UniFinance() {
  const { user } = useAuth();
  const isAdmin  = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';

  const defaultTab = isStudent ? 'my-finance' : 'dashboard';
  const [tab, setTab] = useState(defaultTab);

  // ── Dashboard state ──────────────────────────────────────────────────────
  const [summary, setSummary]         = useState<FinanceSummary | null>(null);
  const [monthly, setMonthly]         = useState<MonthlyRevenue[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError]     = useState('');

  // ── Payments state ───────────────────────────────────────────────────────
  const [payments, setPayments]       = useState<Payment[]>([]);
  const [payPagination, setPayPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [payLoading, setPayLoading]   = useState(false);
  const [payError, setPayError]       = useState('');
  const [paySearch, setPaySearch]     = useState('');
  const [payFilterStatus, setPayFilterStatus] = useState('');
  const [payFilterType, setPayFilterType]     = useState('');
  const [editPayment, setEditPayment] = useState<Payment | null>(null);

  // ── Scholarships state ───────────────────────────────────────────────────
  const [scholarships, setScholarships]   = useState<Scholarship[]>([]);
  const [schLoading, setSchLoading]       = useState(false);
  const [schError, setSchError]           = useState('');
  const [schFilterType, setSchFilterType] = useState('');
  const [schFilterStatus, setSchFilterStatus] = useState('');

  // ── Create invoice form ──────────────────────────────────────────────────
  const [invoiceForm, setInvoiceForm] = useState<CreatePaymentBody>({
    student_id: '', amount: 0, type: 'Tuition', semester: '', method: '', status: 'Pending',
  });
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [invoiceError, setInvoiceError]   = useState('');
  const [invoiceSuccess, setInvoiceSuccess] = useState('');

  // ── Create scholarship form ──────────────────────────────────────────────
  const [schForm, setSchForm] = useState<CreateScholarshipBody>({
    name: '', student_id: '', amount: 0, type: 'Merit', status: 'Active',
  });
  const [schSaving, setSchSaving] = useState(false);
  const [schFormError, setSchFormError] = useState('');
  const [schFormSuccess, setSchFormSuccess] = useState('');

  // ── Loaders ──────────────────────────────────────────────────────────────

  const loadDashboard = useCallback(async () => {
    setSummaryLoading(true); setSummaryError('');
    try {
      const [sumRes, monRes] = await Promise.all([
        FinanceService.summary(),
        FinanceService.monthlyRevenue(),
      ]);
      setSummary(sumRes.data);
      // SP has no TotalRevenue column — add it as a computed field
      setMonthly(monRes.data.map(m => ({
        ...m,
        TotalRevenue: Number(m.Tuition) + Number(m.Hostel) + Number(m.Library) + Number(m.Other),
      })));
    } catch (e) {
      setSummaryError(e instanceof ApiError ? e.message : 'Failed to load dashboard.');
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async (page = 1) => {
    setPayLoading(true); setPayError('');
    try {
      const res = await FinanceService.listPayments({
        search:   paySearch   || undefined,
        status:   payFilterStatus || undefined,
        type:     payFilterType   || undefined,
        page,
        limit: payPagination.limit,
      });
      setPayments(res.data);
      setPayPagination(res.pagination);
    } catch (e) {
      setPayError(e instanceof ApiError ? e.message : 'Failed to load payments.');
    } finally {
      setPayLoading(false);
    }
  }, [paySearch, payFilterStatus, payFilterType, payPagination.limit]);

  const loadScholarships = useCallback(async () => {
    setSchLoading(true); setSchError('');
    try {
      const res = await FinanceService.listScholarships({
        type:   schFilterType   || undefined,
        status: schFilterStatus || undefined,
      });
      setScholarships(res.data);
    } catch (e) {
      setSchError(e instanceof ApiError ? e.message : 'Failed to load scholarships.');
    } finally {
      setSchLoading(false);
    }
  }, [schFilterType, schFilterStatus]);

  useEffect(() => {
    if (tab === 'dashboard')    loadDashboard();
    if (tab === 'payments')     loadPayments(1);
    if (tab === 'scholarships') loadScholarships();
  }, [tab, paySearch, payFilterStatus, payFilterType, schFilterType, schFilterStatus]);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function deletePaymentRow(id: string) {
    if (!confirm(`Delete payment ${id}?`)) return;
    try {
      await FinanceService.deletePayment(id);
      loadPayments(payPagination.page);
    } catch (e) {
      setPayError(e instanceof ApiError ? e.message : 'Failed to delete payment.');
    }
  }

  async function deleteScholarshipRow(id: number) {
    if (!confirm('Delete this scholarship?')) return;
    try {
      await FinanceService.deleteScholarship(id);
      loadScholarships();
    } catch (e) {
      setSchError(e instanceof ApiError ? e.message : 'Failed to delete scholarship.');
    }
  }

  async function submitInvoice() {
    if (!invoiceForm.student_id || !invoiceForm.amount || !invoiceForm.semester) {
      setInvoiceError('Student ID, amount and semester are required.'); return;
    }
    setInvoiceSaving(true); setInvoiceError(''); setInvoiceSuccess('');
    try {
      const res = await FinanceService.createPayment(invoiceForm);
      setInvoiceSuccess(`Invoice created! ID: ${res.paymentId}`);
      setInvoiceForm({ student_id:'', amount:0, type:'Tuition', semester:'', method:'', status:'Pending' });
    } catch (e) {
      setInvoiceError(e instanceof ApiError ? e.message : 'Failed to create invoice.');
    } finally {
      setInvoiceSaving(false);
    }
  }

  async function submitScholarship() {
    if (!schForm.name || !schForm.student_id || !schForm.amount) {
      setSchFormError('Name, student ID and amount are required.'); return;
    }
    setSchSaving(true); setSchFormError(''); setSchFormSuccess('');
    try {
      const res = await FinanceService.createScholarship(schForm);
      setSchFormSuccess(`Scholarship awarded! ID: ${res.scholarshipId}`);
      setSchForm({ name:'', student_id:'', amount:0, type:'Merit', status:'Active' });
      loadScholarships();
    } catch (e) {
      setSchFormError(e instanceof ApiError ? e.message : 'Failed to award scholarship.');
    } finally {
      setSchSaving(false);
    }
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────

  const tabs = [
    ...(isStudent  ? [{ id:'my-finance',   label:'My Finance' }]          : []),
    ...(!isStudent ? [{ id:'dashboard',    label:'Revenue Dashboard' }]    : []),
    ...(!isStudent ? [{ id:'payments',     label:'Payments' }]             : []),
    ...(!isStudent ? [{ id:'scholarships', label:'Scholarships' }]         : []),
    ...(isAdmin    ? [{ id:'invoice',      label:'New Invoice' }]          : []),
    ...(isAdmin    ? [{ id:'add-scholarship', label:'Award Scholarship' }] : []),
  ];

  return (
    <div className="space-y-6">
      {editPayment && (
        <UpdatePaymentModal payment={editPayment}
          onClose={() => setEditPayment(null)}
          onUpdated={() => loadPayments(payPagination.page)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Finance & Payments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025–2026 · Financial Management</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              <Download size={15} /> Export
            </button>
            <button onClick={() => setTab('invoice')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ background: 'var(--primary)' }}>
              <Plus size={15} /> New Invoice
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit flex-wrap" style={{ background: 'var(--muted)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color:      tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow:  tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Student Finance ── */}
      {tab === 'my-finance' && user?.studentId && (
        <StudentFinanceView studentId={user.studentId} />
      )}

      {/* ── Revenue Dashboard ── */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          {summaryError && <ErrorBanner message={summaryError} onRetry={loadDashboard} />}

          {/* KPI cards */}
          {summaryLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border p-5 h-28 animate-pulse"
                  style={{ borderColor: 'var(--border)', background: 'var(--muted)' }} />
              ))}
            </div>
          ) : summary && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue',   value: fmt(summary.totalRevenue),     delta: '+8.2%', icon: <DollarSign size={20} />, color: '#3b5bdb', bg: '#eef2ff' },
                  { label: 'Collected (YTD)', value: fmt(summary.totalRevenue * 0.79), delta: '+5.4%', icon: <TrendingUp size={20} />, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Pending / Overdue', value: fmt(summary.pendingAmount),  delta: '',      icon: <TrendingDown size={20} />, color: '#ef4444', bg: '#fef2f2' },
                  { label: 'Scholarships',    value: fmt(summary.scholarshipTotal), delta: '+18%',  icon: <Award size={20} />,       color: '#f59e0b', bg: '#fffbeb' },
                ].map(m => (
                  <div key={m.label} className="bg-card rounded-2xl border p-5 shadow-sm flex flex-col gap-4"
                    style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl" style={{ background: m.bg }}>
                        <span style={{ color: m.color }}>{m.icon}</span>
                      </div>
                      {m.delta && (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full text-emerald-700 bg-emerald-50">
                          <ArrowUpRight size={11} />{m.delta}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">{m.label}</div>
                      <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 22 }}>{m.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment status counts */}
              {summary.statusCounts.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {summary.statusCounts.map(s => {
                    const icon = s.Status === 'Paid' ? <CheckCircle2 size={18} /> : s.Status === 'Pending' ? <Clock size={18} /> : <XCircle size={18} />;
                    const color = s.Status === 'Paid' ? '#10b981' : s.Status === 'Pending' ? '#f59e0b' : '#ef4444';
                    const bg    = s.Status === 'Paid' ? '#ecfdf5' : s.Status === 'Pending' ? '#fffbeb' : '#fef2f2';
                    return (
                      <div key={s.Status} className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4"
                        style={{ borderColor: 'var(--border)' }}>
                        <div className="p-2.5 rounded-xl" style={{ background: bg }}>
                          <span style={{ color }}>{icon}</span>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-xs">{s.Status}</div>
                          <div className="text-foreground font-bold mt-0.5" style={{ fontSize: 24 }}>{s.Count}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Revenue by type */}
              {summary.revenueByType.length > 0 && (
                <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-foreground text-base mb-4">Revenue by Fee Type</h3>
                  <div className="space-y-3">
                    {summary.revenueByType.map((r, i) => {
                      // SP returns Total (not Amount) — SELECT Type, SUM(Amount) AS Total
                      const total = summary.revenueByType.reduce((a, x) => a + Number(x.Total), 0);
                      const pct   = total > 0 ? Math.round((Number(r.Total) / total) * 100) : 0;
                      const colors = ['#3b5bdb', '#818cf8', '#06b6d4', '#10b981', '#f59e0b'];
                      return (
                        <div key={r.Type}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{r.Type}</span>
                            <span className="text-foreground font-medium">{pct}% · {fmt(Number(r.Total))}</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Monthly revenue chart */}
          {monthly.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-foreground text-base mb-1">Monthly Revenue Trend</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>All fee types · {new Date().getFullYear()}</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="fRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="MonthName" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                    {/* sp_GetMonthlyRevenue has no TotalRevenue column — computed as Tuition+Hostel+Library+Other */}
                    <Area type="monotone" dataKey="TotalRevenue" name="Total" stroke="#3b5bdb" strokeWidth={2} fill="url(#fRevGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-foreground text-base mb-1">Revenue by Category</h3>
                <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Stacked monthly breakdown</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthly} barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="MonthName" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Tuition" stackId="a" fill="#3b5bdb" />
                    <Bar dataKey="Hostel"  stackId="a" fill="#818cf8" />
                    <Bar dataKey="Library" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="Other"   stackId="a" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Payments ── */}
      {tab === 'payments' && (
        <>
          {payError && <ErrorBanner message={payError} onRetry={() => loadPayments(1)} />}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card"
              style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input placeholder="Search by student name, ID, or payment ID…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={paySearch} onChange={e => setPaySearch(e.target.value)} />
              {paySearch && <button onClick={() => setPaySearch('')} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>}
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={payFilterType} onChange={e => setPayFilterType(e.target.value)}>
              <option value="">All Types</option>
              {['Tuition','Hostel','Library','Other'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={payFilterStatus} onChange={e => setPayFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Paid','Pending','Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Payment ID','Student','Type','Amount','Semester','Date','Method','Status',isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                      <th key={h as string} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payLoading
                    ? <SkeletonRows cols={isAdmin ? 9 : 8} />
                    : payments.length === 0
                      ? <tr><td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm">No payments found.</td></tr>
                      : payments.map(p => (
                        <tr key={p.PaymentID} className="border-t hover:bg-muted/30 transition-colors"
                          style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{p.PaymentID}</td>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm font-medium">{p.StudentName}</div>
                            <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{p.StudentID}</div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Type}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{fmt(Number(p.Amount))}</td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Semester ?? '—'}</td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.PaymentDate?.slice(0,10) ?? '—'}</td>
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.Method ?? '—'}</td>
                          <td className="px-5 py-3.5">{payStatusBadge(p.Status)}</td>
                          {isAdmin && (
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1">
                                <button onClick={() => setEditPayment(p)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                  <Edit2 size={13} />
                                </button>
                                <button onClick={() => deletePaymentRow(p.PaymentID)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-red-500">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm text-muted-foreground">
                {payLoading ? 'Loading…' : `${payPagination.total} total · page ${payPagination.page} of ${payPagination.pages}`}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => loadPayments(payPagination.page - 1)}
                  disabled={payPagination.page <= 1 || payLoading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(payPagination.pages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => loadPayments(p)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: p === payPagination.page ? 'var(--primary)' : 'transparent', color: p === payPagination.page ? '#fff' : 'var(--muted-foreground)' }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => loadPayments(payPagination.page + 1)}
                  disabled={payPagination.page >= payPagination.pages || payLoading}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Scholarships ── */}
      {tab === 'scholarships' && (
        <>
          {schError && <ErrorBanner message={schError} onRetry={loadScholarships} />}
          <div className="flex gap-3">
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={schFilterType} onChange={e => setSchFilterType(e.target.value)}>
              <option value="">All Types</option>
              {['Merit','Need-Based','Research'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={schFilterStatus} onChange={e => setSchFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Active','Inactive','Expired'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Scholarship','Recipient','Faculty','GPA','Amount','Type','Status', isAdmin ? 'Actions' : ''].filter(Boolean).map(h => (
                      <th key={h as string} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schLoading
                    ? <SkeletonRows cols={isAdmin ? 6 : 5} />
                    : scholarships.length === 0
                      ? <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No scholarships found.</td></tr>
                      : scholarships.map(s => (
                        <tr key={s.ScholarshipID} className="border-t hover:bg-muted/30 transition-colors"
                          style={{ borderColor: 'var(--border)' }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Award size={14} style={{ color: 'var(--primary)' }} />
                              <span className="text-foreground text-sm font-medium">{s.Name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground text-sm">{s.StudentName}</div>
                            <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{s.StudentID}</div>
                          </td>
                          {/* Faculty — from sp_GetScholarshipsList join on Faculties */}
                          <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.Faculty ?? '—'}</td>
                          {/* GPA — from sp_GetScholarshipsList join on Students */}
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-semibold"
                              style={{ color: Number(s.GPA) >= 3.7 ? '#10b981' : Number(s.GPA) >= 3.0 ? '#3b5bdb' : '#f59e0b' }}>
                              {s.GPA != null ? Number(s.GPA).toFixed(2) : '—'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{fmt(Number(s.Amount))}</td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded-full text-xs"
                              style={{ background: s.Type === 'Merit' ? '#eef2ff' : s.Type === 'Research' ? '#ecfdf5' : '#fffbeb', color: s.Type === 'Merit' ? '#3b5bdb' : s.Type === 'Research' ? '#059669' : '#a16207' }}>
                              {s.Type}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">{scholarshipBadge(s.Status)}</td>
                          {isAdmin && (
                            <td className="px-5 py-3.5">
                              <button onClick={() => deleteScholarshipRow(s.ScholarshipID)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-red-500">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── New Invoice ── */}
      {tab === 'invoice' && isAdmin && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">Create Student Invoice</h3>
            <p className="text-muted-foreground text-sm mt-0.5">
              Submits to <code className="text-xs bg-muted px-1 rounded">POST /api/finance/payments</code>
            </p>
          </div>
          {invoiceError   && <ErrorBanner message={invoiceError} />}
          {invoiceSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 size={14} className="shrink-0" />{invoiceSuccess}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Student ID *</label>
              <input placeholder="STU-2024-4901"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.student_id}
                onChange={e => setInvoiceForm(f => ({ ...f, student_id: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Amount ($) *</label>
              <input type="number" min={0}
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.amount}
                onChange={e => setInvoiceForm(f => ({ ...f, amount: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Fee Type *</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.type}
                onChange={e => setInvoiceForm(f => ({ ...f, type: e.target.value }))}>
                {['Tuition','Hostel','Library','Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Semester *</label>
              <input placeholder="e.g. II or 2026-1"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.semester}
                onChange={e => setInvoiceForm(f => ({ ...f, semester: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Payment Method</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.method ?? ''}
                onChange={e => setInvoiceForm(f => ({ ...f, method: e.target.value }))}>
                <option value="">— Optional —</option>
                {['Bank Transfer','Online Portal','Cash','Card','Mobile Money'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Initial Status</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={invoiceForm.status ?? 'Pending'}
                onChange={e => setInvoiceForm(f => ({ ...f, status: e.target.value }))}>
                {['Pending','Paid','Overdue'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setInvoiceForm({ student_id:'', amount:0, type:'Tuition', semester:'', method:'', status:'Pending' })}
              disabled={invoiceSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Reset
            </button>
            <button onClick={submitInvoice} disabled={invoiceSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-colors"
              style={{ background: 'var(--primary)', opacity: invoiceSaving ? 0.7 : 1 }}>
              {invoiceSaving && <Loader2 size={14} className="animate-spin" />}
              {invoiceSaving ? 'Creating…' : 'Generate Invoice'}
            </button>
          </div>
        </div>
      )}

      {/* ── Award Scholarship ── */}
      {tab === 'add-scholarship' && isAdmin && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">Award Scholarship</h3>
            <p className="text-muted-foreground text-sm mt-0.5">
              Submits to <code className="text-xs bg-muted px-1 rounded">POST /api/finance/scholarships</code>
            </p>
          </div>
          {schFormError   && <ErrorBanner message={schFormError} />}
          {schFormSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm text-emerald-700" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 size={14} className="shrink-0" />{schFormSuccess}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Scholarship Name *</label>
              <input placeholder="e.g. Vice-Chancellor Merit Award"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={schForm.name}
                onChange={e => setSchForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Student ID *</label>
              <input placeholder="STU-2024-4901"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={schForm.student_id}
                onChange={e => setSchForm(f => ({ ...f, student_id: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Amount ($) *</label>
              <input type="number" min={0}
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={schForm.amount}
                onChange={e => setSchForm(f => ({ ...f, amount: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Type *</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={schForm.type}
                onChange={e => setSchForm(f => ({ ...f, type: e.target.value }))}>
                {['Merit','Need-Based','Research'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Status</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={schForm.status ?? 'Active'}
                onChange={e => setSchForm(f => ({ ...f, status: e.target.value }))}>
                {['Active','Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setSchForm({ name:'', student_id:'', amount:0, type:'Merit', status:'Active' })}
              disabled={schSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Reset
            </button>
            <button onClick={submitScholarship} disabled={schSaving}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2 transition-colors"
              style={{ background: 'var(--primary)', opacity: schSaving ? 0.7 : 1 }}>
              {schSaving && <Loader2 size={14} className="animate-spin" />}
              {schSaving ? 'Awarding…' : 'Award Scholarship'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
