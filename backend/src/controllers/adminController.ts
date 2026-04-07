import { Request, Response } from 'express'
import { query, validationResult } from 'express-validator'
import { db } from '../config/firebase'
import { format, subDays } from 'date-fns'
import type { AdminStats, RevenueData } from '../types'

export const revenueValidators = [
  query('period').optional().isIn(['week', 'month']),
]

export async function getStats(_req: Request, res: Response): Promise<void> {
  try {
    const snap = await db.collection('appointments').get()
    const appointments = snap.docs.map((d) => d.data())

    const completed = appointments.filter((a) => a.status === 'completed')
    const totalRevenue = completed.reduce((sum, a) => sum + (a.finalPrice ?? a.servicePrice ?? 0), 0)

    const clientSet = new Set(appointments.map((a) => a.clientPhone as string))
    const oneMonthAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')
    const newClients = new Set(
      appointments
        .filter((a) => a.date >= oneMonthAgo)
        .map((a) => a.clientPhone as string),
    )

    const stats: AdminStats = {
      totalRevenue,
      totalClients: clientSet.size,
      newClients: newClients.size,
      pendingServices: appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed').length,
      completedServices: completed.length,
      cancelledServices: appointments.filter((a) => a.status === 'cancelled').length,
    }

    res.json(stats)
  } catch {
    res.status(500).json({ error: 'Failed to load stats' })
  }
}

export async function getRevenue(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { res.status(422).json({ errors: errors.array() }); return }

  const period = (req.query.period as string) ?? 'week'
  const days = period === 'week' ? 7 : 30

  try {
    const snap = await db
      .collection('appointments')
      .where('status', '==', 'completed')
      .get()

    const completed = snap.docs.map((d) => d.data())

    const buckets: Record<string, { revenue: number; appointments: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const key = format(subDays(new Date(), i), period === 'week' ? 'yyyy-MM-dd' : 'yyyy-MM')
      if (!buckets[key]) buckets[key] = { revenue: 0, appointments: 0 }
    }

    completed.forEach((a) => {
      const key =
        period === 'week'
          ? (a.date as string)
          : (a.date as string).slice(0, 7)
      if (buckets[key] !== undefined) {
        buckets[key].revenue += a.finalPrice ?? a.servicePrice ?? 0
        buckets[key].appointments += 1
      }
    })

    const data: RevenueData[] = Object.entries(buckets).map(([period, v]) => ({
      period: period === 'week' ? period.slice(5) : period.slice(0, 7),
      ...v,
    }))

    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to load revenue data' })
  }
}
