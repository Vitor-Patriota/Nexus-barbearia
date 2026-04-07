import { Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import { db } from '../config/firebase'
import type { ServiceDoc } from '../types'
import admin from '../config/firebase'

const col = () => db.collection('services')

export const createValidators = [
  body('name').isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('description').isString().isLength({ max: 300 }).trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('duration').isInt({ min: 5, max: 480 }),
]

export const updateValidators = [
  param('id').isString().notEmpty(),
  body('name').optional().isString().isLength({ min: 2, max: 80 }).trim().escape(),
  body('description').optional().isString().isLength({ max: 300 }).trim().escape(),
  body('price').optional().isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 5, max: 480 }),
]

export async function getServices(_req: Request, res: Response): Promise<void> {
  try {
    const snap = await col().orderBy('name').get()
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' })
  }
}

export async function createService(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { res.status(422).json({ errors: errors.array() }); return }

  const now = admin.firestore.Timestamp.now()
  const data: ServiceDoc = {
    name: req.body.name,
    description: req.body.description,
    price: Number(req.body.price),
    duration: Number(req.body.duration),
    createdAt: now,
    updatedAt: now,
  }

  try {
    const ref = await col().add(data)
    res.status(201).json({ id: ref.id, ...data })
  } catch {
    res.status(500).json({ error: 'Failed to create service' })
  }
}

export async function updateService(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { res.status(422).json({ errors: errors.array() }); return }

  const { id } = req.params
  const allowed: (keyof Omit<ServiceDoc, 'createdAt' | 'updatedAt'>)[] = ['name', 'description', 'price', 'duration']
  const update: Partial<ServiceDoc> = { updatedAt: admin.firestore.Timestamp.now() }

  allowed.forEach((k) => { if (req.body[k] !== undefined) (update as Record<string, unknown>)[k] = req.body[k] })

  try {
    const ref = col().doc(id)
    const snap = await ref.get()
    if (!snap.exists) { res.status(404).json({ error: 'Service not found' }); return }
    await ref.update(update)
    res.json({ id, ...snap.data(), ...update })
  } catch {
    res.status(500).json({ error: 'Failed to update service' })
  }
}

export async function deleteService(req: Request, res: Response): Promise<void> {
  const { id } = req.params
  try {
    const ref = col().doc(id)
    const snap = await ref.get()
    if (!snap.exists) { res.status(404).json({ error: 'Service not found' }); return }
    await ref.delete()
    res.status(204).end()
  } catch {
    res.status(500).json({ error: 'Failed to delete service' })
  }
}
