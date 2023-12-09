import { User } from '../models/userSchema'
import { IUser } from '../types/types'
import { createHttpError } from '../util/createHttpError'

export const getUsers = async (
  pageParam: number,
  limitParam: number,
  searchParam: string,
) => {
  let page = Number(pageParam) || 1
  const limit = Number(limitParam) || 10
  const searchRegExp = new RegExp('.*' + searchParam + '.*', 'i')
  const searchFilter = searchParam
    ? {
        isAdmin: { $ne: true },
        $or: [
          { name: { $regex: searchRegExp } },
          { email: { $regex: searchRegExp } },
        ],
      }
    : { isAdmin: { $ne: true } }

  const totalCount = await User.countDocuments(searchFilter)
  const totalPages = Math.ceil(totalCount / limit)

  if (page > totalPages) {
    page = totalPages > 0 ? totalPages : 1
  }

  const skip = (page - 1) * limit
  const payload: IUser[] = await User.find(searchFilter, { password: 0 })
    .skip(skip)
    .limit(limit)

  return {
    payload,
    page,
    limit,
    totalCount,
    totalPages,
  }
}
export const findUser = async (id: string) => {
  try {
    const user = await User.findOne({ _id: id }, { password: 0 })
    console.log(user)

    return user
  } catch (error) {
    throw createHttpError(500, 'Error retrieving user')
  }
}
export const banUserById = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBanned: true },
      { new: true },
    )
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw createHttpError(500, 'Error retrieving user')
  }
}
export const unbanUserById = async (id: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isBanned: false },
      { new: true },
    )
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw createHttpError(500, 'Error retrieving user')
  }
}
export const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
