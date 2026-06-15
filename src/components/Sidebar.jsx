import { useState } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Building2, Layers,
  Calendar, ClipboardCheck, FileText, CreditCard,
  Library, Home, UserCog, Package, BarChart3, Bell,
  Settings, ChevronRight, GraduationCap, X, Award
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  {
    id: 'students', label: 'Students', icon: <Users size={18} />, badge: 3,
    children: [
      { id: 'students-list', label: 'All Students' },
      { id: 'students-registration', label: 'Registration' },
      { id: 'students-attendance', label: 'Attendance' },
    ]
  },
  {
    id: 'lecturers', label: 'Lecturers', icon: <UserCog size={18} />,
    children: [
      { id: 'lecturers-list', label: 'All Lecturers' },
      { id: 'lecturers-assignments', label: 'Assignments' },
    ]
  },
  { id: 'courses', label: 'Courses', icon: <BookOpen size={18} /> },
  { id: 'faculties', label: 'Faculties', icon: <Building2 size={18} /> },
  { id: 'departments', label: 'Departments', icon: <Layers size={18} /> },
  { id: 'timetable', label: 'Timetable', icon: <Calendar size={18} /> },
  { id: 'examinations', label: 'Examinations', icon: <ClipboardCheck size={18} />, badge: 2 },
  { id: 'results', label: 'Results & GPA', icon: <Award size={18} /> },
  { id: 'finance', label: 'Finance & Payments', icon: <CreditCard size={18} /> },
  { id: 'library', label: 'Library', icon: <Library size={18} /> },
  { id: 'hostel', label: 'Hostel Management', icon: <Home size={18} /> },
  { id: 'hr', label: 'Human Resources', icon: <Users size={18} /> },
  { id: 'assets', label: 'Asset Management', icon: <Package size={18} /> },
  { id: 'research', label: 'Research', icon: <FileText size={18} /> },
  { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, badge: 7 },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function Sidebar({ activeView, onNavigate, isMobileOpen, onCloseMobile }) {
  // Removing 'students' from default expanded to match the screenshot exactly
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleNav = (id) => {
    onNavigate(id);
    onCloseMobile();
  };

  const isParentActive = (item) =>
    activeView === item.id || item.children?.some(c => c.id === activeView);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 font-sans
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#1c1a36' }} // Exact dark purple/navy background
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between px-5 py-6 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[#6366f1]">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-[15px] leading-tight text-white tracking-wide">UniERP</div>
              <div className="text-[13px] leading-tight mt-0.5" style={{ color: '#888ba3' }}>
                Management System
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg transition-colors text-[#888ba3]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1"
          style={{ scrollbarWidth: 'none' }}>
          {navItems.map(item => {
            const parentActive = isParentActive(item);
            const expanded = expandedItems.includes(item.id);
            const selfActive = activeView === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.children) {
                      toggleExpanded(item.id);
                    } else {
                      handleNav(item.id);
                    }
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group"
                  style={{
                    background: selfActive ? '#2e2b5c' : 'transparent',
                    color: selfActive ? '#ffffff' : '#888ba3',
                  }}
                  onMouseEnter={e => {
                    if (!selfActive) {
                      e.currentTarget.style.background = 'rgba(46, 43, 92, 0.5)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!selfActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888ba3';
                    }
                  }}
                >
                  <span className="shrink-0 transition-colors" style={{ color: selfActive ? '#ffffff' : '#888ba3' }}>
                    {item.icon}
                  </span>
                  
                  <span className="flex-1 text-left text-[14px]" style={{ fontWeight: selfActive ? 600 : 500 }}>
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[11px] font-bold text-white bg-[#ef4444]">
                      {item.badge}
                    </span>
                  )}

                  {item.children && (
                    <ChevronRight
                      size={15}
                      style={{
                        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                        color: '#888ba3',
                      }}
                    />
                  )}
                </button>

                {/* Sub-menu (Hidden in screenshot, but styled to match the dark theme) */}
                {item.children && expanded && (
                  <div className="mt-1 mb-2 space-y-1" style={{ paddingLeft: 46 }}>
                    {item.children.map(child => {
                      const childActive = activeView === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleNav(child.id)}
                          className="w-full text-left px-3 py-2 rounded-xl transition-all duration-200"
                          style={{
                            fontSize: 13.5,
                            fontWeight: childActive ? 600 : 500,
                            background: childActive ? 'rgba(46, 43, 92, 0.5)' : 'transparent',
                            color: childActive ? '#ffffff' : '#888ba3',
                          }}
                          onMouseEnter={e => {
                            if (!childActive) e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={e => {
                            if (!childActive) e.currentTarget.style.color = '#888ba3';
                          }}
                        >
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

        {/* Bottom User Profile */}
        <div className="pt-4 pb-5 px-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-colors bg-[#25224c] hover:bg-[#2e2b5c]">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 bg-[#6366f1]">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold leading-tight text-white">Admin User</div>
              <div className="text-[12px] truncate leading-tight mt-1 text-[#888ba3]">
                admin@university.edu
              </div>
            </div>
            <div className="w-2 h-2 rounded-full shrink-0 bg-[#10b981]" />
          </div>
        </div>
      </aside>
    </>
  );
}