import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useBooking } from '../../../contexts/BookingContext'
import styles from './Steps.module.css'

const TIME_SLOTS = ['09:00', '09:45', '10:30', '11:15', '12:00', '13:30', '14:15', '15:00', '15:45', '16:30', '17:15', '18:00']
const UNAVAILABLE = ['11:15', '15:00']

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1))
}

export default function StepDateTime() {
  const { formData, setDateTime, nextStep, prevStep } = useBooking()

  const days = getNext7Days()

  const handleDate = (d: Date) => {
    setDateTime(format(d, 'yyyy-MM-dd'), formData.time)
  }

  const handleTime = (t: string) => {
    setDateTime(formData.date, t)
  }

  const canNext = formData.date !== '' && formData.time !== ''

  return (
    <div>
      <h3 className={styles.stepTitle}>Data e Horário</h3>
      <p className={styles.stepSubtitle}>Escolha o melhor dia e horário para você</p>

      <p className={styles.label}>Selecione o dia</p>
      <div className={styles.dateGrid}>
        {days.map((d) => {
          const iso = format(d, 'yyyy-MM-dd')
          return (
            <button
              key={iso}
              className={`${styles.dateBtn} ${formData.date === iso ? styles.dateBtnSelected : ''}`}
              onClick={() => handleDate(d)}
            >
              <span className={styles.dateDay}>
                {format(d, 'EEE', { locale: ptBR })}
              </span>
              <span className={styles.dateNum}>{format(d, 'dd')}</span>
              <span className={styles.dateDay}>{format(d, 'MMM', { locale: ptBR })}</span>
            </button>
          )
        })}
      </div>

      {formData.date && (
        <>
          <p className={styles.label} style={{ marginBottom: '0.6rem' }}>Selecione o horário</p>
          <div className={styles.timeGrid}>
            {TIME_SLOTS.map((t) => {
              const unavail = UNAVAILABLE.includes(t)
              return (
                <button
                  key={t}
                  className={`${styles.timeBtn} ${formData.time === t ? styles.timeBtnSelected : ''} ${unavail ? styles.timeBtnUnavail : ''}`}
                  onClick={() => !unavail && handleTime(t)}
                  disabled={unavail}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </>
      )}

      <div className={styles.btnRow}>
        <button className={styles.btnBack} onClick={prevStep}>Voltar</button>
        <button className={styles.btnNext} onClick={nextStep} disabled={!canNext}>
          Próximo
        </button>
      </div>
    </div>
  )
}
