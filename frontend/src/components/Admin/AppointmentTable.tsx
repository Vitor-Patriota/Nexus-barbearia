import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getAppointmentsByDate, updateAppointmentStatus } from '../../services/api'
import type { Appointment } from '../../types'
import FinishServiceModal from './FinishServiceModal'
import styles from './Admin.module.css'

const MOCK: Appointment[] = [
  { id: '1', serviceId: '1', serviceName: 'Corte Clássico', servicePrice: 45, barberId: '1', barberName: 'Marcus Silva', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00', clientName: 'João Pereira', clientPhone: '(11) 99999-1234', clientEmail: '', status: 'confirmed' },
  { id: '2', serviceId: '2', serviceName: 'Corte + Barba', servicePrice: 75, barberId: '2', barberName: 'Diego Costa', date: format(new Date(), 'yyyy-MM-dd'), time: '10:30', clientName: 'Carlos Eduardo', clientPhone: '(11) 98888-5678', clientEmail: '', status: 'pending' },
  { id: '3', serviceId: '4', serviceName: 'Degradê Premium', servicePrice: 55, barberId: '3', barberName: 'Rafael Bronx', date: format(new Date(), 'yyyy-MM-dd'), time: '11:15', clientName: 'Bruno Alves', clientPhone: '(11) 97777-9012', clientEmail: '', status: 'completed', finalPrice: 55 },
  { id: '4', serviceId: '6', serviceName: 'Pacote VIP', servicePrice: 120, barberId: '1', barberName: 'Marcus Silva', date: format(new Date(), 'yyyy-MM-dd'), time: '14:15', clientName: 'Felipe Santos', clientPhone: '(11) 96666-3456', clientEmail: '', status: 'pending' },
]

const STATUS_LABELS: Record<Appointment['status'], string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

export default function AppointmentTable() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK)
  const [finishTarget, setFinishTarget] = useState<Appointment | null>(null)

  useEffect(() => {
    getAppointmentsByDate(today)
      .then((res) => setAppointments(res.data))
      .catch(() => setAppointments(MOCK))
  }, [today])

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return
    try {
      await updateAppointmentStatus(id, 'cancelled')
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
      )
    } catch {
      // keep UI optimistic on error-free mock environment
    }
  }

  const handleFinished = (id: string, finalPrice: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed', finalPrice } : a)),
    )
  }

  return (
    <div className={styles.tableCard}>
      <h2 className={styles.sectionTitle} style={{ marginBottom: '1.25rem' }}>
        Agendamentos de Hoje
      </h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Horário</th>
              <th className={styles.th}>Cliente</th>
              <th className={styles.th}>Serviço</th>
              <th className={styles.th}>Barbeiro</th>
              <th className={styles.th}>Valor</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className={styles.tr}>
                <td className={styles.td}>
                  <span className={styles.timeTag}>{a.time}</span>
                </td>
                <td className={styles.td}>
                  <span className={styles.clientName}>{a.clientName}</span>
                  <span className={styles.clientPhone}>{a.clientPhone}</span>
                </td>
                <td className={styles.td}>{a.serviceName}</td>
                <td className={styles.td}>{a.barberName}</td>
                <td className={styles.td}>
                  <span className={styles.price}>
                    R$ {(a.finalPrice ?? a.servicePrice).toLocaleString('pt-BR')}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${styles[`badge-${a.status}`]}`}>
                    {STATUS_LABELS[a.status]}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <>
                        <button
                          className={styles.actionBtn}
                          onClick={() => setFinishTarget(a)}
                          title="Finalizar"
                        >
                          ✓ Finalizar
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => a.id && handleCancel(a.id)}
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {finishTarget && (
        <FinishServiceModal
          appointment={finishTarget}
          onClose={() => setFinishTarget(null)}
          onConfirm={handleFinished}
        />
      )}
    </div>
  )
}
