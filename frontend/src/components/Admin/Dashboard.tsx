import { useState } from 'react'
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SummaryCards from './SummaryCards'
import RevenueChart from './RevenueChart'
import AppointmentTable from './AppointmentTable'
import ServiceManagement from './ServiceManagement'
import BarberManagement from './BarberManagement'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/admin')
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          BRONX <span>BARBER</span>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/admin/dashboard/services"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
          >
            ✂️ Serviços
          </NavLink>
          <NavLink
            to="/admin/dashboard/barbers"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}
          >
            💈 Barbeiros
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? '...' : 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Routes>
          <Route
            index
            element={
              <>
                <div className={styles.pageHeader}>
                  <h1 className={styles.pageTitle}>Dashboard</h1>
                  <span className={styles.pageDate}>
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <SummaryCards />
                <RevenueChart />
                <AppointmentTable />
              </>
            }
          />
          <Route
            path="services"
            element={
              <>
                <div className={styles.pageHeader}>
                  <h1 className={styles.pageTitle}>Gestão de Serviços</h1>
                </div>
                <ServiceManagement />
              </>
            }
          />
          <Route
            path="barbers"
            element={
              <>
                <div className={styles.pageHeader}>
                  <h1 className={styles.pageTitle}>Gestão de Barbeiros</h1>
                </div>
                <BarberManagement />
              </>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
