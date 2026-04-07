import { Router } from 'express'
import { getStats, getRevenue, revenueValidators } from '../controllers/adminController'
import { requireAuth } from '../middleware/auth'

const router = Router()

// All admin routes require authentication
router.use(requireAuth)

router.get('/stats', getStats)
router.get('/revenue', revenueValidators, getRevenue)

export default router
