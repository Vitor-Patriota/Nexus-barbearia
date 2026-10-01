import { Router } from 'express'
import { requireAdmin } from '../middleware/auth'
import {
  createAppointment,
  getAppointments,
  updateStatus,
  createValidators,
  statusValidators,
  dateQueryValidator,
} from '../controllers/appointmentsController'

const router = Router()

router.get('/', requireAdmin, dateQueryValidator, getAppointments)
router.post('/', createValidators, createAppointment)
router.patch('/:id/status', requireAdmin, statusValidators, updateStatus)

export default router
