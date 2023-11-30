import { Request, Response, NextFunction } from 'express'
import {
  createCategory,
  deleteCategoryById,
  findCategoryById,
  getCategories,
  updateCategoryById,
} from '../services/categoryService'


export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getCategories()
    res.status(200).json({
      message: 'Returns all products',
      payload: categories,
    })
  } catch (error) {
    next(error)
  }
}
export const getSingleCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const category = await findCategoryById(id)
    console.log('Received ID:', id) // Log the ID for debugging
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json({
      message: 'Category Found',
      payload: category,
    })
  } catch (error) {
    next(error)
  }
}
export const deleteSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params // Changed from slug to id
    const deletedCategory = await deleteCategoryById(id)

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json({
      message: 'Category successfully deleted',
      payload: deletedCategory,
    })
  } catch (error) {
    next(error)
  }
}
export const createSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title } = req.body

    const newCategory = await createCategory(title)
    res.status(201).json({
      message: 'Created category',
      payload: newCategory,
    })
  } catch (error) {
    next(error)
  }
}
export const updateSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedCategory = await updateCategoryById(id, updateData)

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.status(200).json({
      message: 'Category successfully updated',
      payload: updatedCategory,
    })
  } catch (error) {
    next(error)
  }
}
