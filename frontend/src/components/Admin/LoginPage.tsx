import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './LoginPage.module.css'

const DEV_AUTH_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH !== 'false'
const DEV_ADMIN_EMAIL = import.meta.env.VITE_DEV_ADMIN_EMAIL || 'admin@bronxbarber.com'
const DEV_ADMIN_PASSWORD = import.meta.env.VITE_DEV_ADMIN_PASSWORD || 'admin123'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState(DEV_AUTH_ENABLED ? DEV_ADMIN_EMAIL : '')
  const [password, setPassword] = useState(DEV_AUTH_ENABLED ? DEV_ADMIN_PASSWORD : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch {
      setError('Credenciais inválidas. Verifique e-mail e senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.logo}>
          BRONX <span>BARBER</span>STORE
        </div>
        <h1 className={styles.title}>Painel Administrativo</h1>
        <p className={styles.subtitle}>Acesso restrito a administradores</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              className={styles.input}
              type="email"
              placeholder="admin@bronxbarber.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
