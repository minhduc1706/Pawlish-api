import express from "express";
import { ProductController } from "../controllers/product.controller";

const router = express.Router();
const productController = new ProductController();

router.get('/products', productController.getProducts);

export default router;
