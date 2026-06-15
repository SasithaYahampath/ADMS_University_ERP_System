import { useState } from 'react';
import {
  Search, Plus, Download,
  ChevronLeft, ChevronRight, Eye, Edit2, X,
  Mail, Phone, MapPin, Calendar, BookOpen,
  CheckCircle2, XCircle, Clock, User, Building2
} from 'lucide-react';

const STUDENTS = [
  { id: 'STU-2024-4901', name: 'Amelia Richardson', email: 'a.richardson@uni.edu', phone: '+1 555-0101', faculty: 'Engineering', program: 'BSc Computer Science', level: '300', gpa: 3.85, status: 'Active', gender: 'Female', dob: '2002-03-14', address: 'Brooklyn, NY', enrolled: '2022-09-05', avatar: 'AR' },
  { id: 'STU-2024-4902', name: 'James Okonkwo', email: 'j.okonkwo@uni.edu', phone: '+1 555-0102', faculty: 'Medicine', program: 'MBBS', level: '200', gpa: 3.62, status: 'Pending', gender: 'Male', dob: '2003-07-22', address: 'Lagos, NG', enrolled: '2023-09-04', avatar: 'JO' },
  { id: 'STU-2024-4903', name: 'Sofia Marchetti', email: 's.marchetti@uni.edu', phone: '+1 555-0103', faculty: 'Business', program: 'MBA Finance', level: '100', gpa: 3.91, status: 'Active', gender: 'Female', dob: '1999-11-30', address: 'Milan, IT', enrolled: '2025-09-02', avatar: 'SM' },
  { id: 'STU-2024-4904', name: 'Chen Wei', email: 'c.wei@uni.edu', phone: '+1 555-0104', faculty: 'Sciences', program: 'MSc Physics', level: '200', gpa: 3.74, status: 'Active', gender: 'Male', dob: '2001-05-09', address: 'Beijing, CN', enrolled: '2024-09-03', avatar: 'CW' },
  { id: 'STU-2024-4905', name: 'Fatima Al-Rashid', email: 'f.alrashid@uni.edu', phone: '+1 555-0105', faculty: 'Law', program: 'LLB', level: '400', gpa: 3.55, status: 'Pending', gender: 'Female', dob: '2000-08-15', address: 'Riyadh, SA', enrolled: '2021-09-06', avatar: 'FA' },
  { id: 'STU-2024-4906', name: 'Marcus Johnson', email: 'm.johnson@uni.edu', phone: '+1 555-0106', faculty: 'Engineering', program: 'BEng Civil', level: '400', gpa: 3.40, status: 'Active', gender: 'Male', dob: '2000-02-28', address: 'Atlanta, GA', enrolled: '2021-09-06', avatar: 'MJ' },
  { id: 'STU-2024-4907', name: 'Yuki Tanaka', email: 'y.tanaka@uni.edu', phone: '+1 555-0107', faculty: 'Arts', program: 'BA Fine Arts', level: '300', gpa: 3.78, status: 'Active', gender: 'Female', dob: '2002-12-01', address: 'Tokyo, JP', enrolled: '2022-09-05', avatar: 'YT' },
  { id: 'STU-2024-4908', name: 'David Mensah', email: 'd.mensah@uni.edu', phone: '+1 555-0108', faculty: 'Sciences', program: 'BSc Biology', level: '100', gpa: 3.20, status: 'Suspended', gender: 'Male', dob: '2004-04-18', address: 'Accra, GH', enrolled: '2025-09-02', avatar: 'DM' },
];

const ATTENDANCE_DATA = [
  { course: 'CS401 - Advanced Algorithms', present: 14, absent: 1, percentage: 93 },
  { course: 'CS302 - Database Systems', present: 13, absent: 2, percentage: 87 },
  { course: 'MATH301 - Linear Algebra', present: 12, absent: 3, percentage: 80 },
  { course: 'CS410 - Software Engineering', present: 15, absent: 0, percentage: 100 },
];

