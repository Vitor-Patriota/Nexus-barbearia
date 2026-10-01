import { useEffect, useState } from 'react'
import { getAdminStats } from '../../services/api'
import type { AdminStats } from '../../types'
import styles from './Admin.module.css'

const MOCK_STATS: AdminStats = {
  totalRevenue: 12480,
  totalClients: 247,
  newClients: 18,
  pendingServices: 7,
  completedServices: 312,
  cancelledServices: 14,
}

interface Card {
  label: string
  value: string
  icon: string
  color: 'red' | 'neon' | 'gold' | 'gray'
  sub?: string
}

export default function SummaryCards() {
  const [stats, setStats] = useState<AdminStats>(MOCK_STATS)

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(MOCK_STATS))
  }, [])

  const cards: Card[] = [
    {
      label: 'Receita Total',
      value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`,
      icon: '💰',
      color: 'neon',
      sub: 'Este mês',
    },
    {
      label: 'Total de Clientes',
      value: String(stats.totalClients),
      icon: '👥',
      color: 'red',
      sub: `+${stats.newClients} novos`,
    },
    {
      label: 'Serviços Pendentes',
      value: String(stats.pendingServices),
      icon: '⏳',
      color: 'gold',
      sub: 'Aguardando',
    },
    {
      label: 'Serviços Concluídos',
      value: String(stats.completedServices),
      icon: '✅',
      color: 'gray',
      sub: 'Total geral',
    },
  ]

  return (
    <div className={styles.cardsGrid}>
      {cards.map((c) => (
        <div key={c.label} className={`${styles.card} ${styles[`card-${c.color}`]}`}>
          <div className={styles.cardIcon}>{c.icon}</div>
          <div className={styles.cardBody}>
            <span className={styles.cardLabel}>{c.label}</span>
            <span className={styles.cardValue}>{c.value}</span>
            {c.sub && <span className={styles.cardSub}>{c.sub}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
