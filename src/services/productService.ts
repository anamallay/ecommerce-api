import { StringExpressionOperator } from 'mongoose'
import { deleteImage } from '../helper/ImageHelper'
import { Product } from '../models/productSchema'
import { IProduct, ProductInput, productUpdateType } from '../types/types'
import { createHttpError } from '../util/createHttpError'
import slugify from 'slugify'
export const getProducts = async (
  pageParam: string,
  limitParam: string,
  search: string,
) => {
  let page = Number(pageParam) || 1
  const limit = Number(limitParam) || 10
  const totalCount = await Product.countDocuments()
  const totalPages = Math.ceil(totalCount / limit)

  // const query = search ? { name: { $regex: search, $options: 'i' } } : {}
  const searchRegExp = new RegExp('.*' + search + '.*', 'i')
  const filter = {
    $or: [
      { title: { $regex: searchRegExp } },
      { description: { $regex: searchRegExp } }, //*Corrected from $regax to $regex
    ],
  }

  if (page > totalPages) {
    page = totalPages > 0 ? totalPages : 1
  }

  const skip = (page - 1) * limit
  // {price: {$eq: 30}}
  // {$and: [{ price: { $gt: 20 } }, { quantity: { $eq: 5 } }],}
  // {price: {$gt: 20}}
  const payload = await Product.find(filter)
    .populate('category')
    .skip(skip)
    .limit(limit)
  // .sort({ price: 1})
  return {
    payload,
    page,
    limit,
    totalCount,
  }
}
export const getSingleProduct = async (slug: string) => {
  const product = await Product.findOne({ slug: slug })
  if (!product) {
     createHttpError(404, 'Product not found!')
  }
  return product
}

export const deleteProduct = async (slug: string) => {
  const deletedProduct = await Product.findOneAndDelete({
    slug: slug,
  })
  if (!deletedProduct) {
    throw new Error('Product not found!')
  }
  if (deletedProduct && deletedProduct.image) {
    deleteImage(deletedProduct.image)
  }

  return deletedProduct
}
// TODO: image!
export const createProduct = async (productInput: ProductInput): Promise<IProduct> => {
  const {
    title,
    price,
    description,
    category,
    quantity,
    sold,
    shipping,
    image = undefined,
  } = productInput

  const productExist = await Product.exists({ title: title })
  if (productExist) {
    throw createHttpError(404, 'Product already exists')
  }

  const newProduct: IProduct = new Product({
    title: title,
    slug: slugify(title),
    price: price,
    ...(image && { image: image }),
    description: description,
    quantity: quantity,
    category: category,
    sold: sold,
    shipping: shipping,
  })

  return newProduct.save()
}

export const updateProduct = async (
  slug: string,
  product: productUpdateType,
) => {
  const { title, sold, quantity, countInStock } = product as IProduct

  const isProductExist = await Product.exists({ slug: slug })
  if (!isProductExist) {
    createHttpError(404, `Product with slug ${slug} does not exist`)
  }

  if (title) {
    const isTitleExist = await Product.exists({ title: title })
    if (isTitleExist) {
      createHttpError(409, `Product with title ${title} already exists`)
    }
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug: slug },
    {
      ...product,
      slug:
        title && typeof title === 'string'
          ? slugify(title, { lower: true })
          : slug,
      title,
      sold: quantity - countInStock > 0 ? quantity - countInStock : sold,
    },
    { new: true },
  )

  return updatedProduct
}