import styles from './Team.module.css'

const barbers = [
  {
    id: 1,
    name: 'Marcus Silva',
    role: 'Master Barber',
    specialty: 'Degradê & Fade',
    exp: '8 anos',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Diego Costa',
    role: 'Senior Barber',
    specialty: 'Barba & Navalha',
    exp: '6 anos',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Rafael Bronx',
    role: 'Barber Artist',
    specialty: 'Cortes Modernos',
    exp: '5 anos',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Alex Mendes',
    role: 'Classic Barber',
    specialty: 'Estilo Clássico',
    exp: '4 anos',
    rating: 4.7,
  },
]

export default function Team() {
  return (
    <section id="team" className={styles.team}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Conheça Nossa Equipe</p>
        <h2 className="section-title">
          Os <span>Artistas</span>
        </h2>
        <p className="section-subtitle">
          Profissionais apaixonados pela arte da barbearia, prontos para transformar seu visual
        </p>

        <div className={styles.grid}>
          {barbers.map((b) => (
            <div key={b.id} className={styles.card}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  <span>{b.name.split(' ').map((n) => n[0]).join('')}</span>
                </div>
                <div className={styles.avatarRing} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{b.name}</h3>
                <span className={styles.role}>{b.role}</span>
                <span className={styles.specialty}>✂ {b.specialty}</span>
                <div className={styles.meta}>
                  <span className={styles.exp}>📅 {b.exp}</span>
                  <span className={styles.rating}>★ {b.rating}</span>
                </div>
              </div>
              <div className={styles.hoverLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
