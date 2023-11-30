import slugify from 'slugify'
import { ObjectId } from 'mongodb'
import { Category } from '../models/categorySchema'
import { createHttpError } from '../util/createHttpError'
import { ICategory } from '../types/types'

export const getCategories = async () => {
  const categories: ICategory[] = await Category.find({})
  return categories
}

export const findCategoryById = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid ID')
  }

    const category = await Category.findById(id)
  return category
}

export const deleteCategoryById = async (id: string) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw createHttpError(400, 'Invalid ID')
    }

    const deletedCategory = await Category.findByIdAndDelete(id)
    return deletedCategory
  } catch (error) {
    throw error
  }
}

export const createCategory = async (title: string) => {
  const slug = slugify(title)
  const existingCategory = await Category.findOne({ slug })
  if (existingCategory) {
    throw createHttpError(400, 'Category already exists')
  }

  const newCategory = new Category({ title, slug })
  await newCategory.save()
  return newCategory
}

export const updateCategoryById = async (id: string, updateData: any) => {
  if (!ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid ID')
  }

  if (updateData.title) {
    updateData.slug = slugify(updateData.title)
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
  })

  return updatedCategory
}
