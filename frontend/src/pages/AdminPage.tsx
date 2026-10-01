import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginPage from '../components/Admin/LoginPage'
import Dashboard from '../components/Admin/Dashboard'

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/dashboard/*"
        element={user ? <Dashboard /> : <Navigate to="/admin" replace />}
      />
    </Routes>
  )
}
