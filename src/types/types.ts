import { Document } from 'mongoose'
export interface Error {
  status?: number
  message?: string
}
// export type ProductType = {
//   _id: string
//   title: string
//   slug: string
//   image: string
//   category: object
//   description: string
//   price: number
//   quantity: number
//   sold: number
//   shipping: number
//   createdAt?: NativeDate
//   updatedAt?: NativeDate
// }


// ============
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
  countInStock: number
}
// export type ProductInput = Omit<IProduct, '_id'>
export type ProductInput = Pick<
  IProduct,
  | 'title'
  | 'slug'
  | 'price'
  | 'description'
  | 'category'
  | 'quantity'
  | 'sold'
  | 'shipping'
  | 'image'
>

export type productUpdateType = Partial<ProductInput>
export interface ICategory extends Document {
  _id: string
  title: string
  slug: string
  createdAt?: string
  updatedAt?: string
  __v: number
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  image?: string
  address: string
  phone: string
  // order: string
  isAdmin?: boolean
  isBanned?: boolean
  createdAt?: string
  updatedAt?: string
  __v: number
}
export type userInputType = Omit<
  IUser,
  '_id' | 'slug' | 'createdAt' | 'updatedAt' | '__v'
  >
export type userUpdateType = Partial<userInputType>
export type EmailDataType = {
  email: string
  subject: string
  html: string
}

export type UserType = {
  name: string
  image?: string,
  email: string
  password: string
  address: string
  phone: string
  isAdmin?: boolean,
  isBanned?:boolean
}