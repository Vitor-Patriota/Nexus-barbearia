import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

const links = {
  navegação: ['Início', 'Sobre', 'Serviços', 'Galeria', 'Equipe'],
  serviços: ['Corte Clássico', 'Degradê Premium', 'Barba Completa', 'Corte + Barba', 'Pacote VIP'],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBar} />
      <div className={styles.container}>
        <div className={styles.brand}>
          <h2 className={styles.logo}>
            BRONX <span>BARBER</span>STORE
          </h2>
          <p className={styles.tagline}>
            Onde estilo encontra precisão.<br />A experiência definitiva em barbearia.
          </p>
          <div className={styles.social}>
            {['IG', 'FB', 'WA'].map((s) => (
              <span key={s} className={styles.socialBtn}>{s}</span>
            ))}
          </div>
        </div>

        <div className={styles.linksBlock}>
          <h3 className={styles.linksTitle}>Navegação</h3>
          <ul className={styles.linksList}>
            {links.navegação.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className={styles.footerLink}>{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.linksBlock}>
          <h3 className={styles.linksTitle}>Serviços</h3>
          <ul className={styles.linksList}>
            {links.serviços.map((l) => (
              <li key={l}>
                <span className={styles.footerLink}>{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.contact}>
          <h3 className={styles.linksTitle}>Contato</h3>
          <div className={styles.contactList}>
            <span>📍 Rua Bronx, 1947 — São Paulo</span>
            <span>📞 (11) 94700-1947</span>
            <span>📧 contato@bronxbarber.com.br</span>
            <span>🕐 Seg–Sáb: 9h às 20h</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © {new Date().getFullYear()} Bronx BarberStore. Todos os direitos reservados.
        </span>
        <Link to="/admin" className={styles.adminLink}>
          Admin
        </Link>
      </div>
    </footer>
  )
}
