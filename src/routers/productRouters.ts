import express from "express";
import { createSingleProduct, deleteSingleProduct, getAllProducts, getSingleProductBySlug, updateSingleProduct } from "../controllers/productController";
import { upload } from "../middleware/uploadFile";
// import multer from "multer";
// const upload = multer({ dest: 'public/images/products' })

const router = express.Router();
router.get(`/`, getAllProducts);
router.get('/:slug', getSingleProductBySlug )
router.post(`/`,upload.single("image"), createSingleProduct);
router.put(`/:slug`, updateSingleProduct)
router.delete(`/:slug`, deleteSingleProduct)

export default router;
