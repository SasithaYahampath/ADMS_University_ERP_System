import React, { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, ChevronDown, MoonStar, Plus, Search } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './screens/Dashboard.jsx'
import SectionPage from './screens/SectionPage.jsx'
import './App.css'

export default function App() {
  return React.createElement(BrowserRouter, null, React.createElement(AppRoutes, null))
}

function AppRoutes() {
  return React.createElement(
    Routes,
    null,
    React.createElement(
      Route,
      { element: React.createElement(AppLayout) },
      React.createElement(Route, {
        path: '/',
        element: React.createElement(Navigate, { to: '/dashboard', replace: true }),
      }),
      React.createElement(Route, { path: '/dashboard', element: React.createElement(Dashboard) }),
      React.createElement(Route, {
        path: '/sales',
        element: React.createElement(SectionPage, {
          title: 'Sales',
          description: 'Monitor orders, invoices, returns, and daily sales performance from a single place.',
        }),
      }),
      React.createElement(Route, {
        path: '/inventory',
        element: React.createElement(SectionPage, {
          title: 'Inventory',
          description: 'Track stock levels, low inventory alerts, and product movement across locations.',
        }),
      }),
      React.createElement(Route, {
        path: '/hr',
        element: React.createElement(SectionPage, {
          title: 'HR',
          description: 'Handle employee records, onboarding, attendance, and team administration.',
        }),
      }),
      React.createElement(Route, {
        path: '/finance',
        element: React.createElement(SectionPage, {
          title: 'Finance',
          description: 'Review cash flow, budgets, expenses, and financial summaries for the ERP system.',
        }),
      }),
      React.createElement(Route, {
        path: '/students-registration',
        element: React.createElement(SectionPage, {
          title: 'Students Registration',
          description: 'Review recent applications, admissions progress, and student enrollment workflows.',
        }),
      }),
      React.createElement(Route, {
        path: '/examinations',
        element: React.createElement(SectionPage, {
          title: 'Examinations',
          description: 'Manage exam schedules, halls, invigilation, and the academic assessment calendar.',
        }),
      }),
      React.createElement(Route, {
        path: '/reports',
        element: React.createElement(SectionPage, {
          title: 'Reports',
          description: 'Generate operational reports and review KPI snapshots for decision making.',
        }),
      }),
      React.createElement(Route, {
        path: '/settings',
        element: React.createElement(SectionPage, {
          title: 'Settings',
          description: 'Update application preferences, permissions, and system configuration.',
        }),
      }),
      React.createElement(Route, {
        path: '*',
        element: React.createElement(Navigate, { to: '/dashboard', replace: true }),
      }),
    ),
  )
}

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const activeView = useMemo(() => {
    const path = location.pathname.replace(/^\//, '')
    return path || 'dashboard'
  }, [location.pathname])

  const setActiveView = (view) => {
    navigate(`/${view}`)
  }

  return React.createElement(
    'div',
    { className: 'app-shell' },
    React.createElement(Sidebar, {
      activeView,
      setActiveView,
      isMobileOpen,
      setIsMobileOpen,
    }),
    React.createElement(
      'main',
      { className: 'app-main' },
      React.createElement(
        'header',
        { className: 'app-topbar app-topbar-desktop' },
        React.createElement(
          'div',
          { className: 'topbar-left' },
          React.createElement('h2', { className: 'topbar-brand' }, 'Dashboard'),
          React.createElement(
            'label',
            { className: 'search-box' },
            React.createElement(Search, { size: 16, className: 'search-icon' }),
            React.createElement('input', {
              type: 'search',
              placeholder: 'Search students, courses, staff...',
              'aria-label': 'Search students, courses, staff',
            }),
            React.createElement('span', { className: 'search-shortcut' }, '⌘K'),
          ),
        ),
        React.createElement(
          'div',
          { className: 'topbar-actions' },
          React.createElement(
            'button',
            { type: 'button', className: 'topbar-icon-button', 'aria-label': 'Calendar' },
            React.createElement(CalendarDays, { size: 18 }),
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'topbar-icon-button notification-button', 'aria-label': 'Notifications' },
            React.createElement(Bell, { size: 18 }),
            React.createElement('span', { className: 'notification-dot' }),
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'topbar-icon-button', 'aria-label': 'Theme' },
            React.createElement(MoonStar, { size: 18 }),
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'quick-add-button' },
            React.createElement(Plus, { size: 16 }),
            React.createElement('span', null, 'Quick Add'),
          ),
          React.createElement(
            'button',
            { type: 'button', className: 'profile-button', 'aria-label': 'User menu' },
            React.createElement('span', { className: 'profile-avatar' }, 'AD'),
            React.createElement(ChevronDown, { size: 14 }),
          ),
        ),
      ),
      React.createElement(
        'header',
        { className: 'app-topbar app-topbar-mobile' },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'menu-button',
            onClick: () => setIsMobileOpen(true),
            'aria-label': 'Open navigation',
          },
          '☰',
        ),
        React.createElement(
          'h2',
          { className: 'topbar-title' },
          activeView.charAt(0).toUpperCase() + activeView.slice(1),
        ),
      ),
      React.createElement('section', { className: 'app-content' }, React.createElement(Outlet, null)),
    ),
  )
}
