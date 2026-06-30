import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { UniSidebar } from './components/UniSidebar';
import { UniTopNav } from './components/UniTopNav';
import { UniDashboard } from './components/UniDashboard';
import { UniStudents } from './components/UniStudents';
import { UniLecturers } from './components/UniLecturers';
import { UniCourses } from './components/UniCourses';
import { UniExaminations } from './components/UniExaminations';
import { UniFinance } from './components/UniFinance';
import { UniSettings } from './components/UniSettings';
import { UniUserManagement } from './components/UniUserManagement';
{/* MARKER-MAKE-KIT-INVOKED */}
{/* MARKER-MAKE-KIT-DISCOVERY-READ */}

function PlaceholderModule({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--secondary)' }}>
        <GraduationCap size={36} style={{ color: 'var(--primary)' }} />
      </div>
      <h2 className="text-foreground">{title}</h2>
      <p className="text-muted-foreground text-sm">This module is coming soon.</p>
    </div>
  );
}

// ─── Loading splash ────────────────────────────────────────────────────────────

function LoadingSplash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--primary)' }}>
        <GraduationCap size={28} className="text-white" />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: 'var(--primary)', animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="text-muted-foreground text-sm">Restoring your session…</p>
    </div>
  );
}

// ─── ERP Shell (shown when authenticated) ─────────────────────────────────────

function ERPShell() {
  const { user } = useAuth();
  const [activeView, setActiveView]   = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark]           = useState(false);

  const handleToggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  const renderContent = () => {
    // Students can only see their own data
    if (user?.role === 'Student') {
      switch (activeView) {
        case 'courses':     return <UniCourses />;
        case 'examinations':return <UniExaminations />;
        case 'results':     return <UniStudents activeTab={activeView} />;
        case 'finance':     return <UniFinance />;
        case 'notifications':return <PlaceholderModule title="Notifications" />;
        case 'settings':    return <UniSettings />;
        default:            return  <UniCourses  />;
      }
    }

    // Lecturers
    if (user?.role === 'Lecturer') {
      switch (activeView) {
        case 'dashboard':           return <UniDashboard onNavigate={setActiveView} />;
        case 'lecturers':
        case 'lecturers-list':
        case 'lecturers-assignments': return <UniLecturers activeTab={activeView} />;
        case 'courses':             return <UniCourses />;
        case 'timetable':           return <PlaceholderModule title="Timetable" />;
        case 'examinations':        return <UniExaminations />;
        case 'results':             return <PlaceholderModule title="Results & GPA" />;
        case 'students-attendance': return <UniStudents activeTab={activeView} />;
        case 'notifications':       return <PlaceholderModule title="Notifications" />;
        case 'settings':            return <UniSettings />;
        default:                    return <UniDashboard onNavigate={setActiveView} />;
      }
    }

    // Admin — full access
    switch (activeView) {
      case 'dashboard':             return <UniDashboard onNavigate={setActiveView} />;
      case 'students':
      case 'students-list':
      case 'students-registration':
      case 'students-attendance':   return <UniStudents activeTab={activeView} onNavigate={setActiveView} />;
      case 'lecturers':
      case 'lecturers-list':
      case 'lecturers-assignments': return <UniLecturers activeTab={activeView} onNavigate={setActiveView} />;
      case 'courses':               return <UniCourses />;
      case 'examinations':          return <UniExaminations />;
      case 'finance':               return <UniFinance />;
      case 'user-management':       return <UniUserManagement />;
      case 'faculties':             return <PlaceholderModule title="Faculty Management" />;
      case 'departments':           return <PlaceholderModule title="Department Management" />;
      case 'timetable':             return <PlaceholderModule title="Timetable" />;
      case 'results':               return <PlaceholderModule title="Results & GPA" />;
      case 'library':               return <PlaceholderModule title="Library Management" />;
      case 'hostel':                return <PlaceholderModule title="Hostel Management" />;
      case 'hr':                    return <PlaceholderModule title="Human Resources" />;
      case 'assets':                return <PlaceholderModule title="Asset Management" />;
      case 'research':              return <PlaceholderModule title="Research Management" />;
      case 'reports':               return <PlaceholderModule title="Reports & Analytics" />;
      case 'notifications':         return <PlaceholderModule title="Notifications" />;
      case 'settings':              return <PlaceholderModule title="Settings" />;
      default:                      return <UniDashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <UniSidebar
        activeView={activeView}
        onNavigate={setActiveView}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <UniTopNav
          onMenuToggle={() => setIsMobileOpen(true)}
          activeView={activeView}
          isDark={isDark}
          onToggleDark={handleToggleDark}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// ─── Auth gate ─────────────────────────────────────────────────────────────────

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)       return <LoadingSplash />;
  if (!isAuthenticated) return <LoginPage />;
  return <ERPShell />;
}

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
