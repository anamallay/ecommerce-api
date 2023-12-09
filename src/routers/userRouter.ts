import express from 'express'
import {
  activeUser,
  banUser,
  getAllUsers,
  getSingleUser,
  registerUser,
  unbanUser,
} from '../controllers/userController'
import { uploadUser } from '../middleware/uploadFile'

const router = express.Router()
router.post(`/process-register`, uploadUser.single('image'), registerUser)
router.post(`/activate`, activeUser)
router.get(`/`, getAllUsers)
router.get(`/:id`, getSingleUser)
router.put(`/ban/:id`, banUser)
router.put(`/unban/:id`, unbanUser)

export default router
