import styles from './About.module.css'

const features = [
  { icon: '✂️', label: 'Precision Cuts' },
  { icon: '🪒', label: 'Hot Shave' },
  { icon: '💈', label: 'Classic Style' },
  { icon: '⭐', label: 'Premium Care' },
]

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            <span className={styles.logo}>B</span>
            <div className={styles.imageLines} />
          </div>
          <div className={styles.imageAccent} />
          <div className={styles.experienceBadge}>
            <span className={styles.badgeNum}>5+</span>
            <span className={styles.badgeText}>Anos de<br />Excelência</span>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Nossa História</p>
          <h2 className={styles.title}>
            Mais que uma barbearia,<br /><span>uma experiência</span>
          </h2>
          <p className={styles.text}>
            Fundada com a missão de elevar o padrão da barbearia, a Bronx BarberStore
            combina técnicas tradicionais com as tendências mais modernas de estilo.
            Cada visita é uma experiência personalizada, desde a música até o corte final.
          </p>
          <p className={styles.text}>
            Nossa equipe de barbeiros altamente qualificados está dedicada a trazer o
            melhor de si para cada cliente, garantindo resultados que superam expectativas
            e criam fãs fiéis.
          </p>

          <div className={styles.features}>
            {features.map((f) => (
              <div key={f.label} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <span className={styles.featureLabel}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
