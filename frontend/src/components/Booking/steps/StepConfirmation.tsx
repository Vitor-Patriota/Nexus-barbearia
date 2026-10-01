import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useBooking } from '../../../contexts/BookingContext'
import { createAppointment } from '../../../services/api'
import styles from './Steps.module.css'

export default function StepConfirmation() {
  const { formData, closeBooking, prevStep } = useBooking()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const { service, barber, date, time, clientName, clientPhone, clientEmail } = formData

  const handleConfirm = async () => {
    if (!service || !barber) return
    setSubmitting(true)
    setError('')

    try {
      await createAppointment({
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        barberId: barber.id,
        barberName: barber.name,
        date,
        time,
        clientName,
        clientPhone,
        clientEmail,
        status: 'pending',
      })
      setDone(true)
    } catch {
      setError('Erro ao realizar agendamento. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div>
        <div className={styles.successIcon}>🎉</div>
        <h3 className={styles.successTitle}>Agendamento Confirmado!</h3>
        <p className={styles.successText}>
          Em breve entraremos em contato pelo número {clientPhone} para confirmar seu horário.
        </p>
        <div className={styles.btnRow} style={{ justifyContent: 'center' }}>
          <button className={styles.btnNext} onClick={closeBooking}>Fechar</button>
        </div>
      </div>
    )
  }

  const formattedDate = date
    ? format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })
    : ''

  return (
    <div>
      <h3 className={styles.stepTitle}>Confirmar Agendamento</h3>
      <p className={styles.stepSubtitle}>Revise os detalhes antes de confirmar</p>

      <div className={styles.confirmCard}>
        {[
          { k: 'Serviço', v: service?.name ?? '' },
          { k: 'Barbeiro', v: barber?.name ?? '' },
          { k: 'Data', v: formattedDate },
          { k: 'Horário', v: time },
          { k: 'Cliente', v: clientName },
          { k: 'Telefone', v: clientPhone },
          ...(clientEmail ? [{ k: 'E-mail', v: clientEmail }] : []),
        ].map((row) => (
          <div key={row.k} className={styles.confirmRow}>
            <span className={styles.confirmKey}>{row.k}</span>
            <span className={styles.confirmVal}>{row.v}</span>
          </div>
        ))}
        <div className={styles.confirmTotal}>
          <span className={styles.confirmTotalKey}>Total</span>
          <span className={styles.confirmTotalVal}>R$ {service?.price ?? 0}</span>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--color-action)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      <div className={styles.btnRow}>
        <button className={styles.btnBack} onClick={prevStep} disabled={submitting}>Voltar</button>
        <button className={styles.btnNext} onClick={handleConfirm} disabled={submitting}>
          {submitting ? 'Aguarde...' : 'Confirmar Agendamento'}
        </button>
      </div>
    </div>
  )
}
