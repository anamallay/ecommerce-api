import { Request, Response, NextFunction } from 'express'
import {
  createProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from '../services/productService'
import slugify from 'slugify'
import { replaceImageProduct } from '../helper/ImageHelper'
import { createHttpError } from '../util/createHttpError'
import { productUpdateType } from '../types/types'

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = typeof req.query.page === 'string' ? req.query.page : '1'
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '10'
    const search = req.query.search === 'string' ? req.query.search : ''

    const result = await getProducts(page, limit, search)
    res.status(200).json({
      message: 'Returns all products',
      ...result,
    })
  } catch (error) {
    next(error)
  }
}
export const getSingleProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug
    const product = await getSingleProduct(slug)
    console.log(slug)

    res.status(200).json({
      message: 'Product found',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
export const deleteSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slug = req.params.slug
    const deletedProduct = await deleteProduct(slug)

    res.status(201).json({
      message: 'Product deleted',
      payload: deletedProduct,
    })
  } catch (error) {
    next(error)
  }
}
export const createSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productInput = {
      title: req.body.title,
      slug: slugify(req.body.title),
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      quantity: req.body.quantity,
      sold: req.body.sold,
      shipping: req.body.shipping,
      image: req.file?.path || 'default-image-path',
    }

    const product = await createProduct(productInput)
    res.status(201).json({
      message: 'Product created',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { params, body, file } = req
    const { slug } = params
    const data = body

    replaceImageProduct(file, slug, data)

    const product: productUpdateType = data && (await updateProduct(slug, data))
    if (!product) {
      createHttpError(404, `Product with slug ${slug} does not exist`)
    }

    res.status(200).json({
      message: 'Update product by slug successfully',
      payload: product,
    })
  } catch (error) {
    next(error)
  }
}
