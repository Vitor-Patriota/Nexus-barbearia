import axios from 'axios'
import { auth } from './firebase'
import type { Appointment, Service, Barber, FinishServicePayload } from '../types'

const DEV_AUTH_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEV_AUTH !== 'false'

let unauthorizedRedirectInProgress = false

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '/api',
})

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // In local dev auth mode, let components handle 401 and use mock fallbacks.
      if (DEV_AUTH_ENABLED) {
        return Promise.reject(error)
      }

      // Avoid hard-refresh loops when multiple requests fail together.
      if (!unauthorizedRedirectInProgress && window.location.pathname !== '/admin') {
        unauthorizedRedirectInProgress = true
        window.location.replace('/admin')
      }
    }
    return Promise.reject(error)
  },
)

// ── Appointments ──────────────────────────────────────────────────────────────
export const createAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) =>
  api.post<Appointment>('/appointments', data)

export const getAppointmentsByDate = (date: string) =>
  api.get<Appointment[]>(`/appointments?date=${date}`)

export const updateAppointmentStatus = (
  id: string,
  status: Appointment['status'],
  payload?: FinishServicePayload,
) => api.patch<Appointment>(`/appointments/${id}/status`, { status, ...payload })

// ── Services ──────────────────────────────────────────────────────────────────
export const getServices = () => api.get<Service[]>('/services')
export const createService = (data: Omit<Service, 'id'>) => api.post<Service>('/services', data)
export const updateService = (id: string, data: Partial<Service>) =>
  api.put<Service>(`/services/${id}`, data)
export const deleteService = (id: string) => api.delete(`/services/${id}`)

// ── Barbers ───────────────────────────────────────────────────────────────────
export const getBarbers = () => api.get<Barber[]>('/barbers')
export const createBarber = (data: Omit<Barber, 'id'>) => api.post<Barber>('/barbers', data)
export const updateBarber = (id: string, data: Partial<Barber>) =>
  api.put<Barber>(`/barbers/${id}`, data)
export const deleteBarber = (id: string) => api.delete(`/barbers/${id}`)

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminStats = () => api.get('/admin/stats')
export const getRevenueChart = (period: 'week' | 'month') =>
  api.get(`/admin/revenue?period=${period}`)

export default api
