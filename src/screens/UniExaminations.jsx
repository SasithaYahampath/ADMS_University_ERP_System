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
  const map= {
    Scheduled: { bg: '#dbeafe', text: '#1d4ed8' },
    Completed: { bg: '#dcfce7', text: '#15803d' },
    Cancelled: { bg: '#fee2e2', text: '#b91c1c' },
    Postponed: { bg: '#fef9c3', text: '#a16207' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>{status}</span>;
}

function gradeBadge(grade) {
  const isA = grade.startsWith('A');
  const isB = grade.startsWith('B');
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: isA ? '#dcfce7' : isB ? '#dbeafe' : '#fef9c3', color: isA ? '#15803d' : isB ? '#1d4ed8' : '#a16207' }}>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Examination Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Final Examination — Semester II, 2025–2026</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: 'var(--primary)' }}>
          <Plus size={15} /> Schedule Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Exams', value: EXAMS.length, icon: <FileText size={18} />, color: '#3b5bdb', bg: '#eef2ff' },
          { label: 'Upcoming', value: upcoming, icon: <Calendar size={18} />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Completed', value: completed, icon: <CheckCircle2 size={18} />, color: '#10b981', bg: '#ecfdf5' },
          { label: 'Total Seats', value: EXAMS.filter(e => e.status === 'Scheduled').reduce((a, e) => a + e.enrolled, 0).toLocaleString(), icon: <Users size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(m => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
            <div className="p-2.5 rounded-xl" style={{ background: m.bg }}>
              <span style={{ color: m.color }}>{m.icon}</span>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">{m.label}</div>
              <div className="text-foreground font-semibold mt-0.5" style={{ fontSize: 22 }}>{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[
          { id: 'schedule', label: 'Exam Schedule' },
          { id: 'halls', label: 'Hall Allocation' },
          { id: 'results', label: 'Results' },
          { id: 'create', label: 'Schedule Exam' },
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

      {tab === 'schedule' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card" style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground" />
              <input placeholder="Search exams by course or code…"
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Scheduled', 'Completed', 'Cancelled', 'Postponed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Course', 'Date & Time', 'Duration', 'Hall', 'Enrolled', 'Invigilator', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.id} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="text-foreground text-sm font-medium">{e.course}</div>
                        <div className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>{e.code}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-foreground text-sm">{e.date}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{e.time}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.duration}</td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{e.hall}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                            <div className="h-full rounded-full" style={{ width: `${(e.enrolled / e.capacity) * 100}%`, background: 'var(--primary)' }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{e.enrolled}/{e.capacity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.invigilator}</td>
                      <td className="px-5 py-3.5">{statusBadge(e.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'halls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {HALLS.map(hall => {
            const exam = EXAMS.find(e => e.hall === hall.name && e.status === 'Scheduled');
            const occupied = !!exam;
            return (
              <div key={hall.name} className="bg-card rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-foreground font-semibold">{hall.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${occupied ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                    {occupied ? 'In Use' : 'Available'}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={13} />
                    <span>{hall.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={13} />
                    <span>Capacity: {hall.capacity} seats</span>
                  </div>
                </div>
                {exam && (
                  <div className="p-3 rounded-xl mb-4" style={{ background: 'var(--muted)' }}>
                    <div className="text-xs text-muted-foreground">Scheduled Exam</div>
                    <div className="text-sm text-foreground font-medium mt-0.5">{exam.course}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{exam.date} · {exam.time}</div>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {hall.facilities.map(f => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--primary)' }}>
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
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border p-4 shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: 'var(--muted)' }}>
              <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
              <p className="text-muted-foreground text-sm">Showing results for <strong className="text-foreground">CS302 – Database Systems</strong> (completed May 30, 2026)</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Student', 'Student ID', 'Course', 'Score', 'Grade', 'GPA Points'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5 text-sm font-medium text-foreground">{r.student}</td>
                      <td className="px-5 py-3.5 text-sm font-mono text-muted-foreground">{r.id}</td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.course}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                            <div className="h-full rounded-full" style={{ width: `${r.score}%`, background: r.score >= 85 ? '#10b981' : r.score >= 70 ? '#3b5bdb' : '#f59e0b' }} />
                          </div>
                          <span className="text-sm text-foreground font-medium">{r.score}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{gradeBadge(r.grade)}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-foreground">{r.gpa.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'create' && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">Schedule New Examination</h3>
            <p className="text-muted-foreground text-sm mt-0.5">Allocate a hall and set the examination timetable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Course</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                <option value="">Select course</option>
                {['CS401 – Advanced Algorithms', 'FIN401 – Corporate Finance', 'BCH302 – Molecular Biology'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Date</label>
              <input type="date" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Start Time</label>
              <input type="time" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Duration</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                {['1 hr', '1.5 hrs', '2 hrs', '2.5 hrs', '3 hrs'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Hall</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                {HALLS.map(h => <option key={h.name}>{h.name} (cap. {h.capacity})</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Invigilator</label>
              <input placeholder="e.g. Prof. Margaret Thompson"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Cancel
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)' }}>
              Schedule Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
