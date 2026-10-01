import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Serviços', href: '#services' },
  { label: 'Galeria', href: '#gallery' },
  { label: 'Equipe', href: '#team' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { openBooking } = useBooking()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="#home" className={styles.logo}>
          BRONX <span>BARBER</span>STORE
        </a>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <span className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`} />
        </button>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/admin"
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </li>
          <li>
            <button
              className={styles.ctaBtn}
              onClick={() => { openBooking(); setMenuOpen(false) }}
            >
              Agendar
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
