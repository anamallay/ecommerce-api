import express from "express";
import { createSingleProduct, deleteSingleProduct, getAllProducts, getSingleProductBySlug, updateSingleProduct } from "../controllers/productController";
import { uploadProduct } from '../middleware/uploadFile'


const router = express.Router();
router.get(`/`, getAllProducts);
router.get('/:slug', getSingleProductBySlug )
router.post(`/`, uploadProduct.single('image'), createSingleProduct)
router.put(`/:slug`, uploadProduct.single('image'), updateSingleProduct)
router.delete(`/:slug`, deleteSingleProduct)

export default router;
