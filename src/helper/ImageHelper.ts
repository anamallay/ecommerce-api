import fs from 'fs/promises'
import fss from 'fs'

import { ProductInput, userInputType } from '../types/types'
import { getSingleProduct } from '../services/productService'
import { findUser } from '../services/userService'
export const deleteImage = async (imagePath: string) => {
  try {
    await fs.unlink(imagePath)
  } catch (error) {

    throw error
  }
}
export const replaceImageProduct = async (
  file: Express.Multer.File | undefined,
  slug: string,
  data: ProductInput,
) => {
  if (file) {
    data.image = file.path
    const product = await getSingleProduct(slug)

    if (product && product.image !== 'public/images/default.png') {
      fs.unlink(product.image)
    }
  }
}

export const replaceImageUser = async (
  file: Express.Multer.File | undefined,
  id: string,
  data: userInputType,
) => {
  if (file) {
    data.image = file.path
    const user = await findUser(id)

    if (user && user.image && user.image !== 'public/images/default.png') {
      fss.unlink(user.image, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`)
        } else {
          console.log(`File deleted: ${user.image}`)
        }
      })
    }
  }
}
