import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './Dashboard.css'

const salesData = [
  { month: 'Jan', revenue: 45000, orders: 234 },
  { month: 'Feb', revenue: 52000, orders: 267 },
  { month: 'Mar', revenue: 48000, orders: 245 },
  { month: 'Apr', revenue: 61000, orders: 312 },
  { month: 'May', revenue: 55000, orders: 289 },
  { month: 'Jun', revenue: 67000, orders: 345 },
]

const categoryData = [
  { name: 'Electronics', value: 35, color: '#4f46e5' },
  { name: 'Clothing', value: 25, color: '#7c3aed' },
  { name: 'Food', value: 20, color: '#db2777' },
  { name: 'Books', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#10b981' },
]

const recentActivities = [
  { id: 1, type: 'Order', description: 'New order #1234 from ABC Corp', time: '2 min ago', status: 'new' },
  { id: 2, type: 'Payment', description: 'Payment received for invoice #5678', time: '15 min ago', status: 'success' },
  { id: 3, type: 'Stock', description: 'Low stock alert: Product XYZ', time: '1 hour ago', status: 'warning' },
  { id: 4, type: 'Employee', description: 'New employee onboarded: Jane Smith', time: '2 hours ago', status: 'info' },
  { id: 5, type: 'Order', description: 'Order #1230 shipped', time: '3 hours ago', status: 'success' },
]

const metrics = [
  {
    title: 'Total Revenue',
    value: '$328,000',
    change: '12.5% from last month',
    trend: 'up',
    icon: DollarSign,
    accent: 'metric-blue',
  },
  {
    title: 'Total Orders',
    value: '1,692',
    change: '8.2% from last month',
    trend: 'up',
    icon: ShoppingBag,
    accent: 'metric-violet',
  },
  {
    title: 'Total Employees',
    value: '142',
    change: '2 new this month',
    trend: 'up',
    icon: Users,
    accent: 'metric-emerald',
  },
  {
    title: 'Inventory Items',
    value: '3,847',
    change: '23 low stock',
    trend: 'down',
    icon: Package,
    accent: 'metric-orange',
  },
]

function MetricCard({ title, value, change, trend, icon: Icon, accent }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${accent}`}>
        <Icon size={20} />
      </div>
      <div className="metric-copy">
        <p className="metric-title">{title}</p>
        <h3 className="metric-value">{value}</h3>
        <p className={`metric-change ${trend === 'down' ? 'down' : 'up'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </p>
      </div>
    </article>
  )
}

export default function Dashboard() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">University ERP</p>
          <h1>Dashboard Overview</h1>
          <p className="hero-copy">
            Welcome back. Here is a quick view of revenue, orders, inventory, and activity across the system.
          </p>
        </div>

        <div className="hero-badge">
          <span className="pulse" />
          Live system status
        </div>
      </section>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="charts-grid">
        <article className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="panel-label">Performance</p>
              <h2>Revenue and Orders Trend</h2>
            </div>
            <span className="panel-chip">Last 6 months</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.22)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" width={48} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.96)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '14px',
                    color: '#e2e8f0',
                  }}
                  labelStyle={{ color: '#cbd5e1' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={false} name="Revenue ($)" />
                <Line type="monotone" dataKey="orders" stroke="#7c3aed" strokeWidth={3} dot={false} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Mix</p>
              <h2>Sales by Category</h2>
            </div>
            <span className="panel-chip">Current quarter</span>
          </div>

          <div className="chart-wrap pie-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={108}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.96)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '14px',
                    color: '#e2e8f0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-header">
          <div>
            <p className="panel-label">Operations</p>
            <h2>Recent Activity</h2>
          </div>
          <span className="panel-chip">Updated now</span>
        </div>

        <div className="activity-list">
          {recentActivities.map((activity) => (
            <article key={activity.id} className="activity-item">
              <div className={`status-dot ${activity.status}`} />
              <div className="activity-copy">
                <p>{activity.description}</p>
                <span>{activity.time}</span>
              </div>
              <span className="activity-type">{activity.type}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
