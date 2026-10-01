import { Router } from 'express'
import {
  getServices,
  createService,
  updateService,
  deleteService,
  createValidators,
  updateValidators,
} from '../controllers/servicesController'
import { requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/', getServices)
router.post('/', requireAdmin, createValidators, createService)
router.put('/:id', requireAdmin, updateValidators, updateService)
router.delete('/:id', requireAdmin, deleteService)

export default router
