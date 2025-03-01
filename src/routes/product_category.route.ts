import express from "express";
import { ProductCategoryController } from "../controllers/product_category.controller";

const router = express.Router();
const productCategory = new ProductCategoryController();
const {
  addCategory,
  deleteCategory,
  getAllProducts,
  getProductById,
  updateCategory,
} = productCategory;

router.get("/", getAllProducts);
router.post("/", addCategory);
router.get("/:id", getProductById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
export default router;
