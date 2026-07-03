import { useState } from 'react';
import {
  Search, Bell, Calendar, Menu, ChevronDown,
  Sun, Moon, Settings, LogOut, User, Plus, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const breadcrumbMap: Record<string, string> = {
  dashboard:              'Dashboard',
  'students-list':        'Students / All Students',
  'students-registration':'Students / Registration',
  'students-attendance':  'Students / Attendance',
  'lecturers-list':       'Lecturers / All Lecturers',
  'lecturers-assignments':'Lecturers / Assignments',
  courses:     'Courses',
  faculties:   'Faculties',
  departments: 'Departments',
  timetable:   'Timetable',
  examinations:'Examinations',
  results:     'Results & GPA',
  finance:     'Finance & Payments',
  library:     'Library',
  hostel:      'Hostel Management',
  hr:          'Human Resources',
  assets:      'Asset Management',
  research:    'Research',
  reports:     'Reports & Analytics',
  notifications:'Notifications',
  settings:    'Settings',
};

interface UniTopNavProps {
  onMenuToggle: () => void;
  activeView: string;
  isDark: boolean;
  onToggleDark: () => void;
}

export function UniTopNav({ onMenuToggle, activeView, isDark, onToggleDark }: UniTopNavProps) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile]   = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');

  const breadcrumb = breadcrumbMap[activeView] ?? 'Dashboard';
  const parts = breadcrumb.split(' / ');

  const roleColors: Record<string, string> = {
    Admin:    '#3b5bdb',
    Lecturer: '#059669',
    Student:  '#d97706',
  };
  const roleColor = roleColors[user?.role ?? 'Admin'] ?? '#3b5bdb';

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b bg-card sticky top-0 z-30"
      style={{ borderColor: 'var(--border)' }}>

      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
          {parts.length > 1 && (
            <>
              <span className="text-muted-foreground truncate">{parts[0]}</span>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          <span className="text-foreground font-semibold truncate">{parts[parts.length - 1]}</span>
        </div>
      </div>

      {/* Center: search */}
      <div className={`flex-1 max-w-md mx-4 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${searchFocused ? 'ring-2' : ''}`}
        style={{
          background: 'var(--input-background)',
          boxShadow: searchFocused ? '0 0 0 2px rgba(59,91,219,0.2)' : 'none',
        }}>
        <Search size={14} className="text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search students, courses, staff…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery
          ? <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground"><X size={13} /></button>
          : <kbd className="hidden lg:inline-flex items-center text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        }
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hidden sm:flex" title="Calendar">
          <Calendar size={17} />
        </button>

        <button className="relative p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground" title="Notifications">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button onClick={onToggleDark}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hidden sm:flex"
          title="Toggle dark mode">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Quick Add — admin/lecturer only */}
        {user?.role !== 'Student' && (
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-white ml-1"
            style={{ background: 'var(--primary)' }}>
            <Plus size={14} />
            <span className="hidden lg:inline">Quick Add</span>
          </button>
        )}

        {/* Profile dropdown */}
        <div className="relative ml-1">
          <button onClick={() => setShowProfile(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: roleColor }}>
              {user?.avatarCode ?? '??'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-foreground text-xs font-semibold leading-tight">{user?.name ?? 'User'}</div>
              <div className="text-muted-foreground leading-tight" style={{ fontSize: 10 }}>{user?.role}</div>
            </div>
            <ChevronDown size={13} className="text-muted-foreground hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-2xl border shadow-xl z-50 py-1 overflow-hidden"
              style={{ borderColor: 'var(--border)' }}>
              {/* User info */}
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: roleColor }}>
                    {user?.avatarCode ?? '??'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{user?.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ background: roleColor }}>
                    {user?.role}
                  </span>
                  {user?.studentId && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-mono">{user.studentId}</span>
                  )}
                  {user?.lecturerId && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-mono">{user.lecturerId}</span>
                  )}
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: <User size={14} />, label: 'My Profile' },
                { icon: <Settings size={14} />, label: 'Settings' },
              ].map(item => (
                <button key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                  <span className="text-muted-foreground">{item.icon}</span>
                  {item.label}
                </button>
              ))}

              <div className="border-t mt-1" style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => { setShowProfile(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-muted transition-colors">
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
