import { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import { db } from '../config/firebase'
import type { BarberDoc } from '../types'
import admin from '../config/firebase'

const col = () => db.collection('barbers')

export const createValidators = [
  body('name').isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('specialty').isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('available').optional().isBoolean(),
]

export const updateValidators = [
  param('id').isString().notEmpty(),
  body('name').optional().isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('specialty').optional().isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('available').optional().isBoolean(),
]

export async function getBarbers(_req: Request, res: Response): Promise<void> {
  try {
    const snap = await col().orderBy('name').get()
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  } catch {
    res.status(500).json({ error: 'Failed to fetch barbers' })
  }
}

export async function createBarber(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { res.status(422).json({ errors: errors.array() }); return }

  const now = admin.firestore.Timestamp.now()
  const data: BarberDoc = {
    name: req.body.name,
    specialty: req.body.specialty,
    rating: Number(req.body.rating ?? 5.0),
    reviewCount: 0,
    available: req.body.available !== false,
    createdAt: now,
    updatedAt: now,
  }

  try {
    const ref = await col().add(data)
    res.status(201).json({ id: ref.id, ...data })
  } catch {
    res.status(500).json({ error: 'Failed to create barber' })
  }
}

export async function updateBarber(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { res.status(422).json({ errors: errors.array() }); return }

  const { id } = req.params
  const allowed: (keyof Omit<BarberDoc, 'createdAt' | 'updatedAt'>)[] = ['name', 'specialty', 'rating', 'available']
  const update: Partial<BarberDoc> = { updatedAt: admin.firestore.Timestamp.now() }

  allowed.forEach((k) => { if (req.body[k] !== undefined) (update as Record<string, unknown>)[k] = req.body[k] })

  try {
    const ref = col().doc(id)
    const snap = await ref.get()
    if (!snap.exists) { res.status(404).json({ error: 'Barber not found' }); return }
    await ref.update(update)
    res.json({ id, ...snap.data(), ...update })
  } catch {
    res.status(500).json({ error: 'Failed to update barber' })
  }
}

export async function deleteBarber(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const ref = col().doc(id)
    const snap = await ref.get()
    if (!snap.exists) { res.status(404).json({ error: 'Barber not found' }); return }
    await ref.delete()
    res.status(204).end()
  } catch {
    res.status(500).json({ error: 'Failed to delete barber' })
  }
}
