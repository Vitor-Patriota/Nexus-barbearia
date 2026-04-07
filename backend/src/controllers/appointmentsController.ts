import { Request, Response } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { db } from '../config/firebase'
import type { AppointmentDoc, AppointmentStatus } from '../types'
import admin from '../config/firebase'

const col = () => db.collection('appointments')

// ── Validators ────────────────────────────────────────────────────────────────
export const createValidators = [
  body('serviceId').isString().notEmpty(),
  body('serviceName').isString().notEmpty().trim().escape(),
  body('servicePrice').isFloat({ min: 0 }),
  body('barberId').isString().notEmpty(),
  body('barberName').isString().notEmpty().trim().escape(),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/),
  body('time').matches(/^\d{2}:\d{2}$/),
  body('clientName').isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('clientPhone').isMobilePhone('pt-BR'),
  body('clientEmail').optional().isEmail().normalizeEmail(),
]

export const statusValidators = [
  param('id').isString().notEmpty(),
  body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled']),
  body('finalPrice').optional().isFloat({ min: 0 }),
  body('notes').optional().isString().isLength({ max: 300 }).trim().escape(),
]

export const dateQueryValidator = [
  query('date').optional().matches(/^\d{4}-\d{2}-\d{2}$/),
]

// ── Handlers ──────────────────────────────────────────────────────────────────
export async function createAppointment(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const now = admin.firestore.Timestamp.now()
  const data: AppointmentDoc = {
    serviceId: req.body.serviceId,
    serviceName: req.body.serviceName,
    servicePrice: Number(req.body.servicePrice),
    barberId: req.body.barberId,
    barberName: req.body.barberName,
    date: req.body.date,
    time: req.body.time,
    clientName: req.body.clientName,
    clientPhone: req.body.clientPhone,
    clientEmail: req.body.clientEmail ?? '',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }

  try {
    const ref = await col().add(data)
    res.status(201).json({ id: ref.id, ...data })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create appointment' })
  }
}

export async function getAppointments(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  try {
    let q = col().orderBy('date').orderBy('time') as FirebaseFirestore.Query

    const dateParam = req.query.date as string | undefined
    if (dateParam) {
      q = q.where('date', '==', dateParam)
    }

    const snap = await q.get()
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' })
  }
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() })
    return
  }

  const { id } = req.params
  const { status, finalPrice, notes } = req.body as {
    status: AppointmentStatus
    finalPrice?: number
    notes?: string
  }

  try {
    const ref = col().doc(id)
    const snap = await ref.get()

    if (!snap.exists) {
      res.status(404).json({ error: 'Appointment not found' })
      return
    }

    const update: Partial<AppointmentDoc> & { updatedAt: FirebaseFirestore.Timestamp } = {
      status,
      updatedAt: admin.firestore.Timestamp.now(),
    }

    if (status === 'completed' && finalPrice !== undefined) {
      update.finalPrice = Number(finalPrice)
    }
    if (notes) update.notes = notes

    await ref.update(update)
    res.json({ id, ...snap.data(), ...update })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment' })
  }
}
