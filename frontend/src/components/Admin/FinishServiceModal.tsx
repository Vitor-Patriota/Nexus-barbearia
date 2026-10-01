import { useState } from 'react'
import type { Appointment, FinishServicePayload } from '../../types'
import { updateAppointmentStatus } from '../../services/api'
import styles from './Admin.module.css'

interface Props {
  appointment: Appointment
  onClose: () => void
  onConfirm: (id: string, finalPrice: number) => void
}

export default function FinishServiceModal({ appointment, onClose, onConfirm }: Props) {
  const [finalPrice, setFinalPrice] = useState(String(appointment.servicePrice))
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const parsedPrice = parseFloat(finalPrice.replace(',', '.'))

  const handleConfirm = async () => {
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Informe um valor válido.')
      return
    }
    if (!appointment.id) return
    setLoading(true)
    setError('')

    const payload: FinishServicePayload = { finalPrice: parsedPrice, notes: notes.trim() || undefined }

    try {
      await updateAppointmentStatus(appointment.id, 'completed', payload)
      onConfirm(appointment.id, parsedPrice)
      onClose()
    } catch {
      setError('Erro ao finalizar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Finalizar Serviço</h2>
        <p className={styles.modalSub}>
          Cliente: <strong>{appointment.clientName}</strong> — {appointment.serviceName}
        </p>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="final-price">Valor Final (R$)</label>
          <input
            id="final-price"
            className={styles.fieldInput}
            type="number"
            min="0"
            step="0.01"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
          />
          {appointment.servicePrice !== parsedPrice && !isNaN(parsedPrice) && (
            <span className={styles.fieldHint}>
              Valor original: R$ {appointment.servicePrice}
              {' → '}
              {parsedPrice < appointment.servicePrice ? '🏷️ Desconto aplicado' : '📈 Valor ajustado'}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor="notes">Observações (opcional)</label>
          <textarea
            id="notes"
            className={`${styles.fieldInput} ${styles.textarea}`}
            rows={3}
            placeholder="Ex: cliente recebeu desconto de fidelidade"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={300}
          />
        </div>

        {error && <p className={styles.fieldError}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.btnSecondary} onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className={styles.btnPrimary} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
