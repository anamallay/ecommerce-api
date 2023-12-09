import { Request, Response, NextFunction } from 'express'
import { User } from '../models/userSchema'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { dev } from '../config'
import { handleSendEmail } from '../helper/sendEmail'
import {
  banUserById,
  deleteUserById,
  findUser,
  getUsers,
  unbanUserById,
} from '../services/userService'
import { UserType } from '../types/types'
import mongoose from 'mongoose'
import { deleteImage } from '../helper/deleteImageHelper'


export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = req.query.search ? String(req.query.search) : ''

    const {
      payload,
      page: currentPage,
      limit: currentLimit,
      totalCount,
      totalPages,
    } = await getUsers(page, limit, search)

    res.status(200).json({
      success: true,
      payload,
      pageInfo: {
        currentPage,
        currentLimit,
        totalCount,
        totalPages,
      },
    })
  } catch (error) {
    next(error)
  }
}
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await findUser(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res
      .status(200)
      .json({ message: 'User retrieved successfully', payload: user })
  } catch (error) {
    next(error)
  }
}
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, address, phone } = req.body
    const image = req.file
    const imagePath = image?.path

    const hashedPassword = await bcrypt.hash(password, 10)
    const tokenpayload: UserType = {
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    }
    if (imagePath) {
      tokenpayload.image = imagePath
    }

    const isUserExists = await User.exists({ email: email })
    if (isUserExists) {
      return next(createHttpError(409, 'User already exists'))
    }

    const token = jwt.sign(tokenpayload, dev.app.userActivationkey, {
      expiresIn: '1h',
    })

    const emailData = {
      email: email,
      subject: 'Activate your account',
      html: `
    <h1>Welcome to Our Service</h1>
    <p>Please click on the link below to activate your account:</p>
    <a href="http://localhost:3002/users/activate/${token}">Activate Account</a>
    <p>Thank you for joining us!</p>`,
    }
    await handleSendEmail(emailData)
    res.status(200).json({
      message: 'Check your email to activate your account',
      token: token,
    })
  } catch (error) {
    next(error)
  }
}
export const activeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.body.token
    if (!token) {
      return next(createHttpError(404, 'Please provide a token'))
    }
    const decoded = jwt.verify(token, dev.app.userActivationkey)
    if (!decoded) {
      throw createHttpError(401, 'Invalid token')
    }
    console.log(decoded)

    await User.create(decoded)

    res.status(201).json({ message: 'User is registered successfully' })
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      const errorMessage =
        error instanceof TokenExpiredError
          ? 'Your token has expired'
          : 'Invalid token'
      next(createHttpError(401, errorMessage))
    } else {
      next(error)
    }
  }
}
export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await banUserById(req.params.id)
    res.status(200).json({
      message: 'User successfully banned',
    })
  } catch (error) {
    next(error)
  }
}
export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await unbanUserById(req.params.id)
    res.status(200).json({
      message: 'User successfully unbanned',
    })
  } catch (error) {
    next(error)
  }
}
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await deleteUserById(req.params.id)
    if (user && user.image) {
      deleteImage(user.image)
    }
    res.status(204).json({
      message: 'deleted succuss',
    })
  } catch (error) {
    //! no working when enter not valid id
    if (error instanceof mongoose.Error.CastError) {
      const formatError = createHttpError(400, 'Id format is not valid')
      next(formatError)
    } else {
      console.error(error)
      next(createHttpError(500, 'Internal Server Error'))
    }
  }
}
