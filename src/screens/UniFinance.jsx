import { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Search, Plus, Download, Filter, CheckCircle2, Clock, XCircle,
  ArrowUpRight, ArrowDownRight, BarChart3, Award
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
  { name: 'Tuition Fees', value: 9800000, color: '#4361ee', pct: '79%' },
  { name: 'Hostel Fees', value: 1280000, color: '#e2e8f0', pct: '10%' },
  { name: 'Library Fees', value: 380000, color: '#e2e8f0', pct: '3%' },
  { name: 'Other Income', value: 940000, color: '#e2e8f0', pct: '8%' },
];

function statusBadge(status) {
  const map = {
    Paid: { bg: '#dcfce7', text: '#15803d', icon: <CheckCircle2 size={12} strokeWidth={2.5} /> },
    Pending: { bg: '#fef9c3', text: '#a16207', icon: <Clock size={12} strokeWidth={2.5} /> },
    Overdue: { bg: '#fee2e2', text: '#b91c1c', icon: <XCircle size={12} strokeWidth={2.5} /> },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b', icon: null };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase"
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

export default function UniFinance() {
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
    <div className="space-y-6 font-sans text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Finance & Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Academic Year 2025–2026 · Financial Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} /> Export Report
          </button>
          <button onClick={() => setTab('invoice')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
            <Plus size={16} strokeWidth={2.5} /> New Invoice
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), delta: '+8.2%', positive: true, icon: <DollarSign size={22} />, color: '#4361ee', bg: '#eef2ff' },
          { label: 'Collected This Month', value: '$1.26M', delta: '+5.4%', positive: true, icon: <TrendingUp size={22} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Pending / Overdue', value: fmt(pendingFees), delta: '+2.1%', positive: false, icon: <TrendingDown size={22} />, color: '#ef4444', bg: '#fef2f2' },
          { label: 'Scholarships Awarded', value: '$840K', delta: '+18.6%', positive: true, icon: <Award size={22} />, color: '#f59e0b', bg: '#fffbeb' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: m.bg }}>
                <span style={{ color: m.color }}>{m.icon}</span>
              </div>
              <span className={`flex items-center gap-0.5 text-[12px] font-semibold px-2.5 py-1 rounded-md ${m.positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                {m.positive ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
                {m.delta}
              </span>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] font-medium mb-1">{m.label}</div>
              <div className="text-gray-900 font-bold" style={{ fontSize: 28, lineHeight: 1 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-gray-50/80 border border-gray-100">
        {[
          { id: 'dashboard', label: 'Revenue Dashboard' },
          { id: 'payments', label: 'Payments' },
          { id: 'scholarships', label: 'Scholarships' },
          { id: 'invoice', label: 'New Invoice' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-5 py-2 rounded-xl text-[14px] font-medium transition-all"
            style={{
              background: tab === t.id ? '#ffffff' : 'transparent',
              color: tab === t.id ? '#111827' : '#64748b',
              boxShadow: tab === t.id ? '0 2px 5px rgba(0,0,0,0.04)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Area chart */}
            <div className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
              <h3 className="text-gray-900 text-[17px] font-semibold mb-0.5">Monthly Revenue Trend</h3>
              <p className="text-gray-500 mb-6 text-[13px]">Jan – Jun 2026 (all sources)</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    {[
                      { id: 'tuitionGrad', color: '#4361ee' },
                      { id: 'hostelGrad', color: '#818cf8' },
                    ].map(g => (
                      <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={g.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={g.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={true} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, paddingTop: '20px', color: '#64748b' }} />
                  <Area type="monotone" dataKey="tuition" name="Tuition" stroke="#4361ee" strokeWidth={2.5} fill="url(#tuitionGrad)" dot={false} activeDot={{ r: 6, fill: '#4361ee', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="hostel" name="Hostel" stroke="#818cf8" strokeWidth={2.5} fill="transparent" dot={false} activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue breakdown */}
            <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm flex flex-col">
              <h3 className="text-gray-900 text-[17px] font-semibold mb-6">Revenue by Category</h3>
              <div className="space-y-5 flex-1">
                {revenueByCategory.map(r => (
                  <div key={r.name}>
                    <div className="flex justify-between text-[13px] mb-2">
                      <span className="text-gray-600 font-medium">{r.name}</span>
                      <span className="text-gray-900 font-semibold">{r.pct}</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden bg-gray-100">
                      <div className="h-full rounded-full" style={{ width: r.pct, background: r.color }} />
                    </div>
                    <div className="text-[13px] text-gray-500 mt-1.5">{fmt(r.value)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex justify-between items-end">
                  <span className="text-[14px] text-gray-500 font-medium mb-1">Total (YTD)</span>
                  <span className="text-gray-900 font-bold" style={{ fontSize: 24 }}>{fmt(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 text-[17px] font-semibold mb-0.5">Revenue Breakdown by Month</h3>
            <p className="text-gray-500 mb-6 text-[13px]">Stacked by income type</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MONTHLY_REVENUE} barSize={36} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: '#f8f9fc' }} formatter={(v) => [`$${v.toLocaleString()}`, '']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, paddingTop: '20px', color: '#64748b' }} />
                <Bar dataKey="tuition" name="Tuition" stackId="a" fill="#4361ee" />
                <Bar dataKey="hostel" name="Hostel" stackId="a" fill="#818cf8" />
                <Bar dataKey="library" name="Library" stackId="a" fill="#06b6d4" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment status summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Fully Paid', count: PAYMENTS.filter(p => p.status === 'Paid').length, color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={20} /> },
              { label: 'Pending', count: PAYMENTS.filter(p => p.status === 'Pending').length, color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={20} /> },
              { label: 'Overdue', count: PAYMENTS.filter(p => p.status === 'Overdue').length, color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={20} /> },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-[16px] border border-gray-100 p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: s.bg }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div>
                  <div className="text-gray-500 text-[13px] font-medium mb-0.5">{s.label}</div>
                  <div className="text-gray-900 font-bold" style={{ fontSize: 24, lineHeight: 1 }}>{s.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee]/50 transition-all">
              <Search size={18} className="text-gray-400" />
              <input placeholder="Search by student name, ID, or payment ID…"
                className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Paid', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Payment ID', 'Student', 'Type', 'Amount', 'Date', 'Method', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[13px] font-mono text-gray-500">{p.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 text-[14px] font-semibold">{p.student}</div>
                        <div className="text-gray-500 font-mono mt-0.5" style={{ fontSize: 12 }}>{p.id_no}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{p.type}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-gray-900">${p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{p.date}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-600">{p.method}</td>
                      <td className="px-6 py-4">{statusBadge(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'scholarships' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'Active Scholarships', value: SCHOLARSHIPS.length, color: '#4361ee', bg: '#eef2ff' },
              { label: 'Total Awarded', value: `$${SCHOLARSHIPS.reduce((a, s) => a + s.amount, 0).toLocaleString()}`, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Merit-Based', value: SCHOLARSHIPS.filter(s => s.type === 'Merit').length, color: '#8b5cf6', bg: '#f5f3ff' },
              { label: 'Need-Based', value: SCHOLARSHIPS.filter(s => s.type === 'Need-Based').length, color: '#f59e0b', bg: '#fffbeb' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm text-center flex flex-col justify-center">
                <div className="font-bold mb-1.5" style={{ fontSize: 26, color: m.color }}>{m.value}</div>
                <div className="text-gray-500 text-[13px] font-medium">{m.label}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Scholarship', 'Recipient', 'Faculty', 'Amount', 'Type', 'GPA', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {SCHOLARSHIPS.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Award size={16} className="text-[#4361ee]" />
                          </div>
                          <span className="text-gray-900 text-[14px] font-semibold">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-700 font-medium">{s.recipient}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500">{s.faculty}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-gray-900">${s.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase"
                          style={{ background: s.type === 'Merit' ? '#eef2ff' : s.type === 'Research' ? '#ecfdf5' : '#fffbeb', color: s.type === 'Merit' ? '#4361ee' : s.type === 'Research' ? '#10b981' : '#d97706' }}>
                          {s.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-[#10b981]">{s.gpa.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50">{s.status}</span>
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
        <div className="bg-white rounded-[20px] border border-gray-100 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-gray-900 text-lg font-semibold">Generate Student Invoice</h3>
            <p className="text-gray-500 text-[14px] mt-1">Create and send a fee invoice to a student account.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Student</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                <option value="">Select student</option>
                {PAYMENTS.map(p => <option key={p.id_no} value={p.id_no}>{p.student} ({p.id_no})</option>)}
              </select>
            </div>
            
            {[
              { label: 'Invoice Date', type: 'date' },
              { label: 'Due Date', type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[13px] font-semibold text-gray-700 block mb-2">{f.label}</label>
                <input type={f.type}
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
              </div>
            ))}
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Fee Type</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                {['Tuition', 'Hostel', 'Library', 'Examination', 'Late Registration'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Amount ($)</label>
              <input type="number" placeholder="0.00"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Notes</label>
              <textarea rows={4} placeholder="Additional notes for the student…"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm resize-none" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Preview Invoice
            </button>
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-colors shadow-sm bg-[#4361ee] hover:bg-[#3651cc]">
              Generate & Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}