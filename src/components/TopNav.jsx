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
    <header className="h-[72px] flex items-center justify-between px-6 border-b border-gray-100 bg-white">
      
      {/* Left: Hamburger + Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block text-[15px] truncate">
          {breadcrumb.includes(' / ') && (
            <span className="text-gray-500 mr-1.5">{breadcrumb.split(' / ')[0]} /</span>
          )}
          <span className="text-gray-900 font-medium">{breadcrumb.split(' / ').pop()}</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className={`flex-1 max-w-2xl mx-8 hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-200 border
        ${searchFocused ? 'bg-white border-[#4361ee]/30 ring-4 ring-[#4361ee]/5' : 'bg-[#f4f5f7] border-transparent hover:bg-[#edf0f2]'}
        `}>
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search students, courses, staff…"
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-500 text-gray-900 font-medium"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <span className="hidden lg:inline-flex text-[13px] font-medium text-gray-400 tracking-wide">
          ⌘K
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          className="p-2.5 rounded-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 hidden sm:flex"
          title="Calendar"
        >
          <Calendar size={20} strokeWidth={1.5} />
        </button>

        <button
          className="relative p-2.5 rounded-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900"
          title="Notifications"
        >
          <Bell size={20} strokeWidth={1.5} />
          <span className="absolute top-[8px] right-[10px] w-2 h-2 rounded-full bg-[#ef4444]" />
        </button>

        <button
          onClick={onToggleDark}
          className="p-2.5 rounded-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 hidden sm:flex"
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div> {/* Subtle Divider */}

        <button
          className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ml-1 text-white bg-[#4361ee] hover:bg-[#3651cc]"
        >
          <Plus size={18} strokeWidth={2} />
          <span className="hidden lg:inline">Quick Add</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1 rounded-full"
          >
            <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold text-white bg-[#4361ee]">
              AD
            </div>
            <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] z-50 py-1.5 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-50">
                <div className="text-[14px] font-bold text-gray-900 leading-tight">Admin User</div>
                <div className="text-[12px] text-gray-500 mt-0.5">admin@university.edu</div>
              </div>
              <div className="py-1.5">
                {[
                  { icon: <User size={15} />, label: 'Profile' },
                  { icon: <Settings size={15} />, label: 'Settings' },
                ].map(item => (
                  <button key={item.label}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-400">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-50 mt-1 pt-1.5 pb-1">
                <button className="w-full flex items-center gap-3 px-5 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut size={15} />
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