import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import appointmentsRouter from './routes/appointments'
import servicesRouter from './routes/services'
import barbersRouter from './routes/barbers'
import adminRouter from './routes/admin'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 5000

// ── Security Middleware ────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. same-origin or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.use(express.json({ limit: '10kb' }))

// Remove fingerprinting header
app.disable('x-powered-by')

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/appointments', appointmentsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/barbers', barbersRouter)
app.use('/api/admin', adminRouter)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Bronx BarberStore API running on port ${PORT}`)
})

export default app
