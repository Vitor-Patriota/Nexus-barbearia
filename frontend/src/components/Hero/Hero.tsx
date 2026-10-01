import { useBooking } from '../../contexts/BookingContext'
import styles from './Hero.module.css'

export default function Hero() {
  const { openBooking } = useBooking()

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.gridBg} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      <div className={styles.content}>
        <div className={styles.badge}>✦ Premium Barber Experience ✦</div>
        <h1 className={styles.title}>
          BRONX <span>BARBER</span>
          <br />STORE
        </h1>
        <p className={styles.subtitle}>
          Onde estilo encontra precisão. A experiência definitiva em barbearia.
        </p>
        <div className={styles.actions}>
          <button className={styles.ctaBtn} onClick={openBooking}>
            Agendar Agora
          </button>
          <a href="#services" className={styles.ghostBtn}>
            Ver Serviços
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>500+</span>
            <span className={styles.statLabel}>Clientes</span>
          </div>
          <span className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>5+</span>
            <span className={styles.statLabel}>Anos de Experiência</span>
          </div>
          <span className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>4.9★</span>
            <span className={styles.statLabel}>Avaliação</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollWheel} />
      </div>
    </section>
  )
}
