import { useState } from 'react';
import {
  Search, Bell, Calendar, Menu, ChevronDown,
  Sun, Moon, Settings, LogOut, User, Plus
} from 'lucide-react';

const breadcrumbMap = {
  dashboard: 'Dashboard',
  'students-list': 'Students / All Students',
  'students-registration': 'Students / Registration',
  'students-attendance': 'Students / Attendance',
  'lecturers-list': 'Lecturers / All Lecturers',
  'lecturers-assignments': 'Lecturers / Assignments',
  courses: 'Courses',
  faculties: 'Faculties',
  departments: 'Departments',
  timetable: 'Timetable',
  examinations: 'Examinations',
  results: 'Results & GPA',
  finance: 'Finance & Payments',
  library: 'Library',
  hostel: 'Hostel Management',
  hr: 'Human Resources',
  assets: 'Asset Management',
  research: 'Research',
  reports: 'Reports & Analytics',
  notifications: 'Notifications',
  settings: 'Settings',
};

export default function TopNav({ onMenuToggle, activeView, isDark, onToggleDark }) {
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const breadcrumb = breadcrumbMap[activeView] || 'Dashboard';

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b bg-card"
      style={{ borderColor: 'var(--border)' }}>
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block text-sm text-muted-foreground truncate">
          <span className="text-foreground font-medium">{breadcrumb.split(' / ').pop()}</span>
          {breadcrumb.includes(' / ') && (
            <span className="ml-1 opacity-50"> · {breadcrumb.split(' / ')[0]}</span>
          )}
        </div>
      </div>

      {/* Center: search */}
      <div className={`flex-1 max-w-md mx-4 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
        ${searchFocused ? 'ring-2 ring-primary/30' : ''}
        `}
        style={{ background: 'var(--input-background)' }}>
        <Search size={15} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search students, courses, staff…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hidden sm:flex"
          title="Calendar"
        >
          <Calendar size={18} />
        </button>

        <button
          className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={onToggleDark}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hidden sm:flex"
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ml-1"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Plus size={15} />
          <span className="hidden lg:inline">Quick Add</span>
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              AD
            </div>
            <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-card rounded-xl border shadow-xl z-50 py-1 overflow-hidden"
              style={{ borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="text-sm font-semibold text-foreground">Admin User</div>
                <div className="text-xs text-muted-foreground">admin@university.edu</div>
              </div>
              {[
                { icon: <User size={14} />, label: 'Profile' },
                { icon: <Settings size={14} />, label: 'Settings' },
              ].map(item => (
                <button key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="border-t mt-1" style={{ borderColor: 'var(--border)' }}>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors">
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}