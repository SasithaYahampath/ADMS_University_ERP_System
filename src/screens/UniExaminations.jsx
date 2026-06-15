import { useState } from 'react';
import {
  Search, Plus, Calendar, Clock, MapPin,
  Users, CheckCircle2, AlertTriangle, FileText, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const EXAMS = [
  { id: 'EX-2026-001', course: 'Advanced Algorithms', code: 'CS401', date: '2026-06-18', time: '09:00 AM', duration: '3 hrs', hall: 'Hall A', capacity: 200, enrolled: 145, invigilator: 'Dr. Aisha Bello', faculty: 'Engineering', status: 'Scheduled' },
  { id: 'EX-2026-002', course: 'Organic Chemistry', code: 'CHM302', date: '2026-06-19', time: '02:00 PM', duration: '2.5 hrs', hall: 'Hall B', capacity: 150, enrolled: 98, invigilator: 'Prof. Samuel Kwesi', faculty: 'Sciences', status: 'Scheduled' },
  { id: 'EX-2026-003', course: 'Corporate Finance', code: 'FIN401', date: '2026-06-20', time: '10:00 AM', duration: '3 hrs', hall: 'Hall C', capacity: 250, enrolled: 212, invigilator: 'Dr. Elena Novak', faculty: 'Business', status: 'Scheduled' },
  { id: 'EX-2026-004', course: 'Medical Ethics', code: 'MED205', date: '2026-06-21', time: '09:00 AM', duration: '2 hrs', hall: 'Hall D', capacity: 100, enrolled: 67, invigilator: 'Dr. Priya Sharma', faculty: 'Medicine', status: 'Scheduled' },
  { id: 'EX-2026-005', course: 'Constitutional Law', code: 'LAW302', date: '2026-06-23', time: '11:00 AM', duration: '3 hrs', hall: 'Moot Court', capacity: 80, enrolled: 74, invigilator: 'Prof. Diana Osei', faculty: 'Law', status: 'Scheduled' },
  { id: 'EX-2026-006', course: 'Calculus II', code: 'MATH202', date: '2026-05-28', time: '09:00 AM', duration: '3 hrs', hall: 'Hall A', capacity: 200, enrolled: 188, invigilator: 'Dr. Nkechi Eze', faculty: 'Sciences', status: 'Completed' },
  { id: 'EX-2026-007', course: 'Database Systems', code: 'CS302', date: '2026-05-30', time: '02:00 PM', duration: '2.5 hrs', hall: 'Lab A201', capacity: 120, enrolled: 114, invigilator: 'Prof. Margaret Thompson', faculty: 'Engineering', status: 'Completed' },
];

const RESULTS = [
  { student: 'Amelia Richardson', id: 'STU-2024-4901', course: 'CS302', score: 87, grade: 'A', gpa: 4.0 },
  { student: 'Marcus Johnson', id: 'STU-2024-4906', course: 'CS302', score: 74, grade: 'B+', gpa: 3.3 },
  { student: 'Yuki Tanaka', id: 'STU-2024-4907', course: 'CS302', score: 91, grade: 'A+', gpa: 4.0 },
  { student: 'Chen Wei', id: 'STU-2024-4904', course: 'CS302', score: 82, grade: 'A-', gpa: 3.7 },
  { student: 'Sofia Marchetti', id: 'STU-2024-4903', course: 'CS302', score: 68, grade: 'B', gpa: 3.0 },
];

const HALLS = [
  { name: 'Hall A', capacity: 200, location: 'Main Block, Ground Floor', facilities: ['Air conditioning', 'CCTV', 'Digital clock'] },
  { name: 'Hall B', capacity: 150, location: 'Sciences Block, Floor 1', facilities: ['Air conditioning', 'CCTV'] },
  { name: 'Hall C', capacity: 250, location: 'Main Block, Floor 2', facilities: ['Air conditioning', 'CCTV', 'Digital clock', 'Projector'] },
  { name: 'Hall D', capacity: 100, location: 'Medicine Block, Ground Floor', facilities: ['Air conditioning'] },
  { name: 'Moot Court', capacity: 80, location: 'Law Block', facilities: ['Air conditioning', 'CCTV', 'Recording system'] },
  { name: 'Lab A201', capacity: 120, location: 'Engineering Block, Floor 2', facilities: ['Computer stations', 'Air conditioning'] },
];

function statusBadge(status) {
  const map = {
    Scheduled: { bg: '#eef2ff', text: '#4361ee' },
    Completed: { bg: '#ecfdf5', text: '#10b981' },
    Cancelled: { bg: '#fef2f2', text: '#ef4444' },
    Postponed: { bg: '#fffbeb', text: '#f59e0b' },
  };
  const c = map[status] ?? { bg: '#f8f9fc', text: '#64748b' };
  return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase" style={{ background: c.bg, color: c.text }}>{status}</span>;
}

function gradeBadge(grade) {
  const isA = grade.startsWith('A');
  const isB = grade.startsWith('B');
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase"
      style={{ background: isA ? '#ecfdf5' : isB ? '#eef2ff' : '#fffbeb', color: isA ? '#10b981' : isB ? '#4361ee' : '#f59e0b' }}>
      {grade}
    </span>
  );
}

