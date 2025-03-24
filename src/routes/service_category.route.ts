import express from "express";
import { ServiceCategoryController } from "../controllers/service_category.controller";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { validateAddCategory, validateUpdateCategory } from "../validations/serviceCategoryValidation";
import { authorized } from "../middleware/auth.middleware";


const router = express.Router();
const serviceCategory = new ServiceCategoryController();
const { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } = serviceCategory;

router.get("/", getAllCategories);
router.get("/:id", handleValidationErrors, getCategoryById);

router.post("/", authorized(["admin"]), validateAddCategory, handleValidationErrors, addCategory);
router.patch("/:id", authorized(["admin"]), validateUpdateCategory, handleValidationErrors, updateCategory);
router.delete("/:id", authorized(["admin"]), handleValidationErrors, deleteCategory);

export default router;