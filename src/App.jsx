import React, { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// Correct imports based on your file structure
import Sidebar from './components/Sidebar.jsx';
import TopNav from './components/TopNav.jsx'; // Make sure you save the TopNav component here
import Dashboard from './screens/Dashboard.jsx';
import SectionPage from './screens/SectionPage.jsx';

import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/sales" element={
          <SectionPage title="Sales" description="Monitor orders, invoices, returns, and daily sales performance from a single place." />
        } />
        <Route path="/inventory" element={
          <SectionPage title="Inventory" description="Track stock levels, low inventory alerts, and product movement across locations." />
        } />
        <Route path="/hr" element={
          <SectionPage title="HR" description="Handle employee records, onboarding, attendance, and team administration." />
        } />
        <Route path="/finance" element={
          <SectionPage title="Finance" description="Review cash flow, budgets, expenses, and financial summaries for the ERP system." />
        } />
        <Route path="/students-registration" element={
          <SectionPage title="Students Registration" description="Review recent applications, admissions progress, and student enrollment workflows." />
        } />
        <Route path="/examinations" element={
          <SectionPage title="Examinations" description="Manage exam schedules, halls, invigilation, and the academic assessment calendar." />
        } />
        <Route path="/reports" element={
          <SectionPage title="Reports" description="Generate operational reports and review KPI snapshots for decision making." />
        } />
        <Route path="/settings" element={
          <SectionPage title="Settings" description="Update application preferences, permissions, and system configuration." />
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Sync active view with current URL route
  const activeView = useMemo(() => {
    const path = location.pathname.replace(/^\//, '');
    return path || 'dashboard';
  }, [location.pathname]);

  const handleNavigate = (view) => {
    navigate(`/${view}`);
    setIsMobileOpen(false);
  };

  const handleToggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />
      
      {/* 260px matches the width of the new Sidebar component */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <TopNav
          onMenuToggle={() => setIsMobileOpen(true)}
          activeView={activeView}
          isDark={isDark}
          onToggleDark={handleToggleDark}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}