export default function UniExaminations() {
  const [tab, setTab] = useState('schedule');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = EXAMS.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.course.toLowerCase().includes(q) || e.code.toLowerCase().includes(q);
    const matchS = !filterStatus || e.status === filterStatus;
    return matchQ && matchS;
  });

  const upcoming = EXAMS.filter(e => e.status === 'Scheduled').length;
  const completed = EXAMS.filter(e => e.status === 'Completed').length;

  return (
    <div className="space-y-6 font-sans text-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Examination Management</h1>
          <p className="text-gray-500 text-sm mt-1">Final Examination — Semester II, 2025–2026</p>
        </div>
        <button onClick={() => setTab('create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
          <Plus size={16} strokeWidth={2.5} /> Schedule Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Exams', value: EXAMS.length, icon: <FileText size={20} />, color: '#4361ee', bg: '#eef2ff' },
          { label: 'Upcoming', value: upcoming, icon: <Calendar size={20} />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Completed', value: completed, icon: <CheckCircle2 size={20} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Total Seats', value: EXAMS.filter(e => e.status === 'Scheduled').reduce((a, e) => a + e.enrolled, 0).toLocaleString(), icon: <Users size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
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
        {[
          { id: 'schedule', label: 'Exam Schedule' },
          { id: 'halls', label: 'Hall Allocation' },
          { id: 'results', label: 'Results' },
          { id: 'create', label: 'Schedule Exam' },
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

      {tab === 'schedule' && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee]/50 transition-all">
              <Search size={18} className="text-gray-400" />
              <input placeholder="Search exams by course or code…"
                className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Scheduled', 'Completed', 'Cancelled', 'Postponed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Course', 'Date & Time', 'Duration', 'Hall', 'Enrolled', 'Invigilator', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-gray-900 text-[14px] font-semibold">{e.course}</div>
                        <div className="text-gray-500 font-mono mt-0.5" style={{ fontSize: 12 }}>{e.code}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 text-[14px] font-medium">{e.date}</div>
                        <div className="text-gray-500 mt-0.5" style={{ fontSize: 13 }}>{e.time}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{e.duration}</td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{e.hall}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden bg-gray-100">
                            <div className="h-full rounded-full bg-[#4361ee]" style={{ width: `${(e.enrolled / e.capacity) * 100}%` }} />
                          </div>
                          <span className="text-[13px] font-medium text-gray-500">{e.enrolled}/{e.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{e.invigilator}</td>
                      <td className="px-6 py-4">{statusBadge(e.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'halls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {HALLS.map(hall => {
            const exam = EXAMS.find(e => e.hall === hall.name && e.status === 'Scheduled');
            const occupied = !!exam;
            return (
              <div key={hall.name} className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-[16px]">{hall.name}</h3>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${occupied ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                    {occupied ? 'In Use' : 'Available'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-5 flex-1">
                  <div className="flex items-center gap-2.5 text-[13px] font-medium text-gray-500">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{hall.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] font-medium text-gray-500">
                    <Users size={16} className="text-gray-400" />
                    <span>Capacity: {hall.capacity} seats</span>
                  </div>
                </div>

                {exam && (
                  <div className="p-4 rounded-xl mb-5 bg-gray-50 border border-gray-100">
                    <div className="text-[11px] font-bold tracking-wide uppercase text-gray-500">Scheduled Exam</div>
                    <div className="text-[14px] text-gray-900 font-semibold mt-1 leading-tight">{exam.course}</div>
                    <div className="text-[13px] font-medium text-gray-500 mt-1">{exam.date} · {exam.time}</div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {hall.facilities.map(f => (
                    <span key={f} className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-[#4361ee]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'results' && (
        <div className="space-y-5">
          <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 p-4 rounded-xl mb-5 bg-amber-50 border border-amber-100/50">
              <AlertTriangle size={18} className="text-[#f59e0b] shrink-0" />
              <p className="text-amber-800 text-[14px] font-medium">
                Showing results for <strong className="font-bold">CS302 – Database Systems</strong> (completed May 30, 2026)
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Student', 'Student ID', 'Course', 'Score', 'Grade', 'GPA Points'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {RESULTS.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-[14px] font-semibold text-gray-900">{r.student}</td>
                      <td className="px-6 py-4 text-[13px] font-mono text-gray-500">{r.id}</td>
                      <td className="px-6 py-4 text-[14px] font-medium text-gray-600">{r.course}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden bg-gray-100">
                            <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.score >= 85 ? '#10b981' : r.score >= 70 ? '#4361ee' : '#f59e0b' }} />
                          </div>
                          <span className="text-[14px] text-gray-900 font-bold">{r.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{gradeBadge(r.grade)}</td>
                      <td className="px-6 py-4 text-[14px] font-bold text-gray-900">{r.gpa.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-white rounded-[20px] border border-gray-100 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-gray-900 text-lg font-semibold">Schedule New Examination</h3>
            <p className="text-gray-500 text-[14px] mt-1">Allocate a hall and set the examination timetable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Course</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                <option value="">Select course</option>
                {['CS401 – Advanced Algorithms', 'FIN401 – Corporate Finance', 'BCH302 – Molecular Biology'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Date</label>
              <input type="date" className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Start Time</label>
              <input type="time" className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Duration</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                {['1 hr', '1.5 hrs', '2 hrs', '2.5 hrs', '3 hrs'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Hall</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                {HALLS.map(h => <option key={h.name}>{h.name} (cap. {h.capacity})</option>)}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Invigilator</label>
              <input placeholder="e.g. Prof. Margaret Thompson"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Cancel
            </button>
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-colors shadow-sm bg-[#4361ee] hover:bg-[#3651cc]">
              Schedule Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}