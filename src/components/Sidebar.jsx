import { LayoutDashboard, ShoppingCart, Package, Users, DollarSign, BarChart3, Settings, X } from 'lucide-react'
import './Sidebar.css'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'hr', label: 'HR', icon: Users },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {isMobileOpen ? (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`sidebar ${isMobileOpen ? 'is-open' : ''}`}
        aria-label="Primary navigation"
      >
        <div className="sidebar-header">
          <h1 className="sidebar-title">ERP System</h1>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="sidebar-close-button"
            aria-label="Close navigation"
          >
            <X className="icon-sm" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveView(item.id)
                  setIsMobileOpen(false)
                }}
                className={`sidebar-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon className="icon-sm" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
