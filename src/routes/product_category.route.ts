import express from "express";
import { ProductCategoryController } from "../controllers/product_category.controller";

const router = express.Router();
const productCategory = new ProductCategoryController();
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} = productCategory;

router.get("/", getAllCategories);
router.post("/", addCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
export default router;
