import { Router } from 'express'
import {
  createAppointment,
  getAppointments,
  updateStatus,
  createValidators,
  statusValidators,
  dateQueryValidator,
} from '../controllers/appointmentsController'

const router = Router()

router.get('/', dateQueryValidator, getAppointments)
router.post('/', createValidators, createAppointment)
router.patch('/:id/status', statusValidators, updateStatus)

export default router
