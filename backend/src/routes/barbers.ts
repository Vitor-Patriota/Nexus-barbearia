import { Router } from 'express'
import {
  getBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
  createValidators,
  updateValidators,
} from '../controllers/barbersController'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', getBarbers)
router.post('/', requireAuth, createValidators, createBarber)
router.put('/:id', requireAuth, updateValidators, updateBarber)
router.delete('/:id', requireAuth, deleteBarber)

export default router
