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
  { faculty: 'Sciences', students: 980 },
  { faculty: 'Business', students: 1150 },
  { faculty: 'Arts', students: 670 },
  { faculty: 'Medicine', students: 530 },
  { faculty: 'Law', students: 310 },
];

const pieData = [
  { name: 'Engineering', value: 29, color: '#3b5bdb' },
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
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex flex-col gap-4" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl" style={{ background: bg }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${positive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {delta}
        </span>
      </div>
      <div>
        <div className="text-muted-foreground text-sm">{title}</div>
        <div className="text-foreground mt-1" style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2 }}>{value}</div>
      </div>
    </div>
  );
}


 function Dashboard({ onNavigate }) {
  const [chartPeriod, setChartPeriod] = useState('12m');
  const data = chartPeriod === '6m' ? enrollmentData.slice(6) : enrollmentData;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Academic Year 2025 – 2026 · Semester II</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Last updated: Jun 14, 2026 at 08:45 AM</span>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--primary)' }}
            onClick={() => onNavigate('reports')}>
            View Reports
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value="4,850"
          delta="12.4%"
          positive={true}
          icon={<Users size={20} />}
          color="#3b5bdb"
          bg="#eef2ff"
        />
        <MetricCard
          title="Active Lecturers"
          value="342"
          delta="5.2%"
          positive={true}
          icon={<GraduationCap size={20} />}
          color="#0891b2"
          bg="#e0f2fe"
        />
        <MetricCard
          title="Courses Offered"
          value="186"
          delta="3.1%"
          positive={true}
          icon={<BookOpen size={20} />}
          color="#059669"
          bg="#ecfdf5"
        />
        <MetricCard
          title="Faculties"
          value="6"
          delta="0%"
          positive={true}
          icon={<Building2 size={20} />}
          color="#d97706"
          bg="#fffbeb"
        />
      </div>

      {/* Secondary metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Attendance Rate', value: '87.3%', icon: <CheckCircle2 size={16} />, color: '#10b981' },
          { label: 'Upcoming Exams', value: '24', icon: <Clock size={16} />, color: '#f59e0b' },
          { label: 'Pending Registrations', value: '37', icon: <AlertCircle size={16} />, color: '#f43f5e' },
          { label: 'Avg GPA (Semester)', value: '3.24', icon: <TrendingUp size={16} />, color: '#3b5bdb' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl px-4 py-3 border flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
            <span style={{ color: m.color }}>{m.icon}</span>
            <div>
              <div className="text-muted-foreground" style={{ fontSize: 11 }}>{m.label}</div>
              <div className="text-foreground font-semibold text-sm">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground text-base">Student Enrollment Trend</h3>
              <p className="text-muted-foreground" style={{ fontSize: 12 }}>Monthly enrollment vs. graduates</p>
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--muted)' }}>
              {(['6m', '12m'] ).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all"
                  style={{
                    background: chartPeriod === p ? 'var(--card)' : 'transparent',
                    color: chartPeriod === p ? 'var(--foreground)' : 'var(--muted-foreground)',
                    boxShadow: chartPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="students" name="Students" stroke="#3b5bdb" strokeWidth={2} fill="url(#enrollGrad)" dot={false} />
              <Area type="monotone" dataKey="graduates" name="Graduates" stroke="#818cf8" strokeWidth={2} fill="url(#gradGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Faculty distribution */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground text-base mb-1">Faculty Distribution</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Student share by faculty</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-foreground font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty bar chart + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-foreground text-base mb-1">Students per Faculty</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: 12 }}>Current enrollment by faculty</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={facultyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="faculty" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                {facultyData.map((_, i) => (
                  <Cell key={i} fill={pieData[i]?.color ?? '#3b5bdb'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground text-base">Upcoming Events</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all</button>
          </div>
          <div className="space-y-3">
            {events.map((e, i) => {
              const colors = { exam: '#ef4444', admin: '#f59e0b', event: '#3b5bdb', academic: '#10b981' };
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="shrink-0 w-12 text-center">
                    <div className="text-xs text-muted-foreground">{e.date.split(' ')[0]}</div>
                    <div className="text-foreground font-semibold text-sm">{e.date.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium leading-tight">{e.title}</div>
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-white capitalize"
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

      {/* Recent Registrations + Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent registrations */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">Recent Registrations</h3>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onNavigate('students-registration')}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {recentRegistrations.map(s => (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold text-white"
                  style={{ background: 'var(--primary)' }}>
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium truncate">{s.name}</div>
                  <div className="text-muted-foreground truncate" style={{ fontSize: 11 }}>{s.program}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{s.date}</div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-white mt-1`}
                    style={{ background: s.status === 'Active' ? '#10b981' : '#f59e0b', fontSize: 10 }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming exams */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-foreground text-base">Upcoming Examinations</h3>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onNavigate('examinations')}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {upcomingExams.map(exam => (
              <div key={exam.code} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--secondary)' }}>
                  <BookOpen size={15} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium truncate">{exam.course}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.code} · {exam.hall}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-foreground text-xs font-medium">{exam.date}</div>
                  <div className="text-muted-foreground" style={{ fontSize: 11 }}>{exam.time} · {exam.students} students</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-foreground text-base">Financial Summary</h3>
            <p className="text-muted-foreground" style={{ fontSize: 12 }}>Academic Year 2025–2026</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onNavigate('finance')}>
            Full report <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue', value: '$12.4M', delta: '+8.2%', positive: true },
            { label: 'Tuition Collected', value: '$9.8M', delta: '+11.4%', positive: true },
            { label: 'Pending Fees', value: '$1.2M', delta: '-3.5%', positive: false },
            { label: 'Scholarships Awarded', value: '$840K', delta: '+18.6%', positive: true },
          ].map(f => (
            <div key={f.label} className="rounded-xl p-4" style={{ background: 'var(--muted)' }}>
              <div className="text-muted-foreground text-xs mb-1">{f.label}</div>
              <div className="text-foreground font-semibold" style={{ fontSize: 20 }}>{f.value}</div>
              <span className={`text-xs font-medium ${f.positive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {f.delta} vs last year
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;