const avatarColors = ['#3b5bdb', '#818cf8', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

function statusBadge(status) {
  const map = {
    Active: { bg: '#dcfce7', text: '#15803d' },
    Pending: { bg: '#fef9c3', text: '#a16207' },
    Suspended: { bg: '#fee2e2', text: '#b91c1c' },
    Graduated: { bg: '#dbeafe', text: '#1d4ed8' },
  };
  const c = map[status] ?? { bg: '#f1f5f9', text: '#64748b' };
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function AddStudentModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', faculty: '', program: '', gender: '', dob: '' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground">Register New Student</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Full Name *</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. John Doe"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Email *</label>
              <input type="email" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="john@uni.edu"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Phone</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="+1 555-0000"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Faculty *</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}>
                <option value="">Select faculty</option>
                {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Program *</label>
              <input className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                placeholder="e.g. BSc Computer Science"
                value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Gender</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Date of Birth</label>
              <input type="date" className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}
                value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium border transition-colors hover:bg-muted text-foreground"
            style={{ borderColor: 'var(--border)' }}>
            Cancel
          </button>
          <button onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--primary)' }}>
            Register Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UniStudents({ activeTab }) {
  const [search, setSearch] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState(
    activeTab === 'students-registration' ? 'registration' :
    activeTab === 'students-attendance' ? 'attendance' : 'list'
  );

  const filtered = STUDENTS.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchF = !filterFaculty || s.faculty === filterFaculty;
    const matchS = !filterStatus || s.status === filterStatus;
    return matchQ && matchF && matchS;
  });

  const perPage = 6;
  const pages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="space-y-6">
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Student Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{STUDENTS.length} students enrolled | Academic Year 2025-2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm border text-muted-foreground hover:bg-muted transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <Download size={15} /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--primary)' }}>
            <Plus size={15} /> Register Student
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'var(--muted)' }}>
        {[
          { id: 'list', label: 'All Students' },
          { id: 'registration', label: 'Registration' },
          { id: 'attendance', label: 'Attendance' },
        ].map(t => (
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-card"
              style={{ borderColor: 'var(--border)' }}>
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input placeholder="Search by name, ID, or email..." className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
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
            <select className="rounded-xl px-3 py-2.5 text-sm border bg-card text-foreground outline-none"
              style={{ borderColor: 'var(--border)' }}
              value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="">All Statuses</option>
              {['Active', 'Pending', 'Suspended', 'Graduated'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--muted)' }}>
                    {['Student', 'ID', 'Faculty / Program', 'Level', 'GPA', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s, i) => (
                    <tr key={s.id} className="border-t hover:bg-muted/30 transition-colors" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                            style={{ background: avatarColors[i % avatarColors.length] }}>
                            {s.avatar}
                          </div>
                          <div>
                            <div className="text-foreground text-sm font-medium">{s.name}</div>
                            <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-muted-foreground font-mono">{s.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm text-foreground">{s.faculty}</div>
                        <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.program}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-foreground">{s.level}L</td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold" style={{ color: s.gpa >= 3.7 ? '#10b981' : s.gpa >= 3.0 ? '#3b5bdb' : '#f59e0b' }}>
                          {s.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">{statusBadge(s.status)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedStudent(s)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-40">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background: p === currentPage ? 'var(--primary)' : 'transparent',
                      color: p === currentPage ? '#fff' : 'var(--muted-foreground)',
                    }}>
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

      {tab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Average Attendance', value: '87.5%', icon: <CheckCircle2 size={18} />, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Below 75% Threshold', value: '43 students', icon: <XCircle size={18} />, color: '#ef4444', bg: '#fef2f2' },
              { label: 'Perfect Attendance', value: '128 students', icon: <Clock size={18} />, color: '#3b5bdb', bg: '#eef2ff' },
            ].map(m => (
              <div key={m.label} className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
                <div className="p-3 rounded-xl" style={{ background: m.bg }}>
                  <span style={{ color: m.color }}>{m.icon}</span>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">{m.label}</div>
                  <div className="text-foreground font-semibold mt-0.5">{m.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground text-base">Course-wise Attendance - Amelia Richardson (STU-2024-4901)</h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {ATTENDANCE_DATA.map(a => (
                <div key={a.course} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium">{a.course}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{a.present} present | {a.absent} absent</div>
                  </div>
                  <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: a.percentage >= 90 ? '#10b981' : a.percentage >= 75 ? '#3b5bdb' : '#ef4444' }} />
                  </div>
                  <div className="w-12 text-right text-sm font-semibold" style={{ color: a.percentage >= 90 ? '#10b981' : a.percentage >= 75 ? '#3b5bdb' : '#ef4444' }}>
                    {a.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'registration' && (
        <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="text-foreground text-base">New Student Registration</h3>
            <p className="text-muted-foreground text-sm mt-0.5">Fill in the form to register a new student into the university system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'First Name', placeholder: 'John', type: 'text' },
              { label: 'Last Name', placeholder: 'Doe', type: 'text' },
              { label: 'Email Address', placeholder: 'john.doe@uni.edu', type: 'email' },
              { label: 'Phone Number', placeholder: '+1 555-0000', type: 'tel' },
              { label: 'Date of Birth', placeholder: '', type: 'date' },
              { label: 'National ID / Passport', placeholder: 'A12345678', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-sm text-foreground block mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
              </div>
            ))}
            <div>
              <label className="text-sm text-foreground block mb-1.5">Faculty</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                <option value="">Select faculty</option>
                {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-foreground block mb-1.5">Gender</label>
              <select className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-foreground block mb-1.5">Home Address</label>
              <textarea rows={2} placeholder="123 Main St, City, Country"
                className="w-full rounded-xl px-3 py-2.5 text-sm border text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                style={{ background: 'var(--input-background)', borderColor: 'var(--border)' }} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium border text-foreground hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}>
              Reset
            </button>
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--primary)' }}>
              Submit Registration
            </button>
          </div>
        </div>
      )}

      {/* Student detail drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setSelectedStudent(null)}>
          <div className="w-full max-w-md bg-card h-full overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-foreground">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'var(--primary)' }}>
                  {selectedStudent.avatar}
                </div>
                <div>
                  <div className="text-foreground font-semibold">{selectedStudent.name}</div>
                  <div className="text-muted-foreground text-sm">{selectedStudent.id}</div>
                  <div className="mt-1">{statusBadge(selectedStudent.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: <Mail size={15} />, label: 'Email', value: selectedStudent.email },
                  { icon: <Phone size={15} />, label: 'Phone', value: selectedStudent.phone },
                  { icon: <BookOpen size={15} />, label: 'Program', value: selectedStudent.program },
                  { icon: <Building2 size={15} />, label: 'Faculty', value: selectedStudent.faculty },
                  { icon: <User size={15} />, label: 'Level', value: `${selectedStudent.level}L` },
                  { icon: <MapPin size={15} />, label: 'Address', value: selectedStudent.address },
                  { icon: <Calendar size={15} />, label: 'Enrolled', value: selectedStudent.enrolled },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                    <span className="text-muted-foreground mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-muted-foreground" style={{ fontSize: 11 }}>{item.label}</div>
                      <div className="text-foreground text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
                <div className="p-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>Cumulative GPA</div>
                  <div className="text-primary font-bold" style={{ fontSize: 24 }}>{selectedStudent.gpa.toFixed(2)}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>
                    {selectedStudent.gpa >= 3.7 ? 'First Class Honours' : selectedStudent.gpa >= 3.3 ? 'Second Class Upper' : 'Second Class Lower'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

