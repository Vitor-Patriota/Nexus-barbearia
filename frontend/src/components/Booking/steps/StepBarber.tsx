import type { Barber } from '../../../types'
import { useBooking } from '../../../contexts/BookingContext'
import styles from './Steps.module.css'

const barbers: Barber[] = [
  { id: '1', name: 'Marcus Silva', specialty: 'Degradê & Fade', rating: 4.9, reviewCount: 128, available: true },
  { id: '2', name: 'Diego Costa', specialty: 'Barba & Navalha', rating: 4.8, reviewCount: 97, available: true },
  { id: '3', name: 'Rafael Bronx', specialty: 'Cortes Modernos', rating: 4.9, reviewCount: 105, available: true },
  { id: '4', name: 'Alex Mendes', specialty: 'Estilo Clássico', rating: 4.7, reviewCount: 84, available: true },
]

export default function StepBarber() {
  const { formData, setBarber, nextStep, prevStep } = useBooking()

  const handleSelect = (b: Barber) => {
    setBarber(b)
    nextStep()
  }

  return (
    <div>
      <h3 className={styles.stepTitle}>Escolha o Barbeiro</h3>
      <p className={styles.stepSubtitle}>Selecione seu barbeiro de preferência</p>

      <div className={styles.grid}>
        {barbers.map((b) => (
          <button
            key={b.id}
            className={`${styles.card} ${formData.barber?.id === b.id ? styles.cardSelected : ''}`}
            onClick={() => handleSelect(b)}
            disabled={!b.available}
          >
            <div className={styles.avatar}>
              {b.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className={styles.cardName}>{b.name}</div>
            <div className={styles.cardDetail}>{b.specialty}</div>
            <div className={styles.rating}>★ {b.rating} ({b.reviewCount} avaliações)</div>
            {!b.available && <div className={styles.cardBadge}>Indisponível</div>}
          </button>
        ))}
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnBack} onClick={prevStep}>Voltar</button>
      </div>
    </div>
  )
}
