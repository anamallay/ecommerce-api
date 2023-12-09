import { Schema, model } from 'mongoose'
import { IProduct } from '../types/types'
import { dev } from '../config'
const productSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Slug is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Product title must be at least 3 characters long'],
      maxlength: [50, 'Product title must be at most 50 characters long'],
    },
    image: {
      type: String,
      default: dev.app.defaultImagePath,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [
        10,
        'Product description must be at least 10 characters long',
      ],
      maxlength: [
        100,
        'Product description must be at most 100 characters long',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer',
      },
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, 'Sold count cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Sold count must be an integer',
      },
    },
    shipping: {
      type: Number,
      default: 0,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
      },
    ],
  },
  { timestamps: true },
)

export const Product = model<IProduct>('Product', productSchema)
