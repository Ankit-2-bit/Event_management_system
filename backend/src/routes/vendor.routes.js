import { Router } from 'express'
import {
  createRequestItem,
  getVendorDashboard,
  getVendorRequests,
  updateVendorProfile,
} from '../controllers/vendor.controller.js'
import { protect } from '../middlewares/auth.middleware.js'
import { authorize } from '../middlewares/role.middleware.js'

const router = Router()

router.use(protect, authorize('vendor'))

router.get('/dashboard', getVendorDashboard)
router.patch('/profile', updateVendorProfile)
router.get('/requests', getVendorRequests)
router.post('/requests', createRequestItem)

export default router
