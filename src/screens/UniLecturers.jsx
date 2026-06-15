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

const avatarColors = ['#3b5bdb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function rankBadge(rank) {
  const map = {
    'Professor': '#3b5bdb',
    'Associate Professor': '#818cf8',
    'Assistant Professor': '#06b6d4',
    'Lecturer': '#10b981',
  };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ background: map[rank] ?? '#64748b' }}>
      {rank}
    </span>
  );
}

function statusBadge(status) {
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: status === 'Active' ? '#dcfce7' : '#fef9c3',
        color: status === 'Active' ? '#15803d' : '#a16207',
      }}>
      {status}
    </span>
  );
}

export function UniLecturers({ activeTab }) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Lecturer Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{LECTURERS.length} active lecturers · {LECTURERS.reduce((a, l) => a + l.courses, 0)} course assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <Download size={15} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Add Lecturer
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Lecturers', value: '342', icon: <Users size={18} />, color: '#3b5bdb', bg: '#eef2ff' },
          { label: 'Professors', value: '86', icon: <Award size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Avg Student Rating', value: '4.62', icon: <Star size={18} />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Total Publications', value: '1,840', icon: <BarChart3 size={18} />, color: '#10b981', bg: '#ecfdf5' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 18 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[{ id: 'list', label: 'All Lecturers' }, { id: 'assignments', label: 'Assignments' }, { id: 'analytics', label: 'Analytics' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
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

      {tab === 'list' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground" />
              <input placeholder="Search by name, ID, or department…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterFaculty} onChange={e => { setFilterFaculty(e.target.value); setCurrentPage(1); }}>
              <option value="">All Faculties</option>
              {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Lecturer', 'Department', 'Rank', 'Courses', 'Students', 'Rating', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((l, i) => (
                    <tr key={l.id} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: avatarColors[i % avatarColors.length] }}>
                            {l.avatar}
                          </div>
                          <div>
                            <div className="text-foreground text-sm font-medium">{l.name}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm text-foreground">{l.department}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.faculty}</div>
                      </td>
                      <td className="px-5 py-3.5">{rankBadge(l.rank)}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{l.courses}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{l.students.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Star size={12} fill="#f59e0b" className="text-amber-400" />
                          <span className="text-sm font-semibold text-foreground">{l.rating}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{statusBadge(l.status)}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setSelected(l)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{ background: p === currentPage ? 'var(--primary)' : 'transparent', color: p === currentPage ? '#fff' : 'var(--muted-foreground)' }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(pages, p + 1))} disabled={currentPage === pages}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'assignments' && (
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">Teaching Assignments — Semester II, 2025–2026</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--muted)' }}>
                  {['Lecturer', 'Course', 'Students', 'Schedule', 'Venue'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ASSIGNMENTS.map((a, i) => (
                  <tr key={i} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3.5 text-sm text-foreground">{a.lecturer}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-foreground font-medium">{a.course}</div>
                      <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{a.code}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{a.students}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-foreground">{a.days}</div>
                      <div className="text-muted-foreground" style={{ fontSize: 11 }}>{a.time}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{a.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base mb-4">Performance Radar — Prof. Margaret Thompson</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={performanceRadar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <Radar dataKey="A" stroke="#3b5bdb" fill="#3b5bdb" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base mb-4">Lecturer Leaderboard</h3>
            <div className="space-y-3">
              {LECTURERS.sort((a, b) => b.rating - a.rating).map((l, i) => (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-bold text-muted-foreground">{i + 1}</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: avatarColors[i % avatarColors.length] }}>
                    {l.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground font-medium truncate">{l.name}</div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{l.department}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#f59e0b" className="text-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{l.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lecturer detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground">Lecturer Profile</h3>
              <button onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'var(--primary)' }}>
                  {selected.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{selected.name}</div>
                  <div className="text-muted-foreground text-sm">{selected.id}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {rankBadge(selected.rank)}
                    {statusBadge(selected.status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Courses', value: selected.courses },
                  { label: 'Students', value: selected.students },
                  { label: 'Publications', value: selected.publications },
                  { label: 'Rating', value: `${selected.rating} / 5.0` },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'var(--muted)' }}>
                    <div className="text-foreground font-bold" style={{ fontSize: 22 }}>{s.value}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              {[
                { icon: <Mail size={15} />, label: 'Email', value: selected.email },
                { icon: <Phone size={15} />, label: 'Phone', value: selected.phone },
                { icon: <BookOpen size={15} />, label: 'Specialization', value: selected.specialization },
                { icon: <Award size={15} />, label: 'Faculty', value: selected.faculty },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <span className="text-muted-foreground mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-muted-foreground" style={{ fontSize: 11 }}>{item.label}</div>
                    <div className="text-foreground text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default UniLecturers;