import { useEffect } from 'react'
import { useBooking } from '../../contexts/BookingContext'
import StepService from './steps/StepService'
import StepBarber from './steps/StepBarber'
import StepDateTime from './steps/StepDateTime'
import StepClientDetails from './steps/StepClientDetails'
import StepConfirmation from './steps/StepConfirmation'
import styles from './BookingModal.module.css'

const STEPS = [
  { num: 1, label: 'Serviço' },
  { num: 2, label: 'Barbeiro' },
  { num: 3, label: 'Data/Hora' },
  { num: 4, label: 'Seus Dados' },
  { num: 5, label: 'Confirmação' },
]

export default function BookingModal() {
  const { currentStep, closeBooking } = useBooking()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && closeBooking()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={closeBooking} aria-label="Fechar">✕</button>

        <div className={styles.header}>
          <h2 className={styles.title}>Agendar Serviço</h2>
          <div className={styles.stepper}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.stepWrapper}>
                <div className={`${styles.stepCircle} ${currentStep >= s.num ? styles.stepDone : ''} ${currentStep === s.num ? styles.stepActive : ''}`}>
                  {currentStep > s.num ? '✓' : s.num}
                </div>
                <span className={`${styles.stepLabel} ${currentStep >= s.num ? styles.stepLabelActive : ''}`}>
                  {s.label}
                </span>
                {s.num < STEPS.length && (
                  <div className={`${styles.stepLine} ${currentStep > s.num ? styles.stepLineDone : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.body}>
          {currentStep === 1 && <StepService />}
          {currentStep === 2 && <StepBarber />}
          {currentStep === 3 && <StepDateTime />}
          {currentStep === 4 && <StepClientDetails />}
          {currentStep === 5 && <StepConfirmation />}
        </div>
      </div>
    </div>
  )
}
