import { useState } from 'react'
import styles from './Gallery.module.css'

const galleryItems = [
  { id: 1, label: 'Degradê Clássico', color: '#1a0a0a' },
  { id: 2, label: 'Barba Modelada', color: '#0a0a1a' },
  { id: 3, label: 'Corte Moderno', color: '#0a1a0a' },
  { id: 4, label: 'Fade Premium', color: '#1a1a0a' },
  { id: 5, label: 'Design Exclusivo', color: '#0d0a1a' },
  { id: 6, label: 'Estilo Bronx', color: '#1a0a10' },
  { id: 7, label: 'Textura & Volume', color: '#0a1218' },
  { id: 8, label: 'Clássico Atemporal', color: '#120a18' },
]

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="gallery" className={styles.gallery}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Nosso Trabalho</p>
        <h2 className="section-title">
          Galeria de <span>Estilos</span>
        </h2>
        <p className="section-subtitle">
          Cada corte conta uma história. Veja alguns dos nossos trabalhos recentes.
        </p>

        <div className={styles.grid}>
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`${styles.item} ${i === 0 || i === 5 ? styles.large : ''}`}
              onMouseEnter={() => setActive(item.id)}
              onMouseLeave={() => setActive(null)}
            >
              <div
                className={styles.imgPlaceholder}
                style={{ background: `linear-gradient(135deg, ${item.color} 0%, #1a1a1a 100%)` }}
              >
                <div className={styles.placeholderIcon}>✂</div>
                <div className={styles.placeholderLines} />
              </div>
              <div className={`${styles.overlay} ${active === item.id ? styles.overlayVisible : ''}`}>
                <span className={styles.itemLabel}>{item.label}</span>
              </div>
              <div className={styles.neonFrame} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
