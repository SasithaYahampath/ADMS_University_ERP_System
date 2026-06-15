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

const avatarColors = ['#4361ee', '#818cf8', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

function statusBadge(status) {
  const map = {
    Active: { bg: '#ecfdf5', text: '#10b981' },
    Pending: { bg: '#fffbeb', text: '#f59e0b' },
    Suspended: { bg: '#fef2f2', text: '#ef4444' },
    Graduated: { bg: '#eef2ff', text: '#4361ee' },
  };
  const c = map[status] ?? { bg: '#f8f9fc', text: '#64748b' };
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase" style={{ background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function AddStudentModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', faculty: '', program: '', gender: '', dob: '' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-xl border border-gray-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-gray-900 font-semibold text-[18px]">Register New Student</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Full Name *</label>
              <input className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                placeholder="e.g. John Doe"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Email *</label>
              <input type="email" className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                placeholder="john@uni.edu"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Phone</label>
              <input className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                placeholder="+1 555-0000"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Faculty *</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}>
                <option value="">Select faculty</option>
                {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Program *</label>
              <input className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                placeholder="e.g. BSc Computer Science"
                value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Gender</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Date of Birth</label>
              <input type="date" className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm"
                value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="flex gap-4 px-8 py-5 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose}
            className="flex-1 rounded-xl py-3 text-[14px] font-semibold border border-gray-200 text-gray-700 hover:bg-white shadow-sm transition-colors">
            Cancel
          </button>
          <button onClick={onClose}
            className="flex-1 rounded-xl py-3 text-[14px] font-semibold text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
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
    <div className="space-y-6 font-sans text-gray-900">
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Student Management</h1>
          <p className="text-gray-500 text-sm mt-1">{STUDENTS.length} students enrolled | Academic Year 2025-2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-sm transition-colors bg-[#4361ee] hover:bg-[#3651cc]">
            <Plus size={16} strokeWidth={2.5} /> Register Student
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1.5 rounded-2xl w-fit bg-gray-50/80 border border-gray-100">
        {[
          { id: 'list', label: 'All Students' },
          { id: 'registration', label: 'Registration' },
          { id: 'attendance', label: 'Attendance' },
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

      {tab === 'list' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#4361ee]/20 focus-within:border-[#4361ee]/50 transition-all">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input placeholder="Search by name, ID, or email..." className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
            </div>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterFaculty} onChange={e => { setFilterFaculty(e.target.value); setCurrentPage(1); }}>
              <option value="">All Faculties</option>
              {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select className="rounded-xl px-4 py-3 text-[14px] font-medium border border-gray-200 bg-white text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50"
              value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="">All Statuses</option>
              {['Active', 'Pending', 'Suspended', 'Graduated'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Student', 'ID', 'Faculty / Program', 'Level', 'GPA', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[12px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                            style={{ background: avatarColors[i % avatarColors.length] }}>
                            {s.avatar}
                          </div>
                          <div>
                            <div className="text-gray-900 text-[14px] font-bold leading-tight">{s.name}</div>
                            <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 font-mono font-medium">{s.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] text-gray-900 font-semibold leading-tight">{s.faculty}</div>
                        <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{s.program}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-gray-600 font-medium">{s.level}L</td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold" style={{ color: s.gpa >= 3.7 ? '#10b981' : s.gpa >= 3.0 ? '#4361ee' : '#f59e0b' }}>
                          {s.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">{statusBadge(s.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedStudent(s)}
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
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="text-[13px] font-medium text-gray-500">
                Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}-{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent">
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className="w-8 h-8 rounded-lg text-[13px] font-bold transition-colors"
                    style={{
                      background: p === currentPage ? '#4361ee' : 'transparent',
                      color: p === currentPage ? '#fff' : '#64748b',
                    }}>
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

      {tab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Average Attendance', value: '87.5%', icon: <CheckCircle2 size={20} />, color: '#10b981', bg: '#ecfdf5' },
              { label: 'Below 75% Threshold', value: '43 students', icon: <XCircle size={20} />, color: '#ef4444', bg: '#fef2f2' },
              { label: 'Perfect Attendance', value: '128 students', icon: <Clock size={20} />, color: '#4361ee', bg: '#eef2ff' },
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
          
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-gray-900 text-[16px] font-semibold">Course-wise Attendance - Amelia Richardson (STU-2024-4901)</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {ATTENDANCE_DATA.map(a => (
                <div key={a.course} className="flex items-center gap-5 px-6 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 text-[14px] font-bold">{a.course}</div>
                    <div className="text-gray-500 text-[13px] mt-1 font-medium">{a.present} present | {a.absent} absent</div>
                  </div>
                  <div className="w-32 h-2.5 rounded-full overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: a.percentage >= 90 ? '#10b981' : a.percentage >= 75 ? '#4361ee' : '#ef4444' }} />
                  </div>
                  <div className="w-12 text-right text-[14px] font-bold" style={{ color: a.percentage >= 90 ? '#10b981' : a.percentage >= 75 ? '#4361ee' : '#ef4444' }}>
                    {a.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'registration' && (
        <div className="bg-white rounded-[20px] border border-gray-100 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="text-gray-900 text-lg font-semibold">New Student Registration</h3>
            <p className="text-gray-500 text-[14px] mt-1">Fill in the form to register a new student into the university system.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'First Name', placeholder: 'John', type: 'text' },
              { label: 'Last Name', placeholder: 'Doe', type: 'text' },
              { label: 'Email Address', placeholder: 'john.doe@uni.edu', type: 'email' },
              { label: 'Phone Number', placeholder: '+1 555-0000', type: 'tel' },
              { label: 'Date of Birth', placeholder: '', type: 'date' },
              { label: 'National ID / Passport', placeholder: 'A12345678', type: 'text' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-[13px] font-semibold text-gray-700 block mb-2">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm" />
              </div>
            ))}
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Faculty</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                <option value="">Select faculty</option>
                {['Engineering', 'Medicine', 'Business', 'Sciences', 'Arts', 'Law'].map(f => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Gender</label>
              <select className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="text-[13px] font-semibold text-gray-700 block mb-2">Home Address</label>
              <textarea rows={3} placeholder="123 Main St, City, Country"
                className="w-full rounded-xl px-4 py-3 text-[14px] border border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-[#4361ee]/20 focus:border-[#4361ee]/50 transition-all shadow-sm resize-none" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Reset Form
            </button>
            <button className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white transition-colors shadow-sm bg-[#4361ee] hover:bg-[#3651cc]">
              Submit Registration
            </button>
          </div>
        </div>
      )}

      {/* Student detail drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}>
          <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h3 className="text-gray-900 font-semibold text-[16px]">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-sm"
                  style={{ background: '#4361ee' }}>
                  {selectedStudent.avatar}
                </div>
                <div>
                  <div className="text-gray-900 font-bold text-xl leading-tight">{selectedStudent.name}</div>
                  <div className="text-gray-500 text-[14px] mt-1 font-mono">{selectedStudent.id}</div>
                  <div className="mt-2.5">{statusBadge(selectedStudent.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3.5">
                {[
                  { icon: <Mail size={16} />, label: 'Email Address', value: selectedStudent.email },
                  { icon: <Phone size={16} />, label: 'Phone Number', value: selectedStudent.phone },
                  { icon: <BookOpen size={16} />, label: 'Program', value: selectedStudent.program },
                  { icon: <Building2 size={16} />, label: 'Faculty', value: selectedStudent.faculty },
                  { icon: <User size={16} />, label: 'Academic Level', value: `${selectedStudent.level}L` },
                  { icon: <MapPin size={16} />, label: 'Home Address', value: selectedStudent.address },
                  { icon: <Calendar size={16} />, label: 'Enrolled Date', value: selectedStudent.enrolled },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3.5 p-4 rounded-[16px] bg-gray-50 border border-gray-100">
                    <span className="text-gray-400 mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-gray-500 text-[12px] font-medium uppercase tracking-wider">{item.label}</div>
                      <div className="text-gray-900 text-[14px] font-semibold mt-0.5">{item.value}</div>
                    </div>
                  </div>
                ))}
                
                <div className="p-5 rounded-[16px] bg-blue-50 border border-blue-100/50 flex flex-col items-center justify-center mt-2">
                  <div className="text-gray-500 text-[12px] font-bold uppercase tracking-wider mb-1">Cumulative GPA</div>
                  <div className="text-[#4361ee] font-black" style={{ fontSize: 36, lineHeight: 1.1 }}>{selectedStudent.gpa.toFixed(2)}</div>
                  <div className="text-gray-600 text-[13px] font-medium mt-2">
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