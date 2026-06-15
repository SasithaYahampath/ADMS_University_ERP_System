import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, BookOpen, GraduationCap, Building2,
  TrendingUp, AlertCircle, Clock, CheckCircle2,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronRight
} from 'lucide-react';

const enrollmentData = [
  { month: 'Jan', students: 3200, graduates: 280 },
  { month: 'Feb', students: 3350, graduates: 310 },
  { month: 'Mar', students: 3500, graduates: 295 },
  { month: 'Apr', students: 3420, graduates: 340 },
  { month: 'May', students: 3680, graduates: 380 },
  { month: 'Jun', students: 3750, graduates: 420 },
  { month: 'Jul', students: 3900, graduates: 390 },
  { month: 'Aug', students: 4100, graduates: 450 },
  { month: 'Sep', students: 4350, graduates: 410 },
  { month: 'Oct', students: 4580, graduates: 480 },
  { month: 'Nov', students: 4720, graduates: 510 },
  { month: 'Dec', students: 4850, graduates: 540 },
];

const facultyData = [
  { faculty: 'Engineering', students: 1420 },
  { faculty: 'Business', students: 1150 },
  { faculty: 'Sciences', students: 980 },
  { faculty: 'Arts', students: 670 },
  { faculty: 'Medicine', students: 530 },
  { faculty: 'Law', students: 310 },
];

const pieData = [
  { name: 'Engineering', value: 29, color: '#4361ee' },
  { name: 'Business', value: 24, color: '#818cf8' },
  { name: 'Sciences', value: 20, color: '#06b6d4' },
  { name: 'Arts', value: 14, color: '#10b981' },
  { name: 'Medicine', value: 11, color: '#f59e0b' },
  { name: 'Law', value: 6, color: '#f43f5e' },
];

const recentRegistrations = [
  { id: 'STU-2024-4901', name: 'Amelia Richardson', faculty: 'Engineering', program: 'BSc Computer Science', date: 'Jun 14, 2026', status: 'Active' },
  { id: 'STU-2024-4902', name: 'James Okonkwo', faculty: 'Medicine', program: 'MBBS', date: 'Jun 13, 2026', status: 'Pending' },
  { id: 'STU-2024-4903', name: 'Sofia Marchetti', faculty: 'Business', program: 'MBA Finance', date: 'Jun 13, 2026', status: 'Active' },
  { id: 'STU-2024-4904', name: 'Chen Wei', faculty: 'Sciences', program: 'MSc Physics', date: 'Jun 12, 2026', status: 'Active' },
  { id: 'STU-2024-4905', name: 'Fatima Al-Rashid', faculty: 'Law', program: 'LLB', date: 'Jun 12, 2026', status: 'Pending' },
];

const upcomingExams = [
  { course: 'Advanced Algorithms', code: 'CS401', date: 'Jun 18, 2026', time: '09:00 AM', hall: 'Hall A', students: 145 },
  { course: 'Organic Chemistry', code: 'CHM302', date: 'Jun 19, 2026', time: '02:00 PM', hall: 'Hall B', students: 98 },
  { course: 'Corporate Finance', code: 'FIN401', date: 'Jun 20, 2026', time: '10:00 AM', hall: 'Hall C', students: 212 },
  { course: 'Medical Ethics', code: 'MED205', date: 'Jun 21, 2026', time: '09:00 AM', hall: 'Hall D', students: 67 },
];

const events = [
  { date: 'Jun 18', title: 'Final Exams Begin', type: 'exam' },
  { date: 'Jun 22', title: 'Senate Meeting', type: 'admin' },
  { date: 'Jun 25', title: 'Graduation Ceremony – Class of 2026', type: 'event' },
  { date: 'Jul 1', title: 'New Semester Registration Opens', type: 'academic' },
  { date: 'Jul 8', title: 'Faculty Research Symposium', type: 'event' },
];

