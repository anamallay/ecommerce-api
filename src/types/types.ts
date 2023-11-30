import { Document } from 'mongoose'
export interface Error {
  status?: number
  message?: string
}
export type ProductType = {
  _id: string
  title: string
  slug: string
  image: string
  category: object
  description: string
  price: number
  quantity: number
  sold: number
  shipping: number
  createdAt?: NativeDate
  updatedAt?: NativeDate
}

export type ProductInput = Omit<ProductType, '_id'>
// ============
export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: string
  updatedAt?: string
  __v: number
}

export interface IProduct extends Document {
  title: string
  slug: string
  image: string
  price: number
  quantity: number
  sold: number
  shipping: number
  category: ICategory['_id']
  description: string
  createAt?: string
  updatedAt?: string
  __v: number
}