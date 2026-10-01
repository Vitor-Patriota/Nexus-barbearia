import { Router } from 'express'
import {
  getBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
  createValidators,
  updateValidators,
} from '../controllers/barbersController'
import { requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/', getBarbers)
router.post('/', requireAdmin, createValidators, createBarber)
router.put('/:id', requireAdmin, updateValidators, updateBarber)
router.delete('/:id', requireAdmin, deleteBarber)

export default router
