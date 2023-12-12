import express from 'express'
import {
  createSingleCategory,
  deleteSingleCategory,
  getAllCategories,
  getSingleCategoryById, 
  updateSingleCategory,
} from '../controllers/categoryController'

const router = express.Router()
router.get(`/`, getAllCategories)
router.get('/:id', getSingleCategoryById)
router.post(`/`, createSingleCategory)
router.put(`/:id`, updateSingleCategory)
router.delete(`/:id`, deleteSingleCategory)

export default router
