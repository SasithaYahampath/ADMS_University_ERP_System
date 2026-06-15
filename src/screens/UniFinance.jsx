import { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Search, Plus, Download, Filter, CheckCircle2, Clock, XCircle,
  ArrowUpRight, BarChart3, Award
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

const MONTHLY_REVENUE = [
  { month: 'Jan', tuition: 980000, hostel: 120000, library: 18000, other: 45000 },
  { month: 'Feb', tuition: 950000, hostel: 118000, library: 16000, other: 42000 },
  { month: 'Mar', tuition: 1020000, hostel: 125000, library: 19000, other: 48000 },
  { month: 'Apr', tuition: 890000, hostel: 115000, library: 15000, other: 40000 },
  { month: 'May', tuition: 1100000, hostel: 132000, library: 21000, other: 52000 },
  { month: 'Jun', tuition: 1050000, hostel: 128000, library: 20000, other: 50000 },
];

const PAYMENTS = [
  { id: 'PAY-2026-0501', student: 'Amelia Richardson', id_no: 'STU-2024-4901', amount: 4800, type: 'Tuition', semester: 'II', date: '2026-06-01', method: 'Bank Transfer', status: 'Paid' },
  { id: 'PAY-2026-0502', student: 'James Okonkwo', id_no: 'STU-2024-4902', amount: 4800, type: 'Tuition', semester: 'II', date: '2026-06-03', method: 'Online Portal', status: 'Paid' },
  { id: 'PAY-2026-0503', student: 'Sofia Marchetti', id_no: 'STU-2024-4903', amount: 6200, type: 'Tuition', semester: 'II', date: '2026-06-05', method: 'Bank Transfer', status: 'Paid' },
  { id: 'PAY-2026-0504', student: 'Chen Wei', id_no: 'STU-2024-4904', amount: 1200, type: 'Hostel', semester: 'II', date: '2026-06-07', method: 'Cash', status: 'Paid' },
  { id: 'PAY-2026-0505', student: 'Fatima Al-Rashid', id_no: 'STU-2024-4905', amount: 4800, type: 'Tuition', semester: 'II', date: '—', method: '—', status: 'Pending' },
  { id: 'PAY-2026-0506', student: 'Marcus Johnson', id_no: 'STU-2024-4906', amount: 4800, type: 'Tuition', semester: 'II', date: '—', method: '—', status: 'Overdue' },
  { id: 'PAY-2026-0507', student: 'Yuki Tanaka', id_no: 'STU-2024-4907', amount: 4800, type: 'Tuition', semester: 'II', date: '2026-06-10', method: 'Online Portal', status: 'Paid' },
  { id: 'PAY-2026-0508', student: 'David Mensah', id_no: 'STU-2024-4908', amount: 4800, type: 'Tuition', semester: 'II', date: '—', method: '—', status: 'Pending' },
];

const SCHOLARSHIPS = [
  { name: 'Vice-Chancellor Merit Award', recipient: 'Amelia Richardson', amount: 2400, type: 'Merit', status: 'Active', gpa: 3.85, faculty: 'Engineering' },
  { name: 'STEM Excellence Scholarship', recipient: 'Yuki Tanaka', amount: 3000, type: 'Merit', status: 'Active', gpa: 3.78, faculty: 'Arts' },
  { name: 'Need-Based Bursary', recipient: 'David Mensah', amount: 1800, type: 'Need-Based', status: 'Active', gpa: 3.20, faculty: 'Sciences' },
  { name: 'Faculty Research Grant', recipient: 'Chen Wei', amount: 5000, type: 'Research', status: 'Active', gpa: 3.74, faculty: 'Sciences' },
];

const revenueByCategory = [
  { name: 'Tuition Fees', value: 9800000, color: '#3b5bdb', pct: '79%' },
  { name: 'Hostel Fees', value: 1280000, color: '#818cf8', pct: '10%' },
  { name: 'Library Fees', value: 380000, color: '#06b6d4', pct: '3%' },
  { name: 'Other Income', value: 940000, color: '#10b981', pct: '8%' },
];

function statusBadge(status) {
  const map = {
    Paid: { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle2 size={11} /> },
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

function fmt(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function UniFinance() {
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = PAYMENTS.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.student.toLowerCase().includes(q) || p.id_no.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchS = !filterStatus || p.status === filterStatus;
    return matchQ && matchS;
  });

  const totalRevenue = MONTHLY_REVENUE.reduce((a, m) => a + m.tuition + m.hostel + m.library + m.other, 0);
  const pendingFees = PAYMENTS.filter(p => p.status !== 'Paid').reduce((a, p) => a + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Finance & Payments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025–2026 · Financial Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <Download size={15} /> Export Report
          </button>
          <button onClick={() => setTab('invoice')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> New Invoice
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), delta: '+8.2%', positive: true, icon: <DollarSign size={20} />, color: '#3b5bdb', bg: '#eef2ff' },
          { label: 'Collected This Month', value: '$1.26M', delta: '+5.4%', positive: true, icon: <TrendingUp size={20} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Pending / Overdue', value: fmt(pendingFees), delta: '+2.1%', positive: false, icon: <TrendingDown size={20} />, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Scholarships Awarded', value: '$840K', delta: '+18.6%', positive: true, icon: <Award size={20} />, color: '#f59e0b', bg: '#fffbeb' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl" style={{ background: m.bg }}>
                <span style={{ color: m.color }}>{m.icon}</span>
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${m.positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                <ArrowUpRight size={11} />
                {m.delta}
              </span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground mt-0.5 font-semibold" style={{ fontSize: 22 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[
          { id: 'dashboard', label: 'Revenue Dashboard' },
          { id: 'payments', label: 'Payments' },
          { id: 'scholarships', label: 'Scholarships' },
          { id: 'invoice', label: 'New Invoice' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id )}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color: tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base mb-1">Monthly Revenue Trend</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Jan – Jun 2026 (all sources)</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_REVENUE}>
                  <defs>
                    {[
                      { id: 'tuitionGrad', color: '#3b5bdb' },
                      { id: 'hostelGrad', color: '#818cf8' },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={g.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="tuition" name="Tuition" stroke="#3b5bdb" strokeWidth={2} fill="url(#tuitionGrad)" dot={false} />
                  <Area type="monotone" dataKey="hostel" name="Hostel" stroke="#818cf8" strokeWidth={2} fill="url(#hostelGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue breakdown */}
            <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base mb-4">Revenue by Category</h3>
              <div className="space-y-3">
                {revenueByCategory.map(r => (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{r.name}</span>
                      <span className="text-foreground font-medium">{r.pct}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                      <div className="h-full rounded-full" style={{ width: r.pct, background: r.color }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{fmt(r.value)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total (YTD)</span>
                  <span className="text-foreground font-bold" style={{ fontSize: 18 }}>{fmt(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base mb-1">Revenue Breakdown by Month</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Stacked by income type</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_REVENUE} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="tuition" name="Tuition" stackId="a" fill="#3b5bdb" />
                <Bar dataKey="hostel" name="Hostel" stackId="a" fill="#818cf8" />
                <Bar dataKey="library" name="Library" stackId="a" fill="#06b6d4" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment status summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Fully Paid', count: PAYMENTS.filter(p => p.status === 'Paid').length, color: '#10b981', bg: '#dcfce7', icon: <CheckCircle2 size={18} /> },
              { label: 'Pending', count: PAYMENTS.filter(p => p.status === 'Pending').length, color: '#f59e0b', bg: '#fef9c3', icon: <Clock size={18} /> },
              { label: 'Overdue', count: PAYMENTS.filter(p => p.status === 'Overdue').length, color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={18} /> },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl border p-5 shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
                <div className="p-2.5 rounded-xl" style={{ background: s.bg }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">{s.label}</div>
                  <div className="text-foreground font-bold mt-0.5" style={{ fontSize: 24 }}>{s.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground" />
              <input placeholder="Search by student name, ID, or payment ID…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Paid', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Payment ID', 'Student', 'Type', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{p.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-foreground text-sm font-medium">{p.student}</div>
                        <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{p.id_no}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.type}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">${p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.date}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{p.method}</td>
                      <td className="px-5 py-3.5">{statusBadge(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'scholarships' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Scholarships', value: SCHOLARSHIPS.length, color: '#3b5bdb', bg: '#eef2ff' },
              { label: 'Total Awarded', value: `$${SCHOLARSHIPS.reduce((a, s) => a + s.amount, 0).toLocaleString()}`, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Merit-Based', value: SCHOLARSHIPS.filter(s => s.type === 'Merit').length, color: '#8b5cf6', bg: '#f5f3ff' },
              { label: 'Need-Based', value: SCHOLARSHIPS.filter(s => s.type === 'Need-Based').length, color: '#f59e0b', bg: '#fffbeb' },
            ].map(m => (
              <div key={m.label} className="bg-card rounded-2xl p-4 border shadow-sm text-center" style={{ borderColor: 'var(--border)' }}>
                <div className="text-foreground font-bold mb-1" style={{ fontSize: 22, color: m.color }}>{m.value}</div>
                <div className="text-muted-foreground text-xs">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Scholarship', 'Recipient', 'Faculty', 'Amount', 'Type', 'GPA', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHOLARSHIPS.map((s, i) => (
                    <tr key={i} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Award size={14} style={{ color: 'var(--primary)' }} />
                          <span className="text-foreground text-sm font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{s.recipient}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{s.faculty}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">${s.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: s.type === 'Merit' ? '#eef2ff' : s.type === 'Research' ? '#ecfdf5' : '#fffbeb', color: s.type === 'Merit' ? '#3b5bdb' : s.type === 'Research' ? '#059669' : '#a16207' }}>
                          {s.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: '#10b981' }}>{s.gpa.toFixed(2)}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-700 bg-emerald-50">{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'invoice' && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">Generate Student Invoice</h3>
            <p className="text-muted-foreground text-sm mt-0.5">Create and send a fee invoice to a student.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Student</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                <option value="">Select student</option>
                {PAYMENTS.map(p => <option key={p.id_no} value={p.id_no}>{p.student} ({p.id_no})</option>)}
              </select>
            </div>
            {[
              { label: 'Invoice Date', type: 'date' },
              { label: 'Due Date', type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-sm text-foreground block mb-1.5">{f.label}</label>
                <input type={f.type}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
              </div>
            ))}
            <div>
              <label className="text-sm text-foreground block mb-1.5">Fee Type</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                {['Tuition', 'Hostel', 'Library', 'Examination', 'Late Registration'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Amount ($)</label>
              <input type="number" placeholder="0.00"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Notes</label>
              <textarea rows={3} placeholder="Additional notes for the student…"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Preview Invoice
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)' }}>
              Generate & Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default UniFinance;