function MetricCard({ title, value, delta, positive, icon, color, bg }) {
  return (
    <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: bg }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-1 rounded-md ${positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {positive ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
          {delta}
        </span>
      </div>
      <div>
        <div className="text-gray-500 text-[13px] font-medium">{title}</div>
        <div className="text-gray-900 mt-1" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }) {
  const [chartPeriod, setChartPeriod] = useState('12m');
  const data = chartPeriod === '6m' ? enrollmentData.slice(6) : enrollmentData;

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl font-semibold">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Academic Year 2025 – 2026 · Semester II</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-gray-500 hidden sm:inline">Last updated: Jun 14, 2026 at 08:45 AM</span>
            <button className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-colors bg-[#4361ee] hover:bg-[#3651cc]"
              onClick={() => onNavigate && onNavigate('reports')}>
              View Reports
            </button>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard title="Total Students" value="4,850" delta="12.4%" positive={true} icon={<Users size={20} />} color="#4361ee" bg="#eef2ff" />
          <MetricCard title="Active Lecturers" value="342" delta="5.2%" positive={true} icon={<GraduationCap size={20} />} color="#06b6d4" bg="#e0f2fe" />
          <MetricCard title="Courses Offered" value="186" delta="3.1%" positive={true} icon={<BookOpen size={20} />} color="#10b981" bg="#ecfdf5" />
          <MetricCard title="Faculties" value="6" delta="0%" positive={true} icon={<Building2 size={20} />} color="#f59e0b" bg="#fffbeb" />
        </div>

        {/* Secondary metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Attendance Rate', value: '87.3%', icon: <CheckCircle2 size={18} />, color: '#10b981' },
            { label: 'Upcoming Exams', value: '24', icon: <Clock size={18} />, color: '#f59e0b' },
            { label: 'Pending Registrations', value: '37', icon: <AlertCircle size={18} />, color: '#f43f5e' },
            { label: 'Avg GPA (Semester)', value: '3.24', icon: <TrendingUp size={18} />, color: '#4361ee' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-[16px] px-5 py-4 border border-gray-100 shadow-sm flex items-center gap-4">
              <span style={{ color: m.color }}>{m.icon}</span>
              <div>
                <div className="text-gray-500 text-[12px] font-medium mb-0.5">{m.label}</div>
                <div className="text-gray-900 font-bold text-[15px] leading-none">{m.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment trend */}
          <div className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 text-base font-semibold">Student Enrollment Trend</h3>
                <p className="text-gray-500 text-[13px] mt-0.5">Monthly enrollment vs. graduates</p>
              </div>
              <div className="flex gap-1 p-1 rounded-lg bg-gray-50 border border-gray-100">
                {['6m', '12m'].map(p => (
                  <button key={p} onClick={() => setChartPeriod(p)}
                    className="px-4 py-1 rounded-md text-[13px] font-semibold transition-all"
                    style={{
                      background: chartPeriod === p ? '#fff' : 'transparent',
                      color: chartPeriod === p ? '#111827' : '#6b7280',
                      boxShadow: chartPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13, paddingTop: '20px', color: '#64748b' }} />
                <Area type="monotone" dataKey="students" name="Students" stroke="#4361ee" strokeWidth={2.5} fill="url(#enrollGrad)" dot={false} activeDot={{ r: 6, fill: '#4361ee', stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="graduates" name="Graduates" stroke="#818cf8" strokeWidth={2.5} fill="transparent" dot={false} activeDot={{ r: 6, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Faculty distribution */}
          <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm flex flex-col">
            <h3 className="text-gray-900 text-base font-semibold mb-0.5">Faculty Distribution</h3>
            <p className="text-gray-500 text-[13px] mb-6">Student share by faculty</p>
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-6">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-gray-500 font-medium">{d.name}</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Faculty bar chart + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <h3 className="text-gray-900 text-base font-semibold mb-0.5">Students per Faculty</h3>
            <p className="text-gray-500 text-[13px] mb-6">Current enrollment by faculty</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={facultyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="faculty" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip cursor={{ fill: '#f8f9fc' }} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                  {facultyData.map((_, i) => (
                    <Cell key={i} fill="#4361ee" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming events */}
          <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 text-base font-semibold">Upcoming Events</h3>
              <button className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">View all</button>
            </div>
            <div className="space-y-5">
              {events.map((e, i) => {
                const colors = { exam: '#ef4444', admin: '#f59e0b', event: '#4361ee', academic: '#10b981' };
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="shrink-0 w-[46px] text-center">
                      <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{e.date.split(' ')[0]}</div>
                      <div className="text-gray-900 font-bold text-base leading-tight mt-0.5">{e.date.split(' ')[1]}</div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="text-gray-900 text-[14px] font-medium leading-tight truncate">{e.title}</div>
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-white capitalize font-medium"
                        style={{ background: colors[e.type], fontSize: 10 }}>
                        {e.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Keeping the remaining sections styled consistently */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent registrations */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-gray-900 text-base font-semibold">Recent Registrations</h3>
              <button className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => onNavigate && onNavigate('students-registration')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentRegistrations.map(s => (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white bg-[#4361ee]">
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 text-[14px] font-medium truncate">{s.name}</div>
                    <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: 12 }}>{s.program}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-gray-500" style={{ fontSize: 12 }}>{s.date}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-white mt-1.5 font-medium`}
                      style={{ background: s.status === 'Active' ? '#10b981' : '#f59e0b', fontSize: 10 }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming exams */}
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-gray-900 text-base font-semibold">Upcoming Examinations</h3>
              <button className="flex items-center gap-1 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => onNavigate && onNavigate('examinations')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingExams.map(exam => (
                <div key={exam.code} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-[#4361ee]">
                    <BookOpen size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 text-[14px] font-medium truncate">{exam.course}</div>
                    <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{exam.code} · {exam.hall}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-gray-900 text-[13px] font-semibold">{exam.date}</div>
                    <div className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{exam.time} · {exam.students} students</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;