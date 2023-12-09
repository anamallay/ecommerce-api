import { Schema, model } from 'mongoose'
import { IUser } from '../types/types'
import bcrypt from 'bcrypt'
import { dev } from '../config'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name must be at most 50 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
        message: 'Please enter a valid email address',
      },
      minlength: [3, 'Email must be at least 3 characters long'],
      maxlength: [50, 'Email must be at most 50 characters long'],
    },
    password: {
      type: String,
      required: [true, 'please give the password'],
      trim: true,
      minlength: [6, 'Password must be at least 6 characters long'],
      // set: (password: string) => bcrypt.hashSync(password, 10),
    },
    image: {
      type: String,
      default: dev.app.defaultImagePath,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export const User = model<IUser>('User', userSchema)
