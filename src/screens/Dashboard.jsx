import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react'
import './Dashboard.css'

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
]

const facultyData = [
  { faculty: 'Engineering', students: 1420 },
  { faculty: 'Sciences', students: 980 },
  { faculty: 'Business', students: 1150 },
  { faculty: 'Arts', students: 670 },
  { faculty: 'Medicine', students: 530 },
  { faculty: 'Law', students: 310 },
]

const pieData = [
  { name: 'Engineering', value: 29, color: '#3b5bdb' },
  { name: 'Business', value: 24, color: '#818cf8' },
  { name: 'Sciences', value: 20, color: '#06b6d4' },
  { name: 'Arts', value: 14, color: '#10b981' },
  { name: 'Medicine', value: 11, color: '#f59e0b' },
  { name: 'Law', value: 6, color: '#f43f5e' },
]

const recentRegistrations = [
  { id: 'STU-2024-4901', name: 'Amelia Richardson', faculty: 'Engineering', program: 'BSc Computer Science', date: 'Jun 14, 2026', status: 'Active' },
  { id: 'STU-2024-4902', name: 'James Okonkwo', faculty: 'Medicine', program: 'MBBS', date: 'Jun 13, 2026', status: 'Pending' },
  { id: 'STU-2024-4903', name: 'Sofia Marchetti', faculty: 'Business', program: 'MBA Finance', date: 'Jun 13, 2026', status: 'Active' },
  { id: 'STU-2024-4904', name: 'Chen Wei', faculty: 'Sciences', program: 'MSc Physics', date: 'Jun 12, 2026', status: 'Active' },
  { id: 'STU-2024-4905', name: 'Fatima Al-Rashid', faculty: 'Law', program: 'LLB', date: 'Jun 12, 2026', status: 'Pending' },
]

const upcomingExams = [
  { course: 'Advanced Algorithms', code: 'CS401', date: 'Jun 18, 2026', time: '09:00 AM', hall: 'Hall A', students: 145 },
  { course: 'Organic Chemistry', code: 'CHM302', date: 'Jun 19, 2026', time: '02:00 PM', hall: 'Hall B', students: 98 },
  { course: 'Corporate Finance', code: 'FIN401', date: 'Jun 20, 2026', time: '10:00 AM', hall: 'Hall C', students: 212 },
  { course: 'Medical Ethics', code: 'MED205', date: 'Jun 21, 2026', time: '09:00 AM', hall: 'Hall D', students: 67 },
]

const events = [
  { date: 'Jun 18', title: 'Final Exams Begin', type: 'exam' },
  { date: 'Jun 22', title: 'Senate Meeting', type: 'admin' },
  { date: 'Jun 25', title: 'Graduation Ceremony - Class of 2026', type: 'event' },
  { date: 'Jul 1', title: 'New Semester Registration Opens', type: 'academic' },
  { date: 'Jul 8', title: 'Faculty Research Symposium', type: 'event' },
]

const financialSummary = [
  { label: 'Total Revenue', value: '$12.4M', delta: '+8.2%', positive: true },
  { label: 'Tuition Collected', value: '$9.8M', delta: '+11.4%', positive: true },
  { label: 'Pending Fees', value: '$1.2M', delta: '-3.5%', positive: false },
  { label: 'Scholarships Awarded', value: '$840K', delta: '+18.6%', positive: true },
]

const quickStats = [
  { label: 'Attendance Rate', value: '87.3%', icon: CheckCircle2, color: '#10b981' },
  { label: 'Upcoming Exams', value: '24', icon: Clock, color: '#f59e0b' },
  { label: 'Pending Registrations', value: '37', icon: AlertCircle, color: '#f43f5e' },
  { label: 'Avg GPA (Semester)', value: '3.24', icon: TrendingUp, color: '#3b5bdb' },
]

function MetricCard({ title, value, delta, positive, icon: Icon, color, bg }) {
  return (
    <div className="metric-card metric-card-university">
      <div className="metric-card-top">
        <div className="metric-icon-plate" style={{ background: bg }}>
          <span style={{ color }}>
            <Icon size={20} />
          </span>
        </div>
        <span className={`metric-delta ${positive ? 'positive' : 'negative'}`}>
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {delta}
        </span>
      </div>
      <div>
        <div className="metric-title">{title}</div>
        <div className="metric-value metric-value-large">{value}</div>
      </div>
    </div>
  )
}

function SectionCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className="panel-header">
        <div>
          <p className="panel-label">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function Dashboard({ onNavigate }) {
  const navigate = useNavigate()
  const [chartPeriod, setChartPeriod] = useState('12m')

  const activeData = useMemo(
    () => (chartPeriod === '6m' ? enrollmentData.slice(6) : enrollmentData),
    [chartPeriod],
  )

  const goTo = (view) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view)
      return
    }
    navigate(`/${view}`)
  }

  return (
    <main className="dashboard-shell university-dashboard">
      <section className="dashboard-hero university-hero">
        <div>
          <p className="eyebrow">University ERP</p>
          <h1>Dashboard</h1>
          <p className="hero-copy">Academic Year 2025 - 2026 · Semester II</p>
        </div>
        <div className="hero-actions">
          <span className="hero-timestamp">Last updated: Jun 14, 2026 at 08:45 AM</span>
          <button type="button" className="primary-button" onClick={() => goTo('reports')}>
            View Reports
          </button>
        </div>
      </section>

      <section className="metrics-grid university-metrics-grid">
        <MetricCard title="Total Students" value="4,850" delta="12.4%" positive icon={Users} color="#3b5bdb" bg="#eef2ff" />
        <MetricCard title="Active Lecturers" value="342" delta="5.2%" positive icon={GraduationCap} color="#0891b2" bg="#e0f2fe" />
        <MetricCard title="Courses Offered" value="186" delta="3.1%" positive icon={BookOpen} color="#059669" bg="#ecfdf5" />
        <MetricCard title="Faculties" value="6" delta="0%" positive icon={Building2} color="#d97706" bg="#fffbeb" />
      </section>

      <section className="quick-stats-grid">
        {quickStats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="quick-stat-card">
              <span className="quick-stat-icon" style={{ color: item.color }}>
                <Icon size={16} />
              </span>
              <div>
                <div className="quick-stat-label">{item.label}</div>
                <div className="quick-stat-value">{item.value}</div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="charts-grid university-charts-grid">
        <SectionCard title="Student Enrollment Trend" subtitle="Overview" className="panel-wide">
          <div className="section-toolbar">
            <p className="section-subtitle">Monthly enrollment vs. graduates</p>
            <div className="period-toggle">
              {['6m', '12m'].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setChartPeriod(period)}
                  className={`period-button ${chartPeriod === period ? 'is-active' : ''}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.18} />
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
        </SectionCard>

        <SectionCard title="Faculty Distribution" subtitle="Student share by faculty">
          <div className="chart-wrap pie-chart-wrap">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-list">
            {pieData.map((entry) => (
              <div key={entry.name} className="legend-row">
                <div className="legend-label">
                  <span className="legend-dot" style={{ background: entry.color }} />
                  <span className="legend-text">{entry.name}</span>
                </div>
                <span className="legend-value">{entry.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="charts-grid university-charts-grid">
        <SectionCard title="Students per Faculty" subtitle="Current enrollment" className="panel-wide">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={facultyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="faculty" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                  {facultyData.map((entry, index) => (
                    <Cell key={entry.faculty} fill={pieData[index]?.color ?? '#3b5bdb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Events" subtitle="Academic calendar">
          <div className="event-list">
            {events.map((event) => (
              <div key={event.date + event.title} className="event-row">
                <div className="event-date-block">
                  <span>{event.date.split(' ')[0]}</span>
                  <strong>{event.date.split(' ')[1]}</strong>
                </div>
                <div className="event-copy">
                  <p>{event.title}</p>
                  <span className={`event-pill ${event.type}`}>{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="dual-cards-grid">
        <SectionCard title="Recent Registrations" subtitle="Admissions">
          <div className="table-card">
            {recentRegistrations.map((student) => (
              <button key={student.id} type="button" className="table-row" onClick={() => goTo('students-registration')}>
                <span className="avatar">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <div className="row-copy">
                  <strong>{student.name}</strong>
                  <span>{student.program}</span>
                </div>
                <div className="row-meta">
                  <span>{student.date}</span>
                  <small>{student.status}</small>
                </div>
              </button>
            ))}
            <button type="button" className="link-button" onClick={() => goTo('students-registration')}>
              View all <ChevronRight size={13} />
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Examinations" subtitle="Exams">
          <div className="table-card">
            {upcomingExams.map((exam) => (
              <button key={exam.code} type="button" className="table-row" onClick={() => goTo('examinations')}>
                <span className="exam-icon">
                  <BookOpen size={15} />
                </span>
                <div className="row-copy">
                  <strong>{exam.course}</strong>
                  <span>{exam.code} - {exam.hall}</span>
                </div>
                <div className="row-meta">
                  <span>{exam.date}</span>
                  <small>{exam.time} - {exam.students} students</small>
                </div>
              </button>
            ))}
            <button type="button" className="link-button" onClick={() => goTo('examinations')}>
              View all <ChevronRight size={13} />
            </button>
          </div>
        </SectionCard>
      </section>

      <section className="panel university-finance-panel">
        <div className="panel-header panel-header-row">
          <div>
            <p className="panel-label">Finance</p>
            <h2>Financial Summary</h2>
            <p className="section-subtitle">Academic Year 2025-2026</p>
          </div>
          <button type="button" className="link-button" onClick={() => goTo('finance')}>
            Full report <ChevronRight size={13} />
          </button>
        </div>
        <div className="finance-grid">
          {financialSummary.map((item) => (
            <div key={item.label} className="finance-card">
              <div className="finance-label">{item.label}</div>
              <div className="finance-value">{item.value}</div>
              <span className={`finance-delta ${item.positive ? 'positive' : 'negative'}`}>{item.delta} vs last year</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
