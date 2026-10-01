import { Router } from 'express'
import {
  getServices,
  createService,
  updateService,
  deleteService,
  createValidators,
  updateValidators,
} from '../controllers/servicesController'
import { requireAuth } from '../middleware/auth'

const router = Router()

router.get('/', getServices)
router.post('/', requireAuth, createValidators, createService)
router.put('/:id', requireAuth, updateValidators, updateService)
router.delete('/:id', requireAuth, deleteService)

export default router
