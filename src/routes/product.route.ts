import express from "express";
import { ProductController } from "../controllers/product.controller";

const router = express.Router();
const productController = new ProductController();
const {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} = productController;

router.get("/", getAllProducts);
router.post("/", addProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
