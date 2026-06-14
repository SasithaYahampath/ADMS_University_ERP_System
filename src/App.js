import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './screens/Dashboard.jsx'

export default function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: '/', element: React.createElement(Dashboard) }),
      React.createElement(Route, {
        path: '*',
        element: React.createElement(Navigate, { to: '/', replace: true }),
      }),
    ),
  )
}
