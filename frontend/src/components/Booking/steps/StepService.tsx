import type { Service } from '../../../types'
import { useBooking } from '../../../contexts/BookingContext'
import styles from './Steps.module.css'

const services: Service[] = [
  { id: '1', name: 'Corte Clássico', description: 'Lavagem e finalização inclusos', price: 45, duration: 45 },
  { id: '2', name: 'Corte + Barba', description: 'Combo completo', price: 75, duration: 75 },
  { id: '3', name: 'Barba Completa', description: 'Navalha quente + modelagem', price: 40, duration: 40 },
  { id: '4', name: 'Degradê Premium', description: 'Alta precisão + contorno', price: 55, duration: 50 },
  { id: '5', name: 'Design Sobrancelha', description: 'Sempre em dupla', price: 20, duration: 20 },
  { id: '6', name: 'Pacote VIP', description: 'Corte + barba + sobrancelha + hidratação', price: 120, duration: 120 },
]

export default function StepService() {
  const { formData, setService, nextStep } = useBooking()

  const handleSelect = (s: Service) => {
    setService(s)
    nextStep()
  }

  return (
    <div>
      <h3 className={styles.stepTitle}>Escolha o Serviço</h3>
      <p className={styles.stepSubtitle}>Selecione o serviço desejado para continuar</p>

      <div className={styles.grid}>
        {services.map((s) => (
          <button
            key={s.id}
            className={`${styles.card} ${formData.service?.id === s.id ? styles.cardSelected : ''}`}
            onClick={() => handleSelect(s)}
          >
            <div className={styles.cardName}>{s.name}</div>
            <div className={styles.cardDetail}>{s.description}</div>
            <div className={styles.cardDetail}>⏱ {s.duration} min</div>
            <div className={styles.cardPrice}>R$ {s.price}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
