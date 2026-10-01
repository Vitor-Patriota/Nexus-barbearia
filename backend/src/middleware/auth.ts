import { Request, Response, NextFunction } from 'express'
import { authAdmin } from '../config/firebase'

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)

export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing token' })
    return
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const decoded = await authAdmin.verifyIdToken(token)
    if (!decoded.email || !adminEmails.has(decoded.email.toLowerCase())) {
      res.status(403).json({ error: 'Forbidden: admin access required' })
      return
    }

    req.uid = decoded.uid
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized: invalid token' })
  }
}
