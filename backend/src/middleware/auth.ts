import { Request, Response, NextFunction } from 'express'
import { authAdmin } from '../config/firebase'

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing token' })
    return
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decoded = await authAdmin.verifyIdToken(token)
    req.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized: invalid token' })
  }
}
