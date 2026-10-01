import { useState } from 'react'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    id: 1,
    name: 'João Pereira',
    text: 'Melhor barbearia da cidade! O Marcus fez um degradê incrível, saí completamente diferente. Recomendo demais.',
    rating: 5,
    service: 'Degradê Premium',
  },
  {
    id: 2,
    name: 'Carlos Eduardo',
    text: 'Ambiente top, atendimento impecável. A barba ficou perfeita com navalha quente. Já sou cliente fiel há 2 anos.',
    rating: 5,
    service: 'Barba Completa',
  },
  {
    id: 3,
    name: 'Bruno Alves',
    text: 'O Pacote VIP vale cada centavo. Saí de lá renovado. A equipe é extremamente profissional e atenciosa.',
    rating: 5,
    service: 'Pacote VIP',
  },
  {
    id: 4,
    name: 'Felipe Santos',
    text: 'Primeira vez que vou e já quero marcar de novo. Corte muito bem feito, além do ambiente que é diferenciado.',
    rating: 5,
    service: 'Corte + Barba',
  },
  {
    id: 5,
    name: 'André Lima',
    text: 'Atendimento rápido, resultado excelente. O app de agendamento facilita muito a vida. Nota 10!',
    rating: 5,
    service: 'Corte Clássico',
  },
  {
    id: 6,
    name: 'Roberto Martins',
    text: 'Já fui em várias barbearias mas a Bronx é outro nível. Qualidade premium em todos os aspectos.',
    rating: 5,
    service: 'Degradê Premium',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section id="testimonials" className={styles.testimonials}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Depoimentos</p>
        <h2 className="section-title">
          O Que Dizem <span>Nossos Clientes</span>
        </h2>
        <p className="section-subtitle">
          A satisfação de cada cliente é nossa maior conquista
        </p>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`${styles.card} ${active === i ? styles.cardActive : ''}`}
              onMouseEnter={() => setActive(i)}
            >
              <div className={styles.quote}>"</div>
              <p className={styles.text}>{t.text}</p>
              <div className={styles.stars}>
                {'★'.repeat(t.rating)}
              </div>
              <div className={styles.author}>
                <div className={styles.avatar}>{t.name[0]}</div>
                <div>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.service}>{t.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
