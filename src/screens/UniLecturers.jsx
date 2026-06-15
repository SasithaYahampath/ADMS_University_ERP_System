import { useState } from 'react';
import {
  Search, Plus, Download, Eye, Edit2, X,
  Mail, Phone, BookOpen, Award, Star, BarChart3,
  ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const LECTURERS = [
  { id: 'LEC-001', name: 'Prof. Margaret Thompson', email: 'm.thompson@uni.edu', phone: '+1 555-1001', department: 'Computer Science', faculty: 'Engineering', specialization: 'AI & Machine Learning', rank: 'Professor', courses: 4, students: 380, rating: 4.8, publications: 42, status: 'Active', avatar: 'MT', joined: '2010-09-01' },
  { id: 'LEC-002', name: 'Dr. Kwame Asante', email: 'k.asante@uni.edu', phone: '+1 555-1002', department: 'Biochemistry', faculty: 'Medicine', specialization: 'Molecular Biology', rank: 'Associate Professor', courses: 3, students: 145, rating: 4.6, publications: 28, status: 'Active', avatar: 'KA', joined: '2015-01-15' },
  { id: 'LEC-003', name: 'Dr. Elena Novak', email: 'e.novak@uni.edu', phone: '+1 555-1003', department: 'Finance', faculty: 'Business', specialization: 'Corporate Finance', rank: 'Assistant Professor', courses: 5, students: 520, rating: 4.9, publications: 15, status: 'Active', avatar: 'EN', joined: '2018-09-03' },
  { id: 'LEC-004', name: 'Prof. Ibrahim Hassan', email: 'i.hassan@uni.edu', phone: '+1 555-1004', department: 'Physics', faculty: 'Sciences', specialization: 'Quantum Mechanics', rank: 'Professor', courses: 3, students: 210, rating: 4.5, publications: 67, status: 'On Leave', avatar: 'IH', joined: '2008-01-10' },
  { id: 'LEC-005', name: 'Dr. Sarah Chen', email: 's.chen@uni.edu', phone: '+1 555-1005', department: 'Civil Engineering', faculty: 'Engineering', specialization: 'Structural Engineering', rank: 'Lecturer', courses: 4, students: 290, rating: 4.7, publications: 12, status: 'Active', avatar: 'SC', joined: '2020-09-01' },
  { id: 'LEC-006', name: 'Prof. Antonio Rossi', email: 'a.rossi@uni.edu', phone: '+1 555-1006', department: 'Fine Arts', faculty: 'Arts', specialization: 'Modern Art Theory', rank: 'Professor', courses: 2, students: 95, rating: 4.3, publications: 23, status: 'Active', avatar: 'AR', joined: '2012-01-08' },
];

const ASSIGNMENTS = [
  { lecturer: 'Prof. Margaret Thompson', course: 'CS401 – Advanced Algorithms', code: 'CS401', students: 145, days: 'Mon, Wed', time: '09:00–11:00 AM', room: 'Lab A201' },
  { lecturer: 'Prof. Margaret Thompson', course: 'CS510 – Deep Learning', code: 'CS510', students: 62, days: 'Tue, Thu', time: '02:00–04:00 PM', room: 'Lab A203' },
  { lecturer: 'Dr. Elena Novak', course: 'FIN401 – Corporate Finance', code: 'FIN401', students: 212, days: 'Mon, Wed, Fri', time: '10:00–11:00 AM', room: 'Hall C' },
  { lecturer: 'Dr. Kwame Asante', course: 'BCH302 – Molecular Biology', code: 'BCH302', students: 88, days: 'Tue, Thu', time: '08:00–10:00 AM', room: 'Lab M102' },
  { lecturer: 'Dr. Sarah Chen', course: 'CEE301 – Structural Analysis', code: 'CEE301', students: 140, days: 'Wed, Fri', time: '01:00–03:00 PM', room: 'Hall E' },
];

const performanceRadar = [
  { subject: 'Teaching', A: 92 },
  { subject: 'Research', A: 88 },
  { subject: 'Attendance', A: 96 },
  { subject: 'Publication', A: 75 },
  { subject: 'Student Rating', A: 90 },
  { subject: 'Admin', A: 70 },
];

const avatarColors = ['#4361ee', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function rankBadge(rank) {
  const map = {
    'Professor': '#4361ee',
    'Associate Professor': '#8b5cf6',
    'Assistant Professor': '#06b6d4',
    'Lecturer': '#10b981',
  };
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase text-white shadow-sm"
      style={{ background: map[rank] ?? '#64748b' }}>
      {rank}
    </span>
  );
}

function statusBadge(status) {
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase"
      style={{
        background: status === 'Active' ? '#ecfdf5' : '#fffbeb',
        color: status === 'Active' ? '#10b981' : '#f59e0b',
      }}>
      {status}
    </span>
  );
}

