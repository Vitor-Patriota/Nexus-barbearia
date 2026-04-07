import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { getRevenueChart } from '../../services/api'
import type { RevenueData } from '../../types'
import styles from './Admin.module.css'

const MOCK_WEEK: RevenueData[] = [
  { period: 'Seg', revenue: 450, appointments: 6 },
  { period: 'Ter', revenue: 620, appointments: 8 },
  { period: 'Qua', revenue: 380, appointments: 5 },
  { period: 'Qui', revenue: 710, appointments: 9 },
  { period: 'Sex', revenue: 890, appointments: 11 },
  { period: 'Sáb', revenue: 1240, appointments: 15 },
  { period: 'Dom', revenue: 0, appointments: 0 },
]

const MOCK_MONTH: RevenueData[] = [
  { period: 'Jan', revenue: 8200, appointments: 98 },
  { period: 'Fev', revenue: 9400, appointments: 112 },
  { period: 'Mar', revenue: 11200, appointments: 134 },
  { period: 'Abr', revenue: 10500, appointments: 126 },
  { period: 'Mai', revenue: 12300, appointments: 148 },
  { period: 'Jun', revenue: 11800, appointments: 142 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} className={styles.tooltipVal}>
            {p.dataKey === 'revenue'
              ? `R$ ${p.value.toLocaleString('pt-BR')}`
              : `${p.value} agendamentos`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [data, setData] = useState<RevenueData[]>(MOCK_WEEK)

  useEffect(() => {
    getRevenueChart(period)
      .then((res) => setData(res.data))
      .catch(() => setData(period === 'week' ? MOCK_WEEK : MOCK_MONTH))
  }, [period])

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <h2 className={styles.sectionTitle}>Receita</h2>
        <div className={styles.periodToggle}>
          <button
            className={`${styles.periodBtn} ${period === 'week' ? styles.periodActive : ''}`}
            onClick={() => setPeriod('week')}
          >
            Semana
          </button>
          <button
            className={`${styles.periodBtn} ${period === 'month' ? styles.periodActive : ''}`}
            onClick={() => setPeriod('month')}
          >
            Mês
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00C8FF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00C8FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="period" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00C8FF"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            name="revenue"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '1.5rem' }}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="period" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#888', fontSize: 12 }} />
            <Bar dataKey="appointments" fill="#DC143C" radius={[4, 4, 0, 0]} name="appointments" maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
