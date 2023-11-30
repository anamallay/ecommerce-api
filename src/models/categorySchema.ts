import { Schema, model } from 'mongoose'

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Category title must be at least 3 characters long'],
      maxlength: [25, 'Category title must be at most 25 characters long'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
)

export const Category = model('Categories', categorySchema)