export default function UniLecturers({ activeTab }) {
  const [search, setSearch] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [tab, setTab] = useState(activeTab === 'lecturers-assignments' ? 'assignments' : 'list');
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = LECTURERS.filter(l => {
    const q = search.toLowerCase();
    const matchQ = !q || l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.department.toLowerCase().includes(q);
    const matchF = !filterFaculty || l.faculty === filterFaculty;
    return matchQ && matchF;
  });

  const perPage = 5;
  const pages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-6 font-sans text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Lecturer Management</h1>
          <p className="text-gray-500 text-sm mt-1">{LECTURERS.length} active lecturers · {LECTURERS.reduce((a, l) => a + l.courses, 0)} course assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
            <Plus size={16} strokeWidth={2.5} /> Add Lecturer
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Lecturers', value: '342', icon: <Users size={20} />, color: '#4361ee', bg: '#eef2ff' },
          { label: 'Professors', value: '86', icon: <Award size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Avg Student Rating', value: '4.62', icon: <Star size={20} />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Publications', value: '1,840', icon: <BarChart3 size={20} />, color: '#10b981', bg: '#ecfdf5' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-gray-500 text-[13px] font-medium mb-0.5">{m.label}</div>
              <div className="text-gray-900 font-bold" style={{ fontSize: 24, lineHeight: 1 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-gray-50/80 border border-gray-100">
        {[{ id: 'list', label: 'All Lecturers' }, { id: 'assignments', label: 'Assignments' }, { id: 'analytics', label: 'Analytics' }].map(t => (
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

      {tab === 'list' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee]/50 transition-all">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input placeholder="Search by name, ID, or department…"
                className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterFaculty} onChange={e => { setFilterFaculty(e.target.value); setCurrentPage(1); }}>
              <option value="">All Faculties</option>
              {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Lecturer', 'Department', 'Rank', 'Courses', 'Students', 'Rating', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((l, i) => (
                    <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                            style={{ background: avatarColors[i % avatarColors.length] }}>
                            {l.avatar}
                          </div>
                          <div>
                            <div className="text-gray-900 text-[14px] font-bold leading-tight">{l.name}</div>
                            <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{l.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] text-gray-900 font-semibold leading-tight">{l.department}</div>
                        <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{l.faculty}</div>
                      </td>
                      <td className="px-6 py-4">{rankBadge(l.rank)}</td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{l.courses}</td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{l.students.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} fill="#f59e0b" className="text-amber-400" />
                          <span className="text-[14px] font-bold text-gray-900">{l.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{statusBadge(l.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelected(l)}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="text-[13px] font-medium text-gray-500">
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className="w-8 h-8 rounded-lg text-[13px] font-bold transition-colors"
                    style={{ background: p === currentPage ? '#4361ee' : 'transparent', color: p === currentPage ? '#fff' : '#64748b' }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(pages, p + 1))} disabled={currentPage === pages}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'assignments' && (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-gray-900 text-[16px] font-semibold">Teaching Assignments — Semester II, 2025–2026</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  {['Lecturer', 'Course', 'Students', 'Schedule', 'Venue'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ASSIGNMENTS.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[14px] font-semibold text-gray-900">{a.lecturer}</td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] text-gray-900 font-bold">{a.course}</div>
                      <div className="text-gray-500 font-mono mt-0.5" style={{ fontSize: 12 }}>{a.code}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{a.students}</td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] text-gray-900 font-medium">{a.days}</div>
                      <div className="text-gray-500 mt-0.5" style={{ fontSize: 13 }}>{a.time}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{a.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 text-[17px] font-semibold mb-6">Performance Radar — Prof. Margaret Thompson</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={performanceRadar}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                <Radar dataKey="A" stroke="#4361ee" strokeWidth={2} fill="#4361ee" fillOpacity={0.15} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 text-[17px] font-semibold mb-6">Lecturer Leaderboard</h3>
            <div className="space-y-4">
              {LECTURERS.sort((a, b) => b.rating - a.rating).map((l, i) => (
                <div key={l.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-6 text-center text-[13px] font-bold text-gray-400">{i + 1}</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                    style={{ background: avatarColors[i % avatarColors.length] }}>
                    {l.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] text-gray-900 font-bold truncate">{l.name}</div>
                    <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{l.department}</div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50">
                    <Star size={14} fill="#f59e0b" className="text-amber-400" />
                    <span className="text-[14px] font-bold text-amber-700">{l.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lecturer detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h3 className="text-gray-900 font-semibold text-[16px]">Lecturer Profile</h3>
              <button onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-sm"
                  style={{ background: '#4361ee' }}>
                  {selected.avatar}
                </div>
                <div>
                  <div className="text-gray-900 font-bold text-xl leading-tight">{selected.name}</div>
                  <div className="text-gray-500 text-[14px] mt-1 font-mono">{selected.id}</div>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    {rankBadge(selected.rank)}
                    {statusBadge(selected.status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Courses', value: selected.courses },
                  { label: 'Students', value: selected.students },
                  { label: 'Publications', value: selected.publications },
                  { label: 'Rating', value: `${selected.rating} / 5.0` },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl p-5 text-center bg-gray-50 border border-gray-100">
                    <div className="text-gray-900 font-bold text-2xl">{s.value}</div>
                    <div className="text-gray-500 text-[13px] font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3.5">
                {[
                  { icon: <Mail size={16} />, label: 'Email', value: selected.email },
                  { icon: <Phone size={16} />, label: 'Phone', value: selected.phone },
                  { icon: <BookOpen size={16} />, label: 'Specialization', value: selected.specialization },
                  { icon: <Award size={16} />, label: 'Faculty', value: selected.faculty },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3.5 p-4 rounded-[16px] bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-gray-500 text-[12px] font-medium uppercase tracking-wider">{item.label}</div>
                      <div className="text-gray-900 text-[14px] font-semibold mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}