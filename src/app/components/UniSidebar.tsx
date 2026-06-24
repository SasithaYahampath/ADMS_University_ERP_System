import { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Building2, Layers,
  Calendar, ClipboardCheck, FileText, CreditCard,
  Library, Home, UserCog, Package, BarChart3, Bell,
  Settings, ChevronRight, GraduationCap, X, Award, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../services/auth';

// ─── Nav item definitions ─────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  roles: UserRole[];                          // which roles can see this item
  children?: { id: string; label: string }[];
}

const ALL_NAV: NavItem[] = [
  {
    id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} />,
    roles: ['Admin'],
  },
  {
    id: 'students', label: 'Students', icon: <Users size={17} />, badge: 3,
    roles: ['Admin', 'Lecturer'],
    children: [
      { id: 'students-list',         label: 'All Students' },
      { id: 'students-registration', label: 'Registration' },
      { id: 'students-attendance',   label: 'Attendance' },
    ],
  },
  {
    id: 'user-management', label: 'User Management', icon: <ShieldCheck size={17} />,
    roles: ['Admin'],
  },
  {
    id: 'lecturers', label: 'Lecturers', icon: <UserCog size={17} />,
    roles: ['Admin'],
    children: [
      { id: 'lecturers-list',        label: 'All Lecturers' },
      { id: 'lecturers-assignments', label: 'Assignments' },
    ],
  },
  {
    id: 'courses', label: 'Courses', icon: <BookOpen size={17} />,
    roles: ['Admin', 'Lecturer', 'Student'],
  },
  {
    id: 'faculties', label: 'Faculties', icon: <Building2 size={17} />,
    roles: ['Admin'],
  },
  {
    id: 'departments', label: 'Departments', icon: <Layers size={17} />,
    roles: ['Admin'],
  },
  // {
  //   id: 'timetable', label: 'Timetable', icon: <Calendar size={17} />,
  //   roles: ['Admin', 'Lecturer', 'Student'],
  // },
  {
    id: 'examinations', label: 'Examinations', icon: <ClipboardCheck size={17} />, badge: 2,
    roles: ['Admin', 'Lecturer', 'Student'],
  },
  {
    id: 'results', label: 'Results & GPA', icon: <Award size={17} />,
    roles: ['Admin', 'Lecturer', 'Student'],
  },
  {
    id: 'finance', label: 'Finance & Payments', icon: <CreditCard size={17} />,
    roles: ['Admin', 'Student'],
  },
  // {
  //   id: 'library', label: 'Library', icon: <Library size={17} />,
  //   roles: ['Admin', 'Lecturer', 'Student'],
  // },
  // {
  //   id: 'hostel', label: 'Hostel Management', icon: <Home size={17} />,
  //   roles: ['Admin'],
  // },
  // {
  //   id: 'hr', label: 'Human Resources', icon: <Users size={17} />,
  //   roles: ['Admin'],
  // },
  // {
  //   id: 'assets', label: 'Asset Management', icon: <Package size={17} />,
  //   roles: ['Admin'],
  // },
  // {
  //   id: 'research', label: 'Research', icon: <FileText size={17} />,
  //   roles: ['Admin', 'Lecturer'],
  // },
  // {
  //   id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 size={17} />,
  //   roles: ['Admin'],
  // },
  {
    id: 'notifications', label: 'Notifications', icon: <Bell size={17} />, badge: 7,
    roles: ['Admin', 'Lecturer', 'Student'],
  },
  {
    id: 'settings', label: 'Settings', icon: <Settings size={17} />,
    roles: ['Admin', 'Lecturer', 'Student'],
  },
];

