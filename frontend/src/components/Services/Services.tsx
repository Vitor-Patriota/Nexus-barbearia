import { useState } from 'react'
import { useBooking } from '../../contexts/BookingContext'
import type { Service } from '../../types'
import styles from './Services.module.css'

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Corte Clássico',
    description: 'Corte tradicional com acabamento perfeito. Inclui lavagem e finalização com produtos premium.',
    price: 45,
    duration: 45,
  },
  {
    id: '2',
    name: 'Corte + Barba',
    description: 'Combo completo: corte personalizado com barba aparada, moldada e hidratada.',
    price: 75,
    duration: 75,
  },
  {
    id: '3',
    name: 'Barba Completa',
    description: 'Barba com navalha quente, modelagem precisa e produtos de acabamento premium.',
    price: 40,
    duration: 40,
  },
  {
    id: '4',
    name: 'Degradê Premium',
    description: 'Degradê de alta precisão com contorno perfeito e acabamento detalhado.',
    price: 55,
    duration: 50,
  },
  {
    id: '5',
    name: 'Design de Sobrancelha',
    description: 'Modelagem e design de sobrancelha para complementar e destacar seu visual.',
    price: 20,
    duration: 20,
  },
  {
    id: '6',
    name: 'Pacote VIP',
    description: 'Experiência completa: corte, barba, sobrancelha, hidratação facial e massagem.',
    price: 120,
    duration: 120,
  },
]

export default function Services() {
  const { openBooking, setService } = useBooking()
  const [hovered, setHovered] = useState<string | null>(null)

  const handleBook = (service: Service) => {
    setService(service)
    openBooking()
  }

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>O Que Oferecemos</p>
        <h2 className="section-title">
          Nossos <span>Serviços</span>
        </h2>
        <p className="section-subtitle">
          Cada serviço executado com maestria por barbeiros especializados utilizando produtos premium
        </p>

        <div className={styles.grid}>
          {mockServices.map((service) => (
            <div
              key={service.id}
              className={`${styles.card} ${hovered === service.id ? styles.cardHovered : ''}`}
              onMouseEnter={() => setHovered(service.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={styles.cardGlow} />
              <div className={styles.cardHeader}>
                <h3 className={styles.cardName}>{service.name}</h3>
                <div className={styles.cardPriceBlock}>
                  <span className={styles.cardCurrency}>R$</span>
                  <span className={styles.cardPrice}>{service.price}</span>
                </div>
              </div>
              <p className={styles.cardDesc}>{service.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.duration}>⏱ {service.duration} min</span>
                <button className={styles.bookBtn} onClick={() => handleBook(service)}>
                  Agendar
                </button>
              </div>
              <div className={styles.bottomLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