// Role → accent color for the role badge on the profile card
const ROLE_COLORS: Record<UserRole, { bg: string; text: string }> = {
  Admin:    { bg: 'rgba(59,91,219,0.25)',  text: '#a5b4fc' },
  Lecturer: { bg: 'rgba(16,185,129,0.2)',  text: '#6ee7b7' },
  Student:  { bg: 'rgba(245,158,11,0.2)',  text: '#fcd34d' },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface UniSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UniSidebar({ activeView, onNavigate, isMobileOpen, onCloseMobile }: UniSidebarProps) {
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(['students']);

  const role = user?.role ?? 'Admin';
  const visibleNav = ALL_NAV.filter(item => item.roles.includes(role));

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNav = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  const isParentActive = (item: NavItem) =>
    activeView === item.id || item.children?.some(c => c.id === activeView);

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300
          lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--sidebar)', borderRight: '1px solid rgba(129,140,248,0.12)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4"
          style={{ borderBottom: '1px solid rgba(129,140,248,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)' }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm leading-tight text-white">UniERP</div>
              <div className="text-xs leading-tight" style={{ color: 'rgba(199,210,254,0.5)' }}>
                Management System
              </div>
            </div>
          </div>
          <button onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(199,210,254,0.5)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Role badge */}
        {user && (
          <div className="px-4 pt-3 pb-1">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={ROLE_COLORS[user.role]}>
              {user.role} Portal
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5"
          style={{ scrollbarWidth: 'none' }}>
          {visibleNav.map(item => {
            const parentActive = isParentActive(item);
            const expanded     = expandedItems.includes(item.id);
            const selfActive   = activeView === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.children) toggleExpanded(item.id);
                    else handleNav(item.id);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
                  style={{
                    background: selfActive
                      ? 'rgba(129,140,248,0.2)'
                      : parentActive && !item.children
                        ? 'rgba(129,140,248,0.1)'
                        : 'transparent',
                    color: parentActive ? '#e0e7ff' : 'rgba(199,210,254,0.6)',
                  }}
                  onMouseEnter={e => {
                    if (!selfActive) (e.currentTarget as HTMLElement).style.background = 'rgba(129,140,248,0.12)';
                    (e.currentTarget as HTMLElement).style.color = '#e0e7ff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = selfActive
                      ? 'rgba(129,140,248,0.2)'
                      : parentActive && !item.children ? 'rgba(129,140,248,0.1)' : 'transparent';
                    (e.currentTarget as HTMLElement).style.color = parentActive ? '#e0e7ff' : 'rgba(199,210,254,0.6)';
                  }}
                >
                  <span style={{ color: parentActive ? '#818cf8' : 'rgba(199,210,254,0.5)' }}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left"
                    style={{ fontSize: 13.5, fontWeight: parentActive ? 600 : 400 }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center"
                      style={{ background: '#ef4444', color: '#fff', fontSize: 10 }}>
                      {item.badge}
                    </span>
                  )}
                  {item.children && (
                    <ChevronRight size={13}
                      style={{
                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        opacity: 0.4, color: '#c7d2fe', flexShrink: 0,
                      }}
                    />
                  )}
                </button>

                {item.children && expanded && (
                  <div className="mt-1 mb-1 space-y-0.5"
                    style={{ paddingLeft: 36, borderLeft: '1px solid rgba(129,140,248,0.18)', marginLeft: 20 }}>
                    {item.children.map(child => {
                      const childActive = activeView === child.id;
                      return (
                        <button key={child.id} onClick={() => handleNav(child.id)}
                          className="w-full text-left px-3 py-2 rounded-lg transition-all duration-150"
                          style={{
                            fontSize: 13,
                            fontWeight: childActive ? 600 : 400,
                            background: childActive ? 'rgba(129,140,248,0.18)' : 'transparent',
                            color: childActive ? '#c7d2fe' : 'rgba(199,210,254,0.5)',
                          }}
                          onMouseEnter={e => {
                            if (!childActive) {
                              (e.currentTarget as HTMLElement).style.background = 'rgba(129,140,248,0.1)';
                              (e.currentTarget as HTMLElement).style.color = '#c7d2fe';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!childActive) {
                              (e.currentTarget as HTMLElement).style.background = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = 'rgba(199,210,254,0.5)';
                            }
                          }}>
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile + logout */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(129,140,248,0.12)' }}>
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl"
            style={{ background: 'rgba(129,140,248,0.08)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)' }}>
              {user?.avatarCode ?? '??'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight text-white truncate">
                {user?.name ?? 'Unknown User'}
              </div>
              <div className="text-xs truncate leading-tight mt-0.5"
                style={{ color: 'rgba(199,210,254,0.45)' }}>
                {user?.email ?? ''}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#34d399' }} />
          </div>

          <button onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
            style={{ color: 'rgba(248,113,113,0.8)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#f87171';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.8)';
            }}>
            <LogOut size={15} />
            <span style={{ fontSize: 13.5 }